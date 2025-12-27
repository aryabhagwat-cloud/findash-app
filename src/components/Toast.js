import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Disappear after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease-out'
  };

  return <div style={styles}>{message}</div>;
};

export default Toast;