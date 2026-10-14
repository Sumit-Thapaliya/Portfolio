import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import sceneState from './sceneState.js';
import './Scene.css';

const BG = '#0a0e14';

/* -------------------------------------------------------------------- */
/*  Formations: where each object lives at different points of the page  */
/*  p = 0 hero · 0.3 about/skills (orbit ring) · 0.62 projects (edges)   */
/*  · 1 contact (converging cluster)                                      */
/* -------------------------------------------------------------------- */
const KEYS = [0, 0.3, 0.62, 1];

function smooth(t) {
  return t * t * (3 - 2 * t);
}

/** Piecewise-smoothstep interpolation between 4 Vector3 keyframes */
function sampleFormation(frames, p, out) {
  if (p <= KEYS[0]) return out.copy(frames[0]);
  if (p >= KEYS[KEYS.length - 1]) return out.copy(frames[frames.length - 1]);
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (p >= KEYS[i] && p <= KEYS[i + 1]) {
      const t = smooth((p - KEYS[i]) / (KEYS[i + 1] - KEYS[i]));
      return out.copy(frames[i]).lerp(frames[i + 1], t);
    }
  }
  return out.copy(frames[0]);
}

function v(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

/* Each object: hero position, ring slot index, edge side, cluster offset */
const OBJECTS = [
  { kind: 'knot', hero: v(3.1, 0.9, -1), side: 1, spin: [0.15, 0.22, 0.05] },
  { kind: 'ico', hero: v(-3.3, 1.8, -2.5), side: -1, spin: [0.1, 0.18, 0] },
  { kind: 'octa', hero: v(3.6, -2.0, -0.5), side: 1, spin: [0.25, 0.3, 0.1] },
  { kind: 'torus', hero: v(-2.9, -1.9, -1.5), side: -1, spin: [0.3, 0.12, 0] },
  { kind: 'sphere', hero: v(0.6, 2.7, -4), side: 1, spin: [0, 0.1, 0] },
  { kind: 'capsule', hero: v(-0.6, -3.0, -2), side: -1, spin: [0.05, 0.2, 0.35] },
  { kind: 'dodeca', hero: v(1.6, -0.6, -5), side: 1, spin: [0.2, 0.25, 0.1] },
];

function buildFrames(i, o) {
  const n = OBJECTS.length;
  const a = (i / n) * Math.PI * 2;
  const ring = v(Math.cos(a) * 3.4, Math.sin(a) * 1.6, -2 - Math.sin(a) * 1.2);
  const edge = v(o.side * (4.6 + (i % 3) * 0.5), ((i % 4) - 1.5) * 1.4, -2.5 - (i % 2) * 1.5);
  const b = a + 1.3;
  const cluster = v(Math.cos(b) * 1.3, Math.sin(b) * 0.9 - 0.2, -2.5 + Math.sin(b) * 0.5);
  return [o.hero, ring, edge, cluster];
}

/* -------------------------------------------------------------------- */
function Floater({ index, def, children }) {
  const ref = useRef();
  const frames = useMemo(() => buildFrames(index, def), [index, def]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const phase = index * 1.37;

  useFrame(({ clock }, delta) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.getElapsedTime() + phase;
    const intro = sceneState.intro;
    const p = sceneState.progress;

    sampleFormation(frames, p, target);

    // Ring formation slowly rotates as a whole while we're in it
    const ringW = p > 0.12 && p < 0.5 ? 1 - Math.abs((p - 0.3) / 0.2) : 0;
    if (ringW > 0) {
      const rot = t * 0.12;
      const x = target.x * Math.cos(rot) - target.z * Math.sin(rot) * 0.4;
      const z = target.z + target.x * Math.sin(rot) * 0.4;
      target.x = THREE.MathUtils.lerp(target.x, x, ringW);
      target.z = THREE.MathUtils.lerp(target.z, z, ringW);
    }

    // Idle bob + cursor parallax
    const bob = Math.sin(t * 0.7) * 0.3;
    const px = sceneState.mouseX * 0.5;
    const py = sceneState.mouseY * 0.35;

    // Intro: objects start spread out & lower, then assemble
    const spread = 1 + intro * 0.9;

    m.position.x = THREE.MathUtils.damp(m.position.x, target.x * spread + px, 2.6, delta);
    m.position.y = THREE.MathUtils.damp(m.position.y, (target.y + bob - intro * 1.5) * spread + py, 2.6, delta);
    m.position.z = THREE.MathUtils.damp(m.position.z, target.z, 2.6, delta);

    // Spin faster while the user scrolls fast
    const boost = 1 + Math.min(Math.abs(sceneState.velocity) * 0.04, 3) + sceneState.burst * 10;
    m.rotation.x += delta * def.spin[0] * boost;
    m.rotation.y += delta * def.spin[1] * boost;
    m.rotation.z += delta * def.spin[2] * boost;

    // Breathe in the cluster
    const s = p > 0.8 ? 1 - (p - 0.8) * 0.9 : 1;
    m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, s, 3, delta));
  });

  return (
    <group ref={ref} position={def.hero}>
      {children}
    </group>
  );
}

