
import React, { useState, useEffect } from 'react';

interface BrowserContentProps {
  url: string;
  isHome: boolean;
  onNavigate: (url: string) => void;
  isIncognito: boolean;
}

const SHORTCUTS = [
  { name: 'Google', url: 'https://www.google.com', icon: 'fa-brands fa-google', color: 'bg-red-500' },
  { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', color: 'bg-red-600' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'fa-solid fa-w', color: 'bg-gray-700' },
  { name: 'Reddit', url: 'https://www.reddit.com', icon: 'fa-brands fa-reddit', color: 'bg-orange-500' },
  { name: 'GitHub', url: 'https://www.github.com', icon: 'fa-brands fa-github', color: 'bg-slate-900' },
  { name: 'Twitter', url: 'https://www.twitter.com', icon: 'fa-brands fa-twitter', color: 'bg-blue-400' },
  { name: 'Amazon', url: 'https://www.amazon.com', icon: 'fa-brands fa-amazon', color: 'bg-yellow-600' },
  { name: 'Add', url: '#', icon: 'fa-solid fa-plus', color: 'bg-gray-200 text-gray-600' },
];

const BrowserContent: React.FC<BrowserContentProps> = ({ url, isHome, onNavigate, isIncognito }) => {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!isHome) {
      setIframeKey(prev => prev + 1);
    }
  }, [url, isHome]);

  if (isHome) {
    if (isIncognito) {
      return (
        <div className="w-full h-full bg-zinc-900 flex flex-col p-8 overflow-y-auto animate-in fade-in duration-500">
          <div className="flex flex-col items-center mt-12 mb-10">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl mb-6 border border-zinc-700">
              <i className="fa-solid fa-user-secret"></i>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100">You've gone incognito</h1>
            <p className="text-zinc-400 text-center text-sm mt-4 leading-relaxed max-w-[280px]">
              Now you can browse privately, and other people who use this device won't see your activity. 
            </p>
          </div>

          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-800 space-y-4">
            <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-widest">DroidBrowser won't save:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <i className="fa-solid fa-clock-rotate-left mt-1 text-zinc-500"></i>
                <span>Your browsing history</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <i className="fa-solid fa-cookie-bite mt-1 text-zinc-500"></i>
                <span>Cookies and site data</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-400">
                <i className="fa-solid fa-pen-to-square mt-1 text-zinc-500"></i>
                <span>Information entered in forms</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto py-8 text-center">
            <p className="text-[10px] text-zinc-600 tracking-tight">PROTECTED SESSION ACTIVE</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-white flex flex-col p-6 overflow-y-auto animate-in fade-in duration-500">
        <div className="flex flex-col items-center mt-12 mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-4">
            <i className="fa-solid fa-globe"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">DroidBrowser</h1>
        </div>

        <div className="grid grid-cols-4 gap-4 px-2">
          {SHORTCUTS.map((site, idx) => (
            <button
              key={idx}
              onClick={() => site.url !== '#' && onNavigate(site.url)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 ${site.color} rounded-full flex items-center justify-center text-white text-lg shadow-sm group-active:scale-90 transition-transform`}>
                <i className={site.icon}></i>
              </div>
              <span className="text-[11px] font-medium text-gray-600 truncate w-full text-center">
                {site.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-12 text-center">
          <p className="text-xs text-gray-400 italic">Version 2.0.4 Premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${isIncognito ? 'bg-black' : 'bg-white'} relative transition-colors duration-500`}>
      <iframe
        key={iframeKey}
        src={url}
        className="w-full h-full border-none"
        title="browser-content"
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-downloads"
      />
      
      {/* Simulation Info Overlay */}
      <div className={`absolute bottom-6 left-6 right-6 p-4 ${isIncognito ? 'bg-zinc-950/95 border-zinc-800' : 'bg-white/95 border-blue-100'} backdrop-blur-sm border rounded-xl shadow-xl pointer-events-none transition-colors duration-500`}>
        <div className={`flex items-center gap-2 mb-1 ${isIncognito ? 'text-zinc-400' : 'text-blue-600'}`}>
          <i className={`fa-solid ${isIncognito ? 'fa-user-secret' : 'fa-shield-halved'} text-xs`}></i>
          <p className="text-[10px] uppercase font-bold tracking-wider">{isIncognito ? 'Incognito Mode' : 'Browser Security Info'}</p>
        </div>
        <p className={`text-[11px] ${isIncognito ? 'text-zinc-500' : 'text-gray-500'} leading-normal`}>
          {isIncognito 
            ? "Browsing history isn't saved. Note: iframes share browser session state in most web environments."
            : "Some modern sites block frame embedding. If a page appears blank, try searching for a different site."}
        </p>
      </div>
    </div>
  );
};

export default BrowserContent;
