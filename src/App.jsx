import { useEffect, useState } from 'react';
import './App.css';
import './fullscreen.css';
import PreflopComponent from './components/PreflopComponent';
import { Helmet } from 'react-helmet';

function App() {
  const [darkMode] = useState(true); // Always dark mode for discretion
  
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
  

  
  // Apply dark mode class to body (always dark mode)
  useEffect(() => {
    document.body.classList.add('dark-mode');
  }, []);
  
  // Set CSS variables for sophisticated dark mode
  useEffect(() => {
    const root = document.documentElement;
    
    // Sophisticated dark color palette
    root.style.setProperty('--bg', '#0f1419'); // Deep navy-black
    root.style.setProperty('--text', '#e6e6e6'); // Soft white
    root.style.setProperty('--header', '#1a1f2e'); // Dark slate blue
    root.style.setProperty('--card-bg', '#1e2329'); // Charcoal with blue tint
    root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.6)');
    root.style.setProperty('--button-bg', '#2a3441'); // Muted blue-gray
    root.style.setProperty('--button-text', '#e6e6e6');
    root.style.setProperty('--button-hover', '#3a4551'); // Lighter blue-gray
    root.style.setProperty('--clear-button', '#d63384'); // Elegant pink-red
    root.style.setProperty('--back-button', '#0d6efd'); // Modern blue
    root.style.setProperty('--primary-dark', '#1a1f2e'); // Primary dark color
    root.style.setProperty('--accent', '#6c757d'); // Muted gray accent
    root.style.setProperty('--success', '#198754'); // Success green
    root.style.setProperty('--warning', '#fd7e14'); // Warning orange
    root.style.setProperty('--border', '#3a4551'); // Border color
  }, []);
  


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
