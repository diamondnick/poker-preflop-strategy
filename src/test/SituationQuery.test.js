import { describe, it, expect } from 'vitest'
import { SituationQuery } from '../models/Situation'

describe('SituationQuery', () => {
  describe('constructor and parsing', () => {
    it('should parse position and cards correctly for pocket pairs', () => {
      const query = new SituationQuery('EAA')
      expect(query.position).toBe('E')
      expect(query.card1).toBe('A')
      expect(query.card2).toBe('A')
      expect(query.isSuited).toBe(false)
    })

    it('should parse position and cards correctly for suited hands', () => {
      const query = new SituationQuery('EAKs')
      expect(query.position).toBe('E')
      expect(query.card1).toBe('A')
      expect(query.card2).toBe('K')
      expect(query.isSuited).toBe(true)
    })

    it('should parse position and cards correctly for offsuit hands', () => {
      const query = new SituationQuery('MAKo')
      expect(query.position).toBe('M')
      expect(query.card1).toBe('A')
      expect(query.card2).toBe('K')
      expect(query.isSuited).toBe(false)
    })

    it('should handle queries without position', () => {
      const query = new SituationQuery('AKs')
      expect(query.position).toBe('')
      expect(query.card1).toBe('A')
      expect(query.card2).toBe('K')
      expect(query.isSuited).toBe(true)
    })

    it('should handle lowercase input', () => {
      const query = new SituationQuery('eaks')
      expect(query.position).toBe('E')
      expect(query.card1).toBe('A')
      expect(query.card2).toBe('K')
      expect(query.isSuited).toBe(true)
    })
  })

  describe('validation', () => {
    it('should validate correct pocket pair queries', () => {
      const query = new SituationQuery('EAA')
      expect(query.isValid).toBe(true)
      expect(query.errors).toHaveLength(0)
    })

    it('should validate correct suited hand queries', () => {
      const query = new SituationQuery('EAKs')
      expect(query.isValid).toBe(true)
      expect(query.errors).toHaveLength(0)
    })

    it('should validate correct offsuit hand queries', () => {
      const query = new SituationQuery('MAKo')
      expect(query.isValid).toBe(true)
      expect(query.errors).toHaveLength(0)
    })

    it('should reject invalid card ranks', () => {
      const query = new SituationQuery('EAX')
      expect(query.isValid).toBe(false)
      expect(query.errors).toContain('Invalid card rank: X')
    })

    it('should reject invalid positions', () => {
      const query = new SituationQuery('XAK')
      expect(query.isValid).toBe(false)
      expect(query.errors).toContain('Invalid position: X')
    })

    it('should reject invalid suited/offsuit indicators', () => {
      const query = new SituationQuery('EAKx')
      expect(query.isValid).toBe(false)
      expect(query.errors).toContain('Invalid suited/offsuit indicator: x')
    })

    it('should reject pocket pairs with suited/offsuit indicators', () => {
      const query = new SituationQuery('EAAs')
      expect(query.isValid).toBe(false)
      expect(query.errors).toContain('Pocket pairs cannot have suited/offsuit indicators')
    })

    it('should reject non-pairs without suited/offsuit indicators', () => {
      const query = new SituationQuery('EAK')
      expect(query.isValid).toBe(false)
      expect(query.errors).toContain('Non-pair hands must specify suited (s) or offsuit (o)')
    })

    it('should reject empty queries', () => {
      const query = new SituationQuery('')
      expect(query.isValid).toBe(false)
      expect(query.errors.length).toBeGreaterThan(0)
    })

    it('should reject queries that are too short', () => {
      const query = new SituationQuery('EA')
      expect(query.isValid).toBe(false)
      expect(query.errors.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle all valid card ranks', () => {
      const validRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
      
      validRanks.forEach(rank => {
        const query = new SituationQuery(`E${rank}${rank}`)
        expect(query.isValid).toBe(true)
      })
    })

    it('should handle all valid positions', () => {
      const validPositions = ['E', 'M', 'L', 'B', 'S']
      
      validPositions.forEach(position => {
        const query = new SituationQuery(`${position}AKs`)
        expect(query.isValid).toBe(true)
      })
    })

    it('should handle mixed case input consistently', () => {
      const queries = [
        new SituationQuery('eaks'),
        new SituationQuery('EAKs'),
        new SituationQuery('EaKs'),
        new SituationQuery('eaKS')
      ]
      
      queries.forEach(query => {
        expect(query.position).toBe('E')
        expect(query.card1).toBe('A')
        expect(query.card2).toBe('K')
        expect(query.isSuited).toBe(true)
        expect(query.isValid).toBe(true)
      })
    })
  })
})
