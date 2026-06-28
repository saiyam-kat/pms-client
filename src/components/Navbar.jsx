import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1e293b',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px'
    }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link to="/dashboard"   style={linkStyle}>Dashboard</Link>
        <Link to="/properties"  style={linkStyle}>Properties</Link>
        <Link to="/tenants"     style={linkStyle}>Tenants</Link>
        <Link to="/payments"    style={linkStyle}>Payments</Link>
        <Link to="/maintenance" style={linkStyle}>Maintenance</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>
          {user?.name}
        </span>
        <button onClick={handleLogout} style={btnStyle}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#e2e8f0',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
};

const btnStyle = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px'
};