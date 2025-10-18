import React, { useState } from "react";
import { getTeamSummary } from "../functions.js";
import "./TeamSummary.css";

function TeamSummary() {
  const [teamId, setTeamId] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamId) return;
    
    setLoading(true);
    try {
      const result = await getTeamSummary(parseInt(teamId));
      console.log('Team Summary Result:', result);
      
      if (result.error) {
        setError(result.error.message);
        setSummary(null);
      } else if (!result.data) {
        setError("Team not found");
        setSummary(null);
      } else {
        setSummary(result.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-summary">
      <h1>📊 Team Summary</h1>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="number"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          placeholder="Enter Team ID"
          className="search-input"
          min="1"
          required
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Loading..." : "Get Summary"}
        </button>
      </form>

      {loading && <p>Loading team data...</p>}
      {error && <p className="error">Error: {error}</p>}
      
      {summary && (
        <div className="summary-content">
          <h2>Team Details</h2>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Team ID</th>
                <th>Team Name</th>
                <th>Cash</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{teamId}</td>
                <td>{summary.team_name}</td>
                <td>₹{(summary.cash || 0).toLocaleString()}</td>
                <td>₹{(summary.total_cash || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {summary.owned_properties && summary.owned_properties.length > 0 ? (
            <>
              <h2>Owned Properties</h2>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Property Name</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.owned_properties.map((property, index) => (
                    <tr key={property.property_name || index}>
                      <td>{index + 1}</td>
                      <td>{property.property_name}</td>
                      <td>₹{(property.value || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="no-properties">This team doesn't own any properties yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamSummary;

