import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- 1. Import Contexts ---
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

// --- 2. Import Components ---
import Navbar from './components/Navbar'; 
import ChatBot from './components/ChatBot'; // <--- NEW: Import the Bot

// --- 3. Import Pages ---
import Login from './pages/Login';
import Signup from './pages/Signup';
import Simulator from './pages/Simulator';
import StockMarket from './pages/StockMarket';
import CryptoDashboard from './pages/CryptoDashboard';

// --- 4. Import CSS ---
import './App.css'; 

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          {/* --- MAIN LAYOUT CONTAINER --- */}
          <div className="app-container">
            
            {/* LEFT SIDEBAR (Fixed Width) */}
            <div className="sidebar-container">
              <Navbar />
            </div>

            {/* RIGHT CONTENT AREA (Scrollable) */}
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/market" element={<StockMarket />} />
                <Route path="/crypto" element={<CryptoDashboard />} />
              </Routes>

              {/* FLOATING CHATBOT (Lives outside Routes so it stays on every page) */}
              <ChatBot />
              
            </div>

          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;