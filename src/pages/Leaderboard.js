import React from "react";

function Leaderboard({ leaderboard, loading }) {
  return (
    <div className="leaderboard">
      <h1 style={{ color: '#000000' }}>🏆 Team Leaderboard</h1>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team Name</th>
              <th>Cash</th>
              <th>Total Cash</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team, index) => (
              <tr key={team.team_id}>
                <td>{index + 1}</td>
                <td>{team.team_name}</td>
                <td>₹{team.cash}</td>
                <td>₹{team.total_cash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;

