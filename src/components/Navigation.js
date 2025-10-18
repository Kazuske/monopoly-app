import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav className="navigation">
      <button className="nav-button" onClick={() => navigate('/')}>🏆 Leaderboard</button>
      <button className="nav-button" onClick={() => navigate('/team-summary')}>📊 Summary</button>
      <button className="nav-button" onClick={() => navigate('/properties')}>🏡 Properties</button>
      <button className="nav-button" onClick={() => navigate('/add-cash')}>💰 Add $</button>
      <button className="nav-button" onClick={() => navigate('/remove-cash')}>💸 Remove $</button>
      <button className="nav-button" onClick={() => navigate('/add-property')}>🏠 Add Prop</button>
      <button className="nav-button" onClick={() => navigate('/remove-property')}>🏚️ Del Prop</button>
      <button className="nav-button" onClick={() => navigate('/edit-team')}>✏️ Edit</button>
      <button className="nav-button" onClick={() => navigate('/remove-team')}>❌ Del Team</button>
      <button className="nav-button reset-button" onClick={() => navigate('/reset-tables')}>🔄 Reset</button>
    </nav>
  );
}

export default Navigation;

