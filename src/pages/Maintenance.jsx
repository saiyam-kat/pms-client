import { useEffect, useState } from 'react';
import { getMaintenance, addMaintenance, updateMaintenance, deleteMaintenance } from '../services/api';
import { getTenants } from '../services/api';

export default function Maintenance() {
  const [issues, setIssues]   = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ tenantId: '', title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [m, t] = await Promise.all([getMaintenance(), getTenants()]);
      setIssues(m.data);
      setTenants(t.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleAdd = async () => {
    if (!form.tenantId || !form.title) {
      setError('Please select tenant and enter issue title');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await addMaintenance(form);
      setForm({ tenantId: '', title: '', description: '' });
      setSuccess('Maintenance issue logged');
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to log issue');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenance(id, { status: newStatus });
      setSuccess('Status updated');
      fetchAll();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this maintenance issue?')) return;
    try {
      await deleteMaintenance(id);
      setSuccess('Issue deleted');
      fetchAll();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete issue');
    }
  };

  const statusColor = (status) => {
    if (status === 'Pending')     return '#f87171';
    if (status === 'In Progress') return '#fbbf24';
    if (status === 'Resolved')    return '#4ade80';
    return '#94a3b8';
  };

  const getTenantName = (t) => t?.tenantName || 'Unknown';

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Maintenance</h2>
      <p style={subTextStyle}>Log and track all maintenance issues</p>

      {error   && <div style={errorStyle}>{error}<span onClick={() => setError('')} style={{ float: 'right', cursor: 'pointer' }}>✕</span></div>}
      {success && <div style={successStyle}>{success}</div>}

      {/* Add Issue Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#f1f5f9', fontSize: '16px' }}>
          Log New Issue
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select style={inputStyle} value={form.tenantId}
            onChange={(e) => setForm({ ...form, tenantId: e.target.value })}>
            <option value="">Select Tenant</option>
            {tenants.map(t => (
              <option key={t._id} value={t._id}>{t.tenantName}</option>
            ))}
          </select>
          <input style={inputStyle} placeholder="Issue Title (e.g. Fan not working)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input style={inputStyle} placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button style={btnStyle} onClick={handleAdd} disabled={loading}>
            {loading ? 'Logging...' : '+ Log Issue'}
          </button>
        </div>
      </div>

      {/* Issues List */}
      {issues.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: '40px', marginBottom: '1rem' }}>🔧</p>
          <p style={{ color: '#94a3b8' }}>No maintenance issues logged.</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {issues.map((issue) => (
            <div key={issue._id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: '15px', marginBottom: '6px' }}>
                    {issue.title}
                  </h3>
                  {issue.description && (
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
                      {issue.description}
                    </p>
                  )}
                  <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '10px' }}>
                    👤 {getTenantName(issue.tenantId)}
                  </p>
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                    style={{
                      background: '#0f172a',
                      color: statusColor(issue.status),
                      border: `1px solid ${statusColor(issue.status)}`,
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <button onClick={() => handleDelete(issue._id)} style={deleteBtnStyle}>
                  Delete
                </button>
              </div>
              <p style={{ color: '#475569', fontSize: '11px', marginTop: '10px' }}>
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle     = { padding: '2rem', background: '#0f172a', minHeight: '100vh' };
const headingStyle  = { color: '#f1f5f9', fontSize: '24px', marginBottom: '4px' };
const subTextStyle  = { color: '#64748b', fontSize: '14px', marginBottom: '1.5rem' };
const formCardStyle = { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #334155' };
const inputStyle    = { padding: '10px 14px', border: '1px solid #334155', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#0f172a', color: '#f1f5f9', minWidth: '160px', flex: '1' };
const btnStyle      = { background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };
const gridStyle     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' };
const cardStyle     = { background: '#1e293b', borderRadius: '12px', padding: '1.25rem', border: '1px solid #334155' };
const deleteBtnStyle = { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', marginLeft: '12px' };
const emptyStyle    = { textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' };
const errorStyle    = { background: '#450a0a', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #7f1d1d' };
const successStyle  = { background: '#052e16', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #14532d' };