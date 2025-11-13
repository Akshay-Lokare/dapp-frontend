import React, { useContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { getToken } from '../utils/auth';

const SendMoney: React.FC = () => {
  const { user } = useContext(UserContext);

  // Keep sender synced with user.email
  const [sender, setSender] = useState(user?.email || '');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentHash, setRecentHash] = useState<string | null>(null);

  // Sync context user changes (in case user logs in/out dynamically)
  useEffect(() => {
    if (user?.email) setSender(user.email);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'receiver') setReceiver(value);
    if (name === 'amount') setAmount(value.replace(/[^0-9.]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!sender || !receiver || numericAmount <= 0) {
      toast.warning('Please fill all fields correctly');
      return;
    }

    setLoading(true);
    setRecentHash(null);

    try {
      const txData = {
        sender,
        recipient: receiver,
        amount: numericAmount,
        broadcastToEthereum: broadcastEnabled,
      };

      const token = getToken();

      const res = await fetch('http://localhost:5000/send-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ Include JWT
        },
        body: JSON.stringify(txData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Transaction failed');
        console.error('Backend error details:', data);
        setLoading(false);
        return;
      }

      toast.success('Transaction successful!');
      console.log('Transaction Details:', data);

      setReceiver('');
      setAmount('');
      setRecentHash(data.ethereum_tx_hash || null);

    } catch (error) {
      console.error('Network or processing error:', error);
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-money-container">
      <h2 className="send-money-title">Send Funds</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="send-money-input"
          type="email"
          name="sender"
          placeholder="Your Email"
          value={sender}
          readOnly
        />
        <input
          className="send-money-input"
          type="email"
          name="receiver"
          placeholder="Recipient Email"
          value={receiver}
          onChange={handleChange}
          required
        />
        <input
          className="send-money-input"
          type="number"
          name="amount"
          placeholder="Amount (e.g., 50.00)"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={handleChange}
          required
        />

        <label className="broadcast-check">
          <input
            type="checkbox"
            className="broadcast-checkbox"
            checked={broadcastEnabled}
            onChange={(e) => setBroadcastEnabled(e.target.checked)}
          />
          Broadcast to Ethereum
        </label>

        <button
          className="send-money-button"
          type="submit"
          disabled={loading || !user}
        >
          {loading ? 'Verifying & Sending...' : 'Transfer Money'}
        </button>

        {recentHash && (
          <p
            style={{
              marginTop: '20px',
              fontSize: '14px',
              color: '#555',
              wordBreak: 'break-all',
              textAlign: 'center',
              fontFamily: 'monospace',
            }}
          >
            <strong>Ethereum Tx Hash:</strong><br />
            {recentHash}
          </p>
        )}
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3500}
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

export default SendMoney;
