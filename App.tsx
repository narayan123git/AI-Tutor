
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ResponseDisplay from './components/ResponseDisplay';
import Loader from './components/Loader';
import { InteractionMode, TutorResponse } from './types';
import { getTutorResponse } from './services/geminiService';
import { MODES } from './constants';

const App: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<InteractionMode>(InteractionMode.Explain);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<TutorResponse | null>(null);

  useEffect(() => {
    // Set dark mode by default for better aesthetics
    document.documentElement.classList.add('dark');
    // Add custom styles for the app
    document.body.classList.add('bg-slate-50', 'dark:bg-slate-900');
    // Add custom styles for the scrollbar
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4A5568;
        border-radius: 20px;
        border: 3px solid transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #2D3748;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleSendMessage = async (message: string, mode: InteractionMode) => {
    setIsProcessing(true);
    setError(null);
    setResponse(null);
    try {
      const result = await getTutorResponse(message, mode);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const WelcomeScreen = () => (
    <div className="text-center">
      <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-6">
        <div className="p-3 bg-indigo-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Welcome to AI Tutor Pro</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Your all-in-one learning companion.</p>
      <div className="mt-8 max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {MODES.slice(0, 4).map(mode => (
          <div key={mode.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-indigo-500 dark:text-indigo-400 w-8 h-8 mx-auto">{mode.icon}</div>
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{mode.name}</p>
          </div>
        ))}
      </div>
       <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">Select a mode on the left and ask a question below to get started!</p>
    </div>
  );

  return (
    <div className="flex h-screen w-full text-slate-800 dark:text-slate-200">
      <Sidebar 
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        isProcessing={isProcessing}
      />
      <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-center min-h-full p-4">
            {isProcessing && <Loader />}
            {error && (
              <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-6 rounded-lg">
                <h3 className="font-bold text-lg">An Error Occurred</h3>
                <p className="mt-2">{error}</p>
              </div>
            )}
            {!isProcessing && !error && !response && <WelcomeScreen />}
            {response && <ResponseDisplay data={response} />}
          </div>
        </main>
        <ChatInput 
          onSendMessage={handleSendMessage}
          selectedMode={selectedMode}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default App;
