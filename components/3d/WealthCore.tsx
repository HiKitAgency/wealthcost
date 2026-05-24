"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface CoreProps {
  mousePosition?: { x: number; y: number };
}

function WealthCoreScene({ mousePosition = { x: 0, y: 0 } }: CoreProps) {
  const coreRef = useRef<THREE.Group>(null!);
  const ring1Ref = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);
  const ring3Ref = useRef<THREE.Group>(null!);
  const nodesRef = useRef<THREE.Group>(null!);

  // Traveling nodes along rings
  const nodeCount = 7;
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      offset: (i / nodeCount) * Math.PI * 2,
      speed: 0.4 + (i % 3) * 0.15,
      radius: 3.8 + Math.sin(i) * 0.4,
      ring: i % 3,
      size: 0.08 + (i % 2) * 0.03,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Main core slow rotation + mouse influence
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.08 + mousePosition.x * 0.6;
      coreRef.current.rotation.x = mousePosition.y * 0.4;
    }

    // Rings — different speeds and axes for rich motion
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.22;
      ring1Ref.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * -0.16;
      ring2Ref.current.rotation.z = Math.cos(t * 0.07) * 0.3;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.13;
      ring3Ref.current.rotation.y = t * 0.09;
    }

    // Animate traveling nodes
    if (nodesRef.current) {
      nodes.forEach((node, index) => {
        const child = nodesRef.current.children[index] as THREE.Group;
        if (!child) return;

        const angle = t * node.speed + node.offset;
        const ringTilt = node.ring === 0 ? 0 : node.ring === 1 ? 1.1 : -0.9;

        // Position on the ring
        child.position.x = Math.cos(angle) * node.radius;
        child.position.z = Math.sin(angle) * node.radius * 0.55;
        child.position.y = Math.sin(angle * 0.7) * 0.6 + ringTilt;

        // Gentle scale pulse
        const pulse = 1 + Math.sin(t * 3 + index) * 0.25;
        child.scale.setScalar(pulse * node.size * 8);
      });
    }
  });

  return (
    <group>
      {/* Ambient + Key lighting for luxurious feel */}
      <ambientLight intensity={0.25} />
      <pointLight position={[-12, 18, -6]} intensity={1.8} color="#C5A46E" />
      <pointLight position={[14, -10, 8]} intensity={1.2} color="#00C9B1" />
      <pointLight position={[0, -22, -18]} intensity={0.7} color="#ffffff" />

      {/* Central Wealth Core — the AI brain */}
      <group ref={coreRef}>
        {/* Outer soft shell */}
        <mesh>
          <sphereGeometry args={[1.65]} />
          <meshPhongMaterial
            color="#0C0F1A"
            emissive="#C5A46E"
            emissiveIntensity={0.035}
            shininess={12}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* Solid luminous core */}
        <mesh>
          <sphereGeometry args={[1.18]} />
          <meshPhongMaterial
            color="#11151F"
            emissive="#C5A46E"
            emissiveIntensity={0.18}
            shininess={80}
          />
        </mesh>
        {/* Inner bright nucleus */}
        <mesh>
          <sphereGeometry args={[0.58]} />
          <meshPhongMaterial
            color="#1F252F"
            emissive="#F5F5F7"
            emissiveIntensity={0.6}
            shininess={100}
          />
        </mesh>
      </group>

      {/* Orbiting Capital Rings — representing allocation layers */}
      {/* Ring 1 — Primary capital ring */}
      <group ref={ring1Ref}>
        <mesh rotation={[1.1, 0, 0]}>
          <torusGeometry args={[3.9, 0.012, 16, 120]} />
          <meshPhongMaterial color="#C5A46E" emissive="#C5A46E" emissiveIntensity={0.35} shininess={40} />
        </mesh>
      </group>

      {/* Ring 2 — Growth ring */}
      <group ref={ring2Ref}>
        <mesh rotation={[0.3, 0.8, 0]}>
          <torusGeometry args={[4.65, 0.009, 16, 140]} />
          <meshPhongMaterial color="#00C9B1" emissive="#00C9B1" emissiveIntensity={0.4} shininess={50} />
        </mesh>
      </group>

      {/* Ring 3 — Risk / Hedging ring */}
      <group ref={ring3Ref}>
        <mesh rotation={[-0.85, -0.4, 0.6]}>
          <torusGeometry args={[5.25, 0.007, 16, 160]} />
          <meshPhongMaterial color="#8A8F9E" emissive="#4A4F5A" emissiveIntensity={0.2} shininess={30} />
        </mesh>
      </group>

      {/* Traveling Portfolio Nodes */}
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <group key={i}>
            <mesh>
              <sphereGeometry args={[0.12]} />
              <meshPhongMaterial
                color={node.ring === 1 ? "#00C9B1" : "#C5A46E"}
                emissive={node.ring === 1 ? "#00C9B1" : "#C5A46E"}
                emissiveIntensity={0.9}
                shininess={90}
              />
            </mesh>
            {/* Tiny glow halo */}
            <mesh>
              <sphereGeometry args={[0.22]} />
              <meshBasicMaterial
                color={node.ring === 1 ? "#00C9B1" : "#C5A46E"}
                transparent
                opacity={0.12}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Subtle distant star field for depth */}
      <Stars
        radius={120}
        depth={18}
        count={48}
        factor={1.6}
        saturation={0}
        fade
        speed={0.2}
      />
    </group>
  );
}

interface WealthCoreCanvasProps {
  className?: string;
  intensity?: number;
}

export default function WealthCoreCanvas({ className = "", intensity = 1 }: WealthCoreCanvasProps) {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x: x * 0.6, y: -y * 0.5 });
  };

  return (
    <div 
      className={`relative w-full h-full ${className}`} 
      onMouseMove={handleMouseMove}
      style={{ touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 13.5], fov: 42 }}
        style={{ background: 'transparent' }}
        gl={{ 
          alpha: true, 
          antialias: true, 
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
      >
        <WealthCoreScene mousePosition={mouse} />
      </Canvas>
      
      {/* Subtle vignette overlay for premium depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(5,7,15,0.65)_82%)]" />
    </div>
  );
}
