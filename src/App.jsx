import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';

const WithNav = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><WithNav><Dashboard /></WithNav></ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute><WithNav><Properties /></WithNav></ProtectedRoute>
          } />
          <Route path="/tenants" element={
            <ProtectedRoute><WithNav><Tenants /></WithNav></ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute><WithNav><Payments /></WithNav></ProtectedRoute>
          } />
          <Route path="/maintenance" element={
            <ProtectedRoute><WithNav><Maintenance /></WithNav></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}