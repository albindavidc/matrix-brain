import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BRAIN_WORDS } from '../constants';
import { BrainRegion, WordData } from '../types';

// Helper to generate filler particles using the same logic as constants.ts
const generateParticles = (count: number) => {
  const particles = [];
  const regions = [
    BrainRegion.FRONTAL, BrainRegion.FRONTAL, BrainRegion.FRONTAL,
    BrainRegion.TEMPORAL, BrainRegion.TEMPORAL,
    BrainRegion.PARIETAL, BrainRegion.PARIETAL,
    BrainRegion.OCCIPITAL, BrainRegion.OCCIPITAL,
    BrainRegion.CEREBELLUM,
    BrainRegion.BRAIN_STEM
  ];

  const getRegionPosition = (region: BrainRegion, index: number, total: number): [number, number, number] => {
    const isLeft = index % 2 === 0;
    const xHemisphereOffset = isLeft ? -0.5 : 0.5;
    
    let x = 0, y = 0, z = 0;
    const r = () => Math.random();
    const rs = () => Math.random() - 0.5;
  
    switch (region) {
      case BrainRegion.FRONTAL: 
        x = (isLeft ? -1 : 1) * (0.2 + r() * 0.4);
        y = 0.2 + r() * 0.8;
        z = 0.5 + r() * 1.0; 
        break;
      case BrainRegion.PARIETAL: 
        x = (isLeft ? -1 : 1) * (0.3 + r() * 0.4);
        y = 0.6 + r() * 0.6;
        z = -0.5 + rs() * 0.8;
        break;
      case BrainRegion.TEMPORAL: 
        x = (isLeft ? -1 : 1) * (0.7 + r() * 0.4);
        y = -0.5 + r() * 0.6;
        z = 0.2 + rs() * 1.0;
        break;
      case BrainRegion.OCCIPITAL: 
        x = (isLeft ? -1 : 1) * (0.2 + r() * 0.4);
        y = 0.1 + r() * 0.5;
        z = -1.5 + rs() * 0.6;
        break;
      case BrainRegion.CEREBELLUM: 
        x = (isLeft ? -1 : 1) * (0.2 + r() * 0.3);
        y = -1.0 + r() * 0.4;
        z = -1.2 + rs() * 0.5;
        break;
      case BrainRegion.BRAIN_STEM: 
        x = rs() * 0.2;
        y = -1.5 + rs() * 0.6;
        z = -0.2 + rs() * 0.4;
        break;
    }
  
    const vec = new THREE.Vector3(x, y, z);
    if (region !== BrainRegion.BRAIN_STEM) {
        vec.normalize();
        vec.x *= 0.85; 
        vec.y *= 1.1;  
        vec.z *= 1.3;  
    }
  
    if (region !== BrainRegion.BRAIN_STEM) {
      vec.x += xHemisphereOffset;
    }
  
    // Add noise
    const surfaceNoise = 1.0 + (Math.random() - 0.5) * 0.15;
    vec.multiplyScalar(surfaceNoise);
  
    return [vec.x, vec.y, vec.z];
  };

  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    particles.push(getRegionPosition(region, i, count));
  }
  return particles;
};

interface TypographyBrainProps {
  isHovered: boolean;
  onNodeSelect: (node: WordData) => void;
}

export const TypographyBrain: React.FC<TypographyBrainProps> = ({ isHovered, onNodeSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentSpeed = useRef(0.15);

  // Generate structure particles once
  const particles = useMemo(() => generateParticles(1500), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
        // Rotation Logic
        if (isHovered) {
            currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, 0, delta * 2);
        } else {
            currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, 0.2, delta * 1);
        }
        
        groupRef.current.rotation.y += currentSpeed.current * delta;
        // Subtle floating
        groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Structural Particles - These create the ASCII "Body" */}
      {particles.map((pos, i) => (
        <mesh key={i} position={new THREE.Vector3(...pos)}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial 
            color="#004400" 
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Interactive Wisdom Nodes - These are brighter/larger to pop in ASCII */}
      {BRAIN_WORDS.map((node) => (
        <NodeMesh 
          key={node.id} 
          node={node} 
          onSelect={onNodeSelect}
        />
      ))}

      {/* Inner Glow Core */}
      <pointLight position={[0, 0, 0]} intensity={2.0} color="#00FF41" distance={5} />
    </group>
  );
};

const NodeMesh = ({ node, onSelect }: { node: WordData, onSelect: (n: WordData) => void }) => {
    const [hovered, setHovered] = useState(false);
    
    // Animate size/pulse
    useFrame((state) => {
       // Optional: Add pulsing logic here if using ref
    });

    return (
        <mesh 
            position={new THREE.Vector3(...node.position)} 
            onClick={(e) => { e.stopPropagation(); onSelect(node); }}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        >
            <boxGeometry args={hovered ? [0.4, 0.4, 0.4] : [0.25, 0.25, 0.25]} />
            <meshStandardMaterial 
                color={hovered ? "#FFFFFF" : "#00FF41"} 
                emissive={hovered ? "#FFFFFF" : "#00AA22"}
                emissiveIntensity={hovered ? 2 : 1}
            />
        </mesh>
    );
};
