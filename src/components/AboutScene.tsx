"use client";

import React, { useRef, useMemo, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ════════════════════════════════════════════════════
   Theme: "Code Matrix" – terminal rain + scan lines
   ════════════════════════════════════════════════════ */

/* ─── Matrix Rain ─── */
const COL_COUNT = 24;
const DROPS = 14;
const TOTAL_DROPS = COL_COUNT * DROPS;

const MatrixRain = memo(function MatrixRain() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const columns = useMemo(
    () =>
      Array.from({ length: COL_COUNT }, (_, i) => ({
        x: (i - COL_COUNT / 2) * 0.55,
        z: -1 - Math.random() * 3,
        speed: 0.4 + Math.random() * 0.6,
        offset: Math.random() * 12,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    let idx = 0;

    for (let c = 0; c < COL_COUNT; c++) {
      const col = columns[c];
      for (let d = 0; d < DROPS; d++) {
        const fall = ((t * col.speed + col.offset + d * 0.35) % 12) - 6;
        const y = 4 - fall;
        const fade = Math.max(0, 1 - Math.abs(fall) / 5);
        dummy.position.set(col.x, y, col.z);
        dummy.scale.setScalar(0.25 + fade * 0.75);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, TOTAL_DROPS]}>
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.55} />
    </instancedMesh>
  );
});

/* ─── Terminal Frame ─── */
const TerminalFrame = memo(function TerminalFrame() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[3.5, 2.2, 0.08]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.3, 2]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.015}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
});

/* ─── Scan Lines ─── */
const ScanLines = memo(function ScanLines() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) r1.current.position.y = Math.sin(t * 0.25) * 2.5;
    if (r2.current) r2.current.position.y = Math.cos(t * 0.18) * 2;
  });

  return (
    <>
      <mesh ref={r1}>
        <planeGeometry args={[10, 0.015]} />
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={r2}>
        <planeGeometry args={[8, 0.01]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
});

/* ─── Code Lines (horizontal bars representing code) ─── */
const CODE_LINE_COUNT = 18;

const CodeLines = memo(function CodeLines() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lines = useMemo(
    () =>
      Array.from({ length: CODE_LINE_COUNT }, (_, i) => ({
        x: (Math.random() - 0.5) * 2.5,
        y: (i - CODE_LINE_COUNT / 2) * 0.22,
        width: 0.3 + Math.random() * 1.2,
        phase: i * 0.6,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < CODE_LINE_COUNT; i++) {
      const l = lines[i];
      dummy.position.set(l.x, l.y, -0.5);
      dummy.scale.set(l.width + Math.sin(t * 0.3 + l.phase) * 0.15, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, CODE_LINE_COUNT]}
    >
      <planeGeometry args={[1, 0.025]} />
      <meshBasicMaterial
        color="#10b981"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
});

/* ─── Ambient Particles ─── */
const AP_COUNT = 80;

const AboutParticles = memo(function AboutParticles() {
  const ref = useRef<THREE.Points>(null);

  const { pos, base } = useMemo(() => {
    const p = new Float32Array(AP_COUNT * 3);
    const b = new Float32Array(AP_COUNT * 3);
    for (let i = 0; i < AP_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = -1 - Math.random() * 4;
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
    const t = clock.getElapsedTime() * 0.12;
    for (let i = 0; i < AP_COUNT; i++) {
      const i3 = i * 3;
      a[i3 + 1] = base[i3 + 1] + Math.sin(t + i * 0.15) * 0.15;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#10b981"
        transparent
        opacity={0.35}
        size={0.03}
        sizeAttenuation
      />
    </points>
  );
});

/* ─── Camera ─── */
function AboutCamera() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.3 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Scene ─── */
export default function AboutScene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={["#020617", 4, 12]} />
      <MatrixRain />
      <TerminalFrame />
      <ScanLines />
      <CodeLines />
      <AboutParticles />
      <AboutCamera />
    </Canvas>
  );
}
