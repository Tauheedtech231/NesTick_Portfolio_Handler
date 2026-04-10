// components/Hero3DBackground.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars, Torus, Cylinder, Box, MeshDistortMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Grand Dome of Baghdad - The House of Wisdom
function GrandDome() {
  const domeRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group>(null);

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

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      groupRef.current.position.x = mouseRef.current.x * 0.2;
      groupRef.current.position.y = mouseRef.current.y * 0.15;
    }
    if (domeRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
      domeRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base platform */}
      <Cylinder args={[2.2, 2.5, 0.3, 8]} position={[0, -0.8, 0]}>
        <meshStandardMaterial color="#1F4381" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Main Dome */}
      <Sphere ref={domeRef} args={[1.6, 128, 128]} position={[0, 0.2, 0]}>
        <MeshDistortMaterial
          color="#E8CA5E"
          emissive="#A57F2A"
          emissiveIntensity={0.4}
          metalness={0.92}
          roughness={0.08}
          transparent
          opacity={0.95}
          distort={0.2}
          speed={0.8}
        />
      </Sphere>
      
      {/* Dome top finial */}
      <Cylinder args={[0.15, 0.25, 0.5, 8]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.95} roughness={0.05} />
      </Cylinder>
      <Sphere args={[0.12, 16, 16]} position={[0, 1.95, 0]}>
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

// Baghdad Minarets - Traditional Islamic architecture
function Minarets() {
  const minaretPositions = [
    { x: -2.8, z: -2.5, rotation: 0 },
    { x: 2.8, z: -2.5, rotation: 0 },
    { x: -2.5, z: 2.8, rotation: 0 },
    { x: 2.5, z: 2.8, rotation: 0 },
  ];
  
  const minaretsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (minaretsRef.current) {
      minaretsRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });
  
  return (
    <group ref={minaretsRef}>
      {minaretPositions.map((pos, i) => (
        <group key={i} position={[pos.x, -0.5, pos.z]}>
          {/* Minaret body */}
          <Cylinder args={[0.25, 0.35, 1.8, 12]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#A57F2A" metalness={0.6} roughness={0.3} />
          </Cylinder>
          
          {/* Balcony */}
          <Torus args={[0.35, 0.06, 16, 32]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#E8CA5E" metalness={0.8} />
          </Torus>
          
          {/* Top cone */}
          <Cylinder args={[0.12, 0.25, 0.5, 8]} position={[0, 1.9, 0]}>
            <meshStandardMaterial color="#E8CA5E" metalness={0.85} />
          </Cylinder>
          
          {/* Crescent */}
          <group position={[0.12, 2.15, 0]} rotation={[0, 0, 0.3]}>
            <Torus args={[0.08, 0.03, 8, 24]}>
              <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.4} />
            </Torus>
          </group>
        </group>
      ))}
    </group>
  );
}

// City Walls - Defensive walls of Baghdad
function CityWalls() {
  const wallsRef = useRef<THREE.Group>(null);
  const wallCount = 32;
  const radius = 3.8;
  
  useFrame(({ clock }) => {
    if (wallsRef.current) {
      wallsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });
  
  return (
    <group ref={wallsRef}>
      {Array.from({ length: wallCount }).map((_, i) => {
        const angle = (i / wallCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Box
            key={i}
            args={[0.4, 1.2, 0.4]}
            position={[x, -0.2, z]}
            rotation={[0, angle, 0]}
          >
            <meshStandardMaterial color="#1F4381" metalness={0.5} roughness={0.5} />
          </Box>
        );
      })}
      
      {/* Wall top decorative line */}
      <Torus args={[radius + 0.15, 0.05, 32, wallCount * 2]} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#E8CA5E" metalness={0.7} />
      </Torus>
    </group>
  );
}

// Islamic Geometric Patterns - Decorative rings
function GeometricRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const starRingRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = clock.getElapsedTime() * 0.1;
      ring1Ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = clock.getElapsedTime() * -0.08;
      ring2Ref.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.15) * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = clock.getElapsedTime() * 0.06;
      ring3Ref.current.rotation.z = clock.getElapsedTime() * 0.04;
    }
    if (starRingRef.current) {
      starRingRef.current.rotation.y = clock.getElapsedTime() * 0.12;
    }
  });
  
  return (
    <group>
      {/* Inner golden ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.4, 0.05, 128, 400]} />
        <meshStandardMaterial color="#E8CA5E" emissive="#A57F2A" emissiveIntensity={0.3} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* Middle blue accent ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.04, 128, 400]} />
        <meshStandardMaterial color="#00E0FF" emissive="#00E0FF" emissiveIntensity={0.2} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Outer decorative ring with geometric pattern */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.2, 0.03, 128, 500]} />
        <meshStandardMaterial color="#1F4381" emissive="#1F4381" emissiveIntensity={0.15} metalness={0.75} roughness={0.25} />
      </mesh>
      
      {/* Star pattern ring */}
      <mesh ref={starRingRef} position={[0, 0.3, 0]}>
        <ringGeometry args={[2.5, 2.7, 64]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.8} side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Floating Knowledge Particles - Representing manuscripts and scholars
function KnowledgeParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Spherical distribution around the dome
    const radius = 2 + Math.random() * 2.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6;
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Color distribution - Gold, Accent, Primary
    const colorType = Math.random();
    if (colorType < 0.5) {
      colors[i * 3] = 0.91;   // Gold
      colors[i * 3 + 1] = 0.79;
      colors[i * 3 + 2] = 0.37;
    } else if (colorType < 0.75) {
      colors[i * 3] = 0;      // Accent Blue
      colors[i * 3 + 1] = 0.88;
      colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 0.12;   // Primary Blue
      colors[i * 3 + 1] = 0.26;
      colors[i * 3 + 2] = 0.51;
    }
  }
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} transparent opacity={0.7} vertexColors blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Floating Manuscripts - Representing the House of Wisdom books
function FloatingManuscripts() {
  const manuscriptsRef = useRef<THREE.Group>(null);
  const count = 80;
  
  useFrame(({ clock }) => {
    if (manuscriptsRef.current) {
      manuscriptsRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });
  
  return (
    <group ref={manuscriptsRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 3.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 4) * 0.4;
        const rotationY = angle;
        const rotationX = Math.sin(angle * 2) * 0.5;
        
        return (
          <group key={i} position={[x, y + 0.5, z]} rotation={[rotationX, rotationY, 0]}>
            <Box args={[0.25, 0.04, 0.35]}>
              <meshStandardMaterial color="#E8CA5E" metalness={0.4} roughness={0.5} emissive="#A57F2A" emissiveIntensity={0.1} />
            </Box>
            <Box args={[0.23, 0.02, 0.33]} position={[0, 0.03, 0]}>
              <meshStandardMaterial color="#1F4381" metalness={0.3} roughness={0.6} />
            </Box>
          </group>
        );
      })}
    </group>
  );
}

// Desert Ground with sand effect
function DesertGround() {
  const groundRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (groundRef.current) {
      (groundRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.05 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
    }
  });
  
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#0B0F19" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Decorative sand ripples */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <ringGeometry args={[2, 5.5, 64]} />
        <meshStandardMaterial color="#1F4381/20" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Palm Trees - Representing Baghdad's gardens
function PalmTrees() {
  const palmPositions = [
    { x: -4.2, z: -3.5 }, { x: 4.2, z: -3.5 },
    { x: -4, z: 3.8 }, { x: 4, z: 3.8 },
    { x: -4.5, z: 0 }, { x: 4.5, z: 0 }
  ];
  
  useFrame(({ clock }) => {
    // Trees sway gently
  });
  
  return (
    <group>
      {palmPositions.map((pos, i) => (
        <group key={i} position={[pos.x, -0.8, pos.z]}>
          <Cylinder args={[0.12, 0.18, 1.2, 6]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#A57F2A" metalness={0.3} roughness={0.7} />
          </Cylinder>
          {/* Palm fronds */}
          {[0, 72, 144, 216, 288].map((angle, j) => (
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

// Tigris River reflection effect
function TigrisRiver() {
  const riverRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (riverRef.current) {
      (riverRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
    }
  });
  
  return (
    <mesh ref={riverRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
      <ringGeometry args={[3.5, 4.5, 32]} />
      <meshStandardMaterial color="#00E0FF" metalness={0.9} roughness={0.2} transparent opacity={0.15} emissive="#00E0FF" emissiveIntensity={0.1} />
    </mesh>
  );
}

// Decorative Stars with glow
function GlowingStars() {
  const starsRef = useRef<THREE.Points>(null);
  const starCount = 1200;
  
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25 + 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
  }
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={starCount} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#E8CA5E" size={0.04} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Main Export
export default function Hero3DBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas 
        camera={{ position: [0, 1.5, 8], fov: 50 }} 
        style={{ background: '#0B0F19' }} 
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        {/* Ambient and directional lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#E8CA5E" />
        <pointLight position={[-4, 3, 4]} intensity={0.6} color="#00E0FF" />
        <pointLight position={[0, 4, 0]} intensity={0.5} color="#1F4381" />
        <directionalLight position={[3, 5, 2]} intensity={0.7} />
        
        {/* Main Baghdad Elements */}
        <DesertGround />
        <TigrisRiver />
        <GrandDome />
        <Minarets />
        <CityWalls />
        <GeometricRings />
        <PalmTrees />
        
        {/* Particle Systems */}
        <KnowledgeParticles />
        <FloatingManuscripts />
        <GlowingStars />
        
        {/* Background Stars */}
        <Stars 
          radius={25} 
          depth={70} 
          count={2500} 
          factor={6} 
          saturation={0.2} 
          fade 
          speed={0.2} 
        />
        
        {/* Atmospheric fog */}
        <fog attach="fog" args={['#0B0F19', 6, 16]} />
      </Canvas>
    </div>
  );
}