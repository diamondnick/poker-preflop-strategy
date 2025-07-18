import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SituationService } from '../models/SituationService'
import { Situation } from '../models/Situation'

describe('SituationService', () => {
  let service

  beforeEach(() => {
    service = new SituationService()
  })

  describe('getAllSituations', () => {
    it('should return an array of situations', () => {
      const situations = service.getAllSituations()
      expect(Array.isArray(situations)).toBe(true)
      expect(situations.length).toBeGreaterThan(0)
    })

    it('should return situations with required properties', () => {
      const situations = service.getAllSituations()
      const firstSituation = situations[0]
      
      expect(firstSituation).toHaveProperty('card1')
      expect(firstSituation).toHaveProperty('card2')
      expect(firstSituation).toHaveProperty('position')
      expect(firstSituation).toHaveProperty('unraisedPot')
      expect(firstSituation).toHaveProperty('raisedPot')
      expect(firstSituation).toHaveProperty('isSuited')
    })
  })

  describe('getSituationByQuery', () => {
    it('should return empty array for invalid queries', () => {
      const result = service.getSituationByQuery('INVALID', 10, { tableSize: 9 })
      expect(result).toEqual([])
    })

    it('should return situations for valid pocket pair queries', () => {
      const result = service.getSituationByQuery('EAA', 10, { tableSize: 9 })
      expect(Array.isArray(result)).toBe(true)
      
      if (result.length > 0) {
        expect(result[0].card1).toBe('A')
        expect(result[0].card2).toBe('A')
        expect(result[0].position).toBe('E')
      }
    })

    it('should return situations for valid suited hand queries', () => {
      const result = service.getSituationByQuery('EAKs', 10, { tableSize: 9 })
      expect(Array.isArray(result)).toBe(true)
      
      if (result.length > 0) {
        expect(result[0].card1).toBe('A')
        expect(result[0].card2).toBe('K')
        expect(result[0].position).toBe('E')
        expect(result[0].isSuited).toBe(true)
      }
    })

    it('should return situations for valid offsuit hand queries', () => {
      const result = service.getSituationByQuery('EAKo', 10, { tableSize: 9 })
      expect(Array.isArray(result)).toBe(true)
      
      if (result.length > 0) {
        expect(result[0].card1).toBe('A')
        expect(result[0].card2).toBe('K')
        expect(result[0].position).toBe('E')
        expect(result[0].isSuited).toBe(false)
      }
    })

    it('should respect the limit parameter', () => {
      const result = service.getSituationByQuery('EAA', 3, { tableSize: 9 })
      expect(result.length).toBeLessThanOrEqual(3)
    })

    it('should log warnings for invalid queries', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      service.getSituationByQuery('INVALID', 10, { tableSize: 9 })
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('advice adjustment methods', () => {
    let testSituation

    beforeEach(() => {
      testSituation = new Situation('A', 'A', 'E', 'F', 'F', false)
    })

    describe('loosenAdvice', () => {
      it('should upgrade fold to call in unraised pot when significant', () => {
        const result = service.loosenAdvice(testSituation, true)
        expect(result.unraisedPot).toBe('C')
      })

      it('should upgrade fold to call in raised pot when significant', () => {
        const result = service.loosenAdvice(testSituation, true)
        expect(result.raisedPot).toBe('C')
      })

      it('should use deterministic logic for non-significant adjustments', () => {
        // Test multiple times to ensure deterministic behavior
        const results = []
        for (let i = 0; i < 5; i++) {
          const situation = new Situation('A', 'A', 'E', 'F', 'F', false)
          const result = service.loosenAdvice(situation, false)
          results.push(result.unraisedPot)
        }
        
        // All results should be the same (deterministic)
        const firstResult = results[0]
        expect(results.every(result => result === firstResult)).toBe(true)
      })

      it('should not modify original situation object', () => {
        const originalUnraised = testSituation.unraisedPot
        const originalRaised = testSituation.raisedPot
        
        service.loosenAdvice(testSituation, true)
        
        expect(testSituation.unraisedPot).toBe(originalUnraised)
        expect(testSituation.raisedPot).toBe(originalRaised)
      })
    })

    describe('tightenAdvice', () => {
      beforeEach(() => {
        testSituation = new Situation('A', 'A', 'E', 'C', 'C', false)
      })

      it('should downgrade call to fold when significant', () => {
        const result = service.tightenAdvice(testSituation, true)
        expect(result.unraisedPot).toBe('F')
        expect(result.raisedPot).toBe('F')
      })

      it('should use deterministic logic for non-significant adjustments', () => {
        // Test multiple times to ensure deterministic behavior
        const results = []
        for (let i = 0; i < 5; i++) {
          const situation = new Situation('A', 'A', 'E', 'C', 'C', false)
          const result = service.tightenAdvice(situation, false)
          results.push(result.unraisedPot)
        }
        
        // All results should be the same (deterministic)
        const firstResult = results[0]
        expect(results.every(result => result === firstResult)).toBe(true)
      })

      it('should not modify original situation object', () => {
        const originalUnraised = testSituation.unraisedPot
        const originalRaised = testSituation.raisedPot
        
        service.tightenAdvice(testSituation, true)
        
        expect(testSituation.unraisedPot).toBe(originalUnraised)
        expect(testSituation.raisedPot).toBe(originalRaised)
      })
    })

    describe('adjustForShortStack', () => {
      it('should use deterministic logic based on card ranks', () => {
        // Test multiple times to ensure deterministic behavior
        const results = []
        for (let i = 0; i < 5; i++) {
          const situation = new Situation('A', 'K', 'E', 'C', 'F', true)
          const result = service.adjustForShortStack(situation)
          results.push(result.raisedPot)
        }
        
        // All results should be the same (deterministic)
        const firstResult = results[0]
        expect(results.every(result => result === firstResult)).toBe(true)
      })

      it('should not modify original situation object', () => {
        const originalUnraised = testSituation.unraisedPot
        const originalRaised = testSituation.raisedPot
        
        service.adjustForShortStack(testSituation)
        
        expect(testSituation.unraisedPot).toBe(originalUnraised)
        expect(testSituation.raisedPot).toBe(originalRaised)
      })
    })
  })

  describe('copySituation', () => {
    it('should create a deep copy of situation', () => {
      const original = new Situation('A', 'K', 'E', 'R', 'F', true)
      const copy = service.copySituation(original)
      
      expect(copy).not.toBe(original)
      expect(copy.card1).toBe(original.card1)
      expect(copy.card2).toBe(original.card2)
      expect(copy.position).toBe(original.position)
      expect(copy.unraisedPot).toBe(original.unraisedPot)
      expect(copy.raisedPot).toBe(original.raisedPot)
      expect(copy.isSuited).toBe(original.isSuited)
    })

    it('should allow modification of copy without affecting original', () => {
      const original = new Situation('A', 'K', 'E', 'R', 'F', true)
      const copy = service.copySituation(original)
      
      copy.unraisedPot = 'C'
      copy.raisedPot = 'C'
      
      expect(original.unraisedPot).toBe('R')
      expect(original.raisedPot).toBe('F')
      expect(copy.unraisedPot).toBe('C')
      expect(copy.raisedPot).toBe('C')
    })
  })

  describe('error handling', () => {
    it('should handle null or undefined queries gracefully', () => {
      expect(() => service.getSituationByQuery(null, 10, { tableSize: 9 })).not.toThrow()
      expect(() => service.getSituationByQuery(undefined, 10, { tableSize: 9 })).not.toThrow()
      
      expect(service.getSituationByQuery(null, 10, { tableSize: 9 })).toEqual([])
      expect(service.getSituationByQuery(undefined, 10, { tableSize: 9 })).toEqual([])
    })

    it('should handle invalid settings gracefully', () => {
      expect(() => service.getSituationByQuery('EAA', 10, null)).not.toThrow()
      expect(() => service.getSituationByQuery('EAA', 10, {})).not.toThrow()
    })
  })
})
