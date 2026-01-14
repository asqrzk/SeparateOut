
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';
import { PostPoint } from '../types';
import { 
  ChevronLeft, ChevronRight, ThumbsUp, MessageSquare, Repeat, Send, MoreHorizontal, Globe, Download, Images
} from 'lucide-react';
import Infographic from './Infographic';

/* --- STYLES (Ported from the HTML file) --- */
const Styles = () => (
  <style>{`
    :root {
      --li-blue: #0a66c2;
      --li-blue-hover: #004182;
      --li-bg: #f3f2ef;
      --li-white: #ffffff;
      --li-text-primary: rgba(0, 0, 0, 0.9);
      --li-text-secondary: rgba(0, 0, 0, 0.6);
      --li-border: #e0e0e0;
      --li-divider: #e9e5df;
      --li-icon: #666666;
      --li-icon-hover-bg: #f2f2f2;
      --slide-aspect-ratio: 1/1; 
    }
    
    .li-font { font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif; }

    /* Custom Scrollbar hiding */
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

interface CarouselProps {
  points: PostPoint[];
  caption?: string;
  onEditImage: (pointId: string, instruction: string) => void;
}

const Carousel: React.FC<CarouselProps> = ({ points, caption, onEditImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* --- ACTIONS --- */
  const scrollCarousel = (direction: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: direction * width, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollRef.current.scrollLeft / width);
      setActiveIndex(Math.min(Math.max(index, 0), points.length - 1));
    }
  };

  // Simple Markdown Renderer for Bold text
  const renderCaption = (text: string) => {
    if (!text) return null;
    
    // Split by bold markers (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleDownloadAll = () => {
    points.forEach((point, index) => {
      if (point.imageUrl) {
        const link = document.createElement('a');
        link.href = point.imageUrl;
        link.download = `slide-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Small delay to allow multiple downloads
        setTimeout(() => {}, 100); 
      }
    });
  };

  return (
    <div className="flex flex-col items-center li-font w-full">
      <Styles />

      {/* --- LINKEDIN CARD COMPONENT --- */}
      <div className="bg-white dark:bg-slate-900 w-full rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_2px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col border border-slate-200 dark:border-white/10">
        
        {/* Header */}
        <div className="p-3 pb-0 flex items-start mb-2">
          <div className="w-12 h-12 rounded-full mr-3 bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600">
             SO
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="font-semibold text-[14px] text-[--li-text-primary] dark:text-slate-100 mr-1.5 cursor-pointer hover:text-[--li-blue] hover:underline">SeparateOut User</span>
              <span className="text-[--li-text-secondary] dark:text-slate-400 text-[14px]">• 1st</span>
            </div>
            <div className="text-[12px] text-[--li-text-secondary] dark:text-slate-400 leading-[1.33]">Content Creator | Thought Leader</div>
            <div className="flex items-center text-[12px] text-[--li-text-secondary] dark:text-slate-400 mt-0.5">
              <span>Just now • </span>
              <Globe className="w-3 h-3 ml-1" />
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-[--li-icon-hover-bg] text-[--li-icon] dark:text-slate-400">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Caption (Full Text with Markdown) */}
        <div className="px-4 pb-2 text-[14px] text-[--li-text-primary] dark:text-slate-200 leading-[1.5] whitespace-pre-wrap">
          {renderCaption(caption || "Check out this carousel...")}
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full bg-[#eef3f8] dark:bg-black group">
          {/* Navigation Buttons (Desktop) */}
          <button 
            onClick={() => scrollCarousel(-1)}
            disabled={activeIndex === 0}
            className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/10 rounded-full items-center justify-center shadow-md z-30 transition-opacity duration-200 ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          <button 
            onClick={() => scrollCarousel(1)}
            disabled={activeIndex === points.length - 1}
            className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/10 rounded-full items-center justify-center shadow-md z-30 transition-opacity duration-200 ${activeIndex === points.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Slides Track */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar aspect-square"
          >
            {points.map((point, idx) => (
              <div key={point.id} className="flex-none w-full h-full snap-start relative bg-white dark:bg-slate-900 border-b border-[--li-divider] overflow-hidden">
                <Infographic 
                  image={{ id: point.id, data: point.imageUrl, prompt: point.suggestedPrompt || '' }} 
                  onEdit={(instr) => onEditImage(point.id, instr)}
                  isEditing={point.isGenerating || false}
                  compact
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Strip */}
        <div className="bg-[#f3f2ef] dark:bg-slate-800/50 px-4 py-2.5 flex justify-between items-center border-t border-[--li-border] dark:border-white/5 text-[12px] text-[--li-text-secondary] dark:text-slate-400">
          <div className="font-medium text-[--li-text-primary] dark:text-slate-200 truncate max-w-[50%]">
            {points[0]?.title || "Carousel Document"}
          </div>
          <div className="flex items-center gap-3">
             <span>{activeIndex + 1} of {points.length}</span>
             <button 
                onClick={handleDownloadAll}
                className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                title="Download All Slides"
             >
               <Download className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">Download</span>
             </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-2 flex justify-between items-center border-b border-[--li-border] dark:border-white/5">
           <div className="flex items-center text-[12px] text-[--li-text-secondary] dark:text-slate-400 hover:text-[--li-blue] hover:underline cursor-pointer">
              <div className="flex -space-x-1 mr-1">
                <div className="w-4 h-4 rounded-full bg-[#1485bd] flex items-center justify-center ring-1 ring-white dark:ring-slate-900 z-20">
                  <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <div className="w-4 h-4 rounded-full bg-[#d11124] flex items-center justify-center ring-1 ring-white dark:ring-slate-900 z-10">
                  <span className="text-[8px] text-white">❤️</span>
                </div>
                <div className="w-4 h-4 rounded-full bg-[#f5bb5c] flex items-center justify-center ring-1 ring-white dark:ring-slate-900 z-0">
                  <span className="text-[8px] text-white">👏</span>
                </div>
              </div>
              1,245
           </div>
           <div className="text-[12px] text-[--li-text-secondary] dark:text-slate-400 hover:text-[--li-blue] hover:underline cursor-pointer">
             88 comments • 24 reposts
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between px-2 py-1 bg-white dark:bg-slate-900">
          <ActionButton icon={ThumbsUp} label="Like" />
          <ActionButton icon={MessageSquare} label="Comment" />
          <ActionButton icon={Repeat} label="Repost" />
          <ActionButton icon={Send} label="Send" />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="flex-1 flex flex-row items-center justify-center py-3 rounded hover:bg-[--li-icon-hover-bg] dark:hover:bg-slate-800 text-[--li-icon] dark:text-slate-400 font-semibold text-[14px] transition-colors gap-2">
    <Icon className="w-5 h-5" strokeWidth={2} />
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-[12px]">{label}</span>
  </button>
);

export default Carousel;
