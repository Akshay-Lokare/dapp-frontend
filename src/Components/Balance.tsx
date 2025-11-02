import React, { useState, useEffect } from 'react';
import Nav from './Nav';

interface BalanceInfo {
    currency: string,
    value: string,
};

const Balance: React.FC = () => {

    const [balances, setBalances] = useState<BalanceInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('http://localhost:5000/transactions');
                
                const data = await response.json();

                if (data.balances && Array.isArray(data.balances) && data.balances.length > 0) {
                    setBalances(data.balances);
                } else {
                    setBalances([]);
                    setError('No balance information found.');                }

            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBalance();
    }, []);
    
    return (

    <div>
    <div className="balance-container">
        <h2 className="balance-title">Account Balance</h2>

        {loading && <p>Loading...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && balances.length > 0 && (
            <ul className="balance-list">
                {balances.map((b, idx) => (
                    <li key={idx}>
                        {b.currency}: <strong>{b.value}</strong>
                    </li>
                ))}
            </ul>
        )}
    </div>
    </div>
    );
};

export default Balance;
