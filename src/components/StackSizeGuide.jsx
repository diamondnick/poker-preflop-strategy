import React from 'react';

function StackSizeGuide() {
  return (
    <div className="stack-size-guide">
      <h3>Stack Size Considerations</h3>
      <div className="stack-recommendations">
        <div className="stack-recommendation">
          <h4>Deep Stacks ({'>'}100BB)</h4>
          <p>Play more suited connectors and small pairs for implied odds.</p>
          <p>Consider 3-betting lighter in position against aggressive opponents.</p>
        </div>
        <div className="stack-recommendation">
          <h4>Medium Stacks (40-100BB)</h4>
          <p>Follow the standard strategy shown in the app.</p>
          <p>Balance your ranges between value hands and bluffs.</p>
        </div>
        <div className="stack-recommendation">
          <h4>Short Stacks ({'<'}40BB)</h4>
          <p>Tighten your calling range and be more willing to commit with medium-strong hands.</p>
          <p>Reduce speculative hand play and focus on high card strength.</p>
        </div>
      </div>
    </div>
  );
}

export default StackSizeGuide;
