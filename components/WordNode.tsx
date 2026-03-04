import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { WordData } from '../types';

interface WordNodeProps {
  data: WordData;
  onSelect: (node: WordData) => void;
  hoveringGlobal: boolean;
}

export const WordNode: React.FC<WordNodeProps> = ({ data, onSelect, hoveringGlobal }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const originalPos = useRef(new THREE.Vector3(...data.position));
  
  // Calculate which hemisphere this node belongs to for proper rotation
  const isLeft = data.position[0] < 0;
  const hemisphereCenter = new THREE.Vector3(isLeft ? -0.5 : 0.5, 0, 0);

  // Random slight drift offset
  const driftPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate Text
    if (textRef.current) {
      // Make text look away from its hemisphere center (creates rounded surface effect)
      textRef.current.lookAt(hemisphereCenter); 
      // Flip so text is readable from outside
      textRef.current.rotateY(Math.PI); 

      // Gentle drift breathing
      const drift = Math.sin(t + driftPhase.current) * 0.05;
      textRef.current.position.copy(originalPos.current).addScalar(drift);

      // Glitch effect on hover
      if (hovered) {
        textRef.current.position.x += (Math.random() - 0.5) * 0.05;
      }
    }
  });

  const baseColor = data.isHighlight ? '#00FFAA' : '#00FF41';
  const activeColor = '#BFFF00';
  
  // Calculate opacity
  const opacity = hovered ? 1 : (hoveringGlobal ? 0.4 : 0.9);

  return (
    <group>
      {/* Backup Geometry: Visible Node Point */}
      <mesh position={data.position} onClick={(e) => { e.stopPropagation(); onSelect(data); }}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={hovered ? activeColor : baseColor} transparent opacity={0.5} />
      </mesh>

      <Text
        ref={textRef as any}
        position={data.position}
        fontSize={hovered ? 0.35 : 0.22} // Slightly smaller base size for density
        color={hovered ? activeColor : baseColor}
        anchorX="center"
        anchorY="middle"
        onClick={(e) => {
            e.stopPropagation();
            onSelect(data);
        }}
        onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'crosshair';
            setHovered(true);
        }}
        onPointerOut={(e) => {
            document.body.style.cursor = 'default';
            setHovered(false);
        }}
        fillOpacity={opacity}
        outlineWidth={hovered ? 0.005 : 0}
        outlineColor={activeColor}
      >
        {data.text}
      </Text>
    </group>
  );
};