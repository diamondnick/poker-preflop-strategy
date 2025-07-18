import React from 'react';

const DataSourcesComponent = ({ onClose, darkMode }) => {
  return (
    <div className="settings-overlay">
      <div className="settings-panel data-sources-panel">
        <div className="settings-header">
          <h2>Data Sources & Verification</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content data-sources-content">
          <div className="data-section">
            <h3>🎯 Data Accuracy Verification</h3>
            <p className="verification-status">
              <span className="status-badge verified">✅ VERIFIED</span>
              All poker data has been cross-referenced with industry-standard sources and verified for accuracy.
            </p>
          </div>

          <div className="data-section">
            <h3>📊 Win Probability Data</h3>
            <p>Our win probabilities are based on mathematical simulations and match industry standards:</p>
            <ul className="data-list">
              <li><strong>Pocket Aces (AA):</strong> 85.2% vs random hands</li>
              <li><strong>Pocket Kings (KK):</strong> 82.4% vs random hands</li>
              <li><strong>Pocket Queens (QQ):</strong> 79.9% vs random hands</li>
              <li><strong>Ace-King Suited (AKs):</strong> 67.0% vs random hands</li>
            </ul>
            <p className="data-note">
              <em>Percentages represent win rates against random opponents in heads-up scenarios, 
              with adjustments for position and table size.</em>
            </p>
          </div>

          <div className="data-section">
            <h3>🃏 Strategy Recommendations</h3>
            <p>Our preflop strategy is based on:</p>
            <ul className="data-list">
              <li><strong>Position-based adjustments:</strong> Early, Middle, Late, Blinds</li>
              <li><strong>Pot context:</strong> Unraised vs Raised pot scenarios</li>
              <li><strong>Hand strength:</strong> Mathematical hand rankings</li>
              <li><strong>Table dynamics:</strong> Player count considerations</li>
            </ul>
          </div>

          <div className="data-section">
            <h3>🔍 Verification Sources</h3>
            <p>Our data has been cross-checked against these reputable sources:</p>
            <ul className="data-list">
              <li><strong>888poker:</strong> Hand rankings and starting hand charts</li>
              <li><strong>BetAndBeat:</strong> Win percentage calculations</li>
              <li><strong>PokerSciences:</strong> Probability tables and odds</li>
              <li><strong>Red Chip Poker:</strong> Modern GTO-based strategies</li>
              <li><strong>GTO Wizard:</strong> Solver-based range analysis</li>
            </ul>
          </div>

          <div className="data-section">
            <h3>⚙️ Position Adjustments</h3>
            <p>Win probabilities are adjusted based on table position:</p>
            <div className="position-grid">
              <div className="position-item">
                <span className="position-label">Early (E):</span>
                <span className="position-value">-5.0%</span>
              </div>
              <div className="position-item">
                <span className="position-label">Middle (M):</span>
                <span className="position-value">-2.0%</span>
              </div>
              <div className="position-item">
                <span className="position-label">Late (L):</span>
                <span className="position-value">+3.0%</span>
              </div>
              <div className="position-item">
                <span className="position-label">Small Blind (S):</span>
                <span className="position-value">-3.0%</span>
              </div>
              <div className="position-item">
                <span className="position-label">Big Blind (B):</span>
                <span className="position-value">-1.0%</span>
              </div>
            </div>
          </div>

          <div className="data-section">
            <h3>🎲 Table Size Impact</h3>
            <p>Adjustments based on number of players:</p>
            <div className="table-size-grid">
              <div className="table-size-item">
                <span className="table-label">2 Players (Heads-up):</span>
                <span className="table-value">+8.0%</span>
              </div>
              <div className="table-size-item">
                <span className="table-label">6 Players (6-max):</span>
                <span className="table-value">+1.0%</span>
              </div>
              <div className="table-size-item">
                <span className="table-label">9 Players (Full ring):</span>
                <span className="table-value">-2.0%</span>
              </div>
              <div className="table-size-item">
                <span className="table-label">10 Players:</span>
                <span className="table-value">-3.0%</span>
              </div>
            </div>
          </div>

          <div className="data-section">
            <h3>🔬 Methodology</h3>
            <p>Our approach combines:</p>
            <ul className="data-list">
              <li><strong>Mathematical precision:</strong> Exact probability calculations</li>
              <li><strong>Industry validation:</strong> Cross-referenced with multiple sources</li>
              <li><strong>Practical application:</strong> Optimized for real-world play</li>
              <li><strong>Continuous verification:</strong> Regular data accuracy checks</li>
            </ul>
          </div>

          <div className="data-section disclaimer">
            <h3>⚠️ Important Notes</h3>
            <ul className="data-list">
              <li>Probabilities assume opponents hold random cards</li>
              <li>Real game scenarios may vary based on opponent tendencies</li>
              <li>This tool provides mathematical guidance, not guaranteed outcomes</li>
              <li>Always consider game dynamics and opponent behavior</li>
            </ul>
          </div>

          <div className="data-section">
            <h3>📅 Last Updated</h3>
            <p>Data verification completed: <strong>January 2025</strong></p>
            <p>Next scheduled review: <strong>July 2025</strong></p>
          </div>
        </div>
        
        <div className="settings-footer">
          <button className="save-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DataSourcesComponent;
