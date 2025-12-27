import React, { useState } from 'react';

const PaymentModal = ({ amount, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay (2 seconds)
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '350px', background: 'white', color: '#333', position: 'relative' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '15px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

        <h3 style={{ marginTop: 0, color: '#2563eb' }}>Secure Checkout</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>Adding <strong style={{ color: '#10b981' }}>${amount.toLocaleString()}</strong> to wallet</p>

        <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Card Number */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>CARD NUMBER</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', marginTop: '5px' }}>
              <span style={{ marginRight: '10px' }}>💳</span>
              <input type="text" placeholder="4242 4242 4242 4242" required style={{ border: 'none', outline: 'none', width: '100%' }} />
            </div>
          </div>

          {/* Expiry & CVC */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>EXPIRY</label>
              <input type="text" placeholder="MM / YY" required style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>CVC</label>
              <input type="password" placeholder="123" required style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} />
            </div>
          </div>

          {/* Pay Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '12px',
              backgroundColor: loading ? '#94a3b8' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {loading ? 'Processing...' : `Pay $${amount}`}
          </button>
        </form>
        
        <p style={{ fontSize: '0.7rem', color: '#999', textAlign: 'center', marginTop: '15px' }}>
          🔒 This is a secure 256-bit SSL encrypted payment simulator.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;