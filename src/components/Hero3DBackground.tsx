// components/Hero3DBackground.tsx
'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Float, Stars, Torus, Cylinder, Box, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Simplified Grand Dome - Reduced polygons
function GrandDome() {
  const domeRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 0.15, // Reduced movement
        y: (e.clientY / window.innerHeight - 0.5) * 0.1,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03; // Slower rotation
      groupRef.current.position.x = mouseRef.current.x * 0.15;
      groupRef.current.position.y = mouseRef.current.y * 0.1;
    }
    if (domeRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.015;
      domeRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base platform - Reduced segments */}
      <Cylinder args={[2.2, 2.5, 0.3, 6]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#1F4381" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Main Dome - Reduced segments from 128 to 48 */}
      <Sphere ref={domeRef} args={[1.6, 48, 48]} position={[0, 0.2, 0]}>
        <MeshDistortMaterial
          color="#E8CA5E"
          emissive="#A57F2A"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.95}
          distort={0.15}
          speed={0.6}
        />
      </Sphere>
      
      {/* Dome top finial */}
      <Cylinder args={[0.15, 0.25, 0.5, 6]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.95} roughness={0.05} />
      </Cylinder>
      <Sphere args={[0.12, 12, 12]} position={[0, 1.95, 0]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.4} />
      </Sphere>
    </group>
  );
}

// Optimized Minarets - Reduced segments
function Minarets() {
  const minaretPositions = [
    { x: -2.8, z: -2.5 },
    { x: 2.8, z: -2.5 },
    { x: -2.5, z: 2.8 },
    { x: 2.5, z: 2.8 },
  ];
  
  return (
    <group>
      {minaretPositions.map((pos, i) => (
        <group key={i} position={[pos.x, -0.5, pos.z]}>
          <Cylinder args={[0.25, 0.35, 1.8, 8]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#A57F2A" metalness={0.6} roughness={0.3} />
          </Cylinder>
          <Torus args={[0.35, 0.06, 8, 24]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#E8CA5E" metalness={0.8} />
          </Torus>
          <Cylinder args={[0.12, 0.25, 0.5, 6]} position={[0, 1.9, 0]}>
            <meshStandardMaterial color="#E8CA5E" metalness={0.85} />
          </Cylinder>
          <group position={[0.12, 2.15, 0]} rotation={[0, 0, 0.3]}>
            <Torus args={[0.08, 0.03, 6, 16]}>
              <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.3} />
            </Torus>
          </group>
        </group>
      ))}
    </group>
  );
}

// Optimized City Walls - Reduced count
function CityWalls() {
  const wallsRef = useRef<THREE.Group>(null);
  const wallCount = 20; // Reduced from 32
  const radius = 3.8;
  
  useFrame(({ clock }) => {
    if (wallsRef.current) {
      wallsRef.current.rotation.y = clock.getElapsedTime() * 0.015;
    }
  });
  
  const walls = useMemo(() => {
    return Array.from({ length: wallCount }).map((_, i) => {
      const angle = (i / wallCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return { x, z, angle };
    });
  }, []);
  
  return (
    <group ref={wallsRef}>
      {walls.map((wall, i) => (
        <Box
          key={i}
          args={[0.4, 1.2, 0.4]}
          position={[wall.x, -0.2, wall.z]}
          rotation={[0, wall.angle, 0]}
        >
          <meshStandardMaterial color="#1F4381" metalness={0.5} roughness={0.5} />
        </Box>
      ))}
      <Torus args={[radius + 0.15, 0.05, 24, wallCount]} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.7} />
      </Torus>
    </group>
  );
}

// Simplified Geometric Rings - Reduced segments
function GeometricRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = clock.getElapsedTime() * -0.06;
    }
  });
  
  return (
    <group>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.4, 0.05, 64, 200]} />
        <meshStandardMaterial color="#E8CA5E" emissive="#A57F2A" emissiveIntensity={0.2} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.03, 64, 200]} />
        <meshStandardMaterial color="#1F4381" emissive="#1F4381" emissiveIntensity={0.1} metalness={0.75} roughness={0.25} />
      </mesh>
    </group>
  );
}

// Optimized Knowledge Particles - Reduced count
function KnowledgeParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 800; // Reduced from 2000
  
  const { positions, colors } = useMemo(() => {
    const positionsArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positionsArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positionsArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
      positionsArray[i * 3 + 2] = radius * Math.cos(phi);
      
      const colorType = Math.random();
      if (colorType < 0.5) {
        colorsArray[i * 3] = 0.91;
        colorsArray[i * 3 + 1] = 0.79;
        colorsArray[i * 3 + 2] = 0.37;
      } else if (colorType < 0.75) {
        colorsArray[i * 3] = 0;
        colorsArray[i * 3 + 1] = 0.88;
        colorsArray[i * 3 + 2] = 1;
      } else {
        colorsArray[i * 3] = 0.12;
        colorsArray[i * 3 + 1] = 0.26;
        colorsArray[i * 3 + 2] = 0.51;
      }
    }
    
    return { positions: positionsArray, colors: colorsArray };
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} args={[positions, 3]}/>
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3}args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} transparent opacity={0.6} vertexColors blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Optimized Floating Manuscripts - Reduced count
function FloatingManuscripts() {
  const manuscriptsRef = useRef<THREE.Group>(null);
  const count = 40; // Reduced from 80
  
  const manuscripts = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 3.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(angle * 4) * 0.3;
      return { x, y, z, angle };
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (manuscriptsRef.current) {
      manuscriptsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });
  
  return (
    <group ref={manuscriptsRef}>
      {manuscripts.map((manu, i) => (
        <group key={i} position={[manu.x, manu.y + 0.5, manu.z]} rotation={[0, manu.angle, 0]}>
          <Box args={[0.25, 0.04, 0.35]}>
            <meshStandardMaterial color="#E8CA5E" metalness={0.4} roughness={0.5} emissive="#A57F2A" emissiveIntensity={0.1} />
          </Box>
        </group>
      ))}
    </group>
  );
}

