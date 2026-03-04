import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AsciiEffect } from 'three-stdlib';

interface AsciiRendererProps {
  characters?: string;
  invert?: boolean;
  color?: string;
  bgColor?: string;
  resolution?: number;
}

export const AsciiRenderer: React.FC<AsciiRendererProps> = ({
  characters = ' .:-+*=%@#',
  invert = true,
  color = '#00FF41',
  bgColor = '#000000',
  resolution = 0.18,
}) => {
  const { gl, scene, camera, size } = useThree();

  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, { invert });
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    effect.domElement.style.pointerEvents = 'none'; // Allow interactions to pass through
    effect.domElement.style.color = color;
    effect.domElement.style.backgroundColor = bgColor;
    effect.domElement.style.fontFamily = "'Source Code Pro', monospace";
    effect.domElement.style.lineHeight = '0.9'; // Adjust line height for denser block feel
    return effect;
  }, [gl, characters, invert, color, bgColor]);

  useLayoutEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  useEffect(() => {
    // Hide original canvas, append ascii
    gl.domElement.style.opacity = '0';
    if (gl.domElement.parentElement) {
        gl.domElement.parentElement.appendChild(effect.domElement);
    }
    
    return () => {
      gl.domElement.style.opacity = '1';
      if (effect.domElement.parentElement) {
          effect.domElement.parentElement.removeChild(effect.domElement);
      }
    };
  }, [effect, gl.domElement]);

  useFrame(() => {
    effect.render(scene, camera);
  }, 1); // Render priority 1 to override default

  return null;
};
