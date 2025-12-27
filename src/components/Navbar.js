import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, setUser } = useUser();
  const { darkMode, toggleTheme } = useTheme(); // Use the Theme Hook
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '20px', 
      backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
      borderRight: '1px solid #334155',
      color: darkMode ? 'white' : 'black'
    }}>
      
      {/* LOGO */}
      <h2 style={{ marginBottom: '40px', color: '#6366f1' }}>FinDash 🚀</h2>

      {/* MENU LINKS */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
        <Link to="/simulator" style={linkStyle(darkMode)}>📊 Dashboard</Link>
        <Link to="/market" style={linkStyle(darkMode)}>🌍 Stock Market</Link>
        <Link to="/crypto" style={linkStyle(darkMode)}>🚀 Crypto</Link>
      </nav>

      {/* BOTTOM SECTION */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* THEME TOGGLE BUTTON */}
        <button 
          onClick={toggleTheme} 
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: darkMode ? '#334155' : '#e2e8f0',
            color: darkMode ? 'white' : 'black',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {user ? (
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}
          >
            Logout
          </button>
        ) : (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer' }}>Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

// Helper for link styles
const linkStyle = (darkMode) => ({
  color: darkMode ? '#cbd5e1' : '#334155',
  textDecoration: 'none',
  fontSize: '1.1rem',
  padding: '10px',
  borderRadius: '5px',
  transition: '0.2s'
});

export default Navbar;