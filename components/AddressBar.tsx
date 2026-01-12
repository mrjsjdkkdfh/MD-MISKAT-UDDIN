
import React, { useState, useEffect } from 'react';

interface AddressBarProps {
  url: string;
  onGo: (input: string) => void;
  onHome: () => void;
  onReload: () => void;
  isIncognito: boolean;
  onToggleIncognito: () => void;
}

const AddressBar: React.FC<AddressBarProps> = ({ 
  url, 
  onGo, 
  onHome,
  onReload,
  isIncognito,
  onToggleIncognito
}) => {
  const [inputValue, setInputValue] = useState(url);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGo(inputValue);
  };

  return (
    <div className={`${isIncognito ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} px-3 py-2 border-b flex items-center gap-2 transition-colors duration-500`}>
      <button 
        onClick={onHome}
        className={`p-2 ${isIncognito ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-500 hover:bg-gray-100'} rounded-full transition-colors`}
      >
        <i className="fa-solid fa-house text-sm"></i>
      </button>

      <form onSubmit={handleSubmit} className={`flex-1 flex items-center ${isIncognito ? 'bg-zinc-800' : 'bg-gray-100'} rounded-lg px-3 py-1.5 gap-2 border border-transparent focus-within:bg-${isIncognito ? 'zinc-700' : 'white'} focus-within:ring-2 focus-within:ring-${isIncognito ? 'zinc-600' : 'blue-100'} focus-within:border-${isIncognito ? 'zinc-500' : 'blue-400'} transition-all`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search or type URL"
          className={`bg-transparent border-none outline-none text-[15px] w-full ${isIncognito ? 'text-zinc-100 placeholder-zinc-500' : 'text-gray-800 placeholder-gray-400'}`}
        />
        {inputValue && (
          <button 
            type="submit"
            className={`${isIncognito ? 'text-zinc-300 hover:bg-zinc-700' : 'text-blue-600 hover:bg-blue-50'} font-bold text-xs uppercase px-2 rounded`}
          >
            Go
          </button>
        )}
      </form>

      <div className="flex items-center gap-1">
        <button 
          onClick={onToggleIncognito}
          className={`p-2 rounded-full transition-all ${isIncognito ? 'bg-zinc-700 text-white shadow-inner' : 'text-gray-500 hover:bg-gray-100'}`}
          title={isIncognito ? "Switch to Normal Mode" : "Switch to Incognito Mode"}
        >
          <i className={`fa-solid ${isIncognito ? 'fa-user-secret' : 'fa-mask'} text-sm`}></i>
        </button>
        
        <button 
          onClick={onReload}
          className={`p-2 ${isIncognito ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-500 hover:bg-gray-100'} rounded-full`}
        >
          <i className="fa-solid fa-rotate-right text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default AddressBar;
