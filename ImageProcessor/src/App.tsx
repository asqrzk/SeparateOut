
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, CarouselSlide, ElementPosition } from './types';
import * as gemini from './services/geminiService';
import { DraggableOverlay } from './components/DraggableOverlay';
import { ProfileEditor } from './components/ProfileEditor';
import { Sidebar } from './components/Sidebar';
import { downloadSlide, downloadAllAsPdf } from './utils/canvasUtils';

const DEFAULT_POSITIONS = {
  content: { x: 14, y: 35, width: 75 },
  pillar: { x: 10, y: 35, height: 25 },
  branding: { x: 8, y: 88 },
  navigation: { x: 85, y: 88 }
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [article, setArticle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('linked_in_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setIsSettingUp(true);
    }
  }, []);

  const saveProfile = (p: UserProfile) => {
    setProfile(p);
    localStorage.setItem('linked_in_profile', JSON.stringify(p));
    setIsSettingUp(false);
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentArticle = article; 

    // Process files sequentially to avoid state thrashing if we were updating one by one, 
    // but here we just append. We'll map them to promises.
    const fileProcessingPromises = Array.from(files).map(async (file) => {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });

      const id = crypto.randomUUID();
      const placeholderSlide: CarouselSlide = {
        id,
        sourceImage: base64,
        content: '', // Start empty
        status: 'analyzing',
        theme: 'dark',
        positions: { ...DEFAULT_POSITIONS }
      };
      
      // Add immediately so user sees loading state
      setSlides(prev => [...prev, placeholderSlide]);

      try {
        const result = await gemini.analyzeImage(base64, currentArticle, file.name);
        
        // Calculate Y position based on recommendation
        let contentY = 35;
        if (result.contentPosition === 'top') contentY = 15;
        if (result.contentPosition === 'center') contentY = 35;
        if (result.contentPosition === 'bottom') contentY = 65;

        setSlides(prev => prev.map(s => s.id === id ? { 
            ...s, 
            theme: result.theme, 
            content: result.content,
            status: 'idle',
            positions: {
                ...s.positions,
                content: { ...s.positions.content, y: contentY },
                pillar: { ...s.positions.pillar, y: contentY }
            }
        } : s));
      } catch (err) {
        setSlides(prev => prev.map(s => s.id === id ? { ...s, status: 'idle' } : s));
      }
    });

    await Promise.all(fileProcessingPromises);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateSlide = (id: string, updates: Partial<CarouselSlide>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSlide = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
          setSlides(prev => {
              const newSlides = [...prev];
              [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
              return newSlides;
          });
      } else if (direction === 'down' && index < slides.length - 1) {
          setSlides(prev => {
              const newSlides = [...prev];
              [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
              return newSlides;
          });
      }
  };

  const handleDownloadSlide = (slide: CarouselSlide, index: number) => {
    downloadSlide(slide, index, slides.length, profile);
  };

  const handleDownloadPdf = () => {
    downloadAllAsPdf(slides, profile);
  };

  if (isSettingUp) return <ProfileEditor onSave={saveProfile} initial={profile} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar 
        slides={slides}
        article={article}
        setArticle={setArticle}
        editingId={editingId}
        setEditingId={setEditingId}
        updateSlide={updateSlide}
        removeSlide={removeSlide}
        moveSlide={moveSlide}
        onAddImages={() => fileInputRef.current?.click()}
        onDownloadSlide={handleDownloadSlide}
        onDownloadPdf={handleDownloadPdf}
        profilePic={profile?.profilePic}
        onEditProfile={() => setIsSettingUp(true)}
      />
      
      <input ref={fileInputRef} type="file" multiple hidden accept="image/*" onChange={handleFiles} />

      {/* Main Preview Area */}
      <main className="flex-1 bg-[#0a0a0a] overflow-y-auto custom-scrollbar p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 max-w-6xl mx-auto pb-12">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-[#32cd32] uppercase tracking-widest">
                  Preview {idx + 1} {slide.status === 'analyzing' && ' (AI Analyzing...)'}
                </span>
              </div>
              
              <div className="aspect-square bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative select-none">
                <img src={slide.sourceImage} className="w-full h-full object-cover" alt="Base" />
                
                {/* Only show overlay if analysis is done (idle) or if there was an error (so user can manually edit) */}
                {slide.status !== 'analyzing' && (
                    <DraggableOverlay 
                    slide={slide} 
                    index={idx} 
                    total={slides.length} 
                    profile={profile}
                    isEditing={editingId === slide.id}
                    onUpdate={(positions) => updateSlide(slide.id, { positions })}
                    />
                )}
                
                {slide.status === 'analyzing' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#32cd32]"></div>
                     </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
