
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Loader2, Zap, Briefcase, Globe, PenTool, Sparkles, BrainCircuit } from 'lucide-react';

interface LoadingProps {
  status: string;
  step: number;
}

const messages = [
  "Initializing deep research engines...",
  "Querying Google Search for market insights...",
  "Model is thinking: synthesizing logical connections...",
  "Architecting the narrative structure...",
  "Applying specific tone & viral hook patterns...",
  "Polishing for high professional impact...",
  "Defining visual asset prompts for each insight..."
];

const Loading: React.FC<LoadingProps> = ({ status }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-12 max-w-lg mx-auto p-6">
      <div className="relative">
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full animate-pulse"></div>
        
        {/* Floating Core */}
        <div className="relative w-40 h-40 flex items-center justify-center bg-white dark:bg-slate-900 border border-blue-500/20 rounded-[3rem] shadow-[0_32px_80px_rgba(37,99,235,0.15)] animate-bounce duration-[3000ms]">
           <Zap className="w-20 h-20 text-blue-600 fill-current drop-shadow-2xl" />
           <div className="absolute -top-3 -right-3">
              <div className="bg-amber-400 p-3 rounded-2xl shadow-xl animate-pulse">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
           </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-all">
          {status}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse h-4">
          {messages[msgIndex]}
        </p>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden shadow-inner">
        <div className="bg-blue-600 h-full w-1/3 animate-[loading_6s_ease-in-out_infinite] shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full pt-4">
         <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-[1.25rem] transition-all ${msgIndex < 2 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
               <Globe className={`w-7 h-7 ${msgIndex < 2 ? 'animate-spin duration-[4000ms]' : ''}`} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Research</span>
         </div>
         <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-[1.25rem] transition-all ${msgIndex >= 2 && msgIndex < 4 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
               <BrainCircuit className={`w-7 h-7 ${msgIndex >= 2 && msgIndex < 4 ? 'animate-pulse' : ''}`} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reasoning</span>
         </div>
         <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-[1.25rem] transition-all ${msgIndex >= 4 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
               <PenTool className={`w-7 h-7 ${msgIndex >= 4 ? 'animate-bounce' : ''}`} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesis</span>
         </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
