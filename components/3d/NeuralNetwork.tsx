"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeData {
  position: [number, number, number];
  connections: number[];
  speed: number;
  phase: number;
}

function NeuralNetworkScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const nodesRef = useRef<THREE.Group>(null!);
  const linesRef = useRef<THREE.Group>(null!);

  const nodeCount = 14;

  const nodes: NodeData[] = useMemo(() => {
    const arr: NodeData[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const radius = 4.2 + Math.random() * 1.8;
      const theta = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const phi = Math.acos(2 * Math.random() - 1) * 0.65;
      
      arr.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi) * 0.6 + (Math.random() - 0.5) * 1.2,
          radius * Math.sin(phi) * Math.sin(theta) * 0.9,
        ],
        connections: [],
        speed: 0.6 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Create intelligent connections (closest 2-3 neighbors)
    arr.forEach((node, i) => {
      const distances = arr
        .map((other, j) => ({
          index: j,
          dist: Math.hypot(
            node.position[0] - other.position[0],
            node.position[1] - other.position[1],
            node.position[2] - other.position[2]
          ),
        }))
        .filter((d) => d.index !== i)
        .sort((a, b) => a.dist - b.dist);

      node.connections = distances.slice(0, 2 + (i % 2)).map((d) => d.index);
    });

    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.035;
      groupRef.current.rotation.x = Math.sin(t * 0.018) * 0.12;
    }

    // Animate nodes pulsing
    if (nodesRef.current) {
      nodes.forEach((node, i) => {
        const mesh = nodesRef.current.children[i] as THREE.Mesh;
        if (!mesh) return;

        const pulse = 1 + Math.sin(t * node.speed + node.phase) * 0.28;
        mesh.scale.setScalar(pulse);

        // Occasional stronger "decision" flash
        const flash = Math.sin(t * 1.8 + i * 1.7) > 0.94 ? 1.6 : 1;
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.65 * flash;
      });
    }

    // Animate connection lines opacity
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const mat = (line as THREE.Line).material as THREE.LineBasicMaterial;
        const pulse = 0.45 + Math.sin(t * 1.6 + i) * 0.35;
        mat.opacity = pulse;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[-18, 22, -10]} intensity={2.2} color="#C5A46E" />
      <pointLight position={[22, -16, 14]} intensity={1.6} color="#00C9B1" />

      {/* Connection Lines */}
      <group ref={linesRef}>
        {nodes.map((node, i) =>
          node.connections.map((targetIdx, ci) => {
            const target = nodes[targetIdx];
            const points = [
              new THREE.Vector3(...node.position),
              new THREE.Vector3(...target.position),
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            return (
              <line key={`${i}-${ci}`}>
                <bufferGeometry attach="geometry" {...geometry} />
                <lineBasicMaterial
                  attach="material"
                  color="#C5A46E"
                  transparent
                  opacity={0.55}
                  linewidth={1}
                />
              </line>
            );
          })
        )}
      </group>

      {/* Decision Nodes */}
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <group key={i} position={node.position}>
            <mesh>
              <sphereGeometry args={[0.22]} />
              <meshPhongMaterial
                color={i % 3 === 0 ? "#00C9B1" : "#C5A46E"}
                emissive={i % 3 === 0 ? "#00C9B1" : "#C5A46E"}
                emissiveIntensity={0.65}
                shininess={70}
              />
            </mesh>
            {/* Soft halo */}
            <mesh>
              <sphereGeometry args={[0.48]} />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#00C9B1" : "#C5A46E"}
                transparent
                opacity={0.09}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

export default function NeuralNetworkCanvas({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 46 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <NeuralNetworkScene />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_38%,rgba(5,7,15,0.6)_78%)]" />
    </div>
  );
}
