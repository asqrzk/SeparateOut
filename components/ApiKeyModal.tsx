import React, { useState } from 'react';
import { Key, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { setGeminiApiKey } from '../services/geminiService';
import { Language } from '../types';
import { apiKeyModalCopy } from '../i18n/copy';

interface ApiKeyModalProps {
  onSuccess: () => void;
  language: Language;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSuccess, language }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  const t = apiKeyModalCopy[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setError(t.errorEmpty);
      return;
    }
    
    // Basic format check (optional, but helpful)
    if (!inputKey.startsWith('AIza')) {
       // Just a warning, not a blocker as formats might change, but good for UX
       // setError('That doesn\'t look like a standard Google API key (usually starts with AIza)');
       // return; 
    }

    setGeminiApiKey(inputKey.trim());
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {t.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">{t.label}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  placeholder={t.placeholder}
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium animate-in slide-in-from-left-2">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {t.submit} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="text-center">
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-blue-500 underline decoration-slate-300 underline-offset-4 transition-colors"
            >
              {t.link}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
