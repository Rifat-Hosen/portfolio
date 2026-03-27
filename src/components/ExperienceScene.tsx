"use client";

import React, { useRef, useMemo, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ════════════════════════════════════════════════════
   Theme: "Career Growth" – ascending network topology
   ════════════════════════════════════════════════════ */

/* ─── Floating Network Nodes ─── */
const NODE_COUNT = 12;

const NetworkNodes = memo(function NetworkNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const connectorRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, (_, i) => {
        const angle = (i / NODE_COUNT) * Math.PI * 2;
        const radius = 1.2 + (i % 4) * 0.4;
        return {
          x: Math.cos(angle) * radius,
          y: (i - NODE_COUNT / 2) * 0.4 + Math.sin(angle) * 0.5,
          z: Math.sin(angle) * radius,
          scale: 0.08 + (i % 3) * 0.06,
          phase: i * 0.6,
          layer: Math.floor(i / 4),
        };
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.015;

    const nodesInst = nodesRef.current;
    const connectors = connectorRef.current;
    if (!nodesInst || !connectors) return;

    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      dummy.position.set(n.x, n.y + Math.sin(t * 0.4 + n.phase) * 0.2, n.z);
      dummy.rotation.set(t * n.phase * 0.1, t * n.phase * 0.05, 0);
      dummy.scale.setScalar(n.scale * (1 + Math.sin(t * 0.3 + n.phase) * 0.3));
      dummy.updateMatrix();
      nodesInst.setMatrixAt(i, dummy.matrix);
      connectors.setMatrixAt(i, dummy.matrix);
    }
    nodesInst.instanceMatrix.needsUpdate = true;
    connectors.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Node spheres */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.4}
        />
      </instancedMesh>
      {/* Solid nodes */}
      <instancedMesh
        ref={connectorRef}
        args={[undefined, undefined, NODE_COUNT]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.08} />
      </instancedMesh>
    </group>
  );
});

/* ─── Connection Threads ─── */
const THREAD_COUNT = 8;

const ConnectionThreads = memo(function ConnectionThreads() {
  const groupRef = useRef<THREE.Group>(null);

  const threads = useMemo(() => {
    const segments = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
      const angle1 = (i / THREAD_COUNT) * Math.PI * 2;
      const angle2 = ((i + 1) / THREAD_COUNT) * Math.PI * 2;
      const r1 = 1.2 + (i % 2) * 0.4;
      const r2 = 1.2 + ((i + 1) % 2) * 0.4;
      segments.push([
        [
          Math.cos(angle1) * r1,
          (i - THREAD_COUNT / 2) * 0.4,
          Math.sin(angle1) * r1,
        ],
        [
          Math.cos(angle2) * r2,
          (i + 1 - THREAD_COUNT / 2) * 0.4,
          Math.sin(angle2) * r2,
        ],
      ]);
    }
    return segments;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {threads.map((segment, idx) => {
        const curve = new THREE.LineCurve3(
          new THREE.Vector3(...(segment[0] as [number, number, number])),
          new THREE.Vector3(...(segment[1] as [number, number, number])),
        );
        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={idx}>
            <bufferGeometry attach="geometry" {...(geometry as any)} />
            <lineBasicMaterial
              color="#10b981"
              transparent
              opacity={0.1}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
});

/* ─── Pulsing Energy Waves ─── */
const EnergyWaves = memo(function EnergyWaves() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.8, 0.03, 16, 100]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.06} />
      </mesh>
      <mesh scale={[1.2, 1.2, 1.2]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.03} />
      </mesh>
    </group>
  );
});

/* ─── Floating Particles ─── */
const PARTICLE_COUNT = 80;

const FloatingParticles = memo(function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const { pos, base } = useMemo(() => {
    const p = new Float32Array(PARTICLE_COUNT * 3);
    const b = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const r = 1 + Math.random() * 2;
      const x = Math.cos(angle) * r;
      const y = (Math.random() - 0.5) * 4;
      const z = Math.sin(angle) * r;
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
      b[i * 3] = x;
      b[i * 3 + 1] = y;
      b[i * 3 + 2] = z;
    }
    return { pos: p, base: b };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      a[i3] = base[i3] + Math.cos(t * 0.2 + i * 0.1) * 0.2;
      a[i3 + 2] = base[i3 + 2] + Math.sin(t * 0.15 + i * 0.15) * 0.2;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#34d399"
        transparent
        opacity={0.25}
        size={0.02}
        sizeAttenuation
      />
    </points>
  );
});

/* ─── Camera ─── */
function ExpCamera() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.02;
    camera.position.y += (pointer.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Scene ─── */
export default function ExperienceScene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={["#020617", 4, 12]} />
      <ambientLight intensity={0.3} />
      <NetworkNodes />
      <ConnectionThreads />
      <EnergyWaves />
      <FloatingParticles />
      <ExpCamera />
    </Canvas>
  );
}
