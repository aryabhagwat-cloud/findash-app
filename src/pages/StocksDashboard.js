import React from 'react';
import { useUser } from '../context/UserContext'; // Import the context

const StocksDashboard = () => {
  const { user, buyStock } = useUser(); // Get the global buy function

  const handleQuickBuy = (symbol) => {
    // For demo, we buy 1 share at $150
    buyStock(symbol, 1, 150.00); 
  };

  return (
    <div className="fade-in">
      <h1>Stock Market</h1>
      <p style={{ color: '#94a3b8' }}>Wall Street at your fingertips</p>

      {/* BALANCE CARD */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Your Cash Balance</h3>
        <h1 style={{ color: '#60a5fa' }}>
          ${user ? user.walletBalance.toLocaleString() : '0.00'}
        </h1>
      </div>

      {/* STOCK CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* AAPL CARD */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>🍎 Apple Inc. (AAPL)</h2>
            <h2 style={{ color: '#10b981' }}>$150.00</h2>
          </div>
          <p style={{ color: '#94a3b8' }}>Tech • Consumer Electronics</p>
          
          <div style={{ marginTop: '20px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
            {/* Placeholder for chart */}
            <p style={{ textAlign: 'center', paddingTop: '40px', color: '#64748b' }}>Chart Placeholder</p>
          </div>

          <button 
            onClick={() => handleQuickBuy('AAPL')} // <--- FIX: Using the global function
            style={{ 
              width: '100%', 
              marginTop: '20px', 
              padding: '12px', 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Buy AAPL Stock
          </button>
        </div>

        {/* TSLA CARD */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2>🚗 Tesla (TSLA)</h2>
            <h2 style={{ color: '#ef4444' }}>$200.00</h2>
          </div>
          <p style={{ color: '#94a3b8' }}>Auto • Clean Energy</p>
          
          <div style={{ marginTop: '20px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
            <p style={{ textAlign: 'center', paddingTop: '40px', color: '#64748b' }}>Chart Placeholder</p>
          </div>

          <button 
            onClick={() => handleQuickBuy('TSLA')} // <--- FIX: Using the global function
            style={{ 
              width: '100%', 
              marginTop: '20px', 
              padding: '12px', 
              background: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Buy TSLA Stock
          </button>
        </div>

      </div>
    </div>
  );
};

export default StocksDashboard;