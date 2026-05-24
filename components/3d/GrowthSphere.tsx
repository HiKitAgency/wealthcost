"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GrowthSphereScene() {
  const outerRef = useRef<THREE.Mesh>(null!);
  const midRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const ringsRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRef.current) outerRef.current.rotation.y = t * 0.09;
    if (midRef.current) midRef.current.rotation.y = t * -0.14;
    if (innerRef.current) {
      innerRef.current.rotation.y = t * 0.22;
      innerRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.05;
      ringsRef.current.children.forEach((r, i) => {
        (r as THREE.Mesh).rotation.z = t * (0.6 + i * 0.3) * (i % 2 ? 1 : -1);
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.35} />
      <pointLight position={[-10, 14, -8]} intensity={2} color="#C5A46E" />
      <pointLight position={[12, -9, 10]} intensity={1.4} color="#00C9B1" />

      {/* Outer protective shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[3.6]} />
        <meshPhongMaterial color="#0C0F1A" emissive="#C5A46E" emissiveIntensity={0.04} shininess={8} transparent opacity={0.35} />
      </mesh>

      {/* Growth layers */}
      <mesh ref={midRef}>
        <sphereGeometry args={[2.7]} />
        <meshPhongMaterial color="#11151F" emissive="#C5A46E" emissiveIntensity={0.12} shininess={60} />
      </mesh>

      <mesh ref={innerRef}>
        <sphereGeometry args={[1.75]} />
        <meshPhongMaterial color="#1A1F2B" emissive="#00C9B1" emissiveIntensity={0.25} shininess={90} />
      </mesh>

      {/* Concentric growth rings */}
      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 0.6, i * 1.1, 0]}>
            <torusGeometry args={[2.15 + i * 0.35, 0.011, 12, 90]} />
            <meshPhongMaterial color={i === 2 ? "#00C9B1" : "#C5A46E"} emissive={i === 2 ? "#00C9B1" : "#C5A46E"} emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function GrowthSphereCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 9.5], fov: 44 }} style={{ background: 'transparent' }} gl={{ alpha: true, antialias: true }}>
        <GrowthSphereScene />
      </Canvas>
    </div>
  );
}
