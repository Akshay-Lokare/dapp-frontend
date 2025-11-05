import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const SendMoney: React.FC = () => {
  const [sender, setSender] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [broadcastEnabled, setBroadcastEnabled] = useState<boolean>(false);

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

    try {
      const res = await fetch("http://localhost:5000/send-money", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          recipient: receiver,
          amount: numericAmount,
          signature: 'valid_signature',
          broadcastToEthereum: broadcastEnabled
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error('Transaction failed');
        console.error('Backend error details:', data);
        return;
      }

      // Success — show minimal toast, detailed console log
      toast.success('Transaction successful!');
      console.log('Transaction Details:', {
        sender,
        receiver,
        amount: numericAmount,
        block_hash: data.python_block_hash,
        broadcasted: data.broadcasted,
        ethereum_tx_hash: data.ethereum_tx_hash
      });

      setSender('');
      setReceiver('');
      setAmount('');

    } catch (error) {
      console.error('Network or processing error:', error);
      toast.error('Something went wrong. Try again.');
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

          <label className='broadcast-check'>
            <input
              type="checkbox"
              className='broadcast-checkbox'
              checked={broadcastEnabled}
              onChange={(e) => setBroadcastEnabled(e.target.checked)}
            />
            Broadcast to Ethereum
          </label>

          <button
            className="send-money-button"
            type="submit"
          >
            Transfer Money
          </button>

          <span></span>
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
