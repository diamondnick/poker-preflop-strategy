// Pre-calculated win probabilities against random hands
export const handOdds = {
  // Pocket pairs
  'AA': 85.2,
  'KK': 82.4,
  'QQ': 79.9,
  'JJ': 77.5,
  'TT': 75.1,
  '99': 72.1,
  '88': 69.1,
  '77': 66.2,
  '66': 63.3,
  '55': 60.3,
  '44': 57.0,
  '33': 53.7,
  '22': 50.3,
  
  // Suited hands
  'AKs': 67.0,
  'AQs': 66.1,
  'AJs': 65.4,
  'ATs': 64.7,
  'KQs': 63.4,
  'KJs': 62.6,
  'KTs': 61.9,
  'QJs': 60.3,
  'QTs': 59.5,
  'JTs': 58.5,
  'T9s': 57.3,
  '98s': 56.0,
  '87s': 54.8,
  '76s': 53.5,
  '65s': 52.2,
  '54s': 50.9,
  
  // Unsuited hands
  'AK': 65.4,
  'AQ': 64.5,
  'AJ': 63.6,
  'AT': 62.9,
  'KQ': 61.4,
  'KJ': 60.6,
  'KT': 59.9,
  'QJ': 58.2,
  'QT': 57.4,
  'JT': 56.4,
  'T9': 55.1,
  '98': 53.8,
  '87': 52.5,
  '76': 51.2,
  '65': 49.9,
  '54': 48.5,
  
  // Default for other hands
  'default': 45.0
};

// Position adjustments
export const positionAdjustments = {
  'E': -5.0,  // Early position
  'M': -2.0,  // Middle position
  'L': 3.0,   // Late position
  'S': -3.0,  // Small blind
  'B': -1.0   // Big blind
};

// Table size adjustments
export const tableSizeAdjustments = {
  2: 8.0,     // Heads up
  6: 1.0,     // 6-max
  9: -2.0,    // Full ring
  10: -3.0    // 10 players
};

// Get win probability for a hand in a specific position
export const getWinProbability = (hand, position, tableSize = 9) => {
  // Normalize hand format
  const normalizedHand = normalizeHand(hand);
  
  // Get base probability for the hand
  const baseProb = handOdds[normalizedHand] || handOdds.default;
  
  // Apply position adjustment
  const posAdj = positionAdjustments[position] || 0;
  
  // Apply table size adjustment
  const tableSizeAdj = tableSizeAdjustments[tableSize] || 0;
  
  // Calculate final probability (capped between 0 and 100)
  let finalProb = baseProb + posAdj + tableSizeAdj;
  
  return Math.min(Math.max(finalProb, 0), 100);
};

// Helper function to normalize hand format
const normalizeHand = (hand) => {
  // Remove any whitespace
  hand = hand.trim();
  
  // Handle pocket pairs
  if (hand.length >= 2 && hand[0] === hand[1]) {
    return hand.substring(0, 2);
  }
  
  // Handle suited hands
  if (hand.length >= 3 && hand[2].toLowerCase() === 's') {
    return hand.substring(0, 2) + 's';
  }
  
  // Handle unsuited hands
  return hand.substring(0, 2);
};

// First card win probabilities (average win rate when paired with any second card)
export const firstCardOdds = {
  'A': 59.0,
  'K': 57.0,
  'Q': 55.0,
  'J': 53.0,
  'T': 51.0,
  '9': 49.0,
  '8': 47.0,
  '7': 45.0,
  '6': 43.0,
  '5': 42.0,
  '4': 41.0,
  '3': 40.0,
  '2': 39.0
};
