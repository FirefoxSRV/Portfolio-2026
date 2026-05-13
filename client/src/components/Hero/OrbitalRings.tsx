import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Ring({
  radius,
  color,
  tilt,
  speed,
  label,
}: {
  radius: number;
  color: string;
  tilt: [number, number, number];
  speed: number;
  label: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * speed;
    }
  });

  return (
    <group ref={ref} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 8, 256]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      {/* a few "satellites" */}
      {Array.from({ length: 3 }).map((_, i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
      {/* label text via tiny sprite-style ring (decorative — actual labels in HTML overlay) */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && null}
    </group>
  );
}

export function OrbitalRings() {
  return (
    <group>
      <Ring radius={3.0} color="#CC0000" tilt={[Math.PI / 2.4, 0.3, 0]} speed={0.25} label="NC STATE" />
      <Ring radius={3.6} color="#4F90D2" tilt={[Math.PI / 2.8, -0.4, 0.2]} speed={-0.18} label="GS" />
      <Ring radius={4.2} color="#f5f2e8" tilt={[Math.PI / 2, 0, 0.6]} speed={0.12} label="" />
    </group>
  );
}
