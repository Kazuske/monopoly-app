import React, { useState } from 'react';
import { removeCash } from '../functions.js';
import './AddCash.css'; // Reuse the same CSS

function RemoveCash() {
  const [teamId, setTeamId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await removeCash(parseInt(amount), parseInt(teamId));
      setMessage({ type: 'success', text: `Successfully removed ₹${amount} from Team ${teamId}` });
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
      <h1>💸 Remove Cash</h1>
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
          {loading ? 'Processing...' : 'Remove Cash'}
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

export default RemoveCash;
