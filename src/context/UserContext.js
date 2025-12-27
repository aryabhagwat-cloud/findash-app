import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config'; // <--- Uses central config

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Load User ---
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${config.API_URL}/auth/user`, {
        headers: { 'x-auth-token': token },
      });
      const data = await res.json();
      if (res.ok) setUser(data);
      else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.error("Load User Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // --- 2. Buy Stock / Crypto ---
  const buyStock = async (symbol, qty, price) => {
    if (!user) return alert("Please Login first.");
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.API_URL}/portfolio/buy`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ symbol, qty, price })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data); // Update global state
        alert(`✅ Successfully bought ${qty} ${symbol}!`);
        return true;
      } else {
        alert(`❌ Error: ${data.msg}`);
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Server Error during Buy.");
      return false;
    }
  };

  // --- 3. Sell Stock / Crypto ---
  const sellStock = async (symbol, qty, price) => {
    if (!user) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${config.API_URL}/portfolio/sell`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ symbol, qty, price })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        alert(`✅ Sold ${qty} ${symbol} for Profit/Loss.`);
        return true;
      } else {
        alert(`❌ Error: ${data.msg}`);
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("Server Error during Sell.");
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadUser, buyStock, sellStock, loading }}>
      {children}
    </UserContext.Provider>
  );
};