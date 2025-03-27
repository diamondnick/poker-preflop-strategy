import React from 'react';
import { cardArray, F, R, RR, C, RFIC1 } from '../data/cardData';

function VirtualKeyboard({ onButtonClick, currentQuery, darkMode }) {
  // Determine what stage of input we're in
  const queryLength = currentQuery.length;
  const showPositions = queryLength === 0;
  const showFirstCard = queryLength === 1;
  const showSecondCard = queryLength === 2;
  
  // Card ranks and positions
  const positions = [
    { key: 'E', display: 'Early' },
    { key: 'M', display: 'Middle' },
    { key: 'L', display: 'Late' },
    { key: 'S', display: 'SB' },
    { key: 'B', display: 'BB' }
  ];
  
  const cardRanks = [
    { key: 'A', display: 'A' },
    { key: 'K', display: 'K' },
    { key: 'Q', display: 'Q' },
    { key: 'J', display: 'J' },
    { key: 'T', display: 'T' },
    { key: '9', display: '9' },
    { key: '8', display: '8' },
    { key: '7', display: '7' },
    { key: '6', display: '6' },
    { key: '5', display: '5' },
    { key: '4', display: '4' },
    { key: '3', display: '3' },
    { key: '2', display: '2' }
  ];

  // Define premium hands
  const premiumHands = ['AA', 'KK', 'QQ', 'AKs', 'AK'];
  
  // Define hand strength categories
  const handStrengthCategories = {
    PREMIUM: 'premium',   // Always raise (green)
    STRONG: 'strong',     // Usually raise (light green)
    PLAYABLE: 'playable', // Position dependent (blue)
    MARGINAL: 'marginal', // Caution (yellow)
    WEAK: 'weak',         // Usually fold (orange)
    FOLD: 'fold'          // Always fold (red)
  };

  // Function to get hand strength category
  const getHandStrength = (card) => {
    if (!showSecondCard) return null;
    
    const position = currentQuery[0];
    const firstCard = currentQuery[1];
    const secondCard = card;
    
    // Check both suited and unsuited combinations
    const suitedCombo = `${firstCard}${secondCard}s`;
    const unsuitedCombo = `${firstCard}${secondCard}`;
    const reversedSuitedCombo = `${secondCard}${firstCard}s`;
    const reversedUnsuitedCombo = `${secondCard}${firstCard}`;
    
    // Premium hands
    if (premiumHands.includes(suitedCombo) || 
        premiumHands.includes(unsuitedCombo) ||
        (firstCard === secondCard && ['A', 'K', 'Q'].includes(firstCard)) ||
        ((firstCard === 'A' && secondCard === 'K') || (firstCard === 'K' && secondCard === 'A'))) {
      return handStrengthCategories.PREMIUM;
    }
    
    // Find the index for the position
    let posIndex;
    switch (position) {
      case 'E': posIndex = 3; break;
      case 'M': posIndex = 1; break;
      case 'L': posIndex = 5; break;
      case 'S': posIndex = 7; break;
      case 'B': posIndex = 9; break;
      default: return handStrengthCategories.FOLD;
    }
    
    // Check hand in the card array
    for (let i = 0; i < cardArray.length; i++) {
      let handData = null;
      
      // Check all possible combinations
      if (cardArray[i][0] === suitedCombo || cardArray[i][0] === unsuitedCombo ||
          cardArray[i][0] === reversedSuitedCombo || cardArray[i][0] === reversedUnsuitedCombo) {
        handData = cardArray[i];
      }
      
      if (handData) {
        const unraisedAction = handData[posIndex];
        const raisedAction = handData[posIndex + 1];
        
        // Both actions are fold
        if (unraisedAction === F && raisedAction === F) {
          return handStrengthCategories.FOLD;
        }
        
        // Both actions are raise or reraise
        if ((unraisedAction === R || unraisedAction === RR) && 
            (raisedAction === R || raisedAction === RR)) {
          return handStrengthCategories.STRONG;
        }
        
        // At least one action is raise
        if (unraisedAction === R || unraisedAction === RR || 
            raisedAction === R || raisedAction === RR) {
          return handStrengthCategories.PLAYABLE;
        }
        
        // At least one action is call
        if (unraisedAction === C || raisedAction === C || 
            unraisedAction === RFIC1 || raisedAction === RFIC1) {
          return handStrengthCategories.MARGINAL;
        }
        
        // Default to weak if we can't categorize
        return handStrengthCategories.WEAK;
      }
    }
    
    // If we can't find the combination, it's a fold
    return handStrengthCategories.FOLD;
  };

  // Function to check if a card combination will result in a fold
  const willFold = (card) => {
    return getHandStrength(card) === handStrengthCategories.FOLD;
  };

  // Function to check if a hand is premium
  const isPremiumHand = (card) => {
    return getHandStrength(card) === handStrengthCategories.PREMIUM;
  };

  // Function to get button style based on hand strength
  const getButtonStyle = (card) => {
    const strength = getHandStrength(card);
    
    if (!strength) return {};
    
    switch (strength) {
      case handStrengthCategories.PREMIUM:
        return {
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          color: '#27ae60',
          borderColor: '#27ae60'
        };
      case handStrengthCategories.STRONG:
        return {
          backgroundColor: 'rgba(39, 174, 96, 0.15)',
          color: '#27ae60',
          borderColor: '#27ae60'
        };
      case handStrengthCategories.PLAYABLE:
        return {
          backgroundColor: 'rgba(52, 152, 219, 0.15)',
          color: '#2980b9',
          borderColor: '#2980b9'
        };
      case handStrengthCategories.MARGINAL:
        return {
          backgroundColor: 'rgba(241, 196, 15, 0.15)',
          color: '#f39c12',
          borderColor: '#f39c12'
        };
      case handStrengthCategories.WEAK:
        return {
          backgroundColor: 'rgba(230, 126, 34, 0.15)',
          color: '#d35400',
          borderColor: '#d35400'
        };
      case handStrengthCategories.FOLD:
        return {
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          color: '#e74c3c',
          borderColor: '#e74c3c'
        };
      default:
        return {};
    }
  };

  // Function to get indicator label for a card
  const getIndicatorLabel = (card) => {
    if (!showSecondCard) return null;
    
    const firstCard = currentQuery[1];
    const secondCard = card;
    const suited = currentQuery[2] === 's';
    const pair = firstCard === secondCard;
    
    // Get the hand strength
    const strength = getHandStrength(card);
    
    if (!strength) return null;
    
    // Return appropriate indicator based on strength
    switch (strength) {
      case handStrengthCategories.PREMIUM:
        return <div className="card-indicator premium-indicator">RAISE</div>;
      case handStrengthCategories.STRONG:
        return <div className="card-indicator strong-indicator">RAISE</div>;
      case handStrengthCategories.PLAYABLE:
        return <div className="card-indicator playable-indicator">CALL</div>;
      case handStrengthCategories.MARGINAL:
        return <div className="card-indicator marginal-indicator">CALL/CHECK</div>;
      case handStrengthCategories.WEAK:
        return <div className="card-indicator weak-indicator">CHECK/FOLD</div>;
      case handStrengthCategories.FOLD:
        return <div className="card-indicator fold-indicator">FOLD</div>;
      default:
        return null;
    }
  };

  // Clear button handler
  const handleClear = () => {
    onButtonClick('', true);
  };

  // Back button handler
  const handleBack = () => {
    if (currentQuery.length > 0) {
      onButtonClick(currentQuery.slice(0, -1), true);
    }
  };

  return (
    <div className={`virtual-keyboard ${darkMode ? 'dark-mode' : ''}`}>
      {/* Display current query */}
      <div className="current-query">
        {currentQuery ? (
          <div className="selected-cards">
            {currentQuery.length >= 1 && currentQuery[0] && (
              <div className="position-display">{currentQuery[0]}</div>
            )}
            {currentQuery.length >= 2 && currentQuery[1] && (
              <div 
                className={`selected-card ${['A', 'K', 'Q', 'J', 'T'].includes(currentQuery[1]) ? 'red-card' : 'black-card'}`}
                data-card={currentQuery[1]}
              >
                <span className="card-corner top-left">{currentQuery[1]}</span>
                <span className="card-center">{currentQuery[1]}</span>
                <span className="card-corner bottom-right">{currentQuery[1]}</span>
              </div>
            )}
            {currentQuery.length >= 3 && currentQuery[2] && (
              <>
                {currentQuery[2] === 's' || currentQuery[2] === 'o' ? (
                  <div className="card-connector">{currentQuery[2] === 's' ? 'suited' : 'offsuit'}</div>
                ) : (
                  <div 
                    className={`selected-card ${['A', 'K', 'Q', 'J', 'T'].includes(currentQuery[2]) ? 'red-card' : 'black-card'}`}
                    data-card={currentQuery[2]}
                  >
                    <span className="card-corner top-left">{currentQuery[2]}</span>
                    <span className="card-center">{currentQuery[2]}</span>
                    <span className="card-corner bottom-right">{currentQuery[2]}</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          'Select cards'
        )}
      </div>
      
      {/* Button groups */}
      <div className="button-groups">
        {/* Position buttons */}
        {showPositions && (
          <div className="button-group">
            <div className="group-label">Position</div>
            <div className="buttons position-buttons">
              {positions.map(pos => (
                <button 
                  key={pos.key} 
                  className="keyboard-button position-button"
                  onClick={() => onButtonClick(pos.key, true)}
                >
                  {pos.display}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* First card buttons */}
        {showFirstCard && (
          <div className="button-group">
            <div className="group-label">First Card</div>
            <div className="buttons card-buttons">
              {cardRanks.map(card => (
                <button 
                  key={card.key} 
                  className="keyboard-button card-button"
                  onClick={() => onButtonClick(currentQuery + card.key)}
                  data-card={card.key}
                >
                  <span className="card-center">{card.display}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Second card buttons */}
        {showSecondCard && (
          <div className="button-group">
            <div className="group-label">Second Card</div>
            <div className="buttons card-buttons">
              {cardRanks.map(card => {
                const strength = getHandStrength(card.key);
                
                return (
                  <button 
                    key={card.key} 
                    className={`keyboard-button card-button ${strength ? strength + '-card' : ''}`}
                    onClick={() => onButtonClick(currentQuery + card.key)}
                    style={getButtonStyle(card.key)}
                    data-card={card.key}
                  >
                    <span className="card-center">{card.display}</span>
                    {getIndicatorLabel(card.key)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Control buttons */}
      <div className="control-buttons">
        <button 
          className="control-button clear-button" 
          onClick={handleClear}
        >
          Clear
        </button>
        <button 
          className="control-button back-button" 
          onClick={handleBack}
          disabled={currentQuery.length === 0}
        >
          ← Back
        </button>
      </div>
      
      {/* Hand strength legend - only show on mobile when in second card selection */}
      {showSecondCard && window.innerWidth <= 576 && (
        <div className="mobile-legend">
          <div className="legend-item premium-legend">
            <span className="legend-color"></span>
            <span className="legend-label">Premium: RAISE/RERAISE</span>
          </div>
          <div className="legend-item fold-legend">
            <span className="legend-color"></span>
            <span className="legend-label">Fold: FOLD</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VirtualKeyboard;
