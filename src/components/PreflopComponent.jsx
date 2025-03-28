import React, { useState, useEffect } from 'react';
import { SituationService } from '../models/SituationService';
import StackSizeGuide from './StackSizeGuide';
import VirtualKeyboard from './VirtualKeyboard';
import SettingsComponent from './SettingsComponent';

const cardService = new SituationService();

function PreflopComponent({ darkMode }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showStackSizeGuide, setShowStackSizeGuide] = useState(false);
  const [tableMode, setTableMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('pokerEdgeSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      tableSize: 9,
      stackSize: 'medium'
    };
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    // Get all situations on component mount
    const allSituations = cardService.getAllSituations();
    setItems(allSituations);
  }, []);

  useEffect(() => {
    // Filter situations when query changes
    if (query) {
      const filtered = cardService.getSituationByQuery(query, 10, settings);
      setFilteredItems(filtered);
      setCurrentItemIndex(0); // Reset to first item when query changes
    } else {
      setFilteredItems([]);
    }
  }, [query, settings]);

  useEffect(() => {
    // Auto-enable table mode on mobile
    const isMobile = window.innerWidth <= 576;
    if (isMobile) {
      setTableMode(true);
    }
  }, []);

  const handleKeyboardInput = (newQuery, replace = false) => {
    if (replace) {
      setQuery(newQuery);
    } else {
      // Only allow up to 3 characters
      if (query.length < 3) {
        setQuery(newQuery);
      }
    }
    
    // Vibration feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(10); // 10ms subtle vibration
    }
  };

  // Function to get the correct image path
  const getCardImagePath = (card, suit) => {
    return `/images/svg-cards/${card}_of_${suit}.svg`;
  };

  // Toggle between normal and table mode
  const toggleTableMode = () => {
    setTableMode(!tableMode);
    
    // Vibration feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(15); // slightly longer vibration for mode change
    }
  };

  // Handle touch start
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end for swipe navigation
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    // Only process swipes in table mode with filtered items
    if (tableMode && filteredItems.length > 0) {
      if (isLeftSwipe && currentItemIndex < filteredItems.length - 1) {
        // Swipe left to next item
        setCurrentItemIndex(currentItemIndex + 1);
        if (navigator.vibrate) navigator.vibrate(10);
      } else if (isRightSwipe && currentItemIndex > 0) {
        // Swipe right to previous item
        setCurrentItemIndex(currentItemIndex - 1);
        if (navigator.vibrate) navigator.vibrate(10);
      }
    }
  };

  // Function to color-code action text
  const colorCodeAction = (action) => {
    if (!action) return action;
    
    // Handle the exact 'F' value from cardData.js
    if (action === 'F' || action === 'Fold') {
      return <span className="action-fold">FOLD</span>;
    }
    
    const lowerAction = action.toLowerCase();
    
    // For other actions that include "fold"
    if (lowerAction.includes('fold')) {
      return <span className="action-fold">{action}</span>;
    } else if (lowerAction.includes('raise')) {
      return <span className="action-raise">{action}</span>;
    } else if (lowerAction.includes('reraise')) {
      return <span className="action-reraise">{action}</span>;
    } else if (lowerAction.includes('call')) {
      return <span className="action-call">{action}</span>;
    } else if (lowerAction.includes('check')) {
      return <span className="action-check">{action}</span>;
    }
    
    return action;
  };

  return (
    <div className={`page ${tableMode ? 'table-mode' : ''}`}>
      <div className="minimal-header">
        <span className="app-title">♠️ PokerEdge</span>
        <div className="header-controls">
          <button 
            className="mode-toggle" 
            onClick={toggleTableMode}
            aria-label={tableMode ? 'Switch to normal mode' : 'Switch to table mode'}
          >
            {tableMode ? '📱' : '🎮'}
          </button>
          <button 
            className="settings-button" 
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>
      
      {showSettings && (
        <SettingsComponent 
          onClose={() => setShowSettings(false)}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
          }}
          initialSettings={settings}
        />
      )}
      
      <VirtualKeyboard 
        onButtonClick={handleKeyboardInput} 
        currentQuery={query} 
        darkMode={darkMode}
      />

      <div 
        className="situations-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tableMode ? (
          // Table mode - show one item at a time with swipe navigation
          filteredItems.length > 0 ? (
            <>
              <div className="situation-row">
                <div className="situation-header">
                  <div className="hand-info">
                    <span className="position-label">{filteredItems[currentItemIndex].positionDisplay}</span>
                    <span className="card-display">
                      {filteredItems[currentItemIndex].card1}
                      {filteredItems[currentItemIndex].card2}
                      {filteredItems[currentItemIndex].isSuited ? 's' : 'o'}
                    </span>
                  </div>
                </div>
                
                <div className="advice-column">
                  <div className="advice">
                    <div className="advice-section">
                      <div className="advice-label">Unraised Pot:</div>
                      <div className="advice-action">
                        {filteredItems[currentItemIndex].unraisedPot === 'F' ? 
                          <span className="action-fold">FOLD</span> : 
                          colorCodeAction(filteredItems[currentItemIndex].unraisedPot)
                        }
                      </div>
                    </div>
                    
                    <div className="advice-section">
                      <div className="advice-label">Raised Pot:</div>
                      <div className="advice-action">
                        {filteredItems[currentItemIndex].raisedPot === 'F' ? 
                          <span className="action-fold">FOLD</span> : 
                          colorCodeAction(filteredItems[currentItemIndex].raisedPot)
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Swipe indicators */}
              {filteredItems.length > 1 && (
                <div className="swipe-indicators">
                  {filteredItems.map((_, index) => (
                    <div 
                      key={index} 
                      className={`swipe-indicator ${index === currentItemIndex ? 'active' : ''}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Swipe instructions */}
              {filteredItems.length > 1 && (
                <div className="swipe-instructions">
                  Swipe left/right to navigate
                </div>
              )}
            </>
          ) : (
            // No results in table mode
            query ? (
              <div className="situation-row">
                <div className="advice-column">
                  <div className="advice">
                    <span style={{
                      color: '#e74c3c',
                      fontWeight: 'bold',
                      fontSize: '1.5em',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      margin: '20px 0'
                    }}>FOLD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="situation-row">
                <div className="advice-column">
                  <div className="advice">
                    <p>Use the keyboard above to select a position and cards</p>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          // Normal mode - show list of items
          filteredItems.length > 0 ? filteredItems.slice(0, 20).map((item, index) => (
            <div key={index} className="row situation-row">
              <div className="situation-header">
                <div className="hand-info">
                  <span className="position-label">{item.positionDisplay}</span>
                  <span className="card-display">
                    {item.card1}
                    {item.card2}
                    {item.isSuited ? 's' : 'o'}
                  </span>
                </div>
              </div>
              
              <div className="advice-column">
                <div className="advice">
                  <div className="advice-section">
                    <div className="advice-label">Unraised Pot:</div>
                    <div className="advice-action">
                      {item.unraisedPot === 'F' ? 
                        <span className="action-fold">FOLD</span> : 
                        colorCodeAction(item.unraisedPot)
                      }
                    </div>
                  </div>
                  
                  <div className="advice-section">
                    <div className="advice-label">Raised Pot:</div>
                    <div className="advice-action">
                      {item.raisedPot === 'F' ? 
                        <span className="action-fold">FOLD</span> : 
                        colorCodeAction(item.raisedPot)
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : query ? (
            <div className="row situation-row">
              <div className="advice-column">
                <div className="advice">
                  <p>No results found for your query</p>
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
      
      <div className="footer-info">
        <div className="table-size-indicator">
          Table Size: {settings.tableSize} players
        </div>
        <div className="stack-size-indicator">
          Stack: {settings.stackSize === 'short' ? 'Short' : settings.stackSize === 'medium' ? 'Medium' : 'Deep'}
        </div>
      </div>
      
      <StackSizeGuide />
    </div>
  );
}

export default PreflopComponent;
