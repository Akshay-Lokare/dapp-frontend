import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, saveToken, removeToken } from '../utils/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      toast.info('Already logged in', { autoClose: 2000 });
      setTimeout(() => navigate('/'), 2000); // 👈 small delay to let toast appear
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

      toast.success('Login successful!', { autoClose: 2000 });

      setUser({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      });

      // ⏳ Delay navigation slightly to let toast show before redirect
      setTimeout(() => {
        navigate('/');
      }, 2200);

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

      {/* ✅ Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Login;
