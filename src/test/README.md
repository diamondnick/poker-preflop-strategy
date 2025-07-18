# Test Suite Documentation

This directory contains comprehensive unit and integration tests for the Poker Preflop Strategy MVP application.

## Test Structure

### Unit Tests
- **`Situation.test.js`** - Tests for the Situation class including constructor, validation, and display methods
- **`SituationQuery.test.js`** - Tests for the SituationQuery class including parsing and validation logic
- **`SituationService.test.js`** - Tests for the SituationService class including deterministic advice adjustments and data filtering
- **`DataValidation.test.js`** - Tests for data integrity, consistency, and performance of poker data

### Integration Tests
- **`PreflopComponent.test.jsx`** - Integration tests for the main React component including user interactions, state management, and error handling

## Key Testing Areas

### 1. Data Correctness & Validation
- ✅ Input validation for card combinations
- ✅ Position and action validation
- ✅ Data integrity checks for poker strategy data
- ✅ Edge case handling for invalid inputs

### 2. Deterministic Logic
- ✅ Advice adjustment methods use deterministic logic (no randomness)
- ✅ Consistent results across multiple test runs
- ✅ Original data objects are not mutated

### 3. Error Handling
- ✅ Graceful handling of invalid queries
- ✅ Error messages for validation failures
- ✅ Service error handling and recovery

### 4. Performance & Reliability
- ✅ Data access performance tests
- ✅ Memory usage validation (no excessive object creation)
- ✅ Component rendering performance

### 5. User Experience
- ✅ Loading states and error messages
- ✅ Keyboard input validation and limits
- ✅ Mobile responsiveness and table mode
- ✅ Settings persistence

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run only SituationService tests
npx vitest src/test/SituationService.test.js

# Run only component tests
npx vitest src/test/PreflopComponent.test.jsx
```

## Test Coverage Goals

- **Unit Tests**: >90% coverage for core business logic
- **Integration Tests**: Cover all major user workflows
- **Data Validation**: 100% coverage of data integrity checks
- **Error Handling**: All error paths tested

## MVP Hardening Validation

These tests validate the key improvements made to harden the app as an MVP:

1. **Removed Randomness**: All advice adjustments now use deterministic logic
2. **Input Validation**: Comprehensive validation prevents invalid queries
3. **Error Handling**: Graceful error handling with user-friendly messages
4. **Performance**: Optimized with memoization and efficient data access
5. **Data Integrity**: Validated poker strategy data for consistency

## Continuous Integration

Tests should be run automatically on:
- Every commit to main branch
- Pull request validation
- Before deployment to production

## Adding New Tests

When adding new features:
1. Write unit tests for new business logic
2. Add integration tests for new user workflows
3. Update data validation tests if data structure changes
4. Ensure error handling is tested for new code paths

## Test Utilities

The test setup includes:
- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing utilities
- **jsdom** - Browser environment simulation
- **Coverage reporting** - Code coverage analysis
- **Mocking utilities** - For isolating components under test
