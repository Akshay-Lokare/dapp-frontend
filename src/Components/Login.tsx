import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, saveToken, removeToken } from '../utils/auth';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      toast.info('Already logged in', { autoClose: 2000 });
      navigate('/');
    } else {
      removeToken();
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.msg || 'Invalid credentials', { autoClose: 2500 });
        return;
      }

      const token = data.token;
      saveToken(token);

      const decoded: any = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const timeLeft = expiryTime - Date.now();

      console.log(`⌛ Token valid for ${Math.round(timeLeft / 1000)} seconds`);

      toast.success('Login successful!', { autoClose: 2000 });

      setTimeout(() => {
        navigate('/');
      }, 1500);

      if (timeLeft > 0) {
        setTimeout(() => {
          toast.warn('⚠️ Session expired. Logging out...', { autoClose: 3000 });
          removeToken();
          navigate('/login');
        }, timeLeft);
      }

    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error logging in.', { autoClose: 2500 });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button id="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
