import React, { useState } from 'react';

function HelpComponent() {
  const [show, setShow] = useState(true);

  const toggleHelp = () => {
    setShow(!show);
  };

  return (
    <div className="help-container">
      {show && (
        <div className="help-content">
          <h3>How to use this app</h3>
          <p>
            This poker strategy app helps you make decisions during preflop play.
            Enter a card combination in the search box to see recommended actions.
          </p>
          <p>
            <strong>Search format:</strong> You can search by position and cards, or just cards.
          </p>
          <ul>
            <li><strong>Position + Cards:</strong> Use format like "EAK" (Early position with Ace-King)</li>
            <li><strong>Cards only:</strong> Use format like "AK" (Ace-King in any position)</li>
          </ul>
          <p>
            <strong>Valid positions:</strong> E (Early), M (Middle), L (Late), S (Small Blind), B (Big Blind)
          </p>
          <button onClick={toggleHelp} className="btn btn-primary">Close Help</button>
        </div>
      )}
      {!show && (
        <button onClick={toggleHelp} className="btn btn-primary">Show Help</button>
      )}
    </div>
  );
}

export default HelpComponent;
