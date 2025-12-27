import React from 'react';

const PortfolioAnalysis = ({ portfolio, balance, netWorth }) => {
  // Logic to generate advice
  const getAdvice = () => {
    const tips = [];
    const cashPercent = netWorth > 0 ? (balance / netWorth) * 100 : 0;
    
    // 1. Cash Check
    if (cashPercent > 70) {
      tips.push({ type: 'warning', text: "High Cash Position: You have a lot of uninvested cash. Consider buying stable assets to beat inflation." });
    } else if (cashPercent < 5) {
      tips.push({ type: 'danger', text: "Low Liquidity: You have very little cash left. Be careful if the market drops!" });
    } else {
      tips.push({ type: 'success', text: "Balanced Cash: Your cash reserves are in a healthy range." });
    }

    // 2. Diversity Check
    if (portfolio.length < 3 && portfolio.length > 0) {
      tips.push({ type: 'warning', text: "Low Diversity: Your portfolio is concentrated. Add more unique assets to reduce risk." });
    } else if (portfolio.length >= 5) {
      tips.push({ type: 'success', text: "Great Diversity: You have a nice mix of different assets." });
    }

    return tips;
  };

  const adviceList = getAdvice();

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <h3>🤖 Portfolio Analysis</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {adviceList.map((tip, index) => (
          <div key={index} style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            background: tip.type === 'success' ? '#dcfce7' : tip.type === 'warning' ? '#fef9c3' : '#fee2e2',
            color: tip.type === 'success' ? '#166534' : tip.type === 'warning' ? '#854d0e' : '#991b1b',
            borderLeft: `5px solid ${tip.type === 'success' ? '#166534' : tip.type === 'warning' ? '#854d0e' : '#991b1b'}`
          }}>
            <strong>{tip.type === 'success' ? '✅ Good:' : tip.type === 'warning' ? '⚠️ Notice:' : '🚨 Alert:'}</strong> {tip.text}
          </div>
        ))}
        {portfolio.length === 0 && <p>Buy your first stock to unlock analysis!</p>}
      </div>
    </div>
  );
};

export default PortfolioAnalysis;