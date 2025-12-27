// src/components/BuyButton.js
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import Toast from './Toast';

const BuyButton = ({ symbol, price }) => {
  const { buyStock } = useUser();
  const [toast, setToast] = useState(null); // { message, type }

  const handleBuy = () => {
    const success = buyStock(symbol, price);
    if (success) {
      setToast({ message: `✅ Successfully bought 1 share of ${symbol}`, type: 'success' });
    } else {
      setToast({ message: `❌ Insufficient Funds for ${symbol}`, type: 'error' });
    }
  };

  return (
    <>
      <button 
        className="buy-btn"
        onClick={handleBuy}
      >
        Buy {symbol}
      </button>

      {/* Render Toast if it exists */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </>
  );
};

export default BuyButton;