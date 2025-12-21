import React from 'react';
import { ViewState } from '../types';
import { soundService } from '../services/soundService';

interface NavBarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  username: string;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView, onLogout, username }) => {
  const NavButton = ({ 
    view, 
    icon, 
    label, 
    color, 
    isActive, 
    onClick 
  }: { 
    view?: ViewState, 
    icon: string, 
    label: string, 
    color: string, 
    isActive?: boolean,
    onClick?: () => void
  }) => (
    <button 
      onClick={() => {
        soundService.playNav();
        if (onClick) onClick();
        else if (view) setView(view);
      }}
      className={`flex flex-col items-center gap-1 p-2 md:p-4 transition-all ${isActive ? 'scale-110 -translate-y-2' : 'opacity-60 hover:opacity-100'}`}
    >
      <div className={`w-10 h-10 md:w-12 md:h-12 border-4 ${color === 'pink' ? 'border-pink-500 bg-pink-900/50' : color === 'cyan' ? 'border-cyan-500 bg-cyan-900/50' : color === 'yellow' ? 'border-yellow-500 bg-yellow-900/50' : color === 'purple' ? 'border-purple-500 bg-purple-900/50' : color === 'red' ? 'border-red-600 bg-red-900' : 'border-green-500 bg-green-900/50'} flex items-center justify-center text-xl md:text-2xl shadow-[4px_4px_0px_black]`}>
        {icon}
      </div>
      <span className={`font-arcade text-[10px] md:text-xs ${color === 'pink' ? 'text-pink-400' : color === 'cyan' ? 'text-cyan-400' : color === 'yellow' ? 'text-yellow-400' : color === 'purple' ? 'text-purple-400' : color === 'red' ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-white z-50 px-2 pb-2 pt-2">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* Player Info (Left) */}
        <div className="hidden md:flex flex-col font-arcade text-xs text-gray-500">
           <span>P1: <span className="text-white">{username}</span></span>
           <span>CREDITS: ∞</span>
        </div>

        {/* Center Controls */}
        <div className="flex gap-1 md:gap-6 mx-auto">
            <NavButton view="FIGHT" icon="🥊" label="FIGHT" color="pink" isActive={currentView === 'FIGHT'} />
            <NavButton view="NEWS" icon="🗞️" label="INTEL" color="green" isActive={currentView === 'NEWS'} />
            <NavButton view="CASES" icon="📜" label="LOGS" color="cyan" isActive={currentView === 'CASES'} />
            <NavButton view="COMMUNITY" icon="🌍" label="GUILD" color="yellow" isActive={currentView === 'COMMUNITY'} />
            
            {username === 'Admin11' && (
                <NavButton view="ADMIN" icon="⚡" label="GOD_MODE" color="red" isActive={currentView === 'ADMIN'} />
            )}
        </div>

        {/* Quit (Right) */}
        <button onClick={onLogout} className="md:flex flex-col items-center gap-1 opacity-50 hover:opacity-100 hidden">
            <span className="font-arcade text-[10px] text-red-500">QUIT</span>
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
        </button>
      </div>
    </div>
  );
};

export default NavBar;