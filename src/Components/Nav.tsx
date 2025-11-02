import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Nav: React.FC = () => {
  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <Link to='/' className="nav-logo">MyFinanceApp</Link>
        <div className="nav-links">
          <NavLink to="/send-money" className="nav-link">
            Send Money
          </NavLink>
          <NavLink to="/balance" className="nav-link">
            Balance
          </NavLink>

        </div>
      </div>
    </nav>
  );
};

export default Nav;
