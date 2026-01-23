import { useState } from 'react';

export default function ReactTest() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      padding: '2rem',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      margin: '2rem 0',
      backgroundColor: '#f0f9ff'
    }}>
      <h2 style={{ marginTop: 0 }}>React Component Test</h2>
      <p>This is an interactive React component in your Astro site!</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Click me!
        </button>
        <span style={{ fontSize: '1.25rem' }}>Count: <strong>{count}</strong></span>
      </div>
    </div>
  );
}
