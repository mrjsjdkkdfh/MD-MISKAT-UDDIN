
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserHistoryItem, BrowserState } from './types';
import StatusBar from './components/StatusBar';
import AddressBar from './components/AddressBar';
import BrowserContent from './components/BrowserContent';

const HOME_URL = 'internal://home';

const App: React.FC = () => {
  const [state, setState] = useState<BrowserState>({
    currentUrl: HOME_URL,
    history: [{ url: HOME_URL, title: 'Home' }],
    currentIndex: 0,
    isLoading: false,
    progress: 0,
    isIncognito: false,
  });

  // Keep track of normal and incognito histories separately
  const normalHistoryRef = useRef<{ history: BrowserHistoryItem[], index: number }>({
    history: [{ url: HOME_URL, title: 'Home' }],
    index: 0
  });
  
  const incognitoHistoryRef = useRef<{ history: BrowserHistoryItem[], index: number }>({
    history: [{ url: HOME_URL, title: 'Home' }],
    index: 0
  });

  const progressIntervalRef = useRef<number | null>(null);

  const stopLoading = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const simulateLoading = useCallback(() => {
    stopLoading();
    
    setState(prev => ({ ...prev, isLoading: true, progress: 5 }));
    
    let currentProgress = 5;
    progressIntervalRef.current = window.setInterval(() => {
      const step = currentProgress < 80 ? Math.random() * 20 : Math.random() * 2;
      currentProgress += step;
      
      if (currentProgress >= 95) {
        stopLoading();
        setState(prev => ({ ...prev, progress: 100 }));
        setTimeout(() => {
          setState(prev => ({ ...prev, isLoading: false }));
        }, 200);
      } else {
        setState(prev => ({ ...prev, progress: currentProgress }));
      }
    }, 150);
  }, [stopLoading]);

  const handleNavigate = (input: string) => {
    let targetUrl = input.trim();
    if (!targetUrl) return;

    const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(targetUrl) || targetUrl.includes('.');
    
    if (isUrl) {
      if (!targetUrl.startsWith('http') && !targetUrl.startsWith('internal://')) {
        targetUrl = 'https://' + targetUrl;
      }
    } else {
      targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
    }

    const newHistory = state.history.slice(0, state.currentIndex + 1);
    newHistory.push({ url: targetUrl, title: targetUrl });

    const newIndex = newHistory.length - 1;

    // Update the relevant ref
    if (state.isIncognito) {
      incognitoHistoryRef.current = { history: newHistory, index: newIndex };
    } else {
      normalHistoryRef.current = { history: newHistory, index: newIndex };
    }

    setState(prev => ({
      ...prev,
      currentUrl: targetUrl,
      history: newHistory,
      currentIndex: newIndex,
    }));

    simulateLoading();
  };

  const handleBack = () => {
    if (state.currentIndex > 0) {
      const prevIndex = state.currentIndex - 1;
      const prevItem = state.history[prevIndex];
      
      if (state.isIncognito) {
        incognitoHistoryRef.current.index = prevIndex;
      } else {
        normalHistoryRef.current.index = prevIndex;
      }

      setState(prev => ({
        ...prev,
        currentUrl: prevItem.url,
        currentIndex: prevIndex,
      }));
      simulateLoading();
    }
  };

  const handleToggleIncognito = () => {
    const switchingToIncognito = !state.isIncognito;
    
    // Save current state to appropriate ref before switching
    if (state.isIncognito) {
      incognitoHistoryRef.current = { history: state.history, index: state.currentIndex };
    } else {
      normalHistoryRef.current = { history: state.history, index: state.currentIndex };
    }

    // Load state from the other ref
    const nextRef = switchingToIncognito ? incognitoHistoryRef.current : normalHistoryRef.current;
    
    setState(prev => ({
      ...prev,
      isIncognito: switchingToIncognito,
      currentUrl: nextRef.history[nextRef.index].url,
      history: nextRef.history,
      currentIndex: nextRef.index,
    }));
    simulateLoading();
  };

  const handleHome = () => {
    handleNavigate(HOME_URL);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopLoading();
    };
  }, [state.currentIndex, handleBack, stopLoading]);

  // Determine theme colors
  const bgColor = state.isIncognito ? 'bg-zinc-900' : 'bg-white';
  const navColor = state.isIncognito ? 'bg-zinc-950' : 'bg-black';
  const borderColor = state.isIncognito ? 'border-zinc-800' : 'border-neutral-800';

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4 transition-colors duration-500">
      <div className={`w-full max-w-md h-[840px] ${state.isIncognito ? 'bg-black' : 'bg-neutral-900'} rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[10px] ${borderColor} overflow-hidden relative flex flex-col transition-all duration-500`}>
        {/* Hardware Elements */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 ${state.isIncognito ? 'bg-zinc-900' : 'bg-neutral-800'} rounded-b-3xl z-50 flex items-center justify-center`}>
          <div className="w-12 h-1 bg-neutral-700 rounded-full"></div>
        </div>
        
        <div className={`flex-1 ${bgColor} flex flex-col overflow-hidden transition-colors duration-500`}>
          <StatusBar isIncognito={state.isIncognito} />
          
          <AddressBar 
            url={state.currentUrl === HOME_URL ? '' : state.currentUrl} 
            onGo={handleNavigate}
            onHome={handleHome}
            onReload={() => simulateLoading()}
            isIncognito={state.isIncognito}
            onToggleIncognito={handleToggleIncognito}
          />
          
          {/* Progress Bar */}
          {state.isLoading && (
            <div className={`h-1 ${state.isIncognito ? 'bg-zinc-800' : 'bg-blue-50'} w-full overflow-hidden absolute top-[72px] left-0 z-10`}>
              <div 
                className={`h-full ${state.isIncognito ? 'bg-zinc-400' : 'bg-blue-500'} transition-all duration-200 ease-out`} 
                style={{ width: `${state.progress}%` }}
              ></div>
            </div>
          )}

          <div className={`flex-1 relative ${state.isIncognito ? 'bg-zinc-900' : 'bg-neutral-50'}`}>
            <BrowserContent 
              url={state.currentUrl} 
              onNavigate={handleNavigate} 
              isHome={state.currentUrl === HOME_URL}
              isIncognito={state.isIncognito}
            />
          </div>

          {/* Android Navigation Bar (3-Button Layout) */}
          <div className={`h-14 ${navColor} flex items-center justify-around px-12 transition-colors duration-500`}>
            <button 
              onClick={handleBack} 
              className={`text-white transition-opacity ${state.currentIndex === 0 ? 'opacity-30' : 'opacity-100 active:scale-90'}`}
            >
              <i className="fa-solid fa-caret-left text-2xl"></i>
            </button>
            <button 
              onClick={handleHome}
              className="text-white opacity-80 active:scale-90"
            >
              <i className="fa-regular fa-circle text-xl"></i>
            </button>
            <button 
              className="text-white opacity-80 active:scale-90"
            >
              <i className="fa-regular fa-square text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
