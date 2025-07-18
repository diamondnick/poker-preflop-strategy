import { describe, it, expect } from 'vitest'
import { Situation } from '../models/Situation'

describe('Situation', () => {
  describe('constructor', () => {
    it('should create a situation with all required properties', () => {
      const situation = new Situation('A', 'K', 'E', 'R', 'F', true)
      
      expect(situation.card1).toBe('A')
      expect(situation.card2).toBe('K')
      expect(situation.position).toBe('E')
      expect(situation.unraisedPot).toBe('R')
      expect(situation.raisedPot).toBe('F')
      expect(situation.isSuited).toBe(true)
    })

    it('should handle pocket pairs correctly', () => {
      const situation = new Situation('A', 'A', 'E', 'R', 'C', false)
      
      expect(situation.card1).toBe('A')
      expect(situation.card2).toBe('A')
      expect(situation.isSuited).toBe(false)
    })

    it('should handle offsuit hands correctly', () => {
      const situation = new Situation('A', 'K', 'M', 'C', 'F', false)
      
      expect(situation.card1).toBe('A')
      expect(situation.card2).toBe('K')
      expect(situation.isSuited).toBe(false)
    })
  })

  describe('getPositionDisplay', () => {
    it('should return correct display names for positions', () => {
      const positions = [
        { code: 'E', display: 'Early' },
        { code: 'M', display: 'Middle' },
        { code: 'L', display: 'Late' },
        { code: 'B', display: 'Button' },
        { code: 'S', display: 'Small Blind' }
      ]

      positions.forEach(({ code, display }) => {
        const situation = new Situation('A', 'K', code, 'R', 'F', true)
        expect(situation.getPositionDisplay()).toBe(display)
      })
    })

    it('should return the position code for unknown positions', () => {
      const situation = new Situation('A', 'K', 'X', 'R', 'F', true)
      expect(situation.getPositionDisplay()).toBe('X')
    })
  })

  describe('getHandDisplay', () => {
    it('should display pocket pairs correctly', () => {
      const situation = new Situation('A', 'A', 'E', 'R', 'F', false)
      expect(situation.getHandDisplay()).toBe('AA')
    })

    it('should display suited hands correctly', () => {
      const situation = new Situation('A', 'K', 'E', 'R', 'F', true)
      expect(situation.getHandDisplay()).toBe('AKs')
    })

    it('should display offsuit hands correctly', () => {
      const situation = new Situation('A', 'K', 'E', 'R', 'F', false)
      expect(situation.getHandDisplay()).toBe('AKo')
    })

    it('should handle different card combinations', () => {
      const testCases = [
        { card1: 'K', card2: 'Q', suited: true, expected: 'KQs' },
        { card1: 'Q', card2: 'J', suited: false, expected: 'QJo' },
        { card1: 'T', card2: 'T', suited: false, expected: 'TT' },
        { card1: '7', card2: '6', suited: true, expected: '76s' }
      ]

      testCases.forEach(({ card1, card2, suited, expected }) => {
        const situation = new Situation(card1, card2, 'E', 'R', 'F', suited)
        expect(situation.getHandDisplay()).toBe(expected)
      })
    })
  })

  describe('isValidAction', () => {
    it('should validate correct action codes', () => {
      const validActions = ['F', 'C', 'R', 'RR']
      
      validActions.forEach(action => {
        const situation = new Situation('A', 'K', 'E', action, action, true)
        expect(situation.isValidAction(action)).toBe(true)
      })
    })

    it('should reject invalid action codes', () => {
      const invalidActions = ['X', 'INVALID', '', null, undefined]
      
      invalidActions.forEach(action => {
        const situation = new Situation('A', 'K', 'E', 'R', 'F', true)
        expect(situation.isValidAction(action)).toBe(false)
      })
    })
  })

  describe('toString', () => {
    it('should return a string representation of the situation', () => {
      const situation = new Situation('A', 'K', 'E', 'R', 'F', true)
      const str = situation.toString()
      
      expect(typeof str).toBe('string')
      expect(str).toContain('A')
      expect(str).toContain('K')
      expect(str).toContain('E')
      expect(str).toContain('suited')
    })

    it('should differentiate between suited and offsuit in string representation', () => {
      const suitedSituation = new Situation('A', 'K', 'E', 'R', 'F', true)
      const offsuitSituation = new Situation('A', 'K', 'E', 'R', 'F', false)
      
      const suitedStr = suitedSituation.toString()
      const offsuitStr = offsuitSituation.toString()
      
      expect(suitedStr).toContain('suited')
      expect(offsuitStr).toContain('offsuit')
    })
  })

  describe('edge cases', () => {
    it('should handle all valid card ranks', () => {
      const validRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
      
      validRanks.forEach(rank => {
        expect(() => new Situation(rank, rank, 'E', 'R', 'F', false)).not.toThrow()
      })
    })

    it('should handle all valid positions', () => {
      const validPositions = ['E', 'M', 'L', 'B', 'S']
      
      validPositions.forEach(position => {
        expect(() => new Situation('A', 'K', position, 'R', 'F', true)).not.toThrow()
      })
    })

    it('should handle all valid actions', () => {
      const validActions = ['F', 'C', 'R', 'RR']
      
      validActions.forEach(action => {
        expect(() => new Situation('A', 'K', 'E', action, action, true)).not.toThrow()
      })
    })
  })
})
