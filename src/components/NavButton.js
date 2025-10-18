import React from 'react';
import './NavButton.css';

function NavButton({ icon, text, onClick }) {
  return (
    <button className="nav-button" onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </button>
  );
}

export default NavButton;
