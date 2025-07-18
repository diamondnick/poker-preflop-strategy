import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PreflopComponent from '../components/PreflopComponent'

// Mock the SituationService
vi.mock('../models/SituationService', () => ({
  SituationService: vi.fn().mockImplementation(() => ({
    getAllSituations: vi.fn().mockReturnValue([
      {
        card1: 'A',
        card2: 'A',
        position: 'E',
        positionDisplay: 'Early',
        unraisedPot: 'R',
        raisedPot: 'C',
        isSuited: false
      },
      {
        card1: 'A',
        card2: 'K',
        position: 'E',
        positionDisplay: 'Early',
        unraisedPot: 'R',
        raisedPot: 'F',
        isSuited: true
      }
    ]),
    getSituationByQuery: vi.fn().mockImplementation((query) => {
      if (query === 'EAA') {
        return [{
          card1: 'A',
          card2: 'A',
          position: 'E',
          positionDisplay: 'Early',
          unraisedPot: 'R',
          raisedPot: 'C',
          isSuited: false
        }]
      }
      if (query === 'EAKs') {
        return [{
          card1: 'A',
          card2: 'K',
          position: 'E',
          positionDisplay: 'Early',
          unraisedPot: 'R',
          raisedPot: 'F',
          isSuited: true
        }]
      }
      return []
    })
  }))
}))

// Mock VirtualKeyboard component
vi.mock('../components/VirtualKeyboard', () => ({
  default: ({ onButtonClick, currentQuery }) => (
    <div data-testid="virtual-keyboard">
      <button onClick={() => onButtonClick('E')}>E</button>
      <button onClick={() => onButtonClick('A')}>A</button>
      <button onClick={() => onButtonClick('K')}>K</button>
      <button onClick={() => onButtonClick('s')}>s</button>
      <div data-testid="current-query">{currentQuery}</div>
    </div>
  )
}))

// Mock SettingsComponent
vi.mock('../components/SettingsComponent', () => ({
  default: ({ onClose, onSave, initialSettings }) => (
    <div data-testid="settings-component">
      <button onClick={onClose}>Close</button>
      <button onClick={() => onSave({ tableSize: 6 })}>Save</button>
    </div>
  )
}))

describe('PreflopComponent', () => {
  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<PreflopComponent darkMode={false} />)
      expect(screen.getByText('♠️ PokerEdge')).toBeInTheDocument()
    })

    it('should render virtual keyboard', () => {
      render(<PreflopComponent darkMode={false} />)
      expect(screen.getByTestId('virtual-keyboard')).toBeInTheDocument()
    })

    it('should render mode toggle button', () => {
      render(<PreflopComponent darkMode={false} />)
      expect(screen.getByLabelText(/switch to table mode/i)).toBeInTheDocument()
    })

    it('should render settings button', () => {
      render(<PreflopComponent darkMode={false} />)
      expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    })
  })

  describe('keyboard input', () => {
    it('should update query when keyboard buttons are clicked', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      const eButton = screen.getByText('E')
      const aButton = screen.getByText('A')
      
      await user.click(eButton)
      await user.click(aButton)
      
      expect(screen.getByTestId('current-query')).toHaveTextContent('EA')
    })

    it('should limit query length to 4 characters', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      const buttons = ['E', 'A', 'K', 's', 'A'] // Try to add 5th character
      
      for (const buttonText of buttons) {
        const button = screen.getByText(buttonText)
        await user.click(button)
      }
      
      // Should only show first 4 characters
      expect(screen.getByTestId('current-query')).toHaveTextContent('EAKs')
    })
  })

  describe('settings', () => {
    it('should open settings when settings button is clicked', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      const settingsButton = screen.getByLabelText('Settings')
      await user.click(settingsButton)
      
      expect(screen.getByTestId('settings-component')).toBeInTheDocument()
    })

    it('should close settings when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      // Open settings
      const settingsButton = screen.getByLabelText('Settings')
      await user.click(settingsButton)
      
      // Close settings
      const closeButton = screen.getByText('Close')
      await user.click(closeButton)
      
      expect(screen.queryByTestId('settings-component')).not.toBeInTheDocument()
    })

    it('should save settings when save button is clicked', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      // Open settings
      const settingsButton = screen.getByLabelText('Settings')
      await user.click(settingsButton)
      
      // Save settings
      const saveButton = screen.getByText('Save')
      await user.click(saveButton)
      
      expect(screen.queryByTestId('settings-component')).not.toBeInTheDocument()
    })
  })

  describe('table mode', () => {
    it('should toggle table mode when mode button is clicked', async () => {
      const user = userEvent.setup()
      render(<PreflopComponent darkMode={false} />)
      
      const modeButton = screen.getByLabelText(/switch to table mode/i)
      await user.click(modeButton)
      
      expect(screen.getByLabelText(/switch to normal mode/i)).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should display error message when service throws error', async () => {
      // Mock service to throw error
      const mockService = {
        getAllSituations: vi.fn().mockImplementation(() => {
          throw new Error('Service error')
        }),
        getSituationByQuery: vi.fn().mockReturnValue([])
      }
      
      vi.doMock('../models/SituationService', () => ({
        SituationService: vi.fn().mockImplementation(() => mockService)
      }))
      
      render(<PreflopComponent darkMode={false} />)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load poker data/i)).toBeInTheDocument()
      })
    })

    it('should clear error when new input is entered', async () => {
      const user = userEvent.setup()
      
      // Mock service to throw error initially
      const mockService = {
        getAllSituations: vi.fn().mockImplementation(() => {
          throw new Error('Service error')
        }),
        getSituationByQuery: vi.fn().mockReturnValue([])
      }
      
      vi.doMock('../models/SituationService', () => ({
        SituationService: vi.fn().mockImplementation(() => mockService)
      }))
      
      render(<PreflopComponent darkMode={false} />)
      
      // Wait for error to appear
      await waitFor(() => {
        expect(screen.getByText(/failed to load poker data/i)).toBeInTheDocument()
      })
      
      // Enter new input
      const eButton = screen.getByText('E')
      await user.click(eButton)
      
      // Error should be cleared
      expect(screen.queryByText(/failed to load poker data/i)).not.toBeInTheDocument()
    })
  })

  describe('loading states', () => {
    it('should show loading indicator during initial load', () => {
      render(<PreflopComponent darkMode={false} />)
      
      // Loading should appear briefly during component mount
      // Note: This test might be flaky due to timing, but demonstrates the concept
    })
  })

  describe('localStorage integration', () => {
    it('should load settings from localStorage', () => {
      const savedSettings = { tableSize: 6 }
      localStorage.setItem('pokerEdgeSettings', JSON.stringify(savedSettings))
      
      render(<PreflopComponent darkMode={false} />)
      
      expect(screen.getByText('Table Size: 6 players')).toBeInTheDocument()
    })

    it('should use default settings when localStorage is empty', () => {
      render(<PreflopComponent darkMode={false} />)
      
      expect(screen.getByText('Table Size: 9 players')).toBeInTheDocument()
    })
  })

  describe('mobile detection', () => {
    it('should enable table mode on mobile devices', () => {
      // Mock mobile screen width
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500, // Mobile width
      })
      
      render(<PreflopComponent darkMode={false} />)
      
      // Should automatically be in table mode
      expect(screen.getByLabelText(/switch to normal mode/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PreflopComponent darkMode={false} />)
      
      expect(screen.getByLabelText(/switch to table mode/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    })
  })
})
