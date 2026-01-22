
import React, { useRef } from 'react';
import { CarouselSlide } from '../types';

interface SidebarProps {
  slides: CarouselSlide[];
  article: string;
  setArticle: (val: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateSlide: (id: string, updates: Partial<CarouselSlide>) => void;
  removeSlide: (id: string) => void;
  moveSlide: (index: number, direction: 'up' | 'down') => void;
  onAddImages: () => void;
  onDownloadSlide: (slide: CarouselSlide, index: number) => void;
  onDownloadPdf: () => void;
  profilePic?: string;
  onEditProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  slides,
  article,
  setArticle,
  editingId,
  setEditingId,
  updateSlide,
  removeSlide,
  moveSlide,
  onAddImages,
  onDownloadSlide,
  onDownloadPdf,
  profilePic,
  onEditProfile
}) => {
  return (
    <div className="w-full md:w-96 p-6 border-b md:border-b-0 md:border-r border-gray-800 bg-[#111] overflow-y-auto custom-scrollbar flex flex-col">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#32cd32] rounded-lg flex items-center justify-center text-black font-black text-lg">L</div>
          <h1 className="text-xl font-bold tracking-tight">Carousel <span className="text-[#32cd32]">Master</span></h1>
        </div>
        <button onClick={onEditProfile} className="hover:opacity-80 transition-opacity">
          <img src={profilePic} className="w-8 h-8 rounded-full border border-gray-700" alt="profile" />
        </button>
      </header>

      <div className="space-y-6 flex-1">
        <section>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Global Context</label>
          <textarea 
            value={article} 
            onChange={(e) => setArticle(e.target.value)}
            placeholder="Article context..."
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 focus:border-[#32cd32] outline-none text-white h-24 resize-none text-sm"
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Slides ({slides.length})</label>
            <div className="flex gap-2">
                {slides.length > 0 && (
                    <button onClick={onDownloadPdf} className="text-[#32cd32] text-xs font-bold hover:underline">PDF Export</button>
                )}
                <span className="text-gray-700">|</span>
                <button onClick={onAddImages} className="text-[#32cd32] text-xs font-bold hover:underline">+ Add Images</button>
            </div>
          </div>
          
          <div className="space-y-4">
            {slides.map((slide, idx) => (
              <div key={slide.id} className={`p-4 rounded-xl border transition-all ${editingId === slide.id ? 'border-[#32cd32] bg-[#32cd32]/5' : 'border-gray-800 bg-[#151515]'}`}>
                <div className="flex gap-3 mb-3">
                  <div className="flex flex-col gap-1 justify-center">
                    <button 
                        onClick={() => moveSlide(idx, 'up')} 
                        disabled={idx === 0}
                        className="text-gray-600 hover:text-white disabled:opacity-30 disabled:hover:text-gray-600"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button 
                        onClick={() => moveSlide(idx, 'down')} 
                        disabled={idx === slides.length - 1}
                        className="text-gray-600 hover:text-white disabled:opacity-30 disabled:hover:text-gray-600"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  <img src={slide.sourceImage} className="w-12 h-12 rounded object-cover border border-gray-700" alt="thumb" />
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Slide {idx + 1}</p>
                    <div className="flex gap-2 mt-1">
                      <button 
                        onClick={() => setEditingId(editingId === slide.id ? null : slide.id)}
                        className={`text-[10px] px-2 py-1 rounded border ${editingId === slide.id ? 'bg-[#32cd32] text-black border-[#32cd32]' : 'text-[#32cd32] border-[#32cd32]/40'}`}
                      >
                        {editingId === slide.id ? 'FINISH EDIT' : 'DRAG ELEMENTS'}
                      </button>
                      <button onClick={() => removeSlide(slide.id)} className="text-gray-600 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                </div>
                <textarea 
                  value={slide.content}
                  onChange={(e) => updateSlide(slide.id, { content: e.target.value })}
                  placeholder="Bullet points..."
                  className="w-full bg-black border border-gray-800 rounded-lg p-2 text-xs text-gray-300 h-20 resize-none outline-none focus:border-[#32cd32]"
                />
                <div className="flex justify-between mt-2">
                  <button 
                    onClick={() => updateSlide(slide.id, { theme: slide.theme === 'light' ? 'dark' : 'light' })}
                    className="text-[9px] font-bold text-gray-500 uppercase hover:text-white"
                  >
                    Theme: {slide.theme === 'light' ? 'Black Text' : 'White Text'}
                  </button>
                  <button onClick={() => onDownloadSlide(slide, idx)} className="text-[10px] font-bold text-[#32cd32] uppercase hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
