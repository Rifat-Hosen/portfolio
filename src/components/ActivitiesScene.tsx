"use client";

import React, { useRef, useMemo, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ════════════════════════════════════════════════════
   Theme: "Hex Modules" – floating hexagonal project cells
   ════════════════════════════════════════════════════ */

/* ─── Helper: hexagon shape ─── */
function createHexShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

/* ─── Hex Prisms ─── */
const HEX_COUNT = 9;

const HexPrisms = memo(function HexPrisms() {
  const groupRef = useRef<THREE.Group>(null);

  const hexes = useMemo(() => {
    const shape = createHexShape(0.5);
    const extrudeSettings = { depth: 0.12, bevelEnabled: false };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    return {
      geom,
      items: Array.from({ length: HEX_COUNT }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const xOff = row % 2 === 1 ? 0.7 : 0;
        return {
          x: (col - 1) * 1.4 + xOff + (Math.random() - 0.5) * 0.3,
          y: (row - 1) * 1.2 + (Math.random() - 0.5) * 0.3,
          z: -0.5 - Math.random() * 2,
          rotSpeed: 0.05 + Math.random() * 0.06,
          phase: i * 0.8,
          scale: 0.7 + Math.random() * 0.4,
        };
      }),
    };
  }, []);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const wireRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.015;

    for (let i = 0; i < HEX_COUNT; i++) {
      const h = hexes.items[i];
      const mesh = meshRefs.current[i];
      const wire = wireRefs.current[i];
      if (!mesh || !wire) continue;

      const y = h.y + Math.sin(t * 0.25 + h.phase) * 0.25;
      const rz = Math.sin(t * h.rotSpeed + h.phase) * 0.15;
      const ry = t * h.rotSpeed;

      mesh.position.set(h.x, y, h.z);
      mesh.rotation.set(0, ry, rz);
      wire.position.copy(mesh.position);
      wire.rotation.copy(mesh.rotation);
    }
  });

  return (
    <group ref={groupRef}>
      {hexes.items.map((h, i) => (
        <React.Fragment key={i}>
          {/* Solid fill */}
          <mesh
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
            geometry={hexes.geom}
            scale={h.scale}
          >
            <meshBasicMaterial color="#10b981" transparent opacity={0.04} />
          </mesh>
          {/* Wireframe */}
          <mesh
            ref={(el) => {
              wireRefs.current[i] = el;
            }}
            geometry={hexes.geom}
            scale={h.scale}
          >
            <meshBasicMaterial
              color="#10b981"
              wireframe
              transparent
              opacity={0.2}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
});

/* ─── Connection Lines between nearby hexes ─── */
const HexConnections = memo(function HexConnections() {
  const lineGeom = useMemo(() => {
    /* Pre-compute connections for the 3x3 grid */
    const positions: number[] = [];
    const items = Array.from({ length: HEX_COUNT }, (_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const xOff = row % 2 === 1 ? 0.7 : 0;
      return {
        x: (col - 1) * 1.4 + xOff,
        y: (row - 1) * 1.2,
        z: -1.5,
      };
    });

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const dx = items[i].x - items[j].x;
        const dy = items[i].y - items[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 2) {
          positions.push(
            items[i].x, items[i].y, items[i].z,
            items[j].x, items[j].y, items[j].z
          );
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geom;
  }, []);

  return (
    <lineSegments geometry={lineGeom}>
      <lineBasicMaterial color="#10b981" transparent opacity={0.06} />
    </lineSegments>
  );
});

/* ─── Orbiting Dots ─── */
const DOT_COUNT = 6;

const OrbitingDots = memo(function OrbitingDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const dots = useMemo(
    () =>
      Array.from({ length: DOT_COUNT }, (_, i) => ({
        radius: 2.5 + i * 0.3,
        speed: 0.15 + i * 0.04,
        yOff: (Math.random() - 0.5) * 2,
        phase: (i / DOT_COUNT) * Math.PI * 2,
      })),
    []
  );

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < DOT_COUNT; i++) {
      const d = dots[i];
      const angle = t * d.speed + d.phase;
      dummy.position.set(
        Math.cos(angle) * d.radius,
        d.yOff + Math.sin(t * 0.2 + i) * 0.3,
        Math.sin(angle) * d.radius - 2
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DOT_COUNT]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.5} />
    </instancedMesh>
  );
});

/* ─── Ambient Particles ─── */
const AP_COUNT = 90;

const ActivityParticles = memo(function ActivityParticles() {
  const ref = useRef<THREE.Points>(null);

  const { pos, base } = useMemo(() => {
    const p = new Float32Array(AP_COUNT * 3);
    const b = new Float32Array(AP_COUNT * 3);
    for (let i = 0; i < AP_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 6;
      const z = -1 - Math.random() * 5;
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
    const t = clock.getElapsedTime() * 0.1;
    for (let i = 0; i < AP_COUNT; i++) {
      const i3 = i * 3;
      a[i3] = base[i3] + Math.sin(t + i * 0.1) * 0.08;
      a[i3 + 1] = base[i3 + 1] + Math.cos(t * 0.8 + i * 0.15) * 0.08;
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
        opacity={0.3}
        size={0.025}
        sizeAttenuation
      />
    </points>
  );
});

/* ─── Camera ─── */
function ActCamera() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.25 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.15 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Scene ─── */
export default function ActivitiesScene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={["#020617", 4, 12]} />
      <HexPrisms />
      <HexConnections />
      <OrbitingDots />
      <ActivityParticles />
      <ActCamera />
    </Canvas>
  );
}
