
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SearchResultItem } from '../types';
import { ExternalLink, BookOpen, Link as LinkIcon, Search } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResultItem[];
  searchEntryPointHtml?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, searchEntryPointHtml }) => {
  if ((!results || results.length === 0) && !searchEntryPointHtml) return null;

  return (
    <div className="w-full mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-t border-slate-200 dark:border-white/10 pt-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800">
              <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">Research Grounding</h3>
        </div>

        {searchEntryPointHtml && (
          <div 
            className="search-entry-point-container"
            dangerouslySetInnerHTML={{ __html: searchEntryPointHtml }}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <a 
            key={index} 
            href={result.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex flex-col p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all duration-500"></div>
            
            <div className="flex items-start justify-between gap-4 mb-4">
               <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight text-sm">
                 {result.title}
               </h4>
               <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 transition-colors mt-0.5" />
            </div>
            
            <div className="mt-auto flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
              <LinkIcon className="w-3 h-3" />
              <span className="truncate max-w-full">
                {(() => {
                  try {
                    return new URL(result.url).hostname.replace('www.', '');
                  } catch {
                    return 'External Source';
                  }
                })()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
