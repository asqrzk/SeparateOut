
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { AppStage, LinkedInDraft, PostPoint, Tone } from './types';
import { 
  generateLinkedInDraft, 
  generatePointImage,
  editPointImage
} from './services/geminiService';
import Loading from './components/Loading';
import IntroScreen from './components/IntroScreen';
import SearchResults from './components/SearchResults';
import Carousel from './components/Carousel';
import ApiKeyModal from './components/ApiKeyModal';
import { 
  ChevronRight, Copy, Check, ArrowLeft, Zap, Sun, Moon, Search, Loader2, AlertCircle, XCircle, Github
} from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [stage, setStage] = useState<AppStage>('INPUT');
  const [topic, setTopic] = useState('');
  const [numPoints, setNumPoints] = useState(3);
  const [pointInputs, setPointInputs] = useState<string[]>(['', '', '']);
  const [tone, setTone] = useState<Tone>('Professional');
  
  const [draft, setDraft] = useState<LinkedInDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const checkKey = () => {
       const key = localStorage.getItem('gemini_api_key');
       if (key) {
         setHasApiKey(true);
       } else {
         setHasApiKey(false);
       }
    };
    checkKey();
  }, []);

  const handleStartApp = () => {
    if (!hasApiKey) {
      setShowKeyModal(true);
    } else {
      setShowIntro(false);
    }
  };

  const handleKeySuccess = () => {
    setHasApiKey(true);
    setShowKeyModal(false);
    setShowIntro(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key');
    setHasApiKey(false);
    setShowKeyModal(true);
    setDraft(null);
    setStage('INPUT');
  };

  const handleApiError = async (err: any) => {
    console.error("API Error encountered:", err);
    if (err?.message?.includes("API Key not found") || err?.message?.includes("API_KEY_INVALID")) {
      setHasApiKey(false);
      setShowKeyModal(true);
      setError("Please check your API key.");
    } else if (err?.message?.includes("Requested entity was not found.")) {
      setError("This high-quality model requires a paid API key from a billing-enabled GCP project.");
    } else {
      setError(err?.message || "Something went wrong. Please check your topic and try again.");
    }
  };

  const updateNumPoints = (val: number) => {
    const newNum = Math.max(1, Math.min(6, val));
    setNumPoints(newNum);
    const newInputs = [...pointInputs];
    if (newNum > pointInputs.length) {
      for (let i = pointInputs.length; i < newNum; i++) newInputs.push('');
    } else {
      newInputs.splice(newNum);
    }
    setPointInputs(newInputs);
  };

  const handlePointChange = (index: number, val: string) => {
    const newInputs = [...pointInputs];
    newInputs[index] = val;
    setPointInputs(newInputs);
  };

  const handleCreateDraft = async () => {
    const activePoints = pointInputs.filter(p => p.trim());
    if (!topic.trim() || activePoints.length === 0) {
      setError("Please provide a topic and at least one core insight.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setLoadingMsg('Analyzing topic & Researching trends...');
    try {
      const res = await generateLinkedInDraft(topic, activePoints, tone);
      setDraft(res);
      setStage('EDITING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(false);

      // Auto-generate images for all carousel points
      res.points.forEach((p) => {
        handleGenerateImageForPoint(p.id, res);
      });
    } catch (err) {
      await handleApiError(err);
      setIsLoading(false);
    }
  };

  const handleGenerateImageForPoint = async (pointId: string, currentDraft?: LinkedInDraft) => {
    const targetDraft = currentDraft || draft;
    if (!targetDraft) return;
    
    const point = targetDraft.points.find(p => p.id === pointId);
    if (!point || !point.suggestedPrompt) return;

    setError(null);
    setDraft(prev => prev ? ({
      ...prev,
      points: prev.points.map(p => p.id === pointId ? { ...p, isGenerating: true } : p)
    }) : null);

    try {
      const imgUrl = await generatePointImage(point.suggestedPrompt);
      setDraft(prev => prev ? {
        ...prev,
        points: prev.points.map(p => p.id === pointId ? { ...p, imageUrl: imgUrl, isGenerating: false } : p)
      } : null);
    } catch (err) {
      await handleApiError(err);
      setDraft(prev => prev ? {
        ...prev,
        points: prev.points.map(p => p.id === pointId ? { ...p, isGenerating: false } : p)
      } : null);
    }
  };

  const handleEditPointImage = async (pointId: string, editInstruction: string) => {
    if (!draft) return;
    const point = draft.points.find(p => p.id === pointId);
    if (!point || !point.imageUrl) return;

    setError(null);
    setDraft({
      ...draft,
      points: draft.points.map(p => p.id === pointId ? { ...p, isGenerating: true } : p)
    });

    try {
      const newImgUrl = await editPointImage(point.imageUrl, editInstruction);
      setDraft(prev => prev ? {
        ...prev,
        points: prev.points.map(p => p.id === pointId ? { ...p, imageUrl: newImgUrl, isGenerating: false } : p)
      } : null);
    } catch (err) {
      await handleApiError(err);
      setDraft(prev => prev ? {
        ...prev,
        points: prev.points.map(p => p.id === pointId ? { ...p, isGenerating: false } : p)
      } : null);
    }
  };

  const copyToClipboard = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {showIntro && <IntroScreen onComplete={handleStartApp} />}
      {showKeyModal && <ApiKeyModal onSuccess={handleKeySuccess} />}
      
      <header className="border-b border-slate-200 dark:border-white/10 sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">SeparateOut <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/asqrzk/SeparateOut" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>OPEN SOURCE</span>
            </a>
            {hasApiKey && (
              <button 
                onClick={handleClearKey}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>CLEAR KEY</span>
              </button>
            )}
            {!hasApiKey && (
              <button 
                onClick={() => setShowKeyModal(true)} 
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg animate-pulse"
              >
                <AlertCircle className="w-4 h-4" /> SET API KEY
              </button>
            )}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              aria-label="Toggle Dark Mode"
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {isLoading ? (
          <Loading status={loadingMsg} step={2} />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {stage === 'INPUT' && (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent pb-2">
                    Separate Out.
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Research-backed narratives for high-impact LinkedIn presences.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] space-y-12">
                  
                  {error && (
                    <div className="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-4 text-red-600 dark:text-red-400 text-sm font-medium animate-in shake duration-300">
                       <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                       <div className="space-y-1">
                         <p className="font-bold">Error Processing Request</p>
                         <p className="text-xs opacity-80">{error}</p>
                         {error.includes("paid API key") && (
                           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs underline font-bold hover:text-red-700 transition-colors">View Billing Setup Guide</a>
                         )}
                       </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                       <h3 className="text-xl font-bold">Carousel Slide Count</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button 
                          key={n}
                          onClick={() => updateNumPoints(n)}
                          className={`flex-1 min-w-[60px] h-14 rounded-2xl font-bold transition-all border-2 ${numPoints === n ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-white/5 text-slate-400 hover:border-blue-500'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                       <h3 className="text-xl font-bold">Topic & Details</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[1.5rem] pl-14 pr-6 py-6 text-xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-inner"
                          placeholder="What is the overarching theme?"
                          value={topic}
                          onChange={(e) => {
                            setTopic(e.target.value);
                            if (error) setError(null);
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pointInputs.map((text, idx) => (
                          <div key={idx} className="relative group">
                            <div className="absolute left-5 top-5 text-[10px] font-black text-blue-500/20 uppercase tracking-[0.3em] z-10">Slide {idx + 1}</div>
                            <textarea 
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[1.5rem] px-5 pt-12 pb-6 min-h-[160px] focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all"
                              placeholder={`Describe insight for slide #${idx + 1}...`}
                              value={text}
                              onChange={(e) => {
                                handlePointChange(idx, e.target.value);
                                if (error) setError(null);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-white/5 space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-wrap gap-2">
                        {(['Professional', 'Casual', 'Inspirational', 'Thought Leader', 'Controversial'] as Tone[]).map((t) => (
                          <button 
                            key={t}
                            onClick={() => setTone(t)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${tone === t ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-950 shadow-lg' : 'bg-transparent border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={handleCreateDraft}
                        disabled={!topic || pointInputs.every(p => !p.trim())}
                        className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/40 active:scale-95 group"
                      >
                        GENERATE CAROUSEL <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'EDITING' && draft && (
              <div className="max-w-4xl mx-auto space-y-12 pb-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <button onClick={() => setStage('INPUT')} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest">
                      <ArrowLeft className="w-4 h-4" /> START NEW DRAFT
                    </button>
                    <h2 className="text-4xl font-black tracking-tight">Post Preview</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setStage('INPUT')} 
                      className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      EDIT INPUTS
                    </button>
                    <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold shadow-2xl transition-all active:scale-95 text-xs">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'COPIED' : 'COPY POST TEXT'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-12">
                  <div className="w-full max-w-[555px] animate-in slide-in-from-bottom-8 duration-700">
                    <Carousel 
                      points={draft.points} 
                      caption={draft.fullPost}
                      onEditImage={(id, instr) => handleEditPointImage(id, instr)}
                    />
                  </div>
                </div>

                <div className="pt-20">
                   <SearchResults results={draft.searchResults} searchEntryPointHtml={draft.searchEntryPointHtml} />
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
