"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SKILLS = [
  "Next.js",
  "Flutter",
  "TypeScript",
  "Dart",
  "JavaScript",
  "Python",
  "Node.js",
  "Supabase",
  "PostgreSQL",
  "Docker",
  "C++",
  "React",
  "Git",
  "MongoDB",
  "TensorFlow",
] as const;

const SPHERE_RADIUS = 3;
const CONNECTION_DISTANCE = 2.5;
const PARTICLE_COUNT = 150;
const PARTICLE_SPHERE_RADIUS = 6;
const EMERALD = "#10b981";

// ---------------------------------------------------------------------------
// Helpers – Fibonacci / golden‑spiral distribution on a sphere
// ---------------------------------------------------------------------------

function fibonacciSpherePoint(
  i: number,
  total: number,
  radius: number
): [number, number, number] {
  const theta = Math.acos(1 - (2 * (i + 0.5)) / total);
  const phi = Math.PI * (1 + Math.sqrt(5)) * i;
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return [x, y, z];
}

// Pre‑compute positions once
const NODE_POSITIONS: [number, number, number][] = SKILLS.map((_, i) =>
  fibonacciSpherePoint(i, SKILLS.length, SPHERE_RADIUS)
);

// ---------------------------------------------------------------------------
// SkillNode
// ---------------------------------------------------------------------------

interface SkillNodeProps {
  name: string;
  position: [number, number, number];
}

function SkillNode({ name, position }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Spring‑like scale animation
  const scaleTarget = hovered ? 1.5 : 1;
  const currentScale = useRef(1);

  useFrame(() => {
    if (!meshRef.current) return;
    currentScale.current += (scaleTarget - currentScale.current) * 0.1;
    meshRef.current.scale.setScalar(currentScale.current);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <icosahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial
        color={EMERALD}
        emissive={EMERALD}
        emissiveIntensity={hovered ? 0.8 : 0.35}
        roughness={0.3}
        metalness={0.6}
      />
      <Html
        distanceFactor={8}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          opacity: hovered ? 1 : 0.45,
          transform: hovered ? "scale(1.15)" : "scale(1)",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: hovered ? "13px" : "10px",
            fontFamily: "sans-serif",
            fontWeight: hovered ? 600 : 400,
            textShadow: "0 0 6px rgba(16,185,129,0.7)",
          }}
        >
          {name}
        </span>
      </Html>
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// ConnectionLines
// ---------------------------------------------------------------------------

function ConnectionLines() {
  const geometry = useMemo(() => {
    const positions: number[] = [];

    for (let i = 0; i < NODE_POSITIONS.length; i++) {
      for (let j = i + 1; j < NODE_POSITIONS.length; j++) {
        const a = NODE_POSITIONS[i];
        const b = NODE_POSITIONS[j];
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist <= CONNECTION_DISTANCE) {
          positions.push(a[0], a[1], a[2]);
          positions.push(b[0], b[1], b[2]);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={EMERALD}
        opacity={0.15}
        transparent
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ---------------------------------------------------------------------------
// ConstellationParticles
// ---------------------------------------------------------------------------

function ConstellationParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random point inside a sphere
      const r = PARTICLE_SPHERE_RADIUS * Math.cbrt(Math.random());
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      arr[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      arr[i * 3 + 2] = r * Math.cos(theta);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={EMERALD}
        size={0.025}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Scene (inner wrapper rendered inside Canvas)
// ---------------------------------------------------------------------------

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />

      {/* Skill nodes */}
      {SKILLS.map((skill, i) => (
        <SkillNode key={skill} name={skill} position={NODE_POSITIONS[i]} />
      ))}

      {/* Connection lines */}
      <ConnectionLines />

      {/* Ambient particles */}
      <ConstellationParticles />

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Default export – the Canvas wrapper
// ---------------------------------------------------------------------------

export default function SkillsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
