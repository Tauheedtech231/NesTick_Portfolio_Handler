// components/Hero3DBackground.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x += 0.001;
      meshRef.current.position.x = mouseRef.current.x * 0.3;
      meshRef.current.position.y = mouseRef.current.y * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#1D4ED8"
          emissive="#0A2463"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.3}
          transparent
          opacity={0.95}
        />
      </Sphere>
    </Float>
  );
}

function OuterRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      ringRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.05, 64, 200]} />
      <meshStandardMaterial color="#38BDF8" emissive="#1D4ED8" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 800;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} args={[positions, 3]}  />
      </bufferGeometry>
      <pointsMaterial color="#38BDF8" size={0.03} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} style={{ background: '#0B0F19' }} gl={{ antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#38BDF8" />
        <directionalLight position={[2, 3, 4]} intensity={0.6} />
        
        <AnimatedCore />
        <OuterRing />
        <Particles />
        <Stars radius={10} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      </Canvas>
    </div>
  );
}