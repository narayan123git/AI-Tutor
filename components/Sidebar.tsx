
import React from 'react';
import { InteractionMode } from '../types';
import { MODES } from '../constants';

interface SidebarProps {
  selectedMode: InteractionMode;
  onSelectMode: (mode: InteractionMode) => void;
  isProcessing: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMode, onSelectMode, isProcessing }) => {
  return (
    <aside className="w-72 flex-shrink-0 bg-white dark:bg-slate-800/50 p-6 flex flex-col space-y-6 border-r border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-3">
         <div className="p-2 bg-indigo-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">AI Tutor Pro</h1>
      </div>
      <nav className="flex-1">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Choose a Mode</p>
        <ul className="space-y-2">
          {MODES.map((mode) => (
            <li key={mode.id}>
              <button
                onClick={() => onSelectMode(mode.id)}
                disabled={isProcessing}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200
                  ${selectedMode === mode.id 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }
                  ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}
                `}
              >
                <span className={selectedMode === mode.id ? 'text-white' : 'text-indigo-500'}>{mode.icon}</span>
                <div className="flex flex-col">
                  <span className="font-semibold">{mode.name}</span>
                  <span className={`text-xs ${selectedMode === mode.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{mode.description}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
       <div className="text-xs text-center text-slate-400 dark:text-slate-500">
          Powered by Gemini
        </div>
    </aside>
  );
};

export default Sidebar;
