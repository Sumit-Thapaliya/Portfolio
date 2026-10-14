import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import './HeroScene.css';

const TEAL = new THREE.Color('#34e4c0');
const AMBER = new THREE.Color('#ffb454');

/* Slowly breathing wireframe icosahedron — the "core" */
function Core({ pointer }) {
  const group = useRef();
  const outer = useRef();

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (!group.current) return;
    // Ease the whole group toward the pointer for a parallax feel
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      pointer.current.y * 0.35 + t * 0.08,
      2,
      delta
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.5 + t * 0.12,
      2,
      delta
    );
    const s = 1 + Math.sin(t * 0.9) * 0.035;
    group.current.scale.setScalar(s);
    if (outer.current) outer.current.rotation.z = -t * 0.05;
  });

  return (
    <group ref={group} position={[1.8, 0.3, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.9, 0]} />
        <meshBasicMaterial color={AMBER} wireframe transparent opacity={0.08} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color={TEAL} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* A galaxy-like particle field that drifts and reacts gently to the pointer */
function Particles({ pointer, count = 900 }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // distribute in a flattened spherical shell for depth
      const r = 2.6 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);
      c.copy(Math.random() > 0.82 ? AMBER : TEAL);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03 + pointer.current.x * 0.15;
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      pointer.current.y * 0.2,
      1.5,
      delta
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Tracks the pointer in normalised coords without re-rendering React */
function PointerTracker({ pointer }) {
  const { gl } = useThree();
  useMemo(() => {
    const el = gl.domElement.ownerDocument;
    function onMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    el.addEventListener('mousemove', onMove, { passive: true });
    return () => el.removeEventListener('mousemove', onMove);
  }, [gl, pointer]);
  return null;
}

/* Scroll-linked camera dolly: the scene recedes as the hero scrolls away */
function ScrollCamera() {
  useFrame(({ camera }, delta) => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7 + progress * 4, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, progress * -1.5, 3, delta);
  });
  return null;
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <PointerTracker pointer={pointer} />
        <ScrollCamera />
        <Core pointer={pointer} />
        <Particles pointer={pointer} />
      </Canvas>
    </div>
  );
}
