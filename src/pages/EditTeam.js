import React, { useState } from 'react';
import { editTeam } from '../functions.js';
import './AddCash.css'; // Reuse existing styles

function EditTeam() {
  const [formData, setFormData] = useState({
    team_id: '',
    new_team_id: '',
    team_name: '',
    cash: '',
    total_cash: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await editTeam(
        parseInt(formData.cash),
        parseInt(formData.new_team_id),
        parseInt(formData.team_id),
        formData.team_name,
        parseInt(formData.total_cash)
      );
      setMessage({ type: 'success', text: `Successfully updated team ${formData.team_id}` });
      setFormData({
        team_id: '',
        new_team_id: '',
        team_name: '',
        cash: '',
        total_cash: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="cash-operation">
      <h1>✏️ Edit Team</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="number"
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            placeholder="Current Team ID"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="new_team_id"
            value={formData.new_team_id}
            onChange={handleChange}
            placeholder="New Team ID (optional)"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="team_name"
            value={formData.team_name}
            onChange={handleChange}
            placeholder="New Team Name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="cash"
            value={formData.cash}
            onChange={handleChange}
            placeholder="Cash Amount"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="total_cash"
            value={formData.total_cash}
            onChange={handleChange}
            placeholder="Total Cash"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Team'}
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

export default EditTeam;
