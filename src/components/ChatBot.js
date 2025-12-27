import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const ChatBot = () => {
  const { user } = useUser();
  const { darkMode } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI Financial Advisor. Ask me for advice! 🤖", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    // 2. AI Logic (Simple Rule-Based)
    setTimeout(() => {
      let botResponse = "I'm not sure about that. Try asking about your 'Net Worth' or 'Portfolio'.";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        botResponse = `Hi ${user ? user.name : 'Trader'}! Ready to make some money? 🚀`;
      } 
      else if (lowerInput.includes("net worth") || lowerInput.includes("balance")) {
        botResponse = user 
          ? `💰 Your Wallet Balance is $${user.walletBalance.toLocaleString()}. Check the dashboard for your full Net Worth.` 
          : "Please log in to see your balance.";
      } 
      else if (lowerInput.includes("advice") || lowerInput.includes("buy")) {
        if (user && user.walletBalance > 10000) {
          botResponse = "📈 You have plenty of Cash ($" + user.walletBalance.toLocaleString() + "). Consider buying blue-chip stocks like AAPL or MSFT!";
        } else {
          botResponse = "⚠️ Your cash is low. Maybe sell some assets or add funds via Razorpay before trading.";
        }
      }
      else if (lowerInput.includes("crypto")) {
        botResponse = "🚀 Crypto is volatile! Check the Crypto Dashboard for live BTC and ETH prices.";
      }

      setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      
      {/* 1. Chat Window */}
      {isOpen && (
        <div className="card fade-in" style={{ 
          width: '300px', 
          height: '400px', 
          display: 'flex', 
          flexDirection: 'column',
          marginBottom: '15px',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: darkMode ? '#1e293b' : 'white',
          border: '1px solid #6366f1',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}>
          {/* Header */}
          <div style={{ background: '#6366f1', color: 'white', padding: '15px', fontWeight: 'bold', display:'flex', justifyContent:'space-between' }}>
            <span>🤖 FinBot</span>
            <span onClick={() => setIsOpen(false)} style={{ cursor:'pointer' }}>✕</span>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#6366f1' : (darkMode ? '#334155' : '#e2e8f0'),
                color: msg.sender === 'user' ? 'white' : (darkMode ? 'white' : 'black'),
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '80%',
                fontSize: '0.9rem'
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '10px', borderTop: '1px solid #444', display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me..." 
              style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
            />
            <button onClick={handleSend} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '5px', padding: '0 15px', cursor: 'pointer' }}>➤</button>
          </div>
        </div>
      )}

      {/* 2. Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: '#6366f1', 
          color: 'white', 
          border: 'none', 
          fontSize: '30px', 
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        💬
      </button>
    </div>
  );
};

export default ChatBot;