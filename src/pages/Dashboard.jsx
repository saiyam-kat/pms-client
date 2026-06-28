import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await getDashboard();
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = stats ? [
    { label: 'Total Properties', value: stats.totalProperties, color: '#3b82f6', icon: '🏠' },
    { label: 'Total Tenants',    value: stats.totalTenants,    color: '#10b981', icon: '👥' },
    { label: 'Collected Rent',   value: `₹${stats.collectedRent}`, color: '#8b5cf6', icon: '💰' },
    { label: 'Pending Rent',     value: `₹${stats.pendingRent}`,   color: '#f59e0b', icon: '⏳' },
    { label: 'Overdue Rent',     value: `₹${stats.overdueRent}`,   color: '#ef4444', icon: '🚨' },
    { label: 'Open Maintenance', value: stats.openMaintenance,  color: '#64748b', icon: '🔧' },
  ] : [];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '0.25rem', color: '#1e293b' }}>
        Welcome back, {user?.name} 👋
      </h2>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Here is your complete property overview
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!stats ? (
        <p style={{ color: '#94a3b8' }}>Loading...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          {cards.map((card) => (
            <div key={card.label} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              borderLeft: `4px solid ${card.color}`
            }}>
              <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>
                {card.icon}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: card.color
              }}>
                {card.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}