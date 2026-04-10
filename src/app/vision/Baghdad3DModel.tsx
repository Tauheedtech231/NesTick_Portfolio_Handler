// components/vision/Baghdad3DModel.tsx
'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 🔸 Buildings Ring - Representing ancient Baghdad structures
function Buildings() {
  const groupRef = useRef<THREE.Group>(null!);

  const buildings = useMemo(() => {
    const arr = [];
    const count = 120;
    const radius = 7;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isPalace = Math.random() > 0.85;
      
      arr.push({
        position: [
          Math.cos(angle) * radius,
          Math.random() * 1.5,
          Math.sin(angle) * radius,
        ],
        height: isPalace ? Math.random() * 4 + 2.5 : Math.random() * 2 + 0.8,
        color: isPalace ? "#E8CA5E" : "#1F4381",
      });
    }

    return arr;
  }, []);

  useFrame(() => {
    groupRef.current.rotation.y += 0.0008;
  });

  return (
    <group ref={groupRef}>
      {buildings.map((b, i) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <mesh key={i} position={b.position as any}>
          <boxGeometry args={[0.5, b.height, 0.5]} />
          <meshStandardMaterial color={b.color} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// 🔸 Outer Walls - Defensive walls of Baghdad
function OuterWalls() {
  const wallRef = useRef<THREE.Group>(null!);
  
  const walls = useMemo(() => {
    const arr = [];
    const count = 60;
    const radius = 9.5;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      arr.push({
        position: [
          Math.cos(angle) * radius,
          0.5,
          Math.sin(angle) * radius,
        ],
        rotation: angle,
      });
    }
    
    return arr;
  }, []);
  
  useFrame(() => {
    wallRef.current.rotation.y += 0.0003;
  });
  
  return (
    <group ref={wallRef}>
      {walls.map((w, i) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <mesh key={i} position={w.position as any} rotation={[0, w.rotation, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.8]} />
          <meshStandardMaterial color="#A57F2A" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// 🔸 Circular Rings - Ornamental rings inspired by Islamic architecture
function Rings() {
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });
  
  return (
    <>
      {/* Inner Ring */}
      <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
        <ringGeometry args={[3.2, 3.5, 128]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} emissive="#A57F2A" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Middle Ring - Angled */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]} position={[0, 0.8, 0]}>
        <ringGeometry args={[4.5, 4.8, 128]} />
        <meshStandardMaterial color="#00E0FF" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} emissive="#00E0FF" emissiveIntensity={0.15} />
      </mesh>
      
      {/* Outer Ring */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <ringGeometry args={[6, 6.3, 128]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Decorative Torus Rings */}
      <mesh position={[0, 1.5, 0]}>
        <torusGeometry args={[2.8, 0.05, 64, 200]} />
        <meshStandardMaterial color="#00E0FF" metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[0, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.04, 64, 200]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
}

// 🔸 Center Dome - The House of Wisdom
function CenterPiece() {
  const domeRef = useRef<THREE.Mesh>(null!);
  const topRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (domeRef.current) {
      domeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
    if (topRef.current) {
      topRef.current.position.y = 1.8 + Math.sin(clock.getElapsedTime() * 2) * 0.03;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.6, 8]} />
        <meshStandardMaterial color="#1F4381" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Main Dome */}
      <mesh ref={domeRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.85} roughness={0.15} emissive="#A57F2A" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Decorative band */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[1.4, 0.06, 32, 100]} />
        <meshStandardMaterial color="#00E0FF" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Top finial */}
      <mesh ref={topRef} position={[0, 2.0, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshStandardMaterial color="#E8CA5E" metalness={0.95} roughness={0.05} />
      </mesh>
      
      {/* Floating particles around dome */}
      <FloatingScholars />
    </group>
  );
}

// 🔸 Floating Scholars/Manuscripts - Representing knowledge
function FloatingScholars() {
  const particlesRef = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 3;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height + 1.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Colors: Gold and Blue mix
      const isGold = Math.random() > 0.6;
      colors[i * 3] = isGold ? 0.91 : 0;
      colors[i * 3 + 1] = isGold ? 0.79 : 0.88;
      colors[i * 3 + 2] = isGold ? 0.37 : 1;
    }
    
    return { positions, colors };
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
<points ref={particlesRef}>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      args={[particles.positions, 3]}
    />
    <bufferAttribute
      attach="attributes-color"
      args={[particles.colors, 3]}
    />
  </bufferGeometry>

  <pointsMaterial
    size={0.06}
    vertexColors
    transparent
    opacity={0.7}
    blending={THREE.AdditiveBlending}
  />
</points>
  );
}

// 🔸 Ground Grid - Representing the Tigris River
function GroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null!);
  
  return (
    <>
      <gridHelper ref={gridRef} args={[20, 30, "#E8CA5E", "#1F4381"]} position={[0, -1, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#0B0F19" metalness={0.2} roughness={0.8} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

// 🔸 Minarets - Tall decorative towers
function Minarets() {
  const minaretPositions = [
    { x: -3.5, z: -2.5, angle: -45 },
    { x: 3.5, z: -2.5, angle: 45 },
    { x: -3.2, z: 3.2, angle: -135 },
    { x: 3.2, z: 3.2, angle: 135 },
  ];
  
  const minaretRef = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    if (minaretRef.current) {
      minaretRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });
  
  return (
    <group ref={minaretRef}>
      {minaretPositions.map((pos, i) => (
        <group key={i} position={[pos.x, 0, pos.z]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 2.4, 8]} />
            <meshStandardMaterial color="#A57F2A" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#E8CA5E" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Balcony */}
          <mesh position={[0, 1.5, 0]}>
            <torusGeometry args={[0.35, 0.05, 16, 32]} />
            <meshStandardMaterial color="#1F4381" metalness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 🔸 Stars Background
function StarField() {
  const starsRef = useRef<THREE.Points>(null!);
  
  const stars = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
    }
    
    return positions;
  }, []);
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });
  
  return (
   <points ref={starsRef}>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      args={[stars, 3]}
    />
  </bufferGeometry>

  <pointsMaterial
    size={0.08}
    color="#E8CA5E"
    transparent
    opacity={0.6}
    blending={THREE.AdditiveBlending}
  />
</points>
  );
}

// 🔥 Main Component
export default function Baghdad3DModel() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 5, 14], fov: 50 }} style={{ background: '#0B0F19' }}>
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 5]} intensity={1.2} color="#E8CA5E" />
        <pointLight position={[-5, 3, 5]} intensity={0.6} color="#00E0FF" />
        <pointLight position={[5, 2, 4]} intensity={0.5} color="#1F4381" />
        <pointLight position={[0, 4, 0]} intensity={0.8} color="#E8CA5E" />

        {/* Scene Elements */}
        <StarField />
        <GroundGrid />
        <OuterWalls />
        <Buildings />
        <Minarets />
        <Rings />
        <CenterPiece />

        {/* Optional: Auto-rotate camera for better view */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.8}
          target={[0, 1.5, 0]}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
}