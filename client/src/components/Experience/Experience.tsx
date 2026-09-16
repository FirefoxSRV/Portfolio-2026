import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { profile, type ExperienceItem } from '@/data/profile';
import { ExperienceFallback } from './ExperienceFallback';
import { hasWebGL } from '@/lib/webgl';
import { useInView } from '@/hooks/useInView';

function PortalRing({
  z,
  color,
  radius,
  thickness,
  rotationSpeed,
  pulse,
}: {
  z: number;
  color: string;
  radius: number;
  thickness: number;
  rotationSpeed: number;
  pulse: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z += dt * rotationSpeed;
    const t = clock.getElapsedTime() + pulse;
    const scale = 1 + Math.sin(t * 2) * 0.04;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={ref} position={[0, 0, z]}>
      <torusGeometry args={[radius, thickness, 16, 128]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

function Tunnel({ activeIndex }: { activeIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef(0);
  target.current = -activeIndex * 6;

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const cur = groupRef.current.position.z;
    groupRef.current.position.z += (-target.current - cur) * Math.min(1, dt * 2.4);
  });

  // far stars
  const starGeometry = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = -Math.random() * 60 - 5;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  return (
    <group ref={groupRef}>
      {/* stars */}
      <points geometry={starGeometry}>
        <pointsMaterial size={0.04} color="#f5f2e8" transparent opacity={0.6} sizeAttenuation />
      </points>

      {profile.experience.map((exp, i) => (
        <group key={exp.id} position={[0, 0, -i * 6]}>
          <PortalRing
            z={0}
            color={exp.color}
            radius={2.6}
            thickness={0.06}
            rotationSpeed={i % 2 ? 0.4 : -0.4}
            pulse={i * 1.3}
          />
          <PortalRing
            z={-0.1}
            color={exp.color}
            radius={2.9}
            thickness={0.01}
            rotationSpeed={i % 2 ? -0.2 : 0.2}
            pulse={i * 0.8}
          />
          {/* glow plane */}
          <mesh position={[0, 0, -0.5]}>
            <circleGeometry args={[2.4, 64]} />
            <meshBasicMaterial color={exp.color} transparent opacity={0.05} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Experience() {
  const [active, setActive] = useState(0);
  const exp: ExperienceItem = profile.experience[active];
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, '200px');

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section relative overflow-hidden bg-[#050507] isolate"
    >
      {/* Background visual — WebGL when available, canvas-2d when not */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {hasWebGL() ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 70 }}
            dpr={[1, 1.5]}
            frameloop={inView ? 'always' : 'demand'}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <Tunnel activeIndex={active} />
            </Suspense>
          </Canvas>
        ) : (
          <ExperienceFallback />
        )}
      </div>

      {/* radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 30%, rgba(5,5,7,0.85) 75%, #050507 100%)',
        }}
      />

      {/* HUD */}
      <div className="relative h-svh md:h-screen flex flex-col" style={{ zIndex: 20 }}>
        <div className="pt-16 px-5 md:pt-24 md:px-12 flex items-baseline justify-between">
          <div>
            <div className="font-mono text-[9px] tracking-[0.3em] md:text-[12px] md:tracking-[0.5em] text-bone/50 uppercase">
              02 / experience
            </div>
            <h2 className="font-display text-[clamp(1.4rem,10vw,2.5rem)] sm:text-4xl md:text-7xl font-extrabold text-bone mt-2 leading-none">
              the tunnel.
            </h2>
          </div>
          <div className="hidden sm:block font-mono text-[12px] tracking-[0.4em] text-bone/40 uppercase text-right">
            warp drive engaged<br />
            <span className="text-wolf-red">depth: {active + 1}/{profile.experience.length}</span>
          </div>
        </div>

        {/* center card */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-5 md:px-12">
          <div
            key={exp.id}
            className="max-w-2xl text-center animate-[expFade_0.6s_ease-out]"
          >
            <div
              className="font-mono text-[9px] tracking-[0.2em] mb-2 md:text-[13px] md:tracking-[0.4em] md:mb-3 uppercase"
              style={{ color: exp.color }}
            >
              ◆ {exp.window} // {exp.location}
            </div>
            <h3 className="font-display text-xl sm:text-3xl md:text-5xl font-bold text-bone leading-tight">
              {exp.role}
            </h3>
            <div
              className="font-mono text-[10px] sm:text-sm tracking-[0.2em] uppercase mt-2"
              style={{ color: exp.color }}
            >
              {exp.org}
            </div>
            <ul className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-bone/85 text-[12px] md:text-[15px] leading-snug md:leading-relaxed text-left max-h-[38svh] overflow-y-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
              {exp.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-wolf-red shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* nav controls */}
        <div className="pb-5 px-4 md:pb-12 md:px-12 flex items-center justify-between gap-3">
          <button
            onClick={() => setActive((i) => Math.max(0, i - 1))}
            disabled={active === 0}
            className="flex items-center gap-2 md:gap-3 font-mono text-[10px] md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase text-bone border border-bone/30 bg-[#050507]/60 px-3 py-2.5 md:px-6 md:py-4 hover:text-wolf-red hover:border-wolf-red hover:bg-wolf-red/10 disabled:opacity-25 disabled:hover:text-bone disabled:hover:border-bone/30 disabled:hover:bg-[#050507]/60 transition-colors"
            data-cursor="hover"
          >
            <span className="text-base md:text-2xl leading-none">←</span> prev
          </button>
          <div className="flex gap-2 md:gap-3 shrink-0">
            {profile.experience.map((e, i) => (
              <button
                key={e.id}
                onClick={() => setActive(i)}
                className={`h-[6px] transition-all ${
                  i === active ? 'w-10 md:w-16' : 'w-5 md:w-8 opacity-40 hover:opacity-80'
                }`}
                style={{ background: e.color }}
                data-cursor="hover"
                aria-label={e.org}
              />
            ))}
          </div>
          <button
            onClick={() => setActive((i) => Math.min(profile.experience.length - 1, i + 1))}
            disabled={active === profile.experience.length - 1}
            className="flex items-center gap-2 md:gap-3 font-mono text-[10px] md:text-base tracking-[0.2em] md:tracking-[0.3em] uppercase text-bone border border-bone/30 bg-[#050507]/60 px-3 py-2.5 md:px-6 md:py-4 hover:text-wolf-red hover:border-wolf-red hover:bg-wolf-red/10 disabled:opacity-25 disabled:hover:text-bone disabled:hover:border-bone/30 disabled:hover:bg-[#050507]/60 transition-colors"
            data-cursor="hover"
          >
            next <span className="text-base md:text-2xl leading-none">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
