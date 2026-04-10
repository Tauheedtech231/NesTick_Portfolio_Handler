// components/vision/FutureCity3DModel.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Sphere, 
  Cylinder, 
  Box, 
  Torus, 
  Float, 
  Stars, 
  MeshDistortMaterial,
  Line,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

interface Product {
  id: number;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface FutureCity3DModelProps {
  products: Product[];
}

// Futuristic Building with Glass Effect
function FuturisticBuilding({ position, color, height, width, index, isHovered, onHover, productName }: { 
  position: [number, number, number]; 
  color: string; 
  height: number;
  width: number;
  index: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  productName: string;
}) {
  const buildingRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [localHover, setLocalHover] = useState(false);
  const hovered = isHovered || localHover;

  useFrame(({ clock }) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
    if (glowRef.current && hovered) {
      const intensity = 0.5 + Math.sin(clock.getElapsedTime() * 5) * 0.3;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    } else if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1;
    }
  });

  const handlePointerEnter = () => {
    setLocalHover(true);
    onHover(index);
  };

  const handlePointerLeave = () => {
    setLocalHover(false);
    onHover(null);
  };

  return (
    <group position={position}>
      <group ref={buildingRef}>
        {/* Main Tower */}
        <Cylinder args={[width * 0.8, width, height, 12]} position={[0, height / 2, 0]}>
          <meshStandardMaterial 
            color="#0F172A" 
            metalness={0.85} 
            roughness={0.15} 
            emissive={color}
            emissiveIntensity={0.15}
            transparent
            opacity={0.85}
          />
        </Cylinder>
        
        {/* Glass Panels - Vertical Lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Box 
            key={i}
            args={[0.05, height * 0.7, 0.05]}
            position={[width * 0.6 * Math.sin(i * Math.PI / 3), height * 0.6, width * 0.6 * Math.cos(i * Math.PI / 3)]}
          >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </Box>
        ))}
        
        {/* Building Top Ring */}
        <Torus args={[width * 0.85, 0.05, 16, 48]} position={[0, height, 0]}>
          <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
        </Torus>
        
        {/* Spire */}
        <Cylinder args={[0.08, 0.15, 0.6, 6]} position={[0, height + 0.35, 0]}>
          <meshStandardMaterial color="#E8CA5E" metalness={0.95} />
        </Cylinder>
      </group>
      
      {/* Floating Energy Orb - Interactive */}
      <mesh 
        ref={glowRef}
        position={[0, height + 0.5, 0]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <Sphere args={[0.12, 24, 24]}>
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </Sphere>
      </mesh>
      
      {/* Particle Ring on Hover */}
      {hovered && (
        <group position={[0, height + 0.5, 0]}>
          <Torus args={[0.22, 0.008, 24, 48]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </Torus>
          <Torus args={[0.32, 0.006, 24, 48]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#E8CA5E" emissive="#E8CA5E" emissiveIntensity={0.5} />
          </Torus>
        </group>
      )}
      
      {/* Product Label */}
      <Html position={[0, height + 0.9, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className={`transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#E8CA5E]/50 rounded-lg px-3 py-1.5 shadow-xl">
            <p className="text-xs font-bold whitespace-nowrap" style={{ color: color }}>{productName}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Central Crystal Tower - The Heart of Future Neezamiya
function CentralCrystalTower() {
  const towerRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);
  
  useFrame(({ clock }) => {
    if (towerRef.current) {
      towerRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (crystalRef.current) {
      const intensity = 0.4 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
      (crystalRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.y = clock.getElapsedTime() * (0.1 + i * 0.05);
        ring.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      }
    });
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Base Platform */}
      <Cylinder args={[1.2, 1.5, 0.3, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#1F4381" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Main Tower Core */}
      <Cylinder args={[0.6, 0.8, 2.2, 12]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.92} roughness={0.08} emissive="#A57F2A" emissiveIntensity={0.2} />
      </Cylinder>
      
      {/* Crystal Center */}
      <mesh ref={crystalRef} position={[0, 2.5, 0]}>
        <octahedronGeometry args={[0.45]} />
        <meshStandardMaterial 
          color="#00E0FF" 
          metalness={0.95} 
          roughness={0.02} 
          emissive="#00E0FF" 
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Rotating Rings */}
      {[1.2, 1.8, 2.4].map((y, i) => (
        <Torus 
          key={i}
          ref={el => { if (el) ringsRef.current[i] = el }}
          args={[1.0 + i * 0.15, 0.04, 48, 120]}
          position={[0, y, 0]}
        >
          <meshStandardMaterial 
            color={i === 0 ? "#E8CA5E" : i === 1 ? "#00E0FF" : "#1F4381"} 
            metalness={0.9} 
            roughness={0.1}
            emissive={i === 1 ? "#00E0FF" : "#E8CA5E"}
            emissiveIntensity={0.3}
          />
        </Torus>
      ))}
      
      {/* Top Spire */}
      <Cylinder args={[0.08, 0.2, 0.8, 8]} position={[0, 3.0, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.98} roughness={0.02} />
      </Cylinder>
      <Sphere args={[0.1, 16, 16]} position={[0, 3.4, 0]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.6} />
      </Sphere>
    </group>
  );
}

// Orbital Rings - Around the city
function OrbitalRings() {
  const ringRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame(({ clock }) => {
    ringRefs.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.y = clock.getElapsedTime() * (0.08 + i * 0.03);
        ring.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      }
    });
  });
  
  const rings = [
    { radius: 2.5, color: "#E8CA5E", width: 0.04, yOffset: 0.5 },
    { radius: 3.2, color: "#00E0FF", width: 0.03, yOffset: 0.8 },
    { radius: 3.9, color: "#1F4381", width: 0.035, yOffset: 1.1 },
    { radius: 4.5, color: "#E8CA5E", width: 0.03, yOffset: 1.4 },
  ];
  
  return (
    <group>
      {rings.map((ring, i) => (
        <Torus 
          key={i}
          ref={el => { if (el) ringRefs.current[i] = el }}
          args={[ring.radius, ring.width, 96, 200]}
          position={[0, ring.yOffset, 0]}
        >
          <meshStandardMaterial 
            color={ring.color} 
            metalness={0.85} 
            roughness={0.15}
            emissive={ring.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </Torus>
      ))}
    </group>
  );
}

// Floating Data Particles - Representing data flow
function DataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Spherical distribution
    const radius = 2 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Color distribution
    const colorType = Math.random();
    if (colorType < 0.4) {
      colors[i * 3] = 0.91; colors[i * 3 + 1] = 0.79; colors[i * 3 + 2] = 0.37; // Gold
    } else if (colorType < 0.7) {
      colors[i * 3] = 0; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1; // Cyan
    } else {
      colors[i * 3] = 0.12; colors[i * 3 + 1] = 0.26; colors[i * 3 + 2] = 0.51; // Blue
    }
  }
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3}  args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} transparent opacity={0.6} vertexColors blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Energy Beams - Connecting buildings
function EnergyBeams() {
  const beamsRef = useRef<THREE.LineSegments>(null);
  const connections = [
    { from: [-1.8, 0.5, -1.4], to: [0, 1.5, 0] },
    { from: [1.8, 0.5, -1.4], to: [0, 1.5, 0] },
    { from: [-1.4, 0.5, 1.8], to: [0, 1.5, 0] },
    { from: [1.4, 0.5, 1.8], to: [0, 1.5, 0] },
    { from: [0, 0.5, -2.0], to: [0, 1.5, 0] },
    { from: [0, 0.5, 2.0], to: [0, 1.5, 0] },
  ];
  
  useFrame(({ clock }) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });
  
  const points = connections.flatMap(conn => [
    new THREE.Vector3(conn.from[0], conn.from[1], conn.from[2]),
    new THREE.Vector3(conn.to[0], conn.to[1], conn.to[2])
  ]);
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x00E0FF, transparent: true, opacity: 0.4 });
  
  return (
    <lineSegments ref={beamsRef} geometry={geometry} material={material} />
  );
}

// Ground Grid with Glow
function GroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      (gridRef.current.material as THREE.Material).opacity = 0.3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  
  return (
    <group>
      <gridHelper ref={gridRef} args={[12, 30, "#E8CA5E", "#00E0FF"]} position={[0, -0.2, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#0F172A" metalness={0.3} roughness={0.7} transparent opacity={0.5} />
      </mesh>
      {/* Circular ring on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]}>
        <ringGeometry args={[2.5, 5, 64]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.8} side={THREE.DoubleSide} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Star Field Background
function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const starCount = 1500;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
  }
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={starCount} array={positions} itemSize={3}  args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E8CA5E" size={0.05} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Main Scene Component
function FutureCityScene({ products }: { products: Product[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const positions: [number, number, number][] = [
    [-1.8, 0, -1.4], [1.8, 0, -1.4], [-1.4, 0, 1.8],
    [1.4, 0, 1.8], [0, 0, -2.0], [0, 0, 2.0]
  ];
  
  const heights = [2.2, 2.5, 2.0, 2.3, 2.8, 2.1];
  const widths = [0.55, 0.6, 0.5, 0.55, 0.65, 0.5];
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 5, 4]} intensity={1} color="#E8CA5E" />
      <pointLight position={[-3, 4, 5]} intensity={0.8} color="#00E0FF" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#1F4381" />
      <directionalLight position={[4, 6, 3]} intensity={0.9} />
      
      {/* Scene Elements */}
      <GroundGrid />
      <CentralCrystalTower />
      <OrbitalRings />
      <EnergyBeams />
      <DataParticles />
      <StarField />
      
      {/* Buildings */}
      {products.map((product, index) => (
        <FuturisticBuilding
          key={product.id}
          position={positions[index % positions.length]}
          color={product.color}
          height={heights[index % heights.length]}
          width={widths[index % widths.length]}
          index={index}
          isHovered={hoveredIndex === index}
          onHover={(idx) => setHoveredIndex(idx)}
          productName={product.name}
        />
      ))}
    </group>
  );
}

// Main Export
export default function FutureCity3DModel({ products }: FutureCity3DModelProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas 
        camera={{ position: [0, 3, 9], fov: 45 }} 
        style={{ background: '#0B0F19' }} 
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <FutureCityScene products={products} />
        <fog attach="fog" args={['#0B0F19', 6, 15]} />
      </Canvas>
    </div>
  );
}