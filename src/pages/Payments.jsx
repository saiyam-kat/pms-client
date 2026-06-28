import { useEffect, useState } from 'react';
import { getPayments, addPayment, updatePayment, deletePayment } from '../services/api';
import { getTenants } from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants]   = useState([]);
  const [form, setForm] = useState({
    tenantId: '', amount: '', status: 'Paid', month: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, t] = await Promise.all([getPayments(), getTenants()]);
      setPayments(p.data);
      setTenants(t.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleAdd = async () => {
    if (!form.tenantId || !form.amount || !form.month) {
      setError('Please fill all fields');
      return;
    }
    if (form.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await addPayment(form);
      setForm({ tenantId: '', amount: '', status: 'Paid', month: '' });
      setSuccess('Payment recorded successfully');
      fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePayment(id, { status: newStatus });
      setSuccess('Status updated');
      fetchAll();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    try {
      await deletePayment(id);
      setSuccess('Payment deleted');
      fetchAll();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to delete payment');
    }
  };

  const statusColor = (status) => {
    if (status === 'Paid')    return { color: '#4ade80', border: '#166534' };
    if (status === 'Pending') return { color: '#fbbf24', border: '#92400e' };
    if (status === 'Overdue') return { color: '#f87171', border: '#7f1d1d' };
    return { color: '#94a3b8', border: '#334155' };
  };

  const getTenantName = (id) => {
    const t = tenants.find(t => t._id === (id?._id || id));
    return t ? t.tenantName : 'Unknown';
  };

  return (
    <div style={pageStyle}>
      <h2 style={headingStyle}>Payments</h2>
      <p style={subTextStyle}>Track and manage all rent payments</p>

      {error   && <div style={errorStyle}>{error}<span onClick={() => setError('')} style={{ float: 'right', cursor: 'pointer' }}>✕</span></div>}
      {success && <div style={successStyle}>{success}</div>}

      {/* Add Payment Form */}
      <div style={formCardStyle}>
        <h3 style={{ marginBottom: '1rem', color: '#f1f5f9', fontSize: '16px' }}>
          Record New Payment
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select style={inputStyle} value={form.tenantId}
            onChange={(e) => setForm({ ...form, tenantId: e.target.value })}>
            <option value="">Select Tenant</option>
            {tenants.map(t => (
              <option key={t._id} value={t._id}>{t.tenantName}</option>
            ))}
          </select>
          <input style={inputStyle} placeholder="Amount (₹)"
            type="number" min="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input style={inputStyle} placeholder="Month (e.g. June 2026)"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })} />
          <select style={inputStyle} value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button style={btnStyle} onClick={handleAdd} disabled={loading}>
            {loading ? 'Recording...' : '+ Record Payment'}
          </button>
        </div>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div style={emptyStyle}>
          <p style={{ fontSize: '40px', marginBottom: '1rem' }}>💰</p>
          <p style={{ color: '#94a3b8' }}>No payments recorded yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {['Tenant', 'Month', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const sc = statusColor(p.status);
                return (
                  <tr key={p._id} style={trStyle}>
                    <td style={tdStyle}>{getTenantName(p.tenantId)}</td>
                    <td style={tdStyle}>{p.month}</td>
                    <td style={tdStyle}>₹{p.amount}</td>
                    <td style={tdStyle}>
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        style={{
                          background: '#0f172a',
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td style={tdStyle}>
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDelete(p._id)} style={deleteBtnStyle}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
const tableStyle    = { width: '100%', borderCollapse: 'collapse', background: '#1e293b', borderRadius: '12px', overflow: 'hidden' };
const thStyle       = { padding: '12px 16px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #334155' };
const tdStyle       = { padding: '12px 16px', color: '#e2e8f0', fontSize: '14px', borderBottom: '1px solid #1e293b' };
const trStyle       = { transition: 'background 0.2s' };
const deleteBtnStyle = { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };
const emptyStyle    = { textAlign: 'center', padding: '4rem', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155' };
const errorStyle    = { background: '#450a0a', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #7f1d1d' };
const successStyle  = { background: '#052e16', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '1rem', fontSize: '14px', border: '1px solid #14532d' };