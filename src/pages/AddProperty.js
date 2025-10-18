import React, { useState, useEffect } from 'react';
import { getAvailableProperties } from '../functions.js';
import './AddCash.css';

function AddProperty() {
  const [teamId, setTeamId] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const result = await getAvailableProperties();
      setAvailableProperties(result.data || []);
    };
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement property assignment function
      setMessage({ type: 'success', text: `Property assigned to Team ${teamId}` });
      setTeamId('');
      setSelectedProperty('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="cash-operation">
      <h1>🏠 Add Property</h1>
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
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            required
          >
            <option value="">Select Property</option>
            {availableProperties.map((prop) => (
              <option key={prop.property_name} value={prop.property_name}>
                {prop.property_name} - ₹{prop.property_value}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Property'}
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

export default AddProperty;
