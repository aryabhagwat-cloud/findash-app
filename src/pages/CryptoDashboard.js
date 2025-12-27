import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext'; // <--- 1. Import UserContext

const CryptoDashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Get the buyStock function from your global state
  const { buyStock } = useUser(); 

  // Fetch Live Crypto Data
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        const data = await res.json();
        setCoins(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching crypto:", err);
        setLoading(false);
      }
    };

    fetchCrypto();
    const interval = setInterval(fetchCrypto, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Handle Buy Logic (Reusing your Stock logic!)
  const handleBuyCrypto = async (coin) => {
    const qty = prompt(`How many ${coin.name} (${coin.symbol.toUpperCase()}) do you want to buy?`);
    
    if (!qty || isNaN(qty) || qty <= 0) return;

    // Call the backend via Context
    // We send: Symbol (BTC), Quantity, and Current Price
    await buyStock(coin.symbol.toUpperCase(), qty, coin.current_price);
  };

  if (loading) return <div className="fade-in" style={{textAlign:'center', marginTop:'50px', color:'white'}}>Loading Crypto Market... 🚀</div>;

  return (
    <div className="fade-in">
      <h1 style={{ marginBottom: '10px' }}>🚀 Crypto Market</h1>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>Trade top cryptocurrencies with your simulator wallet.</p>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Action</th> {/* <--- 4. New Column */}
            </tr>
          </thead>
          <tbody>
            {coins.map(coin => (
              <tr key={coin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: '0.2s' }}>
                
                {/* Coin Info */}
                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={coin.image} alt={coin.name} style={{ width: '30px', height: '30px' }} />
                  <div>
                    <span style={{ fontWeight: 'bold', display: 'block' }}>{coin.name}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{coin.symbol.toUpperCase()}</span>
                  </div>
                </td>

                {/* Price */}
                <td style={{ fontWeight: '600' }}>${coin.current_price.toLocaleString()}</td>

                {/* Change */}
                <td>
                  <span style={{ 
                    color: coin.price_change_percentage_24h > 0 ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: coin.price_change_percentage_24h > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}>
                    {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>

                {/* Market Cap */}
                <td style={{ opacity: 0.8 }}>${coin.market_cap.toLocaleString()}</td>

                {/* 5. BUY BUTTON */}
                <td>
                  <button 
                    onClick={() => handleBuyCrypto(coin)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    Buy
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoDashboard;