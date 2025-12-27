import React from 'react';

const CompanyProfile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>Company Fundamentals</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        
        {/* Market Cap */}
        <div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>Market Cap</span>
          <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
            {profile.marketCapitalization ? `$${(profile.marketCapitalization / 1000).toFixed(2)}T` : 'N/A'}
          </div>
        </div>

        {/* P/E Ratio */}
        <div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>P/E Ratio</span>
          <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{profile.peRatio || 'N/A'}</div>
        </div>

        {/* Dividend Yield */}
        <div>
           <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>Dividend Yield</span>
           <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{profile.dividendYield ? `${profile.dividendYield}%` : 'N/A'}</div>
        </div>

         {/* Sector */}
        <div>
           <span style={{ color: 'var(--text-secondary)', fontSize: '0.9em' }}>Sector</span>
           <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{profile.finnhubIndustry || 'N/A'}</div>
        </div>

      </div>
    </div>
  );
};

export default CompanyProfile;