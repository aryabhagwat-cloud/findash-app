// src/components/TransactionHistory.js
import React, { useState } from 'react';

const TransactionHistory = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // How many trades to show per page

  // 1. Calculate Page Logic
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Get only the items for the CURRENT page
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="card" style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'15px' }}>
        <h3>📜 Transaction History</h3>
        <span style={{ fontSize:'0.9em', color:'var(--text-secondary)' }}>
          {transactions.length} Total Records
        </span>
      </div>
      
      {transactions.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No transactions yet.</p>
      ) : (
        <>
          <div style={{ minHeight: '200px' }}> {/* Fixed height to prevent jumping */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid #eee' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Type</th>
                  <th>Asset</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: tx.type === 'BUY' ? '#10b981' : '#ef4444' }}>
                      {tx.type}
                    </td>
                    <td>{tx.qty}x <strong>{tx.symbol}</strong></td>
                    <td>${tx.total.toFixed(2)}</td>
                    <td style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. PAGINATION CONTROLS */}
          {transactions.length > itemsPerPage && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
              <button 
                onClick={handlePrev} 
                disabled={currentPage === 1}
                style={{ 
                  padding: '5px 15px', border: '1px solid #ddd', borderRadius: '5px', background: 'none', cursor: 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1 
                }}
              >
                ◀ Prev
              </button>
              
              <span style={{ fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
                style={{ 
                  padding: '5px 15px', border: '1px solid #ddd', borderRadius: '5px', background: 'none', cursor: 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1 
                }}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;