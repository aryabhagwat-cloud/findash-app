import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import config from '../config'; // <--- Uses central config
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Simulator = () => {
  const { user, buyStock, sellStock, loadUser, loading } = useUser(); 
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [livePrices, setLivePrices] = useState({}); 
  
  // Trade States
  const [buySymbol, setBuySymbol] = useState('');
  const [buyQty, setBuyQty] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  // --- HELPER: Fetch Real Price ---
  const getRealPrice = async (symbol) => {
    try {
      const token = localStorage.getItem('token');
      // Uses config.API_URL
      const res = await fetch(`${config.API_URL}/portfolio/price/${symbol}`, {
        headers: { 'x-auth-token': token || '' } 
      });
      const data = await res.json();
      return res.ok ? data.price : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // --- 1. Load Portfolio & Calculate Live Values ---
  useEffect(() => {
    const fetchPortfolioPrices = async () => {
      if (user && user.portfolio) {
        let totalValue = 0;
        const newPrices = {};

        for (const stock of user.portfolio) {
          const price = await getRealPrice(stock.symbol);
          if (price) {
            newPrices[stock.symbol] = price;
            totalValue += price * stock.qty;
          } else {
            // Fallback to avgPrice if API fails (e.g. for Crypto symbols not in stock API)
            newPrices[stock.symbol] = stock.avgPrice;
            totalValue += stock.avgPrice * stock.qty;
          }
        }
        setLivePrices(newPrices);
        setPortfolioValue(totalValue);
      }
    };
    if(user) fetchPortfolioPrices();
  }, [user]);

  // --- 2. Buy Logic ---
  const handleBuy = async () => {
    if (!buySymbol || !buyQty) return alert("Enter symbol and quantity");
    setIsTrading(true);
    const price = await getRealPrice(buySymbol);
    if (!price) { setIsTrading(false); return alert("Invalid Symbol"); }

    const confirmed = window.confirm(`📈 Live Price for ${buySymbol.toUpperCase()} is $${price}. Confirm BUY?`);
    if (confirmed) {
      const success = await buyStock(buySymbol.toUpperCase(), buyQty, price); 
      if (success) { setBuySymbol(''); setBuyQty(''); }
    }
    setIsTrading(false);
  };

  // --- 3. Sell Logic ---
  const handleSell = async (symbol) => {
    const qty = prompt(`How many shares of ${symbol} to sell?`);
    if (!qty) return;
    setIsTrading(true);
    
    // Try to get live price, otherwise use avg price (fallback for crypto)
    let price = await getRealPrice(symbol); 
    if (!price) {
        // If live fetch fails, ask user if they want to sell at avg price (simulation mode)
        // Or simply fail. Here we will alert.
        alert("Could not fetch live price. Selling at simulated value.");
        // Retrieve internal price if needed, or return
        setIsTrading(false); 
        return; 
    }
    await sellStock(symbol, qty, price);
    setIsTrading(false);
  };

  // --- 4. RAZORPAY PAYMENT LOGIC ---
  const handleAddFunds = async () => {
    if (!user) return alert("User not loaded.");
    const amount = prompt("Enter amount to add (₹):", "5000");
    if (!amount) return;

    try {
      const token = localStorage.getItem('token');
      // 1. Create Order
      const orderRes = await fetch(`${config.API_URL}/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ amount })
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) return alert("Server Error: " + orderData.msg);

      // 2. Open Razorpay
      const options = {
        key: "rzp_test_RPKOU6Ky0Y8EuF", // Replace with your actual Key ID if different
        amount: orderData.amount, 
        currency: "INR",
        name: "FinDash Pro",
        description: "Add Funds to Wallet",
        order_id: orderData.id, 
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch(`${config.API_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("✅ Payment Successful! Funds Added.");
            await loadUser();
          } else {
            alert("❌ Payment Failed");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#6366f1" }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) { console.error(err); alert("Payment Integration Error (Check Console)"); }
  };

  // Chart Data
  const data = {
    labels: ['Cash', 'Stocks'],
    datasets: [{
      data: [user ? user.walletBalance : 0, portfolioValue],
      backgroundColor: ['#3b82f6', '#10b981'],
      borderWidth: 0,
    }],
  };

  if (loading) return <div className="fade-in" style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <h1 style={{margin:0}}>Trading Simulator</h1>
            <p style={{opacity: 0.7}}>Live Market Data & P&L Tracking 📊</p>
        </div>
        <button className="btn-primary" style={{background:'#6366f1', padding: '12px 24px'}} onClick={handleAddFunds}>
            💳 Add Funds
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card"><h3>Net Worth</h3><h1>${user ? (user.walletBalance + portfolioValue).toLocaleString() : '0.00'}</h1></div>
        <div className="card"><h3>Cash</h3><h1 style={{color:'#60a5fa'}}>${user ? user.walletBalance.toLocaleString() : '0.00'}</h1></div>
        <div className="card"><h3>Stocks (Live)</h3><h1 style={{color:'#10b981'}}>${portfolioValue.toLocaleString()}</h1></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          {/* Trade Box */}
          <div className="card">
            <h3>⚡ Quick Trade</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop:'15px' }}>
              <input type="text" placeholder="Symbol (e.g. NVDA)" value={buySymbol} onChange={e => setBuySymbol(e.target.value)} style={{flex:1}} />
              <input type="number" placeholder="Qty" value={buyQty} onChange={e => setBuyQty(e.target.value)} style={{width:'100px'}} />
              <button onClick={handleBuy} disabled={isTrading} className="btn-primary">{isTrading ? '...' : 'Buy'}</button>
            </div>
          </div>

          {/* PORTFOLIO TABLE */}
          <div className="card" style={{marginTop:'20px', overflowX:'auto'}}>
            <h3>Your Portfolio</h3>
            <table style={{width:'100%', marginTop:'15px', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', borderBottom:'1px solid #444'}}>
                  <th style={{padding:'10px'}}>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Buy</th>
                  <th>Current</th>
                  <th>P&L ($)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {user?.portfolio?.length > 0 ? (
                  user.portfolio.map((stock, i) => {
                    const currentPrice = livePrices[stock.symbol] || stock.avgPrice;
                    const profit = (currentPrice - stock.avgPrice) * stock.qty;
                    const isProfit = profit >= 0;

                    return (
                      <tr key={i} style={{borderBottom:'1px solid #333'}}>
                        <td style={{padding:'10px', fontWeight:'bold', color:'#60a5fa'}}>{stock.symbol}</td>
                        <td>{stock.qty}</td>
                        <td>${stock.avgPrice.toFixed(2)}</td>
                        <td>${currentPrice.toFixed(2)}</td>
                        <td style={{ fontWeight: 'bold', color: isProfit ? '#10b981' : '#ef4444' }}>
                          {isProfit ? '+' : ''}{profit.toFixed(2)}
                        </td>
                        <td>
                          <button onClick={() => handleSell(stock.symbol)} style={{background:'#ef4444', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>Sell</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="6" style={{padding:'20px', textAlign:'center', opacity:0.7}}>No stocks owned</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Chart */}
        <div className="card" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div style={{width:'90%'}}><Pie data={data} /></div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;