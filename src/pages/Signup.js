import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // To show error messages
  const [loading, setLoading] = useState(false); // To show "Creating..." spinner
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Send Data to Your Backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 2. Handle Errors (like "User already exists")
      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // 3. Success! Save Token & Redirect
      localStorage.setItem('token', data.token); // Save the digital key
      alert('🎉 Account Created Successfully!');
      navigate('/'); // Go to Dashboard

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at bottom left, #1e1b4b, #0f172a)' 
    }}>
      <div className="card fade-in" style={{ 
        width: '400px', 
        padding: '40px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '2rem' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', marginTop: '10px' }}>Start your journey to financial freedom</p>
        </div>

        {/* Error Message Box */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.2)', 
            color: '#fca5a5', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '0.9em' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '0.9em' }}>Email</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '8px', fontSize: '0.9em' }}>Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: 'white', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              background: loading ? '#64748b' : 'linear-gradient(to right, #10b981, #059669)', 
              color: 'white', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9em' }}>
          Already have an account? <Link to="/login" style={{ color: '#10b981', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;