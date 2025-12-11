import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import { UserRole } from '../../types';
import { Shield } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: 'official.evolutiongadget@gmail.com',
    password: ''
  });

  useEffect(() => {
    console.log('AdminLogin - Auth state:', { 
      isAuthenticated, 
      userRole: user?.role, 
      userName: user?.name,
      user: user 
    });
    
    if (isAuthenticated && user) {
      console.log('User role check:', user.role, 'Expected:', UserRole.ADMIN, 'Match:', user.role === UserRole.ADMIN);
      
      if (user.role === UserRole.ADMIN) {
        console.log('Redirecting to admin dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 100);
      } else {
        console.log('User is not admin, redirecting to home...');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const fillCorrectEmail = () => {
    setFormData({
      ...formData,
      email: 'official.evolutiongadget@gmail.com'
    });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <Shield size={48} />
          <span>Admin Portal</span>
        </div>
        
        <h1 className="admin-login-title">Welcome Back</h1>
        <p className="admin-login-subtitle">Evulation Gadget Management System</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email" className="admin-form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="official.evolutiongadget@gmail.com"
              className="admin-form-input"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              required
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <small style={{ color: '#94a3b8', fontSize: '0.85rem', flex: 1 }}>
                ⚠️ Email has a DOT (.) between "official" and "evolution"
              </small>
              <button 
                type="button" 
                onClick={fillCorrectEmail}
                style={{
                  padding: '0.25rem 0.75rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Use Correct Email
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="admin-form-input"
              required
            />
          </div>

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
