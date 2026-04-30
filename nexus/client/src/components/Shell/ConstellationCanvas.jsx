import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color } from 'three';

function NetworkField({ accent = '#00b4a0' }) {
  const groupRef = useRef(null);
  const nodes = useMemo(
    () =>
      [
        [-1.8, 0.2, -0.4],
        [-1.2, 0.7, 0.15],
        [-0.65, -0.5, -0.1],
        [-0.05, 0.25, 0.4],
        [0.5, -0.15, -0.25],
        [1.0, 0.6, 0.2],
        [1.45, -0.55, 0.05],
        [0.15, 0.95, -0.3],
        [-0.9, 1.1, 0.2]
      ],
    []
  );

  const connectionPoints = useMemo(
    () => [
      [nodes[0], nodes[1]],
      [nodes[1], nodes[3]],
      [nodes[3], nodes[5]],
      [nodes[5], nodes[6]],
      [nodes[2], nodes[3]],
      [nodes[2], nodes[4]],
      [nodes[4], nodes[6]],
      [nodes[1], nodes[7]],
      [nodes[7], nodes[5]],
      [nodes[8], nodes[1]],
      [nodes[8], nodes[7]]
    ],
    [nodes]
  );

  const linePositions = useMemo(() => {
    const points = [];

    connectionPoints.forEach(([start, end]) => {
      points.push(...start, ...end);
    });

    return new Float32Array(points);
  }, [connectionPoints]);

  const accentColor = useMemo(() => new Color(accent), [accent]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.24;
    groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.18) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.1} />
      <pointLight position={[2, 3, 2]} intensity={12} color={accent} />

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accentColor} transparent opacity={0.34} />
      </lineSegments>

      {nodes.map((position, index) => (
        <mesh key={`node-${index}`} position={position}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function ConstellationCanvas({ accent }) {
  return (
    <div className="constellation-canvas">
      <Canvas camera={{ position: [0, 0, 4.6], fov: 34 }}>
        <NetworkField accent={accent} />
      </Canvas>
    </div>
  );
}
