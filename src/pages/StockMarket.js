import React, { useState } from 'react';
import config from '../config'; // <--- Uses central config
import { useUser } from '../context/UserContext';

const StockMarket = () => {
  const { buyStock } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setStockData(null);

    try {
      const token = localStorage.getItem('token');
      // Uses config.API_URL
      const res = await fetch(`${config.API_URL}/portfolio/price/${searchTerm}`, {
        headers: { 'x-auth-token': token || '' }
      });
      const data = await res.json();

      if (res.ok) {
        setStockData(data);
      } else {
        setError(data.msg || "Stock not found");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if(!stockData) return;
    const qty = prompt(`How many shares of ${stockData.symbol} to buy?`);
    if(qty && !isNaN(qty)) {
      await buyStock(stockData.symbol, qty, stockData.price);
    }
  };

  return (
    <div className="fade-in">
      <h1>🌍 Global Stock Market</h1>
      <p style={{ color: '#94a3b8' }}>Search for any real-time stock price (e.g., AAPL, GOOGL, AMZN).</p>

      {/* Search Bar */}
      <div className="card" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Enter Symbol (e.g. MSFT)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
          style={{ flex: 1 }}
        />
        <button 
          onClick={handleSearch}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {/* Results Section */}
      <div style={{ marginTop: '30px' }}>
        {error && <div style={{ color: '#ef4444', fontSize: '1.2rem', textAlign: 'center' }}>❌ {error}</div>}

        {stockData && (
          <div className="card" style={{ borderLeft: '5px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '3rem' }}>{stockData.symbol}</h1>
              <p style={{ color: '#94a3b8', margin: 0 }}>Real-Time Market Price</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0, fontSize: '3rem', color: '#10b981' }}>
                ${stockData.price.toFixed(2)}
              </h1>
              <button className="btn-primary" onClick={handleBuy} style={{marginTop:'10px'}}>
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockMarket;