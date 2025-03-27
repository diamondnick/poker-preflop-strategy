# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Poker Preflop Strategy App

This is a React application for poker preflop strategy, migrated from an AngularJS application. The app helps poker players make decisions during preflop play by providing recommended actions based on their cards and position.

## Features

- Search for card combinations by position and cards
- View recommended actions for unraised and raised pots
- Visual representation of cards and positions
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Usage

- Enter a card combination in the search box (e.g., "AK" for Ace-King)
- You can also search by position + cards (e.g., "EAK" for Early position with Ace-King)
- Valid positions: E (Early), M (Middle), L (Late), S (Small Blind), B (Big Blind)

## Build for Production

To build the application for production:

```bash
npm run build
```

The build files will be located in the `dist` directory.

## Technologies Used

- React
- Vite
- JavaScript/ES6+
- CSS3
