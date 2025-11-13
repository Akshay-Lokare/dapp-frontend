import React, { useState, useEffect, useContext } from 'react';
import { getToken, isTokenExpired, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../context/UserContext';

interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  blockHash: string;
  ethereumTxHash?: string | null;
  status: string;
  broadcasted: boolean;
  timestamp: string;
}

const Transactions: React.FC = () => {
  const [sentTxs, setSentTxs] = useState<Transaction[]>([]);
  const [receivedTxs, setReceivedTxs] = useState<Transaction[]>([]);
  const [allTxs, setAllTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'sent' | 'received'>('sent'); // for non-admin toggle
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = getToken();

      if (!token || isTokenExpired(token)) {
        toast.warn('Session expired. Please log in again.');
        removeToken();
        navigate('/login');
        return;
      }

      let userEmail = '';
      let userRole = '';

      try {
        const decoded: any = jwtDecode(token);
        userEmail = decoded.email;
        userRole = decoded.role;
      } catch (err) {
        console.error('Error decoding token:', err);
        removeToken();
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/get-transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          if (userRole === 'admin') {
            setAllTxs(data);
          } else {
            const sent = data.filter((tx) => tx.sender === userEmail);
            const received = data.filter((tx) => tx.recipient === userEmail);
            setSentTxs(sent);
            setReceivedTxs(received);
          }
        } else {
          setError('No transactions found.');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error fetching transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const renderTable = (txs: Transaction[]) => (
    <div className="table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Broadcasted</th>
            <th>Block Hash</th>
            <th>Eth Hash</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx, idx) => (
            <tr key={idx}>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
              <td>{tx.sender}</td>
              <td>{tx.recipient}</td>
              <td>{tx.amount.toFixed(2)}</td>
              <td className={`status ${tx.status.toLowerCase()}`}>{tx.status}</td>
              <td>{tx.broadcasted ? 'Yes' : 'No'}</td>
              <td>{tx.blockHash}</td>
              <td>{tx.ethereumTxHash || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <p className="status-text">Loading transactions...</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="transactions-container">
      <div className="transactions-card">
        {user?.role === 'admin' ? (
          <>
            <h2 className="transactions-title">All Transactions (Admin View)</h2>
            {allTxs.length > 0 ? renderTable(allTxs) : <p>No transactions available.</p>}
          </>
        ) : (
          <>
            <div className="transactions-header">
              <h2 className="transactions-title">
                {view === 'sent' ? 'Sent Transactions' : 'Received Transactions'}
              </h2>
              <div className="toggle-buttons">
                <button
                  className={`toggle-btn ${view === 'sent' ? 'active' : ''}`}
                  onClick={() => setView('sent')}
                >
                  Sent
                </button>
                <button
                  className={`toggle-btn ${view === 'received' ? 'active' : ''}`}
                  onClick={() => setView('received')}
                >
                  Received
                </button>
              </div>
            </div>

            {view === 'sent'
              ? sentTxs.length > 0
                ? renderTable(sentTxs)
                : <p>No sent transactions.</p>
              : receivedTxs.length > 0
                ? renderTable(receivedTxs)
                : <p>No received transactions.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
