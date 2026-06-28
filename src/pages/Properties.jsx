import { useEffect, useState } from 'react';
import { getProperties, addProperty, deleteProperty } from '../services/api';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    propertyName: '',
    address: '',
    propertyType: ''
  });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const fetchProperties = async () => {
    try {
      const res = await getProperties();
      setProperties(res.data);
    } catch (err) {
      setError('Failed to load properties');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAdd = async () => {
    if (!form.propertyName || !form.address || !form.propertyType) {
      setError('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await addProperty(form);
      setForm({ propertyName: '', address: '', propertyType: '' });
      setSuccess('Property added successfully');
      fetchProperties();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      setSuccess('Property deleted');
      fetchProperties();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  return (
    <div style={pageStyle}>

      <h2 style={headingStyle}>Properties</h2>
      <p style={subTextStyle}>Manage all your rental properties here</p>

      {/* Messages */}
      {error && (
        <div style={errorStyle}>
          {error}
          <span
            onClick={() => setError('')}
            style={{ float: 'right', cursor: 'pointer' }}
          >✕</span>
        </div>
      )}
      {success && (
        <div style={successStyle}>
          {success}
        </div>
      )}

      {/* Add Property Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#f1f5f9', fontSize: '16px' }}>
          Add New Property
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            style={inputStyle}
            placeholder="Property Name"
            value={form.propertyName}
            onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
          />
          <input
            style={inputStyle}
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <select
            style={inputStyle}
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
            <option value="House">House</option>
            <option value="Shop">Shop</option>
          </select>
          <button
            style={btnStyle}
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? 'Adding...' : '+ Add Property'}
          </button>
        </div>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: '40px', marginBottom: '1rem' }}>🏠</p>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            No properties found. Add one above.
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {properties.map((p) => (
            <div key={p._id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#f1f5f9', marginBottom: '6px', fontSize: '16px' }}>
                    {p.propertyName}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '10px' }}>
                    📍 {p.address}
                  </p>
                  <span style={badgeStyle}>
                    {p.propertyType}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  style={deleteBtnStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  padding: '2rem',
  background: '#0f172a',
  minHeight: '100vh'
};

const headingStyle = {
  color: '#f1f5f9',
  fontSize: '24px',
  marginBottom: '4px'
};

const subTextStyle = {
  color: '#64748b',
  fontSize: '14px',
  marginBottom: '1.5rem'
};

const formCardStyle = {
  background: '#1e293b',
  padding: '1.5rem',
  borderRadius: '12px',
  marginBottom: '2rem',
  border: '1px solid #334155'
};

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #334155',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  background: '#0f172a',
  color: '#f1f5f9',
  minWidth: '180px',
  flex: '1'
};

const btnStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '1rem'
};

const cardStyle = {
  background: '#1e293b',
  borderRadius: '12px',
  padding: '1.25rem',
  border: '1px solid #334155'
};

const badgeStyle = {
  background: '#0f172a',
  color: '#60a5fa',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  border: '1px solid #1e40af'
};

const deleteBtnStyle = {
  background: 'transparent',
  color: '#f87171',
  border: '1px solid #f87171',
  padding: '5px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  cursor: 'pointer'
};

const emptyStyle = {
  textAlign: 'center',
  padding: '4rem',
  background: '#1e293b',
  borderRadius: '12px',
  border: '1px solid #334155'
};

const errorStyle = {
  background: '#450a0a',
  color: '#f87171',
  padding: '12px 16px',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontSize: '14px',
  border: '1px solid #7f1d1d'
};

const successStyle = {
  background: '#052e16',
  color: '#4ade80',
  padding: '12px 16px',
  borderRadius: '8px',
  marginBottom: '1rem',
  fontSize: '14px',
  border: '1px solid #14532d'
};