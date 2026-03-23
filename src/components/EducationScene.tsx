"use client";

import React, { useRef, useMemo, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ════════════════════════════════════════════════════
   Theme: "Building Blocks" – ascending layers of knowledge
   ════════════════════════════════════════════════════ */

/* ─── Floating Wireframe Blocks ─── */
const BLOCK_COUNT = 10;

const FloatingBlocks = memo(function FloatingBlocks() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const solidRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const blocks = useMemo(
    () =>
      Array.from({ length: BLOCK_COUNT }, (_, i) => {
        const angle = (i / BLOCK_COUNT) * Math.PI * 2;
        const r = 1.5 + Math.sin(i * 2.1) * 1.0;
        return {
          x: Math.cos(angle) * r,
          y: (i - BLOCK_COUNT / 2) * 0.55,
          z: Math.sin(angle) * r - 1,
          size: 0.25 + (i % 3) * 0.12,
          rotX: 0.08 + i * 0.015,
          rotY: 0.12 + i * 0.01,
          phase: i * 0.7,
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.025;

    const wire = meshRef.current;
    const solid = solidRef.current;
    if (!wire || !solid) return;

    for (let i = 0; i < BLOCK_COUNT; i++) {
      const b = blocks[i];
      dummy.position.set(
        b.x,
        b.y + Math.sin(t * 0.3 + b.phase) * 0.3,
        b.z
      );
      dummy.rotation.set(t * b.rotX, t * b.rotY, 0);
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      wire.setMatrixAt(i, dummy.matrix);
      solid.setMatrixAt(i, dummy.matrix);
    }
    wire.instanceMatrix.needsUpdate = true;
    solid.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe overlay */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, BLOCK_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.25}
        />
      </instancedMesh>
      {/* Solid fill */}
      <instancedMesh ref={solidRef} args={[undefined, undefined, BLOCK_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.03} />
      </instancedMesh>
    </group>
  );
});

/* ─── Vertical Light Beams ─── */
const BEAM_COUNT = 5;

const LightBeams = memo(function LightBeams() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const beams = useMemo(
    () =>
      Array.from({ length: BEAM_COUNT }, (_, i) => ({
        x: (i - BEAM_COUNT / 2) * 1.8 + (Math.random() - 0.5) * 0.5,
        z: -1 - Math.random() * 2,
        phase: i * 1.2,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < BEAM_COUNT; i++) {
      const b = beams[i];
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(1, 1 + Math.sin(t * 0.2 + b.phase) * 0.2, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BEAM_COUNT]}>
      <planeGeometry args={[0.015, 8]} />
      <meshBasicMaterial
        color="#10b981"
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
});

/* ─── Rising Particles ─── */
const RP_COUNT = 100;

const RisingParticles = memo(function RisingParticles() {
  const ref = useRef<THREE.Points>(null);

  const { pos, base } = useMemo(() => {
    const p = new Float32Array(RP_COUNT * 3);
    const b = new Float32Array(RP_COUNT * 3);
    for (let i = 0; i < RP_COUNT; i++) {
      const x = (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 8;
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
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < RP_COUNT; i++) {
      const i3 = i * 3;
      /* slowly drift upward, wrap around */
      a[i3 + 1] = ((base[i3 + 1] + t * 0.08 * (1 + (i % 3) * 0.3) + 4) % 8) - 4;
      a[i3] = base[i3] + Math.sin(t * 0.15 + i * 0.2) * 0.1;
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
        opacity={0.3}
        size={0.025}
        sizeAttenuation
      />
    </points>
  );
});

/* ─── Connecting Arcs between blocks ─── */
const ConnectingArcs = memo(function ConnectingArcs() {
  const ref = useRef<THREE.Group>(null);

  const lineObjects = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: "#10b981",
      transparent: true,
      opacity: 0.08,
    });
    const pairs = [
      [[-1.5, -2, -1], [1, -1, -1.5]],
      [[1, -1, -1.5], [-0.5, 0.5, -1]],
      [[-0.5, 0.5, -1], [1.5, 1.5, -1.5]],
      [[1.5, 1.5, -1.5], [-1, 2.5, -1]],
    ];
    return pairs.map(([a, b]) => {
      const mid = [
        (a[0] + b[0]) / 2 + 0.5,
        (a[1] + b[1]) / 2 + 0.4,
        (a[2] + b[2]) / 2 + 0.5,
      ];
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a[0], a[1], a[2]),
        new THREE.Vector3(mid[0], mid[1], mid[2]),
        new THREE.Vector3(b[0], b[1], b[2])
      );
      const geom = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(30)
      );
      return new THREE.Line(geom, mat);
    });
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.025;
  });

  return (
    <group ref={ref}>
      {lineObjects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
});

/* ─── Camera ─── */
function EduCamera() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.3 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Scene ─── */
export default function EducationScene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={["#020617", 4, 12]} />
      <ambientLight intensity={0.3} />
      <FloatingBlocks />
      <LightBeams />
      <ConnectingArcs />
      <RisingParticles />
      <EduCamera />
    </Canvas>
  );
}
