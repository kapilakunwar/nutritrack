import React, { useMemo, useState } from 'react';

function DietLog({ meals, dispatch, searchQuery, setSearchQuery, calorieGoal }) {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [mealTypeFilter, setMealTypeFilter] = useState('All');

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      const matchesType = mealTypeFilter === 'All' || meal.type === mealTypeFilter;
      const matchesQuery = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [meals, searchQuery, mealTypeFilter]);

  const totalCalories = useMemo(() => meals.reduce((sum, meal) => sum + meal.calories, 0), [meals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mealName.trim() || !calories) return;

    dispatch({
      type: 'add',
      payload: { id: Date.now(), name: mealName.trim(), calories: parseInt(calories), type: mealType }
    });
    setMealName('');
    setCalories('');
    setMealType('Breakfast'); // Standard form resetting pattern
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">🍽️ Diet Log</h2>
      </div>

      {/* Input Form with Perfect Alignment */}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Meal Name</label>
          <input type="text" placeholder="e.g. Eggs, Oats, Rice" value={mealName} onChange={e => setMealName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Calories (kcal)</label>
          <input type="number" placeholder="Value" value={calories} onChange={e => setCalories(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={mealType} onChange={e => setMealType(e.target.value)}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px' }}>Add</button>
        </div>
      </form>

      {/* Search & Filter Row with Full Width Search Bar */}
      <div className="search-filter-row">
        <div className="form-group" style={{ width: '100%' }}>
          <input type="text" placeholder="🔍 Search meals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div className="filter-buttons">
          {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
            <button key={type} className={`filter-pill ${mealTypeFilter === type ? 'active' : ''}`} onClick={() => setMealTypeFilter(type)}>
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-value">{meals.length}</span><span className="stat-label">Total Items</span></div>
        <div className="stat-card"><span className="stat-value">{meals.length ? Math.round(totalCalories / meals.length) : 0}</span><span className="stat-label">Avg Kcal</span></div>
        <div className="stat-card"><span className="stat-value" style={{color: 'var(--success)'}}>{totalCalories}</span><span className="stat-label">Total Consumed</span></div>
      </div>

      <div className="meal-list">
        {filteredMeals.length === 0 ? (
          <p className="empty-state">No meals tracked for this selection.</p>
        ) : (
          filteredMeals.map(meal => (
            <div key={meal.id} className="meal-item">
              <div>
                <span className="meal-name">{meal.name}</span>
                <span className="meal-meta"> | {meal.type}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span style={{fontWeight: 700}}>{meal.calories} kcal</span>
                <button className="btn btn-danger" style={{padding: '4px 10px', fontSize: '0.8rem'}} onClick={() => dispatch({type: 'delete', payload: meal.id})}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DietLog;