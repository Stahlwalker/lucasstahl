import ColorBends from './ColorBends.jsx';

export default function ColorBendsTest() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#fff' }}>Color Bends Test</h2>
      <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>Testing React Bits ColorBends component with WebGL shader effects</p>

      <div style={{ width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
        <ColorBends
          colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']}
          speed={0.3}
          scale={1.2}
          frequency={1.5}
          warpStrength={1.2}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent={false}
          rotation={45}
          autoRotate={5}
        />
      </div>
    </div>
  );
}
