import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Cpu, Share2 } from 'lucide-react';
import { WordData } from '../types';

interface DetailsModalProps {
  node: WordData | null;
  onClose: () => void;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ node, onClose }) => {
  return (
    <AnimatePresence>
      {node && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Terminal Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl bg-black border-2 border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.3)] pointer-events-auto overflow-hidden font-mono"
          >
            {/* Terminal Header */}
            <div className="bg-[#001100] border-b border-[#00FF41] p-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00FF41]">
                <Terminal size={16} />
                <span className="text-xs tracking-widest uppercase">ROOT_ACCESS :: {node.region}</span>
              </div>
              <button 
                onClick={onClose}
                className="text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Terminal Content */}
            <div className="p-6 md:p-8 relative">
                {/* Background Scanline for modal */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0 opacity-20"></div>

                <div className="relative z-10 text-[#00FF41]">
                    <div className="flex items-center gap-2 mb-4 opacity-70">
                        <span className="animate-pulse">▶</span>
                        <span className="text-sm">EXECUTING_THOUGHT_PROTOCOL...</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 glitch-text tracking-tighter" style={{ textShadow: '2px 0 #003B00, -2px 0 #003B00' }}>
                        {node.text}
                    </h2>

                    <div className="border-l-2 border-[#00FF41] pl-4 mb-8">
                        <p className="text-lg md:text-xl leading-relaxed text-[#BFFF00] typing-effect">
                            "{node.insight}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-[#008F11] mt-8 border-t border-[#003B00] pt-4">
                        <div className="flex items-center gap-2">
                            <Cpu size={14} />
                            <span>MEMORY_ADDRESS: 0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}</span>
                        </div>
                        <div className="text-right">
                            <span>SYSTEM_STATUS: OPTIMAL</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-[#001100] p-3 border-t border-[#00FF41] flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-1 border border-[#00FF41] text-[#00FF41] text-sm hover:bg-[#00FF41] hover:text-black transition-all uppercase">
                 [ Close ]
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};