import React, { useState } from 'react';
import { resetAllTables } from '../functions.js';
import { useNavigate } from 'react-router-dom';
import './AddCash.css';

function ResetTables() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!window.confirm('⚠️ WARNING: This will reset ALL tables and delete ALL data. This cannot be undone. Are you sure?')) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await resetAllTables();
      if (result.error) {
        setMessage({ type: 'error', text: result.error.message });
      } else {
        setMessage({ type: 'success', text: 'All tables have been reset successfully' });
        setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cash-operation">
      <h1>🔄 Reset All Tables</h1>
      <div className="warning-box">
        <p>⚠️ Warning: This will delete ALL data and reset ALL tables.</p>
        <p>This action cannot be undone!</p>
      </div>
      <button 
        onClick={handleReset} 
        disabled={loading}
        className="reset-button"
      >
        {loading ? 'Resetting...' : '🔄 Reset All Tables'}
      </button>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default ResetTables;
