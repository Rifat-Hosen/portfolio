"use client";

import React, { useRef, useMemo, memo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

/* ════════════════════════════════════════════════════════════
   "Digital Topology" – all 3D elements frame the edges,
   leaving a clear center void for hero text
   ════════════════════════════════════════════════════════════ */

/* ─── WaveGrid: animated mesh terrain at top & bottom ─── */
const COLS = 30;
const ROWS = 5;
const GRID_TOTAL = COLS * ROWS;
const LINE_VERTS = (COLS * (ROWS - 1) + (COLS - 1) * ROWS) * 2;

const WaveGrid = memo(function WaveGrid() {
  const topMesh = useRef<THREE.InstancedMesh>(null);
  const botMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const topPos = useMemo(() => new Float32Array(GRID_TOTAL * 3), []);
  const botPos = useMemo(() => new Float32Array(GRID_TOTAL * 3), []);

  const topLines = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(LINE_VERTS * 3), 3)
    );
    return g;
  }, []);

  const botLines = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(LINE_VERTS * 3), 3)
    );
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const update = (
      mesh: THREE.InstancedMesh | null,
      store: Float32Array,
      geom: THREE.BufferGeometry,
      yBase: number,
      yDir: number
    ) => {
      if (!mesh) return;
      let idx = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = (c - COLS / 2) * 0.45;
          const wave =
            Math.sin(c * 0.25 + t * 0.35) * 0.18 +
            Math.cos(r * 0.7 + t * 0.25) * 0.12;
          const y = yBase + r * 0.4 * yDir + wave;
          const z = -2 + Math.sin(c * 0.18 + r * 0.5 + t * 0.15) * 0.6;
          dummy.position.set(x, y, z);
          const sc =
            0.5 + Math.sin(t * 0.3 + c * 0.12 + r * 0.25) * 0.35;
          dummy.scale.setScalar(Math.max(0.2, sc));
          dummy.updateMatrix();
          mesh.setMatrixAt(idx, dummy.matrix);
          store[idx * 3] = x;
          store[idx * 3 + 1] = y;
          store[idx * 3 + 2] = z;
          idx++;
        }
      }
      mesh.instanceMatrix.needsUpdate = true;

      /* Grid connection lines */
      const la = (geom.attributes.position as THREE.BufferAttribute)
        .array as Float32Array;
      let li = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const a = (r * COLS + c) * 3;
          const b = (r * COLS + c + 1) * 3;
          la[li++] = store[a];
          la[li++] = store[a + 1];
          la[li++] = store[a + 2];
          la[li++] = store[b];
          la[li++] = store[b + 1];
          la[li++] = store[b + 2];
        }
      }
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS; c++) {
          const a = (r * COLS + c) * 3;
          const b = ((r + 1) * COLS + c) * 3;
          la[li++] = store[a];
          la[li++] = store[a + 1];
          la[li++] = store[a + 2];
          la[li++] = store[b];
          la[li++] = store[b + 1];
          la[li++] = store[b + 2];
        }
      }
      geom.setDrawRange(0, li / 3);
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    };

    update(topMesh.current, topPos, topLines, 2.5, 1);
    update(botMesh.current, botPos, botLines, -2.5, -1);
  });

  return (
    <>
      <instancedMesh ref={topMesh} args={[undefined, undefined, GRID_TOTAL]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </instancedMesh>
      <lineSegments geometry={topLines}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.05} />
      </lineSegments>

      <instancedMesh ref={botMesh} args={[undefined, undefined, GRID_TOTAL]}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.4} />
      </instancedMesh>
      <lineSegments geometry={botLines}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.05} />
      </lineSegments>
    </>
  );
});

/* ─── SideNodes: network clusters on left & right ─── */
const S_NODES = 18;

const SideNodes = memo(function SideNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(
    () =>
      Array.from({ length: S_NODES }, (_, i) => {
        const right = i >= S_NODES / 2;
        const li = i % (S_NODES / 2);
        return {
          x: (right ? 1 : -1) * (3.8 + Math.random() * 2.5),
          y: (li - S_NODES / 4) * 0.7 + (Math.random() - 0.5) * 0.6,
          z: -1 - Math.random() * 3,
          speed: 0.06 + Math.random() * 0.08,
          phase: i * 0.65,
        };
      }),
    []
  );

  const tPos = useMemo(
    () => Array.from({ length: S_NODES }, () => new THREE.Vector3()),
    []
  );

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(S_NODES * (S_NODES - 1) * 3),
        3
      )
    );
    g.setDrawRange(0, 0);
    return g;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < S_NODES; i++) {
      const n = nodes[i];
      const x = n.x + Math.sin(t * n.speed + n.phase) * 0.12;
      const y = n.y + Math.cos(t * n.speed * 0.6 + n.phase) * 0.18;
      dummy.position.set(x, y, n.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tPos[i].set(x, y, n.z);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const la = (lineGeom.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    let idx = 0;
    for (let i = 0; i < S_NODES; i++) {
      for (let j = i + 1; j < S_NODES; j++) {
        if (tPos[i].distanceTo(tPos[j]) < 2.2) {
          la[idx * 6] = tPos[i].x;
          la[idx * 6 + 1] = tPos[i].y;
          la[idx * 6 + 2] = tPos[i].z;
          la[idx * 6 + 3] = tPos[j].x;
          la[idx * 6 + 4] = tPos[j].y;
          la[idx * 6 + 5] = tPos[j].z;
          idx++;
        }
      }
    }
    lineGeom.setDrawRange(0, idx * 2);
    (lineGeom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, S_NODES]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.45} />
      </instancedMesh>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#10b981" transparent opacity={0.05} />
      </lineSegments>
    </>
  );
});

