import React, { useState } from 'react';
import { addCash } from '../functions.js';
import './AddCash.css';

function AddCash() {
  const [teamId, setTeamId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await addCash(parseInt(amount), parseInt(teamId));
      setMessage({ type: 'success', text: `Successfully added ₹${amount} to Team ${teamId}` });
      setAmount('');
      setTeamId('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cash-operation">
      <h1>💰 Add Cash</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="number"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="Team ID"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Cash'}
        </button>
      </form>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AddCash;
