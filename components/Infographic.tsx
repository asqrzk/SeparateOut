/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface InfographicProps {
  image: GeneratedImage;
  isEditing?: boolean;
  compact?: boolean;
}

const Infographic: React.FC<InfographicProps> = ({ image, isEditing, compact = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setZoomLevel(1);
  }

  return (
    <div className={`flex flex-col items-center w-full animate-in fade-in zoom-in duration-500 ${compact ? '' : ''}`}>
      
      {/* Image Container */}
      <div className={`relative group w-full bg-slate-100 dark:bg-slate-900 overflow-hidden ${compact ? '' : 'rounded-3xl shadow-xl border border-slate-200 dark:border-white/10'}`}>
        <img 
          src={image.data} 
          alt={image.prompt} 
          onClick={() => setIsFullscreen(true)}
          className="w-full h-auto object-contain bg-checkered relative z-10 cursor-zoom-in"
        />
        
        {/* Hover Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
            className="bg-black/60 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg hover:bg-blue-600 transition-colors border border-white/10"
            title="Fullscreen View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Loading overlay for generation */}
        {isEditing && (
          <div className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl flex items-center gap-3">
               <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
               <span className="text-xs font-bold uppercase tracking-widest">Generating...</span>
             </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
                <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <button onClick={handleZoomOut} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 transition-colors">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={handleResetZoom} className="px-3 text-xs font-bold text-slate-600">
                        {Math.round(zoomLevel * 100)}%
                    </button>
                    <button onClick={handleZoomIn} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 transition-colors">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-3">
                    <a 
                      href={image.data} 
                      download={`fullsize-${image.id}.png`}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors shadow-xl"
                    >
                        <Download className="w-6 h-6" />
                    </a>
                    <button 
                        onClick={handleCloseFullscreen}
                        className="p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-xl"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-8 cursor-grab active:cursor-grabbing">
                <img 
                    src={image.data} 
                    alt={image.prompt}
                    style={{ 
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.2s ease-out'
                    }}
                    className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl origin-center"
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default Infographic;