import React, { useEffect } from 'react';
import PreflopComponent from './components/PreflopComponent';
import './App.css';

function App() {
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

  return (
    <div className="app">
      <PreflopComponent />
    </div>
  );
}

export default App;
