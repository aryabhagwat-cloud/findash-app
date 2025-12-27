import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const AddFunds = () => {
  const [amount, setAmount] = useState('');
  const { addFunds } = useUser();

  // 1. Load Razorpay Script Dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Handle Payment Click
  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // 3. Razorpay Options
    const options = {
      key: "rzp_test_RPKOU6Ky0Y8EuF", // <--- Your Actual Test Key
      currency: "INR",
      amount: amount * 100, // Razorpay takes amount in paisa (100 paisa = 1 Rupee)
      name: "FinDash Portfolio",
      description: "Add Money to Wallet",
      image: "https://cdn-icons-png.flaticon.com/512/2534/2534204.png", // Wallet Icon
      handler: function (response) {
        // This runs ONLY when payment is SUCCESSFUL
        // In a real app, you would verify the signature on a backend here.
        // For a portfolio demo, we trust the client success callback.
        
        addFunds(Number(amount)); 
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        setAmount(''); // Clear input
      },
      prefill: {
        name: "Demo User",
        email: "demo@findash.com",
        contact: "9999999999"
      },
      theme: {
        color: "#2563eb"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3>💰 Add Funds (Razorpay)</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>
        Top up your wallet using the Real Test Gateway.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <input 
          type="number" 
          placeholder="Amount (₹)" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100%',
            outline: 'none'
          }}
        />
        <button 
          onClick={handlePayment}
          className="theme-btn"
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}
        >
          Pay Now
        </button>
      </div>
      <p style={{ fontSize:'0.7em', color:'var(--text-secondary)', marginTop:'10px' }}>
        *Test Mode: Use the dummy cards provided by Razorpay.
      </p>
    </div>
  );
};

export default AddFunds;