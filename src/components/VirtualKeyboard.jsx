import React from 'react';
import { cardArray, F } from '../data/cardData';

function VirtualKeyboard({ onButtonClick, currentQuery }) {
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

  // Function to check if a card combination will result in a fold
  const willFold = (card) => {
    if (!showFirstCard && !showSecondCard) return false;
    
    // If we're selecting the first card, we can't determine yet
    if (showFirstCard) return false;
    
    // If we're selecting the second card
    if (showSecondCard) {
      const position = currentQuery[0];
      const firstCard = currentQuery[1];
      const secondCard = card;
      
      // Check both suited and unsuited combinations
      const suitedCombo = `${firstCard}${secondCard}s`;
      const unsuitedCombo = `${firstCard}${secondCard}`;
      
      // Find the index for the position
      let posIndex;
      switch (position) {
        case 'E': posIndex = 3; break;
        case 'M': posIndex = 1; break;
        case 'L': posIndex = 5; break;
        case 'S': posIndex = 7; break;
        case 'B': posIndex = 9; break;
        default: return true; // Default to fold if position is invalid
      }
      
      // Check if the card is in the array and if both unraised and raised pots result in fold
      for (let i = 0; i < cardArray.length; i++) {
        // Check suited version
        if (cardArray[i][0] === suitedCombo) {
          return cardArray[i][posIndex] === F && cardArray[i][posIndex + 1] === F;
        }
        
        // Check unsuited version
        if (cardArray[i][0] === unsuitedCombo) {
          return cardArray[i][posIndex] === F && cardArray[i][posIndex + 1] === F;
        }
      }
      
      // If we can't find the combination, it's a fold
      return true;
    }
    
    return false;
  };

  // Clear button handler
  const handleClear = () => {
    onButtonClick('', true);
  };

  // Backspace button handler
  const handleBackspace = () => {
    if (currentQuery.length > 0) {
      onButtonClick(currentQuery.slice(0, -1), true);
    }
  };

  return (
    <div className="virtual-keyboard">
      {/* Display current query */}
      <div className="current-query">
        {currentQuery ? currentQuery : 'Select cards'}
      </div>
      
      {/* Button groups */}
      <div className="button-groups">
        {/* Position buttons */}
        {showPositions && (
          <div className="button-group">
            <div className="group-label">Position</div>
            <div className="buttons">
              {positions.map(pos => (
                <button 
                  key={pos.key} 
                  className="keyboard-button position-button"
                  onClick={() => onButtonClick(pos.key)}
                >
                  {pos.display}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* First card buttons */}
        {(showFirstCard || showPositions) && (
          <div className="button-group">
            <div className="group-label">{showFirstCard ? 'First Card' : 'Cards'}</div>
            <div className="buttons">
              {cardRanks.map(card => (
                <button 
                  key={card.key} 
                  className="keyboard-button card-button"
                  onClick={() => onButtonClick(showFirstCard ? currentQuery + card.key : card.key)}
                >
                  {card.display}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Second card buttons */}
        {showSecondCard && (
          <div className="button-group">
            <div className="group-label">Second Card</div>
            <div className="buttons">
              {cardRanks.map(card => {
                const isFold = willFold(card.key);
                return (
                  <button 
                    key={card.key} 
                    className={`keyboard-button card-button ${isFold ? 'fold-card' : ''}`}
                    onClick={() => onButtonClick(currentQuery + card.key)}
                    style={isFold ? {
                      backgroundColor: 'rgba(231, 76, 60, 0.2)',
                      color: '#e74c3c',
                      borderColor: '#e74c3c'
                    } : {}}
                  >
                    {card.display}
                    {isFold && <span className="fold-indicator">FOLD</span>}
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
          className="keyboard-button control-button clear-button"
          onClick={handleClear}
        >
          Clear
        </button>
        <button 
          className="keyboard-button control-button backspace-button"
          onClick={handleBackspace}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default VirtualKeyboard;
