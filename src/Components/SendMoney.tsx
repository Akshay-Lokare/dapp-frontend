import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

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

const SendMoney: React.FC = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentHash, setRecentHash] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sender') setSender(value);
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
      const res = await fetch('http://localhost:5000/send-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          recipient: receiver,
          amount: numericAmount,
          signature: 'valid_signature',
          broadcastToEthereum: broadcastEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Transaction failed');
        console.error('Backend error details:', data);
        setLoading(false);
        return;
      }

      toast.success('Transaction successful!');
      console.log('Transaction Details:', data);

      setSender('');
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
    <>
      <div className="send-money-container">
        <h2 className="send-money-title">Send Funds</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="send-money-input"
            type="text"
            name="sender"
            placeholder="Your Account ID/Name"
            value={sender}
            onChange={handleChange}
            required
          />
          <input
            className="send-money-input"
            type="text"
            name="receiver"
            placeholder="Recipient Account ID/Name"
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
            disabled={loading}
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
    </>
  );
};

export default SendMoney;
