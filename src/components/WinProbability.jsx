import React from 'react';
import { getWinProbability, firstCardOdds } from '../data/oddsData';

const WinProbability = ({ position, firstCard, secondCard, settings, darkMode }) => {
  // Calculate win probability
  const calculateProbability = () => {
    // If we have both cards, calculate full hand probability
    if (firstCard && secondCard) {
      // Check if it's a pocket pair
      if (firstCard === secondCard) {
        return getWinProbability(`${firstCard}${secondCard}`, position, settings?.tableSize);
      }
      
      // Check if suited (this is a simplification - you'd need to track suit in your app)
      // For now, we'll assume unsuited for demonstration
      return getWinProbability(`${firstCard}${secondCard}`, position, settings?.tableSize);
    }
    
    // If we only have the first card, show average probability with that card
    if (firstCard) {
      return firstCardOdds[firstCard] || 45.0;
    }
    
    return 0;
  };
  
  const probability = calculateProbability();
  
  // Get color based on probability
  const getProbabilityColor = (prob) => {
    if (prob >= 65) return '#4CAF50'; // Green
    if (prob >= 55) return '#8BC34A'; // Light green
    if (prob >= 45) return '#FFC107'; // Yellow
    if (prob >= 35) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };
  
  // Don't show anything if no cards selected
  if (!firstCard) return null;
  
  return (
    <div className={`win-probability ${darkMode ? 'dark' : ''}`}>
      <div className="probability-meter-container">
        <div 
          className="probability-meter" 
          style={{ 
            width: `${probability}%`,
            backgroundColor: getProbabilityColor(probability)
          }}
        />
        <span className="probability-value">{probability.toFixed(1)}%</span>
      </div>
      
      <div className="probability-label">
        {secondCard ? (
          `Win probability with ${firstCard}${secondCard}${firstCard === secondCard ? '' : ''} in ${
            position === 'E' ? 'Early' : 
            position === 'M' ? 'Middle' : 
            position === 'L' ? 'Late' : 
            position === 'S' ? 'Small Blind' : 'Big Blind'
          }`
        ) : (
          `Average win probability with ${firstCard} as first card`
        )}
      </div>
    </div>
  );
};

export default WinProbability;
