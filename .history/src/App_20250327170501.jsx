import { useEffect, useState } from 'react';
import './App.css';
import './fullscreen.css';
import PreflopComponent from './components/PreflopComponent';
import { Helmet } from 'react-helmet';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Set viewport meta tag to prevent scaling and horizontal scrolling
  useEffect(() => {
    // Check if viewport meta tag exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    // If it doesn't exist, create it
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set the content to prevent scaling and horizontal scrolling
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  }, []);
  
  // Check for user preference for dark mode
  useEffect(() => {
    // Check if user has previously set a preference
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check if user's system prefers dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);
  
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  
  // Set CSS variables for light/dark mode
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.style.setProperty('--bg', '#121212');
      root.style.setProperty('--text', '#f5f5f5');
      root.style.setProperty('--header', '#1e1e1e');
      root.style.setProperty('--card-bg', '#1e1e1e');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.4)');
      root.style.setProperty('--button-bg', '#333');
      root.style.setProperty('--button-text', '#fff');
      root.style.setProperty('--button-hover', '#444');
      root.style.setProperty('--clear-button', '#c0392b');
      root.style.setProperty('--back-button', '#2980b9');
    } else {
      root.style.setProperty('--bg', '#f5f5f5');
      root.style.setProperty('--text', '#333');
      root.style.setProperty('--header', '#4169E1');
      root.style.setProperty('--card-bg', '#fff');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--button-bg', '#f0f0f0');
      root.style.setProperty('--button-text', '#333');
      root.style.setProperty('--button-hover', '#e0e0e0');
      root.style.setProperty('--clear-button', '#e74c3c');
      root.style.setProperty('--back-button', '#3498db');
    }
  }, [darkMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Helmet>
        <meta name="description" content="PokerEdge - Your mobile poker strategy companion" />
        <meta name="apple-mobile-web-app-title" content="PokerEdge" />
        <meta name="application-name" content="PokerEdge" />
      </Helmet>
      

      <PreflopComponent darkMode={darkMode} />
    </div>
  );
}

export default App;
