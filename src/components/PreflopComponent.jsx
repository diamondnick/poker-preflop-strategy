import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SituationService } from '../models/SituationService';
import VirtualKeyboard from './VirtualKeyboard';
import DataSourcesComponent from './DataSourcesComponent';
import { getWinProbability } from '../data/oddsData';
import './LoadingAndError.css';

const cardService = new SituationService();

function PreflopComponent({ darkMode }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tableMode, setTableMode] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [settings] = useState({
    tableSize: 9
  });
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    // Get all situations on component mount
    try {
      setIsLoading(true);
      const allSituations = cardService.getAllSituations();
      setItems(allSituations);
      setError(null);
    } catch (err) {
      console.error('Error loading situations:', err);
      setError('Failed to load poker data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize the query completeness check
  const isQueryComplete = useMemo(() => {
    if (!query) return false;
    
    return query.length >= 3 && (
      // Pocket pair (same cards)
      (query.length === 3 && query[1] === query[2]) ||
      // Non-pair with suited/offsuit indicator
      (query.length === 4 && (query[3] === 's' || query[3] === 'o'))
    );
  }, [query]);
  
  // Memoize filtered items to prevent unnecessary recalculations
  useEffect(() => {
    // Filter situations when query changes - only show results when query is complete
    if (query && isQueryComplete) {
      try {
        setIsLoading(true);
        const filtered = cardService.getSituationByQuery(query, 10, settings);
        setFilteredItems(filtered);
        setCurrentItemIndex(0); // Reset to first item when query changes
        setError(null);
      } catch (err) {
        console.error('Error filtering situations:', err);
        setError('Failed to process your selection. Please try again.');
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredItems([]); // Don't show results until query is complete
    }
  }, [query, settings, isQueryComplete]);

  useEffect(() => {
    // Auto-enable table mode on mobile
    const isMobile = window.innerWidth <= 576;
    if (isMobile) {
      setTableMode(true);
    }
  }, []);

  const handleKeyboardInput = useCallback((newQuery, replace = false) => {
    if (replace) {
      setQuery(newQuery);
    } else {
      // Only allow up to 4 characters (position + card1 + card2 + suited/offsuit)
      if (query.length < 4) {
        setQuery(newQuery);
      }
    }
    
    // Clear any previous errors when user is entering new input
    setError(null);
    
    // Vibration feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(10); // 10ms subtle vibration
    }
  }, [query]);

  // Function to get the correct image path
  const getCardImagePath = (card, suit) => {
    return `/images/svg-cards/${card}_of_${suit}.svg`;
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

  // Function to get color based on probability
  const getProbabilityColor = (prob) => {
    if (prob >= 65) return '#4CAF50'; // Green
    if (prob >= 55) return '#8BC34A'; // Light green
    if (prob >= 45) return '#FFC107'; // Yellow
    if (prob >= 35) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Function to format hand for win probability calculation
  const formatHandForProbability = (card1, card2, isSuited) => {
    if (card1 === card2) {
      return `${card1}${card2}`;
    } else if (isSuited) {
      return `${card1}${card2}s`;
    } else {
      return `${card1}${card2}`;
    }
  };

  // Function to calculate and display win probability
  const displayWinProbability = (card1, card2, isSuited, position, isRaisedPot = false) => {
    const hand = formatHandForProbability(card1, card2, isSuited);
    // Base probability from the hand
    let probability = getWinProbability(hand, position, settings.tableSize);
    
    // Adjust probability based on whether the pot is raised
    if (isRaisedPot) {
      // In raised pots, stronger hands are needed to continue
      probability = probability * 0.9; // Reduce probability by 10% for raised pots
    }
    
    // Adjust for suited vs unsuited (if not a pair)
    if (card1 !== card2) {
      if (isSuited) {
        probability = probability * 1.1; // Increase by 10% for suited hands
      } else {
        probability = probability * 0.95; // Decrease by 5% for offsuit hands
      }
    }
    
    // Ensure probability stays within reasonable bounds
    probability = Math.min(Math.max(probability, 5), 95);
    
    const roundedProb = Math.round(probability);
    const color = getProbabilityColor(probability);
    
    return (
      <div className="win-probability-container">
        <div className="probability-meter-mini">
          <div 
            className="probability-bar" 
            style={{ width: `${probability}%`, backgroundColor: color }}
          />
          <span className="probability-value" style={{ color: '#000', fontWeight: 'bold', textShadow: '0 0 3px rgba(255, 255, 255, 0.9)' }}>
            {roundedProb}%
          </span>
        </div>
        <div className="probability-label">
          Win Probability {isSuited ? '(Suited)' : card1 === card2 ? '(Pair)' : '(Offsuit)'} 
          {isRaisedPot ? ' - Raised Pot' : ''}
        </div>
      </div>
    );
  };

  return (
    <div className={`page ${tableMode ? 'table-mode' : ''}`}>
      <div className="minimal-header">
        <span className="app-title">♠️ PokerEdge</span>
        <div className="header-controls">
          <button 
            className="settings-button" 
            onClick={() => setShowDataSources(true)}
            aria-label="Data Sources"
          >
            📊
          </button>
        </div>
      </div>
      
      {showDataSources && (
        <DataSourcesComponent 
          onClose={() => setShowDataSources(false)}
          darkMode={darkMode}
        />
      )}
      
      <div className="preflop-container">
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        <div className="keyboard-container">
          <VirtualKeyboard onButtonClick={handleKeyboardInput} currentQuery={query} darkMode={darkMode} settings={settings} />
        </div>
      </div>

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
                      {displayWinProbability(filteredItems[currentItemIndex].card1, filteredItems[currentItemIndex].card2, filteredItems[currentItemIndex].isSuited, filteredItems[currentItemIndex].position)}
                    </div>
                    
                    <div className="advice-section">
                      <div className="advice-label">Raised Pot:</div>
                      <div className="advice-action">
                        {filteredItems[currentItemIndex].raisedPot === 'F' ? 
                          <span className="action-fold">FOLD</span> : 
                          colorCodeAction(filteredItems[currentItemIndex].raisedPot)
                        }
                      </div>
                      {displayWinProbability(filteredItems[currentItemIndex].card1, filteredItems[currentItemIndex].card2, filteredItems[currentItemIndex].isSuited, filteredItems[currentItemIndex].position, true)}
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
            (() => {
              // Check if query is complete
              const isQueryComplete = query && query.length >= 3 && (
                // Pocket pair (same cards)
                (query.length === 3 && query[1] === query[2]) ||
                // Non-pair with suited/offsuit indicator
                (query.length === 4 && (query[3] === 's' || query[3] === 'o'))
              );
              
              if (isQueryComplete) {
                // Query is complete but no results found - show FOLD
                return (
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
                );
              } else {
                // Query is incomplete - show instruction
                return (
                  <div className="situation-row">
                    <div className="advice-column">
                      <div className="advice">
                        <p>Use the keyboard above to select a position and cards</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })()
          )
        ) : (
          // Normal mode - show list of items
          filteredItems.length > 0 ? filteredItems.slice(0, 20).map((item, index) => (
            <div key={index} className="row situation-row">
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
                    {displayWinProbability(item.card1, item.card2, item.isSuited, item.position)}
                  </div>
                  
                  <div className="advice-section">
                    <div className="advice-label">Raised Pot:</div>
                    <div className="advice-action">
                      {item.raisedPot === 'F' ? 
                        <span className="action-fold">FOLD</span> : 
                        colorCodeAction(item.raisedPot)
                      }
                    </div>
                    {displayWinProbability(item.card1, item.card2, item.isSuited, item.position, true)}
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
      </div>
    </div>
  );
}

export default PreflopComponent;
