import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const KaggleDataChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('AA');
  const [error, setError] = useState(false);

  const loadData = (fileSymbol) => {
    if (!fileSymbol) return;
    setLoading(true);
    setError(false);
    
    // FIX: Use process.env.PUBLIC_URL to always find the root 'public' folder
    const filePath = `${process.env.PUBLIC_URL}/data/${fileSymbol.toUpperCase()}.csv`;
    
    console.log("Attempting to fetch:", filePath); // Check your browser console to see this path!

    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error("File not found");
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const cleanData = results.data
              .filter(row => row.Date && row.Close) // Filter empty rows
              .map(row => ({
                ...row,
                Close: parseFloat(row.Close) // Ensure price is a number
              }))
              .slice(-150); // Show last 150 days

            if (cleanData.length === 0) {
              setError(true);
            } else {
              setData(cleanData);
            }
            setLoading(false);
          }
        });
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h3>📊 Historical Data Explorer</h3>
          <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>Offline Kaggle Database</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="File (e.g. AA)"
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', width: '80px' }}
          />
          <button 
            onClick={() => loadData(symbol)}
            className="theme-btn"
            style={{ background: '#2563eb', color: 'white', border: 'none', fontSize: '0.9em' }}
          >
            Load
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray' }}>
          Loading {symbol}...
        </div>
      ) : error ? (
        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <p>File <strong>/data/{symbol.toUpperCase()}.csv</strong> not found.</p>
          <p style={{ fontSize: '0.8em', color: 'gray' }}>Make sure the file exists in /public/data folder.</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorKaggle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="Date" tick={{ fontSize: 10 }} tickFormatter={(str) => str ? str.substring(0, 4) : ''} />
              <YAxis domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="Close" stroke="#10b981" fill="url(#colorKaggle)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default KaggleDataChart;