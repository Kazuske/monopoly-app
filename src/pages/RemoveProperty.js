import React, { useState } from 'react';
import { removePropertyFromTeam } from '../functions.js';
import './AddCash.css';

function RemoveProperty() {
  const [teamId, setTeamId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await removePropertyFromTeam(propertyName, parseInt(teamId));
      setMessage({ type: 'success', text: `Property removed from Team ${teamId}` });
      setTeamId('');
      setPropertyName('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="cash-operation">
      <h1>🏚️ Remove Property</h1>
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
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            placeholder="Property Name"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Removing...' : 'Remove Property'}
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

export default RemoveProperty;
