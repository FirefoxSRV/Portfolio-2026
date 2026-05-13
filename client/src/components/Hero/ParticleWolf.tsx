import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A breathing point cloud roughly shaped like a wolf head.
 * Reacts to mouse position via R3F's pointer.
 */
export function ParticleWolf() {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const { positions, basePositions, colors, count } = useMemo(() => {
    const N = 2800;
    const pos = new Float32Array(N * 3);
    const base = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);

    // Stylized wolf "polygon" in 2D, with depth jitter
    const profile: Array<[number, number]> = [
      [-1.1, 0.2], [-0.95, -0.2], [-1.05, -0.55], [-0.7, -0.45],
      [-0.45, -0.85], [-0.15, -0.45], [0.15, -0.85], [0.5, -0.45],
      [0.85, -0.55], [0.9, -0.15], [0.75, 0.25], [0.45, 0.55],
      [0.1, 0.85], [-0.25, 0.7], [-0.6, 0.55],
    ];

    const red = new THREE.Color('#ff2e2e');
    const blue = new THREE.Color('#4F90D2');
    const bone = new THREE.Color('#ffffff');

    for (let i = 0; i < N; i++) {
      // pick edge segment + random t
      const seg = Math.floor(Math.random() * profile.length);
      const [x1, y1] = profile[seg];
      const [x2, y2] = profile[(seg + 1) % profile.length];
      const t = Math.random();
      let x = x1 + (x2 - x1) * t;
      let y = -(y1 + (y2 - y1) * t); // flip Y for 3D

      // some interior fill (fewer points)
      if (Math.random() < 0.35) {
        x *= 0.45 + Math.random() * 0.55;
        y *= 0.45 + Math.random() * 0.55;
      }

      // jitter
      x += (Math.random() - 0.5) * 0.04;
      y += (Math.random() - 0.5) * 0.04;
      const z = (Math.random() - 0.5) * 0.4;

      const idx = i * 3;
      base[idx] = x * 2.2;
      base[idx + 1] = y * 2.2;
      base[idx + 2] = z;
      pos[idx] = base[idx];
      pos[idx + 1] = base[idx + 1];
      pos[idx + 2] = base[idx + 2];

      const r = Math.random();
      const c = r < 0.5 ? red : r < 0.85 ? blue : bone;
      col[idx] = c.r;
      col[idx + 1] = c.g;
      col[idx + 2] = c.b;
    }
    return { positions: pos, basePositions: base, colors: col, count: N };
  }, []);

  useFrame(({ clock }) => {
    const points = ref.current;
    if (!points) return;
    const t = clock.getElapsedTime();
    const arr = points.geometry.attributes.position.array as Float32Array;

    const px = pointer.x * 2.2;
    const py = pointer.y * 2.2;
    const t12 = t * 1.2;
    const t2 = t * 2;
    const REPEL_R2 = 1.5 * 1.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const bx = basePositions[idx];
      const by = basePositions[idx + 1];
      const bz = basePositions[idx + 2];

      // breathing
      const breathe = 1 + Math.sin(t12 + bx * 1.5 + by * 1.5) * 0.04;

      // mouse repulsion — squared-distance gate, only sqrt when in range
      const dx = bx - px;
      const dy = by - py;
      const d2 = dx * dx + dy * dy;
      let ax = bx * breathe;
      let ay = by * breathe;
      if (d2 < REPEL_R2) {
        const dist = Math.sqrt(d2) || 0.0001;
        const force = (1 - dist / 1.5) * 0.35;
        ax += (dx / dist) * force;
        ay += (dy / dist) * force;
      }
      arr[idx] = ax;
      arr[idx + 1] = ay;
      arr[idx + 2] = bz + Math.sin(t2 + i * 0.05) * 0.05;
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.rotation.y = Math.sin(t * 0.2) * 0.05;
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
