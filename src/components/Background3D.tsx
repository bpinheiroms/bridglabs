"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function Orb({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Orb position={[-4, 2, -2]} color="#3b82f6" scale={2.5} />
        <Orb position={[4, -2, -3]} color="#8b5cf6" scale={2} />
        <Orb position={[0, 3, -4]} color="#06b6d4" scale={1.8} />
        <Orb position={[-3, -3, -2]} color="#10b981" scale={1.5} />
        <Orb position={[5, 1, -5]} color="#f59e0b" scale={2.2} />
      </Canvas>
    </div>
  );
}
