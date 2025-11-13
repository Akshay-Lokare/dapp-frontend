import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home: React.FC = () => {

  const { user } = useContext(UserContext);

  return (
    <div className="home">
      <div className="home-container">
        <h1>Welcome {user ? user.name : 'Guest'}</h1>
        <p>Manage your money easily!</p>
        <div className="home-links">
          <Link to="/send-money">Send Money</Link>
          <Link to="/balance">Check Transactions</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
