// components/vision/FutureCity3DModel.tsx
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Sphere, 
  Cylinder, 
  Box, 
  Torus, 
 
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

// Moving Car Component - Slower Speed
function MovingCar({ position, color, direction, speed = 0.8, delay = 0, routeLength = 8 }: { 
  position: [number, number, number]; 
  color: string; 
  direction: 'x' | 'z';
  speed?: number;
  delay?: number;
  routeLength?: number;
}) {
  const carRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (carRef.current) {
      const time = (clock.getElapsedTime() + delay) * speed;
      const move = (time % routeLength) - (routeLength / 2);
      
      if (direction === 'x') {
        carRef.current.position.x = position[0] + move;
        // Smooth rotation for turns
        if (move > routeLength/2 - 0.8 || move < -routeLength/2 + 0.8) {
          carRef.current.rotation.y = Math.sin(time * 3) * 0.05;
        } else {
          carRef.current.rotation.y = 0;
        }
      } else {
        carRef.current.position.z = position[2] + move;
        if (move > routeLength/2 - 0.8 || move < -routeLength/2 + 0.8) {
          carRef.current.rotation.x = Math.sin(time * 3) * 0.03;
        } else {
          carRef.current.rotation.x = 0;
        }
      }
      
      // Gentle suspension bounce
      const bounce = Math.abs(Math.sin(time * 8)) * 0.01;
      carRef.current.position.y = -0.02 + bounce;
    }
  });
  
  return (
    <group ref={carRef} position={position}>
      {/* Car Body */}
      <Box args={[0.45, 0.15, 0.8]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Box>
      {/* Car Top */}
      <Box args={[0.35, 0.12, 0.5]} position={[0, 0.23, -0.05]}>
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </Box>
      {/* Windows */}
      <Box args={[0.28, 0.08, 0.35]} position={[0, 0.28, -0.05]}>
        <meshStandardMaterial color="#1A3A5C" metalness={0.9} roughness={0.1} />
      </Box>
      {/* Wheels */}
      <Sphere args={[0.08, 12, 12]} position={[-0.18, 0.05, 0.28]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </Sphere>
      <Sphere args={[0.08, 12, 12]} position={[0.18, 0.05, 0.28]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </Sphere>
      <Sphere args={[0.08, 12, 12]} position={[-0.18, 0.05, -0.28]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </Sphere>
      <Sphere args={[0.08, 12, 12]} position={[0.18, 0.05, -0.28]}>
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.3} />
      </Sphere>
      {/* Headlights */}
      <Sphere args={[0.05, 8, 8]} position={[0.22, 0.12, 0.42]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[-0.22, 0.12, 0.42]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} />
      </Sphere>
      {/* Taillights */}
      <Sphere args={[0.04, 6, 6]} position={[0.22, 0.1, -0.42]}>
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere args={[0.04, 6, 6]} position={[-0.22, 0.1, -0.42]}>
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
}

// Airport Component
function Airport() {
  const airportRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (airportRef.current) {
      airportRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.01;
    }
  });
  
  return (
    <group ref={airportRef} position={[-4, -0.1, -2]}>
      {/* Runway */}
      <Box args={[3.5, 0.05, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4A5568" metalness={0.6} roughness={0.4} />
      </Box>
      <Box args={[3.3, 0.06, 0.08]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </Box>
      
      {/* Airport Terminal Building */}
      <Box args={[1.2, 0.6, 1.2]} position={[0, 0.35, 0.8]}>
        <meshStandardMaterial color="#A0A8C0" metalness={0.8} roughness={0.2} transparent opacity={0.85} />
      </Box>
      <Box args={[1.1, 0.4, 0.05]} position={[0, 0.55, 1.45]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.9} />
      </Box>
      
      {/* Control Tower */}
      <Cylinder args={[0.2, 0.25, 0.8, 6]} position={[0.6, 0.6, 0.6]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.85} />
      </Cylinder>
      <Sphere args={[0.15, 12, 12]} position={[0.6, 1.0, 0.6]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Small Airplane */}
      <group position={[1.2, 0.15, -0.3]}>
        <Box args={[0.6, 0.1, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#FFFFFF" metalness={0.7} />
        </Box>
        <Box args={[0.3, 0.08, 0.3]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#FFFFFF" metalness={0.7} />
        </Box>
        <Box args={[0.15, 0.05, 0.5]} position={[-0.4, 0.05, 0]}>
          <meshStandardMaterial color="#A0A8C0" metalness={0.8} />
        </Box>
        <Box args={[0.05, 0.2, 0.1]} position={[-0.2, -0.05, 0.15]}>
          <meshStandardMaterial color="#A0A8C0" />
        </Box>
        <Box args={[0.05, 0.2, 0.1]} position={[-0.2, -0.05, -0.15]}>
          <meshStandardMaterial color="#A0A8C0" />
        </Box>
      </group>
    </group>
  );
}

// Office Building
function OfficeBuilding({ position, color, height, width }: { 
  position: [number, number, number]; 
  color: string; 
  height: number;
  width: number;
}) {
  const buildingRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (buildingRef.current && hovered) {
      buildingRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
    }
  });
  
  return (
    <group 
      ref={buildingRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main Building */}
      <Box args={[width, height, width]} position={[0, height / 2, 0]}>
        <meshStandardMaterial 
          color="#0F172A" 
          metalness={0.85} 
          roughness={0.15} 
          emissive={color}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </Box>
      
      {/* Windows Grid */}
      {Array.from({ length: 4 }).map((_, floor) => (
        Array.from({ length: 4 }).map((_, col) => (
          <Box 
            key={`${floor}-${col}`}
            args={[0.12, 0.12, 0.05]}
            position={[
              -width/2 + 0.2 + col * 0.35,
              floor * 0.35 + 0.25,
              width/2 + 0.03
            ]}
          >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.15} />
          </Box>
        ))
      ))}
      
      {/* Building Top */}
      <Box args={[width + 0.1, 0.08, width + 0.1]} position={[0, height, 0]}>
        <meshStandardMaterial color={color} metalness={0.9} />
      </Box>
      
      {/* Antenna */}
      <Cylinder args={[0.05, 0.08, 0.4, 4]} position={[0, height + 0.25, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.95} />
      </Cylinder>
      
      {/* Ground Light */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[width * 0.7, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.2 : 0.08} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Glass Skyscraper
function Skyscraper({ position, color, height, width }: { 
  position: [number, number, number]; 
  color: string; 
  height: number;
  width: number;
}) {
  const buildingRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (buildingRef.current) {
      buildingRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.03;
    }
  });
  
  return (
    <group ref={buildingRef} position={position}>
      {/* Main Tower */}
      <Cylinder args={[width * 0.8, width, height, 12]} position={[0, height / 2, 0]}>
        <meshStandardMaterial 
          color="#1A2A4A" 
          metalness={0.92} 
          roughness={0.08} 
          transparent 
          opacity={0.85}
        />
      </Cylinder>
      
      {/* Glass Panels */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.sin(angle) * width * 0.75;
        const z = Math.cos(angle) * width * 0.75;
        return (
          <Box 
            key={i}
            args={[0.1, height * 0.8, 0.1]}
            position={[x, height * 0.5, z]}
          >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
          </Box>
        );
      })}
      
      {/* Top Crown */}
      <Torus args={[width * 0.85, 0.06, 16, 48]} position={[0, height, 0]}>
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
      </Torus>
      
      {/* Spire */}
      <Cylinder args={[0.06, 0.12, 0.6, 6]} position={[0, height + 0.35, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.98} />
      </Cylinder>
      <Sphere args={[0.08, 12, 12]} position={[0, height + 0.65, 0]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.4} />
      </Sphere>
    </group>
  );
}

// Street Light
function StreetLight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const intensity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
      (lightRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });
  
  return (
    <group position={position}>
      <Cylinder args={[0.06, 0.1, 1.0, 5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#A0A8C0" metalness={0.7} />
      </Cylinder>
      <Box args={[0.25, 0.08, 0.25]} position={[0, 1.02, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.8} />
      </Box>
      <Sphere ref={lightRef} args={[0.07, 8, 8]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.4} />
      </Sphere>
    </group>
  );
}

// Road System
function RoadSystem() {
  return (
    <group>
      {/* Main Roads - Wider roads for better spacing */}
      <Box args={[14, 0.08, 1.8]} position={[0, -0.08, -3]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      <Box args={[1.8, 0.08, 12]} position={[-4, -0.08, 1]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      <Box args={[1.8, 0.08, 12]} position={[4, -0.08, 1]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      <Box args={[10, 0.08, 1.8]} position={[0, -0.08, 5]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      <Box args={[8, 0.08, 1.8]} position={[0, -0.08, -1]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      <Box args={[6, 0.08, 1.8]} position={[0, -0.08, -4.5]}>
        <meshStandardMaterial color="#2D3748" roughness={0.7} />
      </Box>
      
      {/* Road Lines */}
      <Box args={[13.5, 0.1, 0.08]} position={[0, -0.02, -3]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      <Box args={[0.08, 0.1, 11.5]} position={[-4, -0.02, 1]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      <Box args={[0.08, 0.1, 11.5]} position={[4, -0.02, 1]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      <Box args={[9.5, 0.1, 0.08]} position={[0, -0.02, 5]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      <Box args={[7.5, 0.1, 0.08]} position={[0, -0.02, -1]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      <Box args={[5.5, 0.1, 0.08]} position={[0, -0.02, -4.5]}>
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.15} />
      </Box>
      
      {/* Street Lights */}
      {[
        [-5, -3], [-3, -3], [0, -3], [3, -3], [5, -3],
        [-5, 1], [5, 1], [-5, 4], [5, 4], [-5, 6], [5, 6],
        [-4, -2], [-4, 0], [-4, 2], [-4, 4], [-4, 6],
        [4, -2], [4, 0], [4, 2], [4, 4], [4, 6],
        [-2, -4], [2, -4], [0, -4], [-2, -5], [2, -5], [0, -5]
      ].map(([x, z], i) => (
        <StreetLight key={`light-${i}`} position={[x, -0.05, z]} />
      ))}
    </group>
  );
}

// Central Tower
function CentralTower() {
  const towerRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (towerRef.current) {
      towerRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });
  
  return (
    <group ref={towerRef} position={[0, 0, 0]}>
      {/* Base */}
      <Cylinder args={[1.5, 1.8, 0.4, 8]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#1F4381" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Main Core */}
      <Cylinder args={[0.8, 1.0, 2.5, 12]} position={[0, 1.45, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.95} roughness={0.05} emissive="#A57F2A" emissiveIntensity={0.15} />
      </Cylinder>
      
      {/* Crystal Center */}
      <mesh position={[0, 2.8, 0]}>
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial 
          color="#00E0FF" 
          metalness={0.98} 
          roughness={0.02} 
          emissive="#00E0FF" 
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Rotating Rings */}
      {[1.3, 2.0, 2.7].map((y, i) => (
        <Torus 
          key={i}
          args={[1.2 + i * 0.2, 0.05, 32, 96]}
          position={[0, y, 0]}
        >
          <meshStandardMaterial 
            color={i === 0 ? "#E8CA5E" : i === 1 ? "#00E0FF" : "#1F4381"} 
            metalness={0.9} 
            roughness={0.1}
            emissive={i === 1 ? "#00E0FF" : "#E8CA5E"}
            emissiveIntensity={0.2}
          />
        </Torus>
      ))}
      
      {/* Top Spire */}
      <Cylinder args={[0.1, 0.25, 1.0, 8]} position={[0, 3.3, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.98} roughness={0.02} emissive="#E8CA5E" emissiveIntensity={0.2} />
      </Cylinder>
      <Sphere args={[0.12, 16, 16]} position={[0, 3.8, 0]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.5} />
      </Sphere>
      
      {/* Ground Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[2.2, 24]} />
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.15} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Ground Grid
function GroundGrid() {
  return (
    <group>
      <gridHelper args={[20, 40, "#E8CA5E", "#00E0FF"]} position={[0, -0.15, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#0F172A" metalness={0.3} roughness={0.7} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Stars Background
function StarField() {
  const starCount = 1500;
  const positions = useMemo(() => {
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 200;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 100;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50;
    }
    return posArray;
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
      color="#E8CA5E"
      size={0.05}
      transparent
      opacity={0.3}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </points>
);
}

// Floating Particles
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 600;
  
  const positions = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 15;
      posArray[i * 3 + 1] = Math.random() * 5;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return posArray;
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.05;
    }
  });
  
 return (
  <points ref={particlesRef}>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        args={[positions, 3]}
      />
    </bufferGeometry>
    <pointsMaterial
      color="#00E0FF"
      size={0.04}
      transparent
      opacity={0.3}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </points>
);
}

// Main Scene
function FutureCityScene({ products }: { products: Product[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.015) * 0.02;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 8, 6]} intensity={0.8} color="#E8CA5E" />
      <pointLight position={[-4, 6, 5]} intensity={0.6} color="#00E0FF" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#1F4381" />
      <directionalLight position={[5, 8, 4]} intensity={0.7} />
      
      {/* Scene Elements */}
      <GroundGrid />
      <RoadSystem />
      <CentralTower />
      <StarField />
      <FloatingParticles />
      <Airport />
      
      {/* Moving Cars - SLOWER SPEEDS with better spacing */}
      {/* Horizontal Road - Main (y=-3) - Slower speeds */}
      <MovingCar position={[-5, -0.02, -3]} color="#FF4444" direction="x" speed={0.6} delay={0} routeLength={14} />
      <MovingCar position={[-3, -0.02, -3]} color="#4444FF" direction="x" speed={0.7} delay={2} routeLength={14} />
      <MovingCar position={[-1, -0.02, -3]} color="#44FF44" direction="x" speed={0.65} delay={4} routeLength={14} />
      <MovingCar position={[1, -0.02, -3]} color="#FFFF44" direction="x" speed={0.55} delay={6} routeLength={14} />
      <MovingCar position={[3, -0.02, -3]} color="#FF44FF" direction="x" speed={0.7} delay={8} routeLength={14} />
      
      {/* Horizontal Road - Upper (y=5) */}
      <MovingCar position={[-4, -0.02, 5]} color="#44FFFF" direction="x" speed={0.6} delay={1} routeLength={10} />
      <MovingCar position={[0, -0.02, 5]} color="#FF8844" direction="x" speed={0.65} delay={3.5} routeLength={10} />
      <MovingCar position={[3, -0.02, 5]} color="#88FF44" direction="x" speed={0.55} delay={6} routeLength={10} />
      
      {/* Horizontal Road - Middle (y=-1) */}
      <MovingCar position={[-3.5, -0.02, -1]} color="#FF6688" direction="x" speed={0.5} delay={1.5} routeLength={8} />
      <MovingCar position={[0, -0.02, -1]} color="#66FF88" direction="x" speed={0.6} delay={4} routeLength={8} />
      <MovingCar position={[3, -0.02, -1]} color="#FF44AA" direction="x" speed={0.55} delay={6.5} routeLength={8} />
      
      {/* Horizontal Road - Bottom (y=-4.5) */}
      <MovingCar position={[-3, -0.02, -4.5]} color="#44AAFF" direction="x" speed={0.5} delay={0.8} routeLength={6} />
      <MovingCar position={[0, -0.02, -4.5]} color="#FFAA44" direction="x" speed={0.55} delay={3} routeLength={6} />
      <MovingCar position={[2.5, -0.02, -4.5]} color="#AAFF44" direction="x" speed={0.6} delay={5} routeLength={6} />
      
      {/* Vertical Roads - Left (x=-4) */}
      <MovingCar position={[-4, -0.02, -3]} color="#FF4444" direction="z" speed={0.6} delay={0.5} routeLength={10} />
      <MovingCar position={[-4, -0.02, -1]} color="#4444FF" direction="z" speed={0.65} delay={2.5} routeLength={10} />
      <MovingCar position={[-4, -0.02, 1]} color="#44FF44" direction="z" speed={0.55} delay={4.5} routeLength={10} />
      <MovingCar position={[-4, -0.02, 3]} color="#FFFF44" direction="z" speed={0.6} delay={7} routeLength={10} />
      
      {/* Vertical Roads - Right (x=4) */}
      <MovingCar position={[4, -0.02, -2.5]} color="#FF44FF" direction="z" speed={0.55} delay={1} routeLength={10} />
      <MovingCar position={[4, -0.02, -0.5]} color="#44FFFF" direction="z" speed={0.6} delay={3} routeLength={10} />
      <MovingCar position={[4, -0.02, 1.5]} color="#FF8844" direction="z" speed={0.65} delay={5.5} routeLength={10} />
      <MovingCar position={[4, -0.02, 3.5]} color="#88FF44" direction="z" speed={0.55} delay={8} routeLength={10} />
      
      {/* Office Buildings */}
      <OfficeBuilding position={[-2.5, 0, -2.2]} color="#E8CA5E" height={1.6} width={0.7} />
      <OfficeBuilding position={[2.5, 0, -2.2]} color="#00E0FF" height={1.8} width={0.7} />
      <OfficeBuilding position={[-2, 0, 2.5]} color="#1F4381" height={1.5} width={0.65} />
      <OfficeBuilding position={[2, 0, 2.5]} color="#A57F2A" height={1.7} width={0.7} />
      <OfficeBuilding position={[0, 0, -3]} color="#FF6B35" height={2.0} width={0.8} />
      <OfficeBuilding position={[0, 0, 3.5]} color="#50C878" height={1.9} width={0.75} />
      
      {/* Skyscrapers */}
      <Skyscraper position={[-3.2, 0, -1]} color="#E8CA5E" height={2.4} width={0.65} />
      <Skyscraper position={[3.2, 0, -1]} color="#00E0FF" height={2.6} width={0.7} />
      <Skyscraper position={[-2.8, 0, 1.5]} color="#1F4381" height={2.2} width={0.6} />
      <Skyscraper position={[2.8, 0, 1.5]} color="#A57F2A" height={2.5} width={0.68} />
      <Skyscraper position={[-1.5, 0, -3.5]} color="#FF6B35" height={2.3} width={0.62} />
      <Skyscraper position={[1.5, 0, -3.5]} color="#50C878" height={2.7} width={0.72} />
      <Skyscraper position={[-1.2, 0, 4]} color="#E8CA5E" height={2.1} width={0.58} />
      <Skyscraper position={[1.2, 0, 4]} color="#00E0FF" height={2.4} width={0.64} />
      
      {/* Additional Buildings around the city */}
      <OfficeBuilding position={[-4, 0, -1.5]} color="#E8CA5E" height={1.4} width={0.6} />
      <OfficeBuilding position={[4, 0, -1.5]} color="#00E0FF" height={1.5} width={0.6} />
      <OfficeBuilding position={[-3.5, 0, 2.8]} color="#1F4381" height={1.3} width={0.55} />
      <OfficeBuilding position={[3.5, 0, 2.8]} color="#A57F2A" height={1.6} width={0.62} />
    </group>
  );
}

// Main Export
export default function FutureCity3DModel({ products }: FutureCity3DModelProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas 
        camera={{ position: [0, isMobile ? 3 : 4, isMobile ? 10 : 12], fov: isMobile ? 50 : 45 }} 
        style={{ background: '#0B0F19' }} 
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
        dpr={isMobile ? [0.75, 1] : [1, 1.5]}
      >
        <FutureCityScene products={products} />
        <fog attach="fog" args={['#0B0F19', isMobile ? 8 : 10, isMobile ? 18 : 22]} />
      </Canvas>
    </div>
  );
}