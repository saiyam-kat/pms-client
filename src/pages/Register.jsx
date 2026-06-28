import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Register</h2>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <input style={inputStyle} placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input style={inputStyle} type="email" placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input style={inputStyle} type="password" placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button style={btnStyle} onClick={handleRegister} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0f172a'
};

const cardStyle = {
  background: 'white',
  padding: '2.5rem',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  padding: '10px 14px',
  marginBottom: '1rem',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none'
};

const btnStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer'
};