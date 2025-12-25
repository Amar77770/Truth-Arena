
import React, { useState, useEffect } from 'react';
import { getApiKey, setManualApiKey } from '../services/geminiService';
import { soundService } from '../services/soundService';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if key exists on mount
    const key = getApiKey();
    setHasKey(!!key);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playClick();
    
    if (keyInput.trim()) {
        setManualApiKey(keyInput.trim());
    }

    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Lines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(255,0,255,0.3)_25%,rgba(255,0,255,0.3)_26%,transparent_27%,transparent_74%,rgba(0,255,255,0.3)_75%,rgba(0,255,255,0.3)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>

      <div className="z-10 text-center animate-glitch-once w-full max-w-md">
        <div className="mb-8">
            <h1 className="font-comic text-7xl md:text-9xl text-yellow-400 drop-shadow-[5px_5px_0px_#ff00ff] transform -rotate-3">
                TRUTH
            </h1>
            <h1 className="font-comic text-7xl md:text-9xl text-white drop-shadow-[5px_5px_0px_#00ffff] transform rotate-2 -mt-4">
                ARENA
            </h1>
            <div className="font-arcade text-pink-500 text-sm md:text-lg mt-4 animate-pulse">
                INSERT COIN TO START
            </div>
        </div>

        <div className="bg-black border-4 border-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)] mx-auto relative group">
            <h2 className="font-arcade text-cyan-400 text-xs mb-6 text-left">&gt;&gt; ENTER GAMERTAG_</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Player 1"
                    className="bg-[#111] text-white font-mono text-xl p-4 border-2 border-gray-600 focus:border-yellow-400 focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,0,0.5)] text-center placeholder-gray-700"
                    maxLength={15}
                    autoFocus
                />

                {!hasKey && (
                    <div className="animate-fade-in-up mt-2">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <label className="font-arcade text-[8px] text-red-400">UPLINK_SIGNAL_LOST: ENTER API KEY</label>
                         </div>
                         <input 
                            type="password" 
                            value={keyInput}
                            onChange={(e) => setKeyInput(e.target.value)}
                            placeholder="PASTE GEMINI API KEY HERE"
                            className="w-full bg-red-950/20 text-red-200 font-mono text-sm p-3 border-2 border-red-900 focus:border-red-500 focus:outline-none text-center placeholder-red-900/50"
                        />
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="block text-right mt-1 font-arcade text-[8px] text-gray-500 hover:text-white underline">
                            GET_KEY @ GOOGLE_AI_STUDIO
                        </a>
                    </div>
                )}

                <button 
                    type="submit"
                    className="btn-retro bg-[#ff00ff] hover:bg-pink-600 text-white font-arcade text-sm py-4 border-b-4 border-pink-900 mt-2"
                >
                    {hasKey || keyInput ? "ESTABLISH LINK" : "ENTER OFFLINE MODE"}
                </button>
            </form>

            <div className="mt-6 text-[10px] font-mono text-gray-500 border-b border-gray-800 pb-4 mb-4">
                WARNING: THIS SYSTEM DESTROYS FAKE NEWS.<br/>
                PROCEED WITH CAUTION.
            </div>

            {/* Developer Hint - Fully Visible inside the box */}
            <div className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                 <span className="font-arcade text-[8px] text-gray-600">GOD_MODE_KEY:</span>
                 <span className="font-mono text-[10px] text-red-500 font-bold bg-red-950/20 px-2 py-0.5 border border-red-900/30 rounded cursor-help" title="Use this username to access Admin Dashboard">
                    Admin11
                 </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
