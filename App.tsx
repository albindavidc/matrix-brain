import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { TypographyBrain } from './components/TypographyBrain';
import { AsciiRenderer } from './components/AsciiRenderer';
import { DetailsModal } from './components/DetailsModal';
import { WordData } from './types';
import { Terminal, Maximize, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WordData | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden font-mono selection:bg-[#00FF41] selection:text-black">
      
      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 2]} 
        onPointerMissed={() => setSelectedNode(null)}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Lights for ASCII shading */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        <Suspense fallback={null}>
          <group 
            onPointerOver={() => setIsHovering(true)}
            onPointerOut={() => setIsHovering(false)}
          >
            <TypographyBrain 
                isHovered={isHovering || !!selectedNode} 
                onNodeSelect={(n) => {
                    setSelectedNode(n);
                    setIsHovering(true);
                }}
            />
          </group>
          
          <AsciiRenderer 
            invert={true} 
            characters=" .:-+*=%@#" 
            resolution={0.2}
            color="#00FF41"
            bgColor="#000000"
          />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={15}
        />
        <Preload all />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-20">
        <div className="pointer-events-auto">
          <h1 className="text-4xl font-bold text-[#00FF41] tracking-tighter mb-1 glitch-text" style={{ textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
            NEURO_HACKER<span className="animate-pulse">_</span>
          </h1>
          <div className="text-xs text-[#008F11] flex flex-col gap-1 border-l-2 border-[#00FF41] pl-2 mt-2">
            <span>VISUALIZATION: ASCII_TOMOGRAPHY</span>
            <span>RESOLUTION: HIGH_DENSITY</span>
            <span>INTERACTION_MODE: ENABLED</span>
          </div>
        </div>

        <div className="flex gap-4 pointer-events-auto">
          <button 
            onClick={() => setShowIntro(true)}
            className="p-2 border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all"
            aria-label="Help"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-[#001100] border-t border-[#00FF41] p-2 flex justify-between items-center text-[#00FF41] text-xs z-20 pointer-events-none font-mono">
         <div className="flex items-center gap-4">
             <span className="animate-pulse">● SYSTEM_ACTIVE</span>
             <span>RENDER: ASCII_Matrix_FX</span>
         </div>
         <div className="flex items-center gap-2">
             <span>NAVIGATE :: [DRAG_TO_ROTATE] [CLICK_NODES]</span>
             <Maximize size={12} />
         </div>
      </div>

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="max-w-md w-full border border-[#00FF41] bg-black p-8 shadow-[0_0_50px_rgba(0,255,65,0.2)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41]"></div>
            <h2 className="text-2xl font-bold text-[#00FF41] mb-4 flex items-center gap-2">
                <Terminal size={24} />
                INITIALIZE_ASCII_CORE
            </h2>
            <div className="space-y-4 text-[#00CC33] text-sm leading-relaxed mb-8">
              <p>Initializing NeuroHacker v2.0...</p>
              <p>The neural architecture has been digitized into pure ASCII data streams. Observe the transformation of thought into code.</p>
              <ul className="list-disc pl-5 space-y-1 text-[#008F11]">
                <li><strong className="text-[#00FF41]">OBSERVE</strong> the 3D ASCII structure.</li>
                <li><strong className="text-[#00FF41]">INTERACT</strong> with the bright data nodes.</li>
                <li><strong className="text-[#00FF41]">DECRYPT</strong> the hidden wisdom.</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowIntro(false)}
              className="w-full py-3 bg-[#00FF41] text-black font-bold text-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest"
            >
              [ EXECUTE ]
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <DetailsModal 
        node={selectedNode} 
        onClose={() => {
          setSelectedNode(null);
          setIsHovering(false);
        }} 
      />
    </div>
  );
};

export default App;