const metal = (color, extra = {}) => ({
  color,
  metalness: 0.75,
  roughness: 0.28,
  flatShading: true,
  ...extra,
});

function Shape({ kind }) {
  switch (kind) {
    case 'knot':
      return (
        <mesh>
          <torusKnotGeometry args={[0.75, 0.24, 160, 24]} />
          <meshStandardMaterial {...metal('#17403a')} />
        </mesh>
      );
    case 'ico':
      return (
        <>
          <mesh>
            <icosahedronGeometry args={[1.05, 0]} />
            <meshStandardMaterial {...metal('#0f1a24')} />
          </mesh>
          <mesh scale={1.06}>
            <icosahedronGeometry args={[1.05, 0]} />
            <meshBasicMaterial color="#34e4c0" wireframe transparent opacity={0.35} />
          </mesh>
        </>
      );
    case 'octa':
      return (
        <mesh>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial {...metal('#6b4a1c', { emissive: '#ffb454', emissiveIntensity: 0.15 })} />
        </mesh>
      );
    case 'torus':
      return (
        <mesh>
          <torusGeometry args={[0.85, 0.26, 24, 64]} />
          <meshStandardMaterial {...metal('#1b2a3a', { flatShading: false, roughness: 0.2 })} />
        </mesh>
      );
    case 'sphere':
      return (
        <mesh>
          <sphereGeometry args={[0.55, 48, 48]} />
          <meshStandardMaterial color="#34e4c0" metalness={0.9} roughness={0.15} emissive="#0e4a40" emissiveIntensity={0.6} />
        </mesh>
      );
    case 'capsule':
      return (
        <mesh>
          <capsuleGeometry args={[0.32, 1.1, 8, 20]} />
          <meshStandardMaterial {...metal('#223447', { flatShading: false })} />
        </mesh>
      );
    case 'dodeca':
      return (
        <mesh>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial {...metal('#2b2117', { emissive: '#ffb454', emissiveIntensity: 0.08 })} />
        </mesh>
      );
    default:
      return null;
  }
}

/* Glowing shards that always orbit the camera's view — depth filler */
function Shards({ count = 14 }) {
  const ref = useRef();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        r: 3 + Math.random() * 4,
        a: (i / count) * Math.PI * 2,
        y: (Math.random() - 0.5) * 5,
        z: -3 - Math.random() * 5,
        s: 0.08 + Math.random() * 0.12,
        sp: 0.05 + Math.random() * 0.1,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    const p = sceneState.progress;
    g.children.forEach((m, i) => {
      const sd = seeds[i];
      const a = sd.a + t * sd.sp + p * 2;
      m.position.set(Math.cos(a) * sd.r, sd.y + Math.sin(t * 0.5 + i) * 0.3, sd.z);
      m.rotation.x = t * 0.5 + i;
      m.rotation.y = t * 0.3;
    });
  });

  return (
    <group ref={ref}>
      {seeds.map((sd, i) => (
        <mesh key={i} scale={sd.s}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 3 === 0 ? '#ffb454' : '#34e4c0'} emissive={i % 3 === 0 ? '#ffb454' : '#34e4c0'} emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

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
    ref.current.rotation.y += delta * (0.008 + Math.min(Math.abs(sceneState.velocity) * 0.001, 0.05));
    ref.current.rotation.z = sceneState.progress * 0.6;
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

/* Camera: dolly on reveal, drift through the page, follow the cursor */
function Rig() {
  useFrame(({ camera, clock }, delta) => {
    sceneState.burst = Math.max(0, sceneState.burst - delta * 1.6);
    const intro = sceneState.intro;
    const p = sceneState.progress;
    const t = clock.getElapsedTime();
    const targetZ = 8 + intro * 4.5 + Math.sin(p * Math.PI) * 1.5;
    const driftX = Math.sin(p * Math.PI * 2) * 1.1;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, sceneState.mouseX * 0.4 + driftX + Math.sin(t * 0.15) * 0.15, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, sceneState.mouseY * 0.3 + Math.cos(t * 0.12) * 0.1, 2, delta);
    camera.lookAt(0, 0, -1);
    camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, -sceneState.velocity * 0.0006, 3, delta);
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

        <group scale={mobile ? 0.7 : 1}>
          {OBJECTS.map((def, i) => (
            <Floater key={def.kind} index={i} def={def}>
              <Shape kind={def.kind} />
            </Floater>
          ))}
          <Shards count={mobile ? 8 : 14} />
        </group>
        <Stars count={mobile ? 220 : 500} />
        <Rig />
      </Canvas>
    </div>
  );
}