// Simple Desert Ground
function DesertGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <circleGeometry args={[6, 24]} />
      <meshStandardMaterial color="#0B0F19" metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

// Optimized Palm Trees - Simplified
function PalmTrees() {
  const palmPositions = [
    { x: -4.2, z: -3.5 }, { x: 4.2, z: -3.5 },
    { x: -4, z: 3.8 }, { x: 4, z: 3.8 }
  ];
  
  return (
    <group>
      {palmPositions.map((pos, i) => (
        <group key={i} position={[pos.x, -0.8, pos.z]}>
          <Cylinder args={[0.12, 0.18, 1.2, 5]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#A57F2A" metalness={0.3} roughness={0.7} />
          </Cylinder>
          {[0, 120, 240].map((angle, j) => (
            <group key={j} rotation={[0, (angle * Math.PI) / 180, 0.4]}>
              <Cylinder args={[0.02, 0.08, 0.6, 3]} position={[0.3, 1.1, 0]}>
                <meshStandardMaterial color="#00E0FF" metalness={0.2} roughness={0.8} />
              </Cylinder>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// Responsive Camera Component
function ResponsiveCamera() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        camera.position.set(0, 1.2, 6.5); // Mobile: closer view
      } else if (width < 1024) {
        camera.position.set(0, 1.5, 7.5); // Tablet
      } else {
        camera.position.set(0, 1.5, 8); // Desktop
      }
      camera.lookAt(0, 0, 0);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);
  
  return null;
}

// Optimized Stars - Reduced count for mobile
function OptimizedStars() {
  const { camera } = useThree();
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 640) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);
  
  const starCount = deviceType === 'mobile' ? 800 : deviceType === 'tablet' ? 1500 : 2500;
  
  return (
    <Stars 
      radius={20} 
      depth={50} 
      count={starCount} 
      factor={4} 
      saturation={0.2} 
      fade 
      speed={0.1} 
    />
  );
}

// Main Export with Performance Optimizations
export default function Hero3DBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    // Detect device capabilities
    const checkDevice = () => {
      const mobile = window.innerWidth < 640;
      const lowEnd = !window.matchMedia('(any-pointer: fine)').matches || 
                     navigator.hardwareConcurrency <= 4;
      
      setIsMobile(mobile);
      setIsLowEnd(lowEnd);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 1.2, 6.5], fov: 45 }} 
        style={{ background: '#0B0F19' }} 
        gl={{ 
          antialias: !isLowEnd, 
          alpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false
        }}
        dpr={isMobile ? [0.75, 1] : [1, 1.5]}
      >
        {/* Responsive Camera */}
        <ResponsiveCamera />
        
        {/* Optimized Lighting */}
        <ambientLight intensity={isMobile ? 0.5 : 0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#E8CA5E" />
        <pointLight position={[-4, 3, 4]} intensity={0.4} color="#00E0FF" />
        <directionalLight position={[3, 5, 2]} intensity={0.5} />
        
        {/* Conditional rendering based on device */}
        <DesertGround />
        
        {!isLowEnd && <TigrisRiver />}
        
        <GrandDome />
        <Minarets />
        
        {!isMobile && <CityWalls />}
        
        {!isLowEnd && <GeometricRings />}
        
        <PalmTrees />
        
        {/* Particle systems - reduced on mobile */}
        <KnowledgeParticles />
        
        {!isMobile && <FloatingManuscripts />}
        
        <OptimizedStars />
        
        {/* Atmospheric fog - less on mobile for performance */}
        <fog attach="fog" args={['#0B0F19', isMobile ? 5 : 6, isMobile ? 12 : 16]} />
      </Canvas>
    </div>
  );
}

// Optional: Tigris River component (lazy loaded)
function TigrisRiver() {
  const riverRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (riverRef.current && riverRef.current.material) {
      (riverRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.08 + Math.sin(clock.getElapsedTime() * 0.6) * 0.04;
    }
  });
  
  return (
    <mesh ref={riverRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
      <ringGeometry args={[3.5, 4.5, 24]} />
      <meshStandardMaterial color="#00E0FF" metalness={0.8} roughness={0.3} transparent opacity={0.12} emissive="#00E0FF" emissiveIntensity={0.08} />
    </mesh>
  );
}