/* ─── EdgeTokens: code syntax pushed to far edges ─── */
const EDGE_TOKEN_DATA = [
  { text: "</>", x: -5.8, y: 2.2, z: -2 },
  { text: "{ }", x: 5.8, y: -2.2, z: -2.5 },
  { text: "=>", x: 5.2, y: 3.0, z: -3 },
  { text: "fn()", x: -5.2, y: -3.0, z: -2.5 },
  { text: "API", x: -5.0, y: 0.5, z: -3.5 },
  { text: "git", x: 5.0, y: -0.5, z: -3.5 },
  { text: "npm", x: 6.0, y: 1.5, z: -3 },
  { text: "[ ]", x: -6.0, y: -1.5, z: -3 },
];

const EdgeToken = memo(function EdgeToken({
  text,
  bx,
  by,
  bz,
  i,
}: {
  text: string;
  bx: number;
  by: number;
  bz: number;
  i: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useMemo(() => i * 1.1, [i]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = by + Math.sin(t * 0.2 + phase) * 0.2;
    ref.current.rotation.y = Math.sin(t * 0.1 + phase) * 0.1;
  });

  return (
    <group ref={ref} position={[bx, by, bz]}>
      <Text
        fontSize={0.2}
        color="#34d399"
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.3}
      >
        {text}
      </Text>
    </group>
  );
});

const EdgeTokens = memo(function EdgeTokens() {
  return (
    <Suspense fallback={null}>
      {EDGE_TOKEN_DATA.map((t, i) => (
        <EdgeToken key={i} text={t.text} bx={t.x} by={t.y} bz={t.z} i={i} />
      ))}
    </Suspense>
  );
});

/* ─── FrameRings: large orbital rings far from center ─── */
const FrameRings = memo(function FrameRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) {
      r1.current.rotation.x = t * 0.04;
      r1.current.rotation.z = t * 0.06;
    }
    if (r2.current) {
      r2.current.rotation.y = t * 0.05;
      r2.current.rotation.x = t * 0.03;
    }
    if (r3.current) {
      r3.current.rotation.z = t * 0.03;
      r3.current.rotation.y = t * 0.07;
    }
  });

  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[4.5, 0.006, 16, 120]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, 0, Math.PI / 5]}>
        <torusGeometry args={[5.5, 0.006, 16, 120]} />
        <meshBasicMaterial color="#059669" transparent opacity={0.08} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
        <torusGeometry args={[6.5, 0.006, 16, 120]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.06} />
      </mesh>
    </>
  );
});

/* ─── DustParticles: annular distribution (void in center) ─── */
const DUST_COUNT = 200;

const dustVert = /* glsl */ `
  attribute float size;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (120.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
    vA = size / 2.0;
  }
`;

const dustFrag = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = (1.0 - smoothstep(0.0, 0.5, d)) * vA * 0.35;
    gl_FragColor = vec4(0.063, 0.725, 0.506, a);
  }
`;

const DustParticles = memo(function DustParticles() {
  const ref = useRef<THREE.Points>(null);

  const { pos, sz, base } = useMemo(() => {
    const p = new Float32Array(DUST_COUNT * 3);
    const b = new Float32Array(DUST_COUNT * 3);
    const s = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      /* Annular: min radius 2.5, nothing near center */
      const r = 2.5 + Math.cbrt(Math.random()) * 5.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.65;
      const z = r * Math.cos(phi);
      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
      b[i * 3] = x;
      b[i * 3 + 1] = y;
      b[i * 3 + 2] = z;
      s[i] = Math.random() * 1.2 + 0.3;
    }
    return { pos: p, sz: s, base: b };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    const t = clock.getElapsedTime() * 0.15;
    for (let i = 0; i < DUST_COUNT; i++) {
      const i3 = i * 3;
      a[i3] = base[i3] + Math.sin(t + i * 0.06) * 0.08;
      a[i3 + 1] = base[i3 + 1] + Math.sin(t * 0.6 + i * 0.1) * 0.08;
      a[i3 + 2] = base[i3 + 2] + Math.cos(t * 0.4 + i * 0.08) * 0.08;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-size" args={[sz, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={dustVert}
        fragmentShader={dustFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

/* ─── CameraRig ─── */
function CameraRig() {
  const { camera } = useThree();
  useFrame(({ pointer }) => {
    camera.position.x += (pointer.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Scene ─── */
export default function Scene() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <fog attach="fog" args={["#020617", 5, 15]} />
      <WaveGrid />
      <SideNodes />
      <EdgeTokens />
      <FrameRings />
      <DustParticles />
      <CameraRig />
    </Canvas>
  );
}
