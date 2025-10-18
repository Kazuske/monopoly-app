import React, { useState } from 'react';
import { removeTeam } from '../functions.js';
import './AddCash.css'; // Reuse existing styles

function RemoveTeam() {
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to remove Team ${teamId}? This cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const result = await removeTeam(parseInt(teamId));
      setMessage({ type: 'success', text: `Successfully removed Team ${teamId}` });
      setTeamId('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cash-operation">
      <h1>❌ Remove Team</h1>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Removing...' : 'Remove Team'}
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

export default RemoveTeam;
