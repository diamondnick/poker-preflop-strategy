import React, { useState, useEffect } from 'react';
import { SituationService } from '../models/SituationService';
import StackSizeGuide from './StackSizeGuide';
import VirtualKeyboard from './VirtualKeyboard';

const cardService = new SituationService();

function PreflopComponent() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [tableMode, setTableMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
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
      const filtered = cardService.getSituationByQuery(query);
      setFilteredItems(filtered);
      setCurrentItemIndex(0); // Reset to first item when query changes
    } else {
      setFilteredItems([]);
    }
  }, [query]);

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
    
    const lowerAction = action.toLowerCase();
    
    if (lowerAction.includes('raise')) {
      return <span className="action-raise">{action}</span>;
    } else if (lowerAction.includes('reraise')) {
      return <span className="action-reraise">{action}</span>;
    } else if (lowerAction.includes('call')) {
      return <span className="action-call">{action}</span>;
    } else if (lowerAction.includes('fold')) {
      return <span className="action-fold">{action}</span>;
    } else if (lowerAction.includes('check')) {
      return <span className="action-check">{action}</span>;
    }
    
    return action;
  };

  return (
    <div className={`page ${tableMode ? 'table-mode' : ''}`}>
      <div className="head">
        <div className="container-fluid">
          <div id="top" className="row">
            <h1>Pre<span className="hi">flop</span></h1>
            <div className="sub-head">poker strategy</div>
          </div>
        </div>
      </div>
      
      <div className="view-mode-toggle">
        <button 
          className={`view-mode-button ${!tableMode ? 'active' : ''}`}
          onClick={toggleTableMode}
        >
          Full View
        </button>
        <button 
          className={`view-mode-button ${tableMode ? 'active' : ''}`}
          onClick={toggleTableMode}
        >
          Table Mode
        </button>
      </div>
      
      <VirtualKeyboard 
        onButtonClick={handleKeyboardInput} 
        currentQuery={query} 
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
                <div className="col-xs-12 col-sm-4">
                  <img className="card" src={`/images/svg-cards/${filteredItems[currentItemIndex].position}.svg`} alt={filteredItems[currentItemIndex].positionDisplay} />
                  <img className="card" src={getCardImagePath(filteredItems[currentItemIndex].card1, 'clubs')} alt={filteredItems[currentItemIndex].card1} />
                  {filteredItems[currentItemIndex].isSuited ? (
                    <img className="card" src={getCardImagePath(filteredItems[currentItemIndex].card2, 'clubs')} alt={filteredItems[currentItemIndex].card2} />
                  ) : (
                    <img className="card" src={getCardImagePath(filteredItems[currentItemIndex].card2, 'hearts')} alt={filteredItems[currentItemIndex].card2} />
                  )}
                  <img 
                    className="card" 
                    src={`/images/svg-cards/${filteredItems[currentItemIndex].isSuited ? 'suited' : 'unsuited'}.svg`} 
                    alt={filteredItems[currentItemIndex].suited} 
                  />
                </div>

                <div className="col-xs-12 advice-column">
                  <div className="advice">
                    <p>If pot is <b>un-raised</b>: {colorCodeAction(filteredItems[currentItemIndex].unraisedPot)}</p>
                    <p>If pot is <b>raised</b>: {colorCodeAction(filteredItems[currentItemIndex].raisedPot)}</p>
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
            </>
          ) : (
            // No results in table mode
            query ? (
              <div className="situation-row">
                <div className="col-xs-12 advice-column">
                  <div className="advice">
                    <p>No results found for "<b>{query}</b>"</p>
                    <p>Try a different hand or position</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="situation-row">
                <div className="col-xs-12 advice-column">
                  <div className="advice">
                    <p>Use the keyboard above to select a position and cards</p>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          // Normal mode - show list of items
          (filteredItems.length > 0 ? filteredItems : []).slice(0, 20).map((item, index) => (
            <div key={index} className="row situation-row">
              <div className="col-xs-12 col-sm-4">
                <img className="card" src={`/images/svg-cards/${item.position}.svg`} alt={item.positionDisplay} />
                <img className="card" src={getCardImagePath(item.card1, 'clubs')} alt={item.card1} />
                {item.isSuited ? (
                  <img className="card" src={getCardImagePath(item.card2, 'clubs')} alt={item.card2} />
                ) : (
                  <img className="card" src={getCardImagePath(item.card2, 'hearts')} alt={item.card2} />
                )}
                <img 
                  className="card" 
                  src={`/images/svg-cards/${item.isSuited ? 'suited' : 'unsuited'}.svg`} 
                  alt={item.suited} 
                />
              </div>

              <div className="col-xs-12 col-sm-4 advice-column">
                <div className="advice">
                  <p>If pot is <b>un-raised</b>: {colorCodeAction(item.unraisedPot)}</p>
                  <p>If pot is <b>raised</b>: {colorCodeAction(item.raisedPot)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <StackSizeGuide />
    </div>
  );
}

export default PreflopComponent;
