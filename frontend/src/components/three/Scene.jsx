import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import sceneState from './sceneState.js';
import './Scene.css';

const BG = '#0a0e14';

/* -------------------------------------------------------------------- */
/*  Floating object: gentle bob + slow tumble, parallax from the cursor    */
/* -------------------------------------------------------------------- */
function Floater({ position, rotationSpeed = [0.2, 0.3, 0], floatAmp = 0.35, phase = 0, depth = 1, children }) {
  const ref = useRef();
  const base = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime() + phase;
    const intro = sceneState.intro;

    // Bob + drift
    const y = base.y + Math.sin(t * 0.7) * floatAmp;
    const x = base.x + Math.cos(t * 0.45) * floatAmp * 0.5;

    // Parallax from the cursor (deeper objects move less), scroll lifts objects
    const px = sceneState.mouseX * 0.6 * depth;
    const py = sceneState.mouseY * 0.4 * depth;
    const scrollLift = sceneState.scroll * 2.2 * depth;

    // During the intro, objects sit further apart and lower (they "assemble")
    const spread = 1 + intro * 0.9;

    m.position.x = THREE.MathUtils.damp(m.position.x, x * spread + px, 3, delta);
    m.position.y = THREE.MathUtils.damp(m.position.y, (y - intro * 1.5) * spread + py + scrollLift, 3, delta);
    m.position.z = base.z;

    m.rotation.x += delta * rotationSpeed[0];
    m.rotation.y += delta * rotationSpeed[1];
    m.rotation.z += delta * rotationSpeed[2];
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

/* Materials — faceted "low-poly premium" look lit by coloured lights */
const metal = (color, extra = {}) => ({
  color,
  metalness: 0.75,
  roughness: 0.28,
  flatShading: true,
  ...extra,
});

function Objects({ mobile }) {
  const scale = mobile ? 0.7 : 1;
  return (
    <group scale={scale}>
      {/* Torus knot — hero right */}
      <Floater position={[3.1, 0.9, -1]} rotationSpeed={[0.15, 0.22, 0.05]} phase={1} depth={1}>
        <mesh castShadow>
          <torusKnotGeometry args={[0.75, 0.24, 160, 24]} />
          <meshStandardMaterial {...metal('#17403a')} />
        </mesh>
      </Floater>

      {/* Icosahedron — wire shell + dark core, upper left */}
      <Floater position={[-3.3, 1.8, -2.5]} rotationSpeed={[0.1, 0.18, 0]} phase={2.4} depth={0.7}>
        <mesh>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial {...metal('#0f1a24')} />
        </mesh>
        <mesh scale={1.06}>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshBasicMaterial color="#34e4c0" wireframe transparent opacity={0.35} />
        </mesh>
      </Floater>

      {/* Octahedron — amber accent, lower right */}
      <Floater position={[3.6, -2.0, -0.5]} rotationSpeed={[0.25, 0.3, 0.1]} phase={4} depth={1.2} floatAmp={0.45}>
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial {...metal('#6b4a1c', { emissive: '#ffb454', emissiveIntensity: 0.15 })} />
        </mesh>
      </Floater>

      {/* Torus — lower left */}
      <Floater position={[-2.9, -1.9, -1.5]} rotationSpeed={[0.3, 0.12, 0]} phase={0.6} depth={0.9}>
        <mesh>
          <torusGeometry args={[0.85, 0.26, 24, 64]} />
          <meshStandardMaterial {...metal('#1b2a3a', { flatShading: false, roughness: 0.2 })} />
        </mesh>
      </Floater>

      {/* Glossy sphere — top centre, far */}
      <Floater position={[0.6, 2.7, -4]} rotationSpeed={[0, 0.1, 0]} phase={3.1} depth={0.5} floatAmp={0.25}>
        <mesh>
          <sphereGeometry args={[0.55, 48, 48]} />
          <meshStandardMaterial color="#34e4c0" metalness={0.9} roughness={0.15} emissive="#0e4a40" emissiveIntensity={0.6} />
        </mesh>
      </Floater>

      {/* Capsule — bottom centre */}
      <Floater position={[-0.6, -3.0, -2]} rotationSpeed={[0.05, 0.2, 0.35]} phase={5.2} depth={0.8}>
        <mesh>
          <capsuleGeometry args={[0.32, 1.1, 8, 20]} />
          <meshStandardMaterial {...metal('#223447', { flatShading: false })} />
        </mesh>
      </Floater>

      {/* Dodecahedron — small, deep */}
      <Floater position={[1.6, -0.6, -5]} rotationSpeed={[0.2, 0.25, 0.1]} phase={1.9} depth={0.4}>
        <mesh>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial {...metal('#2b2117', { emissive: '#ffb454', emissiveIntensity: 0.08 })} />
        </mesh>
      </Floater>

      {/* Tiny tetrahedrons — dust */}
      {[[-1.4, 0.4, -6], [2.2, 2.2, -6.5], [-4.2, -0.2, -5], [4.6, 0.3, -4.5]].map((p, i) => (
        <Floater key={i} position={p} rotationSpeed={[0.4, 0.5, 0.2]} phase={i * 1.7} depth={0.3} floatAmp={0.2}>
          <mesh>
            <tetrahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#34e4c0" emissive="#34e4c0" emissiveIntensity={0.5} />
          </mesh>
        </Floater>
      ))}
    </group>
  );
}

/* Sparse starfield for depth */
function Stars({ count = 500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 30;
      a[i * 3 + 1] = (Math.random() - 0.5) * 20;
      a[i * 3 + 2] = -4 - Math.random() * 16;
    }
    return a;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.008;
    ref.current.position.y = sceneState.scroll * 1.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#8fb3ad" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* Camera rig: dolly-in on reveal, breathe, follow cursor */
function Rig() {
  useFrame(({ camera, clock }, delta) => {
    const intro = sceneState.intro;
    const t = clock.getElapsedTime();
    const targetZ = 8 + intro * 4.5;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, sceneState.mouseX * 0.4 + Math.sin(t * 0.15) * 0.15, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, sceneState.mouseY * 0.3 + Math.cos(t * 0.12) * 0.1, 2, delta);
    camera.lookAt(0, 0, -1);
  });
  return null;
}

export default function Scene({ mobile = false }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.3 : 1.75]}
        camera={{ position: [0, 0, 12.5], fov: 38, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(BG, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <fog attach="fog" args={[BG, 9, 22]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 6, 6]} intensity={1.1} color="#e8edf4" />
        <pointLight position={[5, 3, 3]} intensity={38} color="#34e4c0" distance={18} decay={2} />
        <pointLight position={[-5, -3, 2]} intensity={28} color="#ffb454" distance={18} decay={2} />
        <pointLight position={[0, -5, -4]} intensity={14} color="#4f7cff" distance={16} decay={2} />
        <Objects mobile={mobile} />
        <Stars count={mobile ? 220 : 500} />
        <Rig />
      </Canvas>
    </div>
  );
}
