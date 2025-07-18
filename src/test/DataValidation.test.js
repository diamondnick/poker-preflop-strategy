import { describe, it, expect } from 'vitest'
import { cardArray } from '../data/cardData'
import { getWinProbability } from '../data/oddsData'

describe('Data Validation', () => {
  describe('cardArray data integrity', () => {
    it('should have valid structure', () => {
      expect(Array.isArray(cardArray)).toBe(true)
      expect(cardArray.length).toBeGreaterThan(0)
    })

    it('should have required properties for each card entry', () => {
      cardArray.forEach((card, index) => {
        expect(card).toHaveProperty('card1', `Card at index ${index} missing card1`)
        expect(card).toHaveProperty('card2', `Card at index ${index} missing card2`)
        expect(card).toHaveProperty('position', `Card at index ${index} missing position`)
        expect(card).toHaveProperty('unraisedPot', `Card at index ${index} missing unraisedPot`)
        expect(card).toHaveProperty('raisedPot', `Card at index ${index} missing raisedPot`)
        expect(card).toHaveProperty('isSuited', `Card at index ${index} missing isSuited`)
      })
    })

    it('should have valid card ranks', () => {
      const validRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
      
      cardArray.forEach((card, index) => {
        expect(validRanks).toContain(card.card1, `Invalid card1 at index ${index}: ${card.card1}`)
        expect(validRanks).toContain(card.card2, `Invalid card2 at index ${index}: ${card.card2}`)
      })
    })

    it('should have valid positions', () => {
      const validPositions = ['E', 'M', 'L', 'B', 'S']
      
      cardArray.forEach((card, index) => {
        expect(validPositions).toContain(card.position, `Invalid position at index ${index}: ${card.position}`)
      })
    })

    it('should have valid actions', () => {
      const validActions = ['F', 'C', 'R', 'RR']
      
      cardArray.forEach((card, index) => {
        expect(validActions).toContain(card.unraisedPot, `Invalid unraisedPot at index ${index}: ${card.unraisedPot}`)
        expect(validActions).toContain(card.raisedPot, `Invalid raisedPot at index ${index}: ${card.raisedPot}`)
      })
    })

    it('should have consistent suited/offsuit logic', () => {
      cardArray.forEach((card, index) => {
        if (card.card1 === card.card2) {
          // Pocket pairs should not be suited
          expect(card.isSuited).toBe(false, `Pocket pair at index ${index} should not be suited`)
        } else {
          // Non-pairs should have explicit suited/offsuit designation
          expect(typeof card.isSuited).toBe('boolean', `Non-pair at index ${index} should have boolean isSuited`)
        }
      })
    })

    it('should not have duplicate entries', () => {
      const seen = new Set()
      
      cardArray.forEach((card, index) => {
        const key = `${card.card1}${card.card2}${card.position}${card.isSuited}`
        expect(seen.has(key)).toBe(false, `Duplicate entry found at index ${index}: ${key}`)
        seen.add(key)
      })
    })
  })

  describe('win probability data', () => {
    it('should return valid probabilities for known hands', () => {
      const testHands = [
        { hand: 'AA', position: 'E', tableSize: 9 },
        { hand: 'AKs', position: 'M', tableSize: 6 },
        { hand: 'AKo', position: 'L', tableSize: 9 },
        { hand: 'KK', position: 'B', tableSize: 6 },
        { hand: '22', position: 'S', tableSize: 9 }
      ]

      testHands.forEach(({ hand, position, tableSize }) => {
        const probability = getWinProbability(hand, position, tableSize)
        expect(typeof probability).toBe('number', `Probability for ${hand} should be a number`)
        expect(probability).toBeGreaterThanOrEqual(0, `Probability for ${hand} should be >= 0`)
        expect(probability).toBeLessThanOrEqual(100, `Probability for ${hand} should be <= 100`)
      })
    })

    it('should handle edge cases gracefully', () => {
      // Test with invalid inputs
      expect(() => getWinProbability('XX', 'E', 9)).not.toThrow()
      expect(() => getWinProbability('AA', 'X', 9)).not.toThrow()
      expect(() => getWinProbability('AA', 'E', 0)).not.toThrow()
      expect(() => getWinProbability(null, 'E', 9)).not.toThrow()
      expect(() => getWinProbability('AA', null, 9)).not.toThrow()
    })
  })

  describe('data consistency checks', () => {
    it('should have consistent hand representations', () => {
      // Check that all hands in cardArray have corresponding probability data
      const uniqueHands = new Set()
      
      cardArray.forEach(card => {
        let handStr
        if (card.card1 === card.card2) {
          handStr = `${card.card1}${card.card2}`
        } else if (card.isSuited) {
          handStr = `${card.card1}${card.card2}s`
        } else {
          handStr = `${card.card1}${card.card2}o`
        }
        uniqueHands.add(handStr)
      })

      // Test that we can get probabilities for all unique hands
      uniqueHands.forEach(hand => {
        expect(() => getWinProbability(hand, 'E', 9)).not.toThrow()
      })
    })

    it('should have reasonable action distributions', () => {
      const actionCounts = { F: 0, C: 0, R: 0, RR: 0 }
      
      cardArray.forEach(card => {
        actionCounts[card.unraisedPot]++
        actionCounts[card.raisedPot]++
      })

      // Should have some of each action type
      expect(actionCounts.F).toBeGreaterThan(0, 'Should have some fold actions')
      expect(actionCounts.C).toBeGreaterThan(0, 'Should have some call actions')
      expect(actionCounts.R).toBeGreaterThan(0, 'Should have some raise actions')
      
      // Fold should be the most common action in raised pots
      const raisedPotFolds = cardArray.filter(card => card.raisedPot === 'F').length
      const totalRaisedPotActions = cardArray.length
      
      expect(raisedPotFolds / totalRaisedPotActions).toBeGreaterThan(0.3, 'Should fold at least 30% of hands in raised pots')
    })
  })

  describe('performance considerations', () => {
    it('should have reasonable data size', () => {
      // Check that cardArray isn't excessively large
      expect(cardArray.length).toBeLessThan(10000, 'cardArray should not be excessively large')
      
      // Check that each entry doesn't have excessive properties
      cardArray.forEach((card, index) => {
        const keys = Object.keys(card)
        expect(keys.length).toBeLessThan(20, `Card at index ${index} has too many properties`)
      })
    })

    it('should have efficient data access patterns', () => {
      // Test that we can quickly find specific combinations
      const startTime = performance.now()
      
      // Simulate finding 100 random combinations
      for (let i = 0; i < 100; i++) {
        const randomCard = cardArray[Math.floor(Math.random() * cardArray.length)]
        // Simulate lookup operation
        const found = cardArray.find(card => 
          card.card1 === randomCard.card1 && 
          card.card2 === randomCard.card2 && 
          card.position === randomCard.position &&
          card.isSuited === randomCard.isSuited
        )
        expect(found).toBeDefined()
      }
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(100, 'Data access should be reasonably fast')
    })
  })
})
