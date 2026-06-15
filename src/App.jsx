import React, { useEffect, useMemo, useReducer, useState } from 'react';
import DietLog from './components/DietLog.jsx';
import FastingTimer from './components/FastingTimer.jsx';
import ProgressRing from './components/ProgressRing.jsx';

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState];
}

function mealsReducer(meals, action) {
  switch (action.type) {
    case 'add': return [...meals, action.payload];
    case 'delete': return meals.filter((meal) => meal.id !== action.payload);
    case 'clear': return [];
    default: return meals;
  }
}

function App() {
  const [theme, setTheme] = useLocalStorageState('trackerTheme', 'light');
  const [calorieGoal, setCalorieGoal] = useLocalStorageState('calorieGoal', 2000);
  const [fastingGoal, setFastingGoal] = useLocalStorageState('fastingGoal', 16);
  const [waterIntake, setWaterIntake] = useLocalStorageState('waterIntake', 0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [meals, dispatch] = useReducer(mealsReducer, [], () => {
    try {
      const saved = localStorage.getItem('dietMeals');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [timerState, setTimerState] = useLocalStorageState('fastingTimer', {
    isRunning: false,
    elapsedTime: 0,
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dietMeals', JSON.stringify(meals));
  }, [meals]);

  const totalCalories = useMemo(() => meals.reduce((sum, meal) => sum + meal.calories, 0), [meals]);
  const progressPercent = calorieGoal > 0 ? Math.min(100, Math.round((totalCalories / calorieGoal) * 100)) : 0;
  const caloriesRemaining = Math.max(0, calorieGoal - totalCalories);

  // Dynamic feedback generator for interactive feel
  const feedbackMessage = useMemo(() => {
    if (progressPercent === 0) return "💪 Ready to kickstart your day? Log your first meal!";
    if (progressPercent < 50) return "⚡ Good start! Keep fueling your body smartly.";
    if (progressPercent < 85) return "🔥 You are doing amazing! Steady progress toward your target.";
    if (progressPercent < 100) return "🎯 Almost there! Just a few more calories to hit the bullseye.";
    return "🎉 Outstanding! Daily calorie target successfully achieved!";
  }, [progressPercent]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">NutriTrack Workspace</p>
          <h1>NutriTrack Optimized Dashboard</h1>
          <p className="hero-copy">Track meals, monitor dynamic fasting windows, and analyze your health routine.</p>
        </div>
        <button className="btn btn-secondary action-theme-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </header>

      <section className="overview-grid">
        <div className="card highlight-card">
          <div className="card-header">
            <h2 className="card-title">🎯 Calorie Overview</h2>
            <div className={`badge ${progressPercent >= 100 ? 'badge-success' : 'badge-secondary'}`}>
              {progressPercent >= 100 ? 'Goal Achieved' : `${progressPercent}% Filled`}
            </div>
          </div>
          <div className="progress-group">
            <ProgressRing progress={progressPercent} />
            <div className="progress-details" style={{flex: 1}}>
              <p className="main-stat-text">Logged <strong>{totalCalories}</strong> / {calorieGoal} kcal</p>
              <p className="feedback-text">{feedbackMessage}</p>
              <div className="form-group inline-setting">
                <label>Set Target:</label>
                <input 
                  type="number" 
                  value={calorieGoal} 
                  onChange={(e) => setCalorieGoal(Math.max(0, parseInt(e.target.value) || 0))} 
                  className="goal-input-minimal" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card metric-sidebar-card">
          <h2 className="card-title">📊 Hydration & Quick Insights</h2>
          <div className="insight-list">
            <div className="insight-item"><span>Total Meals Logged</span><strong>{meals.length}</strong></div>
            <div className="insight-item"><span>Fasting Session</span><strong>{timerState.isRunning ? 'Active ⏱️' : 'Paused ⏸️'}</strong></div>
          </div>
          
          <div className="water-widget-premium">
            <div className="water-info">
              <p className="water-title">💧 Hydration Tracker</p>
              <p className="water-progress">{waterIntake} ml / 3000 ml</p>
            </div>
            <div className="water-bar-container">
              <div className="water-bar-fill" style={{ width: `${Math.min(100, (waterIntake / 3000) * 100)}%` }}></div>
            </div>
            <div className="water-controls">
              <button className="btn btn-water-minus" onClick={() => setWaterIntake(w => Math.max(0, w - 250))}>-250ml</button>
              <button className="btn btn-water-plus" onClick={() => setWaterIntake(w => w + 250)}>+250ml</button>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard">
        <DietLog meals={meals} dispatch={dispatch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} calorieGoal={calorieGoal} />
        <FastingTimer timerState={timerState} setTimerState={setTimerState} fastingGoal={fastingGoal} setFastingGoal={setFastingGoal} />
      </div>
    </div>
  );
}

export default App;