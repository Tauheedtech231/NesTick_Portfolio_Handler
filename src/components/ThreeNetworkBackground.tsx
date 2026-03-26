// components/ThreeNetworkBackground.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeNetworkBackground = () => {
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

    // Camera position
    camera.position.z = 15;

    // Colors
    const primaryColor = '#1D4ED8';
    const secondaryColor = '#38BDF8';
    const accentColor = '#F87171';

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 30;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Particle material with gradient
    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(secondaryColor),
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create glowing particles (larger)
    const glowParticlesGeometry = new THREE.BufferGeometry();
    const glowCount = 150;
    const glowPosArray = new Float32Array(glowCount * 3);
    
    for (let i = 0; i < glowCount; i++) {
      glowPosArray[i * 3] = (Math.random() - 0.5) * 25;
      glowPosArray[i * 3 + 1] = (Math.random() - 0.5) * 18;
      glowPosArray[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    
    glowParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(glowPosArray, 3));
    
    const glowMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    
    const glowParticles = new THREE.Points(glowParticlesGeometry, glowMaterial);
    scene.add(glowParticles);

    // Create connecting lines between nearby particles
    const linesGeometry = new THREE.BufferGeometry();
    const lineVertices: number[] = [];
    
    // Find connections between particles within distance
    const positions = posArray;
    for (let i = 0; i < particlesCount; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];
      
      for (let j = i + 1; j < particlesCount; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) + 
          Math.pow(y2 - y1, 2) + 
          Math.pow(z2 - z1, 2)
        );
        
        if (distance < 2.5) {
          lineVertices.push(x1, y1, z1);
          lineVertices.push(x2, y2, z2);
        }
      }
    }
    
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVertices), 3));
    
    const linesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.2,
    });
    
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Create central glow sphere
    const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(primaryColor),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });
    const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(centerSphere);

    // Add a few floating orbs
    const orbCount = 8;
    const orbs: THREE.Mesh[] = [];
    for (let i = 0; i < orbCount; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(i % 2 === 0 ? primaryColor : secondaryColor),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.userData = {
        speedX: (Math.random() - 0.5) * 0.005,
        speedY: (Math.random() - 0.5) * 0.005,
        speedZ: (Math.random() - 0.5) * 0.005,
        radius: Math.random() * 4 + 2,
        angleX: Math.random() * Math.PI * 2,
        angleY: Math.random() * Math.PI * 2,
      };
      scene.add(orb);
      orbs.push(orb);
    }

    // Animation variables
    let time = 0;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.005;
      
      // Rotate particles slowly
      particlesMesh.rotation.y = time * 0.1;
      particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
      glowParticles.rotation.y = time * 0.08;
      linesMesh.rotation.y = time * 0.1;
      linesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Animate orbs
      orbs.forEach((orb, idx) => {
        const data = orb.userData;
        orb.position.x = Math.sin(time * 0.8 + idx) * data.radius;
        orb.position.y = Math.cos(time * 0.6 + idx) * data.radius * 0.8;
        orb.position.z = Math.sin(time * 0.5 + idx) * data.radius * 0.6;
      });
      
      // Pulse central sphere
      const scale = 1 + Math.sin(time * 3) * 0.1;
      centerSphere.scale.set(scale, scale, scale);
      
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
    
    // Cleanup
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

export default ThreeNetworkBackground;