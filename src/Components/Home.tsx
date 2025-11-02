import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="home-container">
        <h1>Welcome to MyFinanceApp</h1>
        <p>Manage your money easily!</p>
        <div className="home-links">
          <Link to="/send-money">Send Money</Link>
          <Link to="/balance">Check Balance</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
