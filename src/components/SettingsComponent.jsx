import React, { useState, useEffect } from 'react';

const SettingsComponent = ({ onClose, onSave, initialSettings, darkMode, onDarkModeToggle }) => {
  const [settings, setSettings] = useState({
    tableSize: initialSettings?.tableSize || 9,
    darkMode: darkMode,
    ...initialSettings
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = () => {
    // Toggle dark mode if it changed
    if (settings.darkMode !== darkMode) {
      onDarkModeToggle();
    }
    
    // Save settings to localStorage
    localStorage.setItem('pokerEdgeSettings', JSON.stringify(settings));
    
    // Call the onSave callback with the new settings
    if (onSave) {
      onSave(settings);
    }
    
    // Close the settings panel
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-group">
            <label htmlFor="tableSize">Number of Players at Table</label>
            <select 
              id="tableSize" 
              name="tableSize" 
              value={settings.tableSize} 
              onChange={handleChange}
            >
              <option value="2">2 Players (Heads Up)</option>
              <option value="3">3 Players</option>
              <option value="4">4 Players</option>
              <option value="5">5 Players</option>
              <option value="6">6 Players (6-Max)</option>
              <option value="7">7 Players</option>
              <option value="8">8 Players</option>
              <option value="9">9 Players (Full Ring)</option>
              <option value="10">10 Players</option>
            </select>
            <div className="setting-description">
              This affects position-based advice. More players means tighter play from early positions.
            </div>
          </div>
          

          <div className="settings-group">
            <label>Display Mode</label>
            <div className="toggle-option">
              <span>Dark Mode</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.darkMode} 
                  onChange={() => handleToggle('darkMode')}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-description">
              Dark mode is easier on the eyes in low-light environments.
            </div>
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;
