import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

const Nav: React.FC = () => {

  const navigator = useNavigate();

  const handleLogout = () => {
    try {
      removeToken();
      console.log(`{} logged out successfully`);
      navigator('/login');
      
    } catch (error) {
      console.log(`Error logging out: ${error}`);
    }
  }

  return (
    <nav className="nav-bar">
      <div className="nav-container">

        <Link to='/' className="nav-logo">NickKurtDale FinanceApp</Link>

        <div className="nav-links">
          <NavLink to="/send-money" className="nav-link">
            Send Money
          </NavLink>

          <NavLink to="/balance" className="nav-link">
            Transactions
          </NavLink>

          <button onClick={handleLogout}>Logout</button>

        </div>
      </div>
    </nav>
  );
};

export default Nav;
