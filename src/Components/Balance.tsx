import React, { useState, useEffect } from 'react';

interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  blockHash: string;
  ethereumTxHash?: string | null,
  status: string;
  broadcasted: boolean;
  timestamp: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-transactions');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setTransactions(data);
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
  }, []);

  return (
    <>
    <div className="transactions-container">
    <div className="transactions-card">
        <h2 className="transactions-title">Transaction History</h2>

        {loading && <p className="status-text">Loading transactions...</p>}
        {!loading && error && <p className="status-text error">{error}</p>}

        {!loading && !error && transactions.length > 0 && (
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
                {transactions.map((tx, idx) => (
                <tr key={idx}>
                    <td>{new Date(tx.timestamp).toLocaleString()}</td>
                    <td>{tx.sender}</td>
                    <td>{tx.recipient}</td>
                    <td>{tx.amount.toFixed(2)}</td>
                    <td className={`status ${tx.status.toLowerCase()}`}>{tx.status}</td>
                    <td>{tx.broadcasted ? 'Yes' : 'No'}</td>
                    <td>{tx.blockHash}</td>
                    <td>{tx.ethereumTxHash ? tx.ethereumTxHash : 'N/A'}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
    </div>

    </>
  );
};

export default Transactions;
