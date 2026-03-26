// components/landing/ParticlesBackground.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 15;

    // Colors
    const primaryColor = '#1D4ED8';
    const secondaryColor = '#38BDF8';

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 30;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(secondaryColor),
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Glowing particles
    const glowGeometry = new THREE.BufferGeometry();
    const glowCount = 200;
    const glowPosArray = new Float32Array(glowCount * 3);
    
    for (let i = 0; i < glowCount; i++) {
      glowPosArray[i * 3] = (Math.random() - 0.5) * 25;
      glowPosArray[i * 3 + 1] = (Math.random() - 0.5) * 18;
      glowPosArray[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPosArray, 3));
    
    const glowMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    
    const glowParticles = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(glowParticles);

    // Connecting lines
    const linesGeometry = new THREE.BufferGeometry();
    const lineVertices: number[] = [];
    
    for (let i = 0; i < particlesCount; i++) {
      const x1 = posArray[i * 3];
      const y1 = posArray[i * 3 + 1];
      const z1 = posArray[i * 3 + 2];
      
      for (let j = i + 1; j < particlesCount; j++) {
        const x2 = posArray[j * 3];
        const y2 = posArray[j * 3 + 1];
        const z2 = posArray[j * 3 + 2];
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        
        if (distance < 2) {
          lineVertices.push(x1, y1, z1);
          lineVertices.push(x2, y2, z2);
        }
      }
    }
    
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVertices), 3));
    
    const linesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.15,
    });
    
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Animation
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.005;
      
      particlesMesh.rotation.y = time * 0.1;
      particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
      glowParticles.rotation.y = time * 0.08;
      linesMesh.rotation.y = time * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticlesBackground;