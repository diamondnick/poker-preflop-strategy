import React, { useState, useEffect } from 'react';
import { SituationService } from '../models/SituationService';
import StackSizeGuide from './StackSizeGuide';

const cardService = new SituationService();

function PreflopComponent() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

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
    } else {
      setFilteredItems([]);
    }
  }, [query]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Function to get the correct image path
  const getCardImagePath = (card, suit) => {
    return `/images/svg-cards/${card}_of_${suit}.svg`;
  };

  return (
    <div className="page">
      <div className="head">
        <div className="container-fluid">
          <div id="top" className="row">
            <h1>Pre<span className="hi">flop</span></h1>
            <div className="sub-head">poker strategy</div>
          </div>
        </div>
      </div>
      
      <div className="search-container">
        <input 
          id="hand" 
          placeholder="usage: 'et9'" 
          value={query}
          onChange={handleQueryChange}
          maxLength="3" 
          type="text" 
          style={{ marginBottom: '10px' }} 
        />
      </div>

      <div className="situations-container">
        {(filteredItems.length > 0 ? filteredItems : []).slice(0, 20).map((item, index) => (
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
                <p>{item.unraisedPot} if pot is <b>un-raised</b></p>
                <p>{item.raisedPot} if pot is <b>raised</b></p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <StackSizeGuide />
    </div>
  );
}

export default PreflopComponent;
