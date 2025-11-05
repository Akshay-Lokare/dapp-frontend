import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './Components/Nav';
import Home from './Components/Home';
import SendMoney from './Components/SendMoney';
import Balance from './Components/Balance';
import SocketLogs from './Components/SocketLogs';

const App: React.FC = () => {
  return (
    <Router>
      <Nav />
      <SocketLogs />

      <div className="container">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/send-money" element={<SendMoney />} />
            <Route path="/balance" element={<Balance />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
