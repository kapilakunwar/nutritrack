import React, { useEffect } from 'react';

function FastingTimer({ timerState, setTimerState, fastingGoal, setFastingGoal }) {
  const { isRunning, elapsedTime } = timerState;
  const targetSeconds = fastingGoal * 3600;
  const progressPercent = targetSeconds > 0 ? Math.min(100, Math.round((elapsedTime / targetSeconds) * 100)) : 0;
  const goalReached = elapsedTime >= targetSeconds;

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = setInterval(() => {
      setTimerState((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, setTimerState]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setTimerState({ ...timerState, isRunning: !isRunning });
  const resetTimer = () => setTimerState({ isRunning: false, elapsedTime: 0 });

  const handleGoalChange = (event) => {
    const hours = Math.max(1, Number(event.target.value) || 1);
    setFastingGoal(hours);
  };

  return (
    <div className="card timer-card">
      <h2 className="card-title">Intermittent Fasting Timer</h2>

      <div className={`timer-status ${isRunning ? 'active' : 'inactive'}`}>
        {isRunning ? '⏱️ Fasting in progress' : '⏸️ Fasting paused'}
      </div>

      <div className="timer-display">{formatTime(elapsedTime)}</div>

      <div className="progress-details">
        <p className="progress-copy">
          Fasting goal: <strong>{fastingGoal} hours</strong>
        </p>
        <p className="progress-copy">
          {goalReached ? 'Goal reached — nice work!' : `${progressPercent}% of target completed`}
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="fasting-goal">Fasting goal (hours)</label>
        <input
          id="fasting-goal"
          type="number"
          min="1"
          max="24"
          value={fastingGoal}
          onChange={handleGoalChange}
          className="goal-input"
        />
      </div>

      <div className="timer-controls">
        <button className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`} onClick={toggleTimer}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={resetTimer} disabled={elapsedTime === 0 && !isRunning}>
          Reset
        </button>
      </div>

      <div className="help-text">Track your fasting duration against a target and keep your progress saved locally.</div>
    </div>
  );
}

export default FastingTimer;
