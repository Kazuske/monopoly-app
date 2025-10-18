import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gameTime, setGameTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (isRunning && startTime) {
        const elapsed = Math.floor((now - startTime) / 1000);
        setGameTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  const handleStart = () => {
    setStartTime(new Date());
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setGameTime(0);
    setStartTime(null);
  };

  const formatGameTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <div className="timer-row">
        <div className="time-display">
          <span>🕒 Current Time: {currentTime.toLocaleTimeString()}</span>
          <span>⏱️ Game Time: {formatGameTime(gameTime)}</span>
        </div>
        <div className="timer-controls">
          <button 
            onClick={handleStart} 
            disabled={isRunning}
            className="timer-button start"
          >
            {isRunning ? 'Game Started' : '▶️ Start Game'}
          </button>
          <button 
            onClick={handleReset}
            className="timer-button reset"
          >
            🔄 Reset Timer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Timer;
