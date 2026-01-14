
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Play, Globe, Zap, Network } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); 
  // 0: Initializing
  // 1: Researching
  // 2: Synthesis
  // 3: Ready

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 800);
    const timer2 = setTimeout(() => setPhase(2), 2500);
    const timer3 = setTimeout(() => setPhase(3), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-display">
      <style>{`
        @keyframes network-pulse {
          0% { transform: scale(0.8); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(0.8); opacity: 0.2; }
        }
        @keyframes line-draw {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black"></div>
      
      {/* Dynamic Network Visualizer */}
      <div className={`relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center transition-all duration-1000 ${phase >= 2 ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}`}>
        <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border border-blue-400/5 rounded-full scale-125 animate-[spin_20s_linear_infinite]"></div>
        
        {/* Core Icon */}
        <div className={`z-10 bg-blue-600 p-6 rounded-3xl shadow-2xl shadow-blue-500/20 transition-all duration-700 ${phase >= 1 ? 'rotate-0 scale-100' : 'rotate-45 scale-75'}`}>
          <Zap className="w-12 h-12 text-white fill-current" />
        </div>

        {/* Orbiting Points */}
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)] transition-all duration-1000"
            style={{ 
              transform: `rotate(${deg + (phase * 30)}deg) translate(${phase >= 2 ? '140px' : '0px'})`,
              opacity: phase >= 2 ? 1 : 0
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className={`absolute bottom-24 flex flex-col items-center transition-all duration-1000 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tighter text-center">
          SeparateOut <span className="text-blue-500">AI</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8 uppercase tracking-[0.4em] font-bold">Research. Write. Visualize.</p>
        
        <button 
          onClick={onComplete}
          className="group relative px-10 py-4 bg-white text-slate-950 font-bold rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-xl shadow-blue-500/10"
        >
          <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative group-hover:text-white flex items-center gap-2">
            START CREATING <Play className="w-4 h-4 fill-current" />
          </span>
        </button>
      </div>

      <div className="absolute bottom-8 flex items-center gap-2 text-slate-600 text-[10px] font-bold tracking-[0.2em]">
        <Globe className="w-3 h-3" />
        POWERED BY GEMINI 3 & GOOGLE SEARCH
      </div>
    </div>
  );
};

export default IntroScreen;
