import { useEffect, useState } from 'react';
import { getTenants, addTenant, deleteTenant } from '../services/api';
import { getProperties } from '../services/api';

export default function Tenants() {
  const [tenants, setTenants]       = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    propertyId: '', tenantName: '', phone: '',
    rentAmount: '', dueDate: '', joiningDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, p] = await Promise.all([getTenants(), getProperties()]);
      setTenants(t.data);
      setProperties(p.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleAdd = async () => {
    if (!form.propertyId || !form.tenantName || !form.phone ||
        !form.rentAmount || !form.dueDate || !form.joiningDate) {
      setError('Please fill all fields');
      return;
    }
    if (form.phone.length < 10) {
      setError('Enter valid phone number');
      return;
    }
    if (form.rentAmount <= 0) {
      setError('Rent amount must be greater than 0');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await addTenant(form);
      setForm({ propertyId: '', tenantName: '', phone: '',
                rentAmount: '', dueDate: '', joiningDate: '' });
      setSuccess('Tenant added successfully');
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add tenant');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this tenant?')) return;
    try {
      await deleteTenant(id);
      setSuccess('Tenant removed');
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete tenant');
    }
  };

  const getPropertyName = (id) => {
    const p = properties.find(p => p._id === id);
    return p ? p.propertyName : 'Unknown';
  };

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Tenants</h2>
      <p style={subTextStyle}>Manage all your tenants here</p>

      {error   && <div style={errorStyle}>{error}<span onClick={() => setError('')} style={{ float: 'right', cursor: 'pointer' }}>✕</span></div>}
      {success && <div style={successStyle}>{success}</div>}

      {/* Add Tenant Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#f1f5f9', fontSize: '16px' }}>
          Add New Tenant
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select style={inputStyle} value={form.propertyId}
            onChange={(e) => setForm({ ...form, propertyId: e.target.value })}>
            <option value="">Select Property</option>
            {properties.map(p => (
              <option key={p._id} value={p._id}>{p.propertyName}</option>
            ))}
          </select>
          <input style={inputStyle} placeholder="Tenant Name"
            value={form.tenantName}
            onChange={(e) => setForm({ ...form, tenantName: e.target.value })} />
          <input style={inputStyle} placeholder="Phone Number"
            value={form.phone} maxLength={10}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input style={inputStyle} placeholder="Rent Amount (₹)"
            type="number" min="0"
            value={form.rentAmount}
            onChange={(e) => setForm({ ...form, rentAmount: e.target.value })} />
          <input style={inputStyle} placeholder="Due Date (1-28)"
            type="number" min="1" max="28"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <input style={inputStyle} type="date"
            value={form.joiningDate}
            onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
          <button style={btnStyle} onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : '+ Add Tenant'}
          </button>
        </div>
      </div>

      {/* Tenants List */}
      {tenants.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: '40px', marginBottom: '1rem' }}>👥</p>
          <p style={{ color: '#94a3b8' }}>No tenants found. Add one above.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {tenants.map((t) => (
            <div key={t._id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#f1f5f9', marginBottom: '6px', fontSize: '16px' }}>
                    {t.tenantName}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0' }}>
                    📞 {t.phone}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0' }}>
                    🏠 {getPropertyName(t.propertyId)}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0' }}>
                    📅 Due: {t.dueDate} of every month
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <span style={rentBadgeStyle}>₹{t.rentAmount}/month</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(t._id)} style={deleteBtnStyle}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle    = { padding: '2rem', background: '#0f172a', minHeight: '100vh' };
const headingStyle = { color: '#f1f5f9', fontSize: '24px', marginBottom: '4px' };
const subTextStyle = { color: '#64748b', fontSize: '14px', marginBottom: '1.5rem' };
const formCardStyle = { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #334155' };
const inputStyle   = { padding: '10px 14px', border: '1px solid #334155', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#0f172a', color: '#f1f5f9', minWidth: '160px', flex: '1' };
const btnStyle     = { background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' };
const gridStyle    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' };
const cardStyle    = { background: '#1e293b', borderRadius: '12px', padding: '1.25rem', border: '1px solid #334155' };
const rentBadgeStyle = { background: '#0f172a', color: '#4ade80', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', border: '1px solid #166534' };
const deleteBtnStyle = { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const emptyStyle   = { textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' };
const errorStyle   = { background: '#450a0a', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #7f1d1d' };
const successStyle = { background: '#052e16', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #14532d' };