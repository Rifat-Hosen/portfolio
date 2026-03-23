"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DEG2RAD = Math.PI / 180;

/* ---------- helpers ---------- */

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const latRad = lat * DEG2RAD;
  const lonRad = lon * DEG2RAD;
  return new THREE.Vector3(
    r * Math.cos(latRad) * Math.cos(lonRad),
    r * Math.sin(latRad),
    r * Math.cos(latRad) * Math.sin(lonRad)
  );
}

/* ---------- GlobeDots ---------- */

function GlobeDots() {
  const positions = useMemo(() => {
    const pts: number[] = [];
    for (let lat = -80; lat <= 80; lat += 10) {
      for (let lon = 0; lon < 360; lon += 10) {
        const v = latLonToVec3(lat, lon, 1.5);
        pts.push(v.x, v.y, v.z);
      }
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#34d399"
        size={0.02}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- GlobeLines ---------- */

function GlobeLines() {
  const latLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    const latitudes = [-60, -30, 0, 30, 60];
    for (const lat of latitudes) {
      const pts: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 2) {
        pts.push(latLonToVec3(lat, lon, 1.52));
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  const lonLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let lon = 0; lon < 360; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -80; lat <= 80; lat += 2) {
        pts.push(latLonToVec3(lat, lon, 1.52));
      }
      lines.push(pts);
    }
    return lines;
  }, []);

  return (
    <group>
      {latLines.map((pts, i) => (
        <lineLoop key={`lat-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#34d399" transparent opacity={0.1} />
        </lineLoop>
      ))}
      {lonLines.map((pts, i) => (
        <line key={`lon-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#34d399" transparent opacity={0.1} />
        </line>
      ))}
    </group>
  );
}

/* ---------- LocationMarker ---------- */

function LocationMarker() {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const position = useMemo(() => latLonToVec3(24.0, 90.4, 1.55), []);

  useFrame(({ clock }) => {
    if (!ringRef.current || !materialRef.current) return;
    const t = clock.getElapsedTime() % 2;
    const progress = t / 2; // 0 → 1
    const scale = 1 + progress * 3;
    ringRef.current.scale.set(scale, scale, scale);
    materialRef.current.opacity = 1 - progress;
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Marker sphere */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color="#34d399"
          emissive="#34d399"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.005, 8, 32]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#34d399"
          transparent
          opacity={1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------- ConnectionArcs ---------- */

const CITIES: { name: string; lat: number; lon: number }[] = [
  { name: "San Francisco", lat: 37.7, lon: -122.4 },
  { name: "London", lat: 51.5, lon: -0.1 },
  { name: "Tokyo", lat: 35.7, lon: 139.7 },
  { name: "Dubai", lat: 25.2, lon: 55.3 },
];

const DHAKA = { lat: 24.0, lon: 90.4 };

function ConnectionArcs() {
  const arcs = useMemo(() => {
    return CITIES.map((city) => {
      const start = latLonToVec3(DHAKA.lat, DHAKA.lon, 1.55);
      const end = latLonToVec3(city.lat, city.lon, 1.55);

      // Midpoint on the sphere surface, then push outward
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.2);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(48);
      const positions = new Float32Array(
        curvePoints.flatMap((p) => [p.x, p.y, p.z])
      );

      return positions;
    });
  }, []);

  return (
    <group>
      {arcs.map((positions, i) => (
        <line key={`arc-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#34d399"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}

/* ---------- RotatingGlobe ---------- */

function RotatingGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <GlobeDots />
      <GlobeLines />
      <LocationMarker />
      <ConnectionArcs />
    </group>
  );
}

/* ---------- ContactScene ---------- */

export default function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.4} />
      <RotatingGlobe />
    </Canvas>
  );
}
