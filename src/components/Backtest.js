import React, { useState } from 'react';
import Papa from 'papaparse';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Backtest = () => {
  const [symbol, setSymbol] = useState('AA');
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runBacktest = () => {
    setLoading(true);
    setError('');
    setResult(null);

    // FIX: Using correct public path
    const filePath = `${process.env.PUBLIC_URL}/data/${symbol.toUpperCase()}.csv`;

    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (parsed) => {
            const rows = parsed.data
              .filter(r => r.Date && r.Close)
              .map(r => ({ ...r, Close: parseFloat(r.Close) }));
            
            if (rows.length < 10) {
              setError("Not enough data history.");
              setLoading(false);
              return;
            }

            const startData = rows[0]; 
            const endData = rows[rows.length - 1];
            const startPrice = startData.Close;
            const endPrice = endData.Close;
            
            const shares = amount / startPrice;
            const finalValue = shares * endPrice;
            const profit = finalValue - amount;
            const percent = ((finalValue - amount) / amount) * 100;

            setResult({
              startPrice, endPrice,
              startDate: startData.Date, endDate: endData.Date,
              finalValue, profit, percent
            });

            // Sample data to make chart load faster
            setChartData(rows.filter((_, i) => i % 5 === 0));
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(`Could not load ${symbol}.csv`);
        setLoading(false);
      });
  };

  return (
    <div className="card" style={{ marginTop: '20px', borderTop: '4px solid #8b5cf6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <span style={{ fontSize: '1.5rem' }}>⏳</span>
        <div>
           <h3 style={{ margin: 0 }}>Time Machine</h3>
           <p style={{ margin: 0, fontSize: '0.9em', color: 'var(--text-secondary)' }}>Backtest Strategy</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '0.8em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Asset</label>
          <input 
            type="text" 
            value={symbol} 
            onChange={e => setSymbol(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '80px' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8em', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Invest ($)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd', width: '100px' }}
          />
        </div>
        <button 
          onClick={runBacktest}
          disabled={loading}
          style={{ padding: '11px 20px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {error && <p style={{ color: '#ef4444', marginTop: '15px' }}>⚠️ {error}</p>}

      {result && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '8px', marginBottom: '15px' }}>
             <div>
               <div style={{ fontSize: '0.8em', color: 'gray' }}>INITIAL ({result.startDate})</div>
               <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>${Number(amount).toLocaleString()}</div>
             </div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '0.8em', color: 'gray' }}>FINAL ({result.endDate})</div>
               <div style={{ fontWeight: 'bold', fontSize: '1.2em', color: result.profit >= 0 ? '#10b981' : '#ef4444' }}>
                 ${result.finalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
               </div>
               <div style={{ fontSize: '0.8em', color: result.profit >= 0 ? '#10b981' : '#ef4444' }}>
                 {result.profit >= 0 ? '+' : ''}{result.percent.toFixed(1)}%
               </div>
             </div>
          </div>

          <div style={{ width: '100%', height: 150 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <XAxis dataKey="Date" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip />
                <Area type="monotone" dataKey="Close" stroke="#8b5cf6" fill="rgba(139, 92, 246, 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backtest;