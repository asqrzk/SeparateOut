
import React, { useRef, useState, useEffect } from 'react';
import { CarouselSlide, UserProfile } from '../types';

interface DraggableOverlayProps {
  slide: CarouselSlide;
  index: number;
  total: number;
  profile: UserProfile | null;
  isEditing: boolean;
  onUpdate: (positions: any) => void;
}

export const DraggableOverlay: React.FC<DraggableOverlayProps> = ({ slide, index, total, profile, isEditing, onUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Store the initial offset between pillar and content
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const textColor = slide.theme === 'dark' ? 'text-white' : 'text-black';
  const subColor = slide.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      // Calculate height percentage relative to container
      // Add a small buffer to height to cover descenders
      const h = (contentRef.current.offsetHeight / containerRef.current.offsetHeight) * 100;
      setContentHeight(h);
    }
  }, [slide.content, slide.positions.content.width]);

  useEffect(() => {
    if (!activeDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      let x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      let y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      const newPositions = { ...slide.positions };
      
      // Update position for the dragged element
      (newPositions as any)[activeDrag] = { ...(newPositions as any)[activeDrag], x, y };
      
      // Group moving logic
      if (activeDrag === 'content') {
         // Move pillar along with content
         // Maintain the initial relative X distance
         newPositions.pillar = { 
             ...newPositions.pillar, 
             y: y, // Align top Y perfectly
             x: x - dragOffset.x // Maintain relative X spacing
         };
      }
      else if (activeDrag === 'pillar') {
         // Move content along with pillar
         newPositions.content = { 
             ...newPositions.content, 
             y: y, // Align top Y perfectly
             x: x + dragOffset.x // Maintain relative X spacing
         };
      }

      onUpdate(newPositions);
    };

    const handleMouseUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDrag, slide.positions, onUpdate, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent, element: string) => {
    if (!isEditing) return;
    e.stopPropagation();
    e.preventDefault();
    setActiveDrag(element);

    // Calculate initial offset between content and pillar
    if (element === 'content') {
        setDragOffset({
            x: slide.positions.content.x - slide.positions.pillar.x,
            y: 0
        });
    } else if (element === 'pillar') {
        setDragOffset({
            x: slide.positions.content.x - slide.positions.pillar.x,
            y: 0
        });
    }
  };

  // Dynamic height for the pillar based on content height
  const pillarHeight = contentHeight > 0 ? contentHeight : slide.positions.pillar.height;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 p-[8%] pointer-events-none ${isEditing ? 'bg-black/20 ring-4 ring-[#32cd32]/50' : ''}`}
      style={{ containerType: 'size' }}
    >
      {/* Content Pillar */}
      {/* Only show if content is present to avoid weird floating line */}
      {slide.content && (
        <div 
            onMouseDown={(e) => handleMouseDown(e, 'pillar')}
            className={`absolute bg-[#32cd32] rounded-full pointer-events-auto transition-transform ${isEditing ? 'cursor-move ring-2 ring-white scale-110' : ''}`}
            style={{
            left: `${slide.positions.pillar.x}%`,
            top: `${slide.positions.pillar.y}%`, // Precisely aligned with text top
            width: '1%',
            height: `${pillarHeight}%`,
            marginTop: '0.2em' // Fine-tune alignment to visually match text cap height
            }}
        />
      )}

      {/* Content */}
      <div 
        ref={contentRef}
        onMouseDown={(e) => handleMouseDown(e, 'content')}
        className={`absolute pointer-events-auto ${textColor} transition-all ${isEditing ? 'cursor-move ring-2 ring-white p-2 bg-black/40 rounded scale-105' : ''}`}
        style={{
          left: `${slide.positions.content.x}%`,
          top: `${slide.positions.content.y}%`,
          width: `${slide.positions.content.width}%`,
          paddingLeft: '1.5em', // Added margin/padding from previous request
          fontSize: '4cqw',
          lineHeight: '1.4',
          fontWeight: 500
        }}
      >
        <p className="whitespace-pre-wrap">{slide.content || (isEditing ? "Add your content here..." : "")}</p>
      </div>

      {/* Branding Footer */}
      <div 
        onMouseDown={(e) => handleMouseDown(e, 'branding')}
        className={`absolute flex items-center gap-[3cqw] pointer-events-auto transition-all ${isEditing ? 'cursor-move ring-2 ring-white p-2 bg-black/40 rounded scale-105' : ''}`}
        style={{
          left: `${slide.positions.branding.x}%`,
          top: `${slide.positions.branding.y}%`,
        }}
      >
        <img src={profile?.profilePic} className="w-[8cqw] h-[8cqw] rounded-full border-2 border-white/20 object-cover" alt="PFP" />
        <div className="flex flex-col justify-center">
          <span className={`font-[700] text-[3.2cqw] leading-none ${textColor}`}>{profile?.username}</span>
          <span className={`text-[2.2cqw] font-[400] ${subColor} mt-[0.5cqw]`}>{index + 1} of {total}</span>
        </div>
      </div>

      {/* Navigation Pill */}
      <div 
        onMouseDown={(e) => handleMouseDown(e, 'navigation')}
        className={`absolute border-2 border-[#32cd32] rounded-full w-[11cqw] h-[7cqw] flex items-center justify-center text-[#32cd32] text-[4cqw] font-bold pointer-events-auto transition-all ${isEditing ? 'cursor-move ring-2 ring-white bg-black/40 scale-105' : ''}`}
        style={{
          left: `${slide.positions.navigation.x}%`,
          top: `${slide.positions.navigation.y}%`,
        }}
      >
        {index === total - 1 ? '✓' : '→'}
      </div>
    </div>
  );
};
