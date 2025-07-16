import { Situation, SituationQuery } from './Situation';
import { cardArray } from '../data/cardData';

export class SituationService {
  getSituationByQuery(query, limit, settings = { tableSize: 9, stackSize: 'medium' }) {
    // Validate query first
    const sq = new SituationQuery(query);
    if (!sq.isValid) {
      console.warn(`Invalid query: ${sq.errorMessage}`);
      return [];
    }
    return this.filterSituations(this.getAllSituations(), query, limit, settings);
  }

  filterSituations(situations, query, limit, settings = { tableSize: 9, stackSize: 'medium' }) {
    let out = [];
    if (query) {
      const sq = new SituationQuery(query);
      
      // Only proceed if query is valid
      if (sq.isValid) {
        situations.forEach(sit => {
          if (sit.isMatch(sq)) {
            // Create a copy of the situation to avoid modifying the original
            const adjustedSit = this.copySituation(sit);
            
            // Adjust the situation based on table size
            this.adjustSituationForTableSize(adjustedSit, settings.tableSize);
            
            // Adjust the situation based on stack size
            if (settings.stackSize) {
              this.adjustSituationForStackSize(adjustedSit, settings.stackSize);
            }
            
            out.push(adjustedSit);
          }
        });
      } else {
        console.warn(`Invalid query in filterSituations: ${sq.errorMessage}`);
      }
    }

    if (limit && out.length > limit) {
      out = out.slice(0, limit);
    }

    return out;
  }
  
  // Adjust advice based on table size
  adjustSituationForTableSize(situation, tableSize) {
    // Default advice is calibrated for 9 players (full ring)
    // For smaller tables, we can loosen up early position play
    // For larger tables, we should tighten up
    
    const position = situation.position;
    
    // Early position adjustments
    if (position === 'E') {
      if (tableSize <= 6) {
        // 6-max or smaller: loosen up early position
        this.loosenAdvice(situation);
      } else if (tableSize >= 10) {
        // 10+ players: tighten up early position
        this.tightenAdvice(situation);
      }
    }
    
    // Middle position adjustments
    else if (position === 'M') {
      if (tableSize <= 4) {
        // Very small table: significantly loosen middle position
        this.loosenAdvice(situation, true);
      } else if (tableSize <= 6) {
        // 6-max: slightly loosen middle position
        this.loosenAdvice(situation);
      } else if (tableSize >= 10) {
        // 10+ players: slightly tighten middle position
        this.tightenAdvice(situation);
      }
    }
    
    // No adjustments for late position or blinds
  }
  
  // Adjust advice based on stack size
  adjustSituationForStackSize(situation, stackSize) {
    if (stackSize === 'short') {
      // Short stack: favor all-in plays with medium strength hands
      this.adjustForShortStack(situation);
    } else if (stackSize === 'deep') {
      // Deep stack: favor more speculative hands, tighten up marginal hands
      this.adjustForDeepStack(situation);
    }
    // Medium stack is the default, no adjustments needed
  }
  
  // Helper methods for adjusting advice
  loosenAdvice(situation, significant = false) {
    // Upgrade marginal hands to playable, and some fold hands to marginal
    if (situation.unraisedPot === 'F' && significant) {
      situation.unraisedPot = 'C';
    } else if (situation.unraisedPot === 'F') {
      // Deterministic upgrade based on card values
      const cardRanks = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
      const rank1 = cardRanks[situation.card1] || 0;
      const rank2 = cardRanks[situation.card2] || 0;
      const sum = rank1 + rank2;
      
      // Upgrade if sum of card ranks is above threshold or cards are suited
      if (sum > 20 || (situation.isSuited && sum > 16)) {
        situation.unraisedPot = 'C';
      }
    }
    
    // Also loosen raised pot advice slightly
    if (situation.raisedPot === 'F' && significant) {
      situation.raisedPot = 'C';
    }
  }
  
  tightenAdvice(situation, significant = false) {
    // Downgrade some call hands to fold
    if (situation.unraisedPot === 'C') {
      const cardRanks = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
      const rank1 = cardRanks[situation.card1] || 0;
      const rank2 = cardRanks[situation.card2] || 0;
      const sum = rank1 + rank2;
      
      // Downgrade if sum of card ranks is below threshold and not suited
      if (significant || (sum < 18 && !situation.isSuited)) {
        situation.unraisedPot = 'F';
      }
    }
    
    // Also tighten raised pot advice
    if (situation.raisedPot === 'C') {
      const cardRanks = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
      const rank1 = cardRanks[situation.card1] || 0;
      const rank2 = cardRanks[situation.card2] || 0;
      const sum = rank1 + rank2;
      
      if (significant || (sum < 22 && !situation.isSuited)) {
        situation.raisedPot = 'F';
      }
    }
  }
  
  adjustForShortStack(situation) {
    // With short stacks, we want to be more willing to get all-in with decent hands
    const cardRanks = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
    const rank1 = cardRanks[situation.card1] || 0;
    const rank2 = cardRanks[situation.card2] || 0;
    const sum = rank1 + rank2;
    const isPair = situation.card1 === situation.card2;
    
    // Upgrade some call hands to raises - more aggressive with strong hands
    if (situation.unraisedPot === 'C' && (sum > 20 || isPair || (situation.isSuited && sum > 18))) {
      situation.unraisedPot = 'R';
    }
    
    // But we want to be less willing to call raises with marginal hands
    if (situation.raisedPot === 'C' && sum < 24 && !isPair && !(situation.isSuited && sum > 22)) {
      situation.raisedPot = 'F';
    }
  }
  
  adjustForDeepStack(situation) {
    // With deep stacks, we want to play more speculative hands
    // Suited connectors and small pairs become more valuable
    const { card1, card2, isSuited } = situation;
    
    // Check if we have a small pair
    const isSmallPair = card1 === card2 && ['2', '3', '4', '5', '6'].includes(card1);
    
    // Check if we have suited connectors or one-gappers
    const isConnectorOrOneGapper = isSuited && this.isConnectorOrOneGapper(card1, card2);
    
    if ((isSmallPair || isConnectorOrOneGapper) && situation.unraisedPot === 'F') {
      situation.unraisedPot = 'C';
    }
  }
  
  isConnectorOrOneGapper(card1, card2) {
    const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const rank1 = cardRanks.indexOf(card1);
    const rank2 = cardRanks.indexOf(card2);
    
    // Check if the cards are connectors or one-gappers
    return Math.abs(rank1 - rank2) <= 2;
  }

  getSituationByPosition(posName, data, startIndex) {
    return data.map(ob => {
      return new Situation(ob[0], ob[startIndex], ob[startIndex + 1], posName);
    });
  }

  // Helper method to create a copy of a situation
  copySituation(situation) {
    const copy = new Situation(
      situation.face,
      situation.unraisedPot,
      situation.raisedPot,
      situation.position
    );
    return copy;
  }
  
  getAllSituations(cardArrayData) {
    if (!cardArrayData) {
      cardArrayData = cardArray;
    }

    try {
      let situations = [];
      situations = this.getSituationByPosition('E', cardArrayData, 3);
      situations = situations.concat(this.getSituationByPosition('M', cardArrayData, 1));
      situations = situations.concat(this.getSituationByPosition('L', cardArrayData, 5));
      situations = situations.concat(this.getSituationByPosition('S', cardArrayData, 7));
      situations = situations.concat(this.getSituationByPosition('B', cardArrayData, 9));
      return situations;
    } catch (e) {
      console.error('Error loading poker situations:', e);
      return [];
    }
  }
}
