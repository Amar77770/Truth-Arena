
import React, { useEffect, useRef, useState } from 'react';
import { DebateTurn } from '../types';
import { soundService } from '../services/soundService';

interface CourtroomDebateProps {
  script: DebateTurn[];
}

const CourtroomDebate: React.FC<CourtroomDebateProps> = ({ script }) => {
  const [visibleTurns, setVisibleTurns] = useState<DebateTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setVisibleTurns([]);
    if (!script || script.length === 0) return;

    let currentIndex = 0;
    // Show the first turn immediately to avoid a blank screen
    setVisibleTurns([script[0]]);
    currentIndex = 1;

    const interval = setInterval(() => {
      if (currentIndex >= script.length) {
        clearInterval(interval);
        return;
      }

      const turn = script[currentIndex];
      setVisibleTurns(prev => [...prev, turn]);
      soundService.playBlip();
      currentIndex++;

      // Auto-scroll
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }

    }, 1500);

    return () => clearInterval(interval);
  }, [script]);

  return (
    <div className="relative mb-12 border-8 border-gray-800 bg-black h-[650px] flex flex-col shadow-[20px_20px_0px_0px_#000] overflow-hidden group/arena">
      
      {/* HUD Scanlines and Static Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]"></div>
      <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>

      {/* Arcade Header */}
      <div className="bg-[#111] p-3 flex justify-between items-center border-b-4 border-gray-800 relative z-30">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]"></div>
            <span className="font-arcade text-[10px] text-red-500 uppercase tracking-widest">VERIF_CHANNEL_ACTV</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 font-comic text-3xl text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] uppercase tracking-widest whitespace-nowrap">
            LOGIC_ARENA_BETA
        </div>
        <div className="font-arcade text-[8px] text-gray-500 uppercase">SYS_TIME: <span className="text-white">ERR_NULL</span></div>
      </div>

      {/* Background Ambience Characters (Static so the fight always looks "visible") */}
      <div className="absolute inset-0 z-0 flex justify-between items-center px-12 pointer-events-none opacity-10">
          <div className="text-9xl grayscale blur-[2px]">🦜</div>
          <div className="text-9xl grayscale blur-[2px]">🕵️‍♂️</div>
      </div>

      {/* Battle Area */}
      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] bg-[#050505]/80">
        {visibleTurns.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <div className="font-arcade text-[10px] text-cyan-500 animate-pulse">AWAITING_SIGNAL_STREAM...</div>
          </div>
        )}
        
        {visibleTurns.map((turn, index) => {
          const isRumor = turn.speaker.toLowerCase().includes('rumor');
          const isJudge = turn.speaker.toLowerCase().includes('judge');
          const isFact = turn.speaker.toLowerCase().includes('fact') || turn.speaker.toLowerCase().includes('logic');

          if (isJudge) {
            return (
              <div key={index} className="flex flex-col items-center animate-glitch-once my-12 relative group/judge">
                <div className="text-7xl mb-6 animate-bounce filter drop-shadow-[0_0_15px_rgba(255,255,0,0.4)]">⚖️</div>
                <div className="bg-yellow-400 border-4 border-black p-6 max-w-xl text-center transform rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-yellow-400 font-arcade text-[8px] px-3 py-1 border-2 border-white uppercase">ARENA_JUDGE</div>
                  <p className="font-comic text-3xl text-black uppercase leading-tight">{turn.text}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className={`flex w-full ${isRumor ? 'justify-start' : 'justify-end'} items-end gap-6 animate-fade-in-up`}>
              
              {isRumor && (
                 <>
                    <div className="flex flex-col items-center group/rumor">
                        <div className="w-20 h-20 bg-pink-900/40 border-4 border-pink-500 flex items-center justify-center text-5xl mb-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover/rumor:scale-110 transition-transform">
                            🦜
                        </div>
                        <span className="font-arcade text-[8px] bg-pink-600 text-white px-2 py-0.5 border-2 border-black uppercase font-black">P1_RUMOR</span>
                    </div>
                    <div className="relative bg-[#111] border-4 border-pink-600 p-6 max-w-[75%] shadow-[8px_8px_0px_0px_rgba(236,72,153,0.1)] group-hover/arena:border-pink-400 transition-colors">
                        <div className="absolute bottom-4 -left-4 w-0 h-0 border-t-[12px] border-t-transparent border-r-[16px] border-r-pink-600 border-b-[12px] border-b-transparent"></div>
                        <p className="font-mono text-pink-400 text-sm md:text-base leading-relaxed uppercase tracking-tighter">
                            <span className="text-[10px] text-pink-900 block mb-2">&gt;&gt; RX_SIGNAL:</span>
                            {turn.text}
                        </p>
                    </div>
                 </>
              )}

              {isFact && (
                 <>
                    <div className="relative bg-[#111] border-4 border-cyan-600 p-6 max-w-[75%] shadow-[-8px_8px_0px_0px_rgba(34,211,238,0.1)] group-hover/arena:border-cyan-400 transition-colors">
                        <div className="absolute bottom-4 -right-4 w-0 h-0 border-t-[12px] border-t-transparent border-l-[16px] border-l-cyan-600 border-b-[12px] border-b-transparent"></div>
                        <p className="font-mono text-cyan-400 text-sm md:text-base leading-relaxed uppercase tracking-tighter">
                            <span className="text-[10px] text-cyan-900 block mb-2 text-right">&gt;&gt; TX_REBUTTAL:</span>
                            {turn.text}
                        </p>
                    </div>
                    <div className="flex flex-col items-center group/fact">
                        <div className="w-20 h-20 bg-cyan-900/40 border-4 border-cyan-500 flex items-center justify-center text-5xl mb-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover/fact:scale-110 transition-transform">
                            🕵️‍♂️
                        </div>
                        <span className="font-arcade text-[8px] bg-cyan-600 text-white px-2 py-0.5 border-2 border-black uppercase font-black">P2_LOGIC</span>
                    </div>
                 </>
              )}
            </div>
          );
        })}
      </div>

      {/* Arcade Dashboard Controls Visual */}
      <div className="bg-[#0a0a0a] h-20 border-t-8 border-gray-900 flex items-center justify-center gap-16 relative z-30">
           <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 opacity-20"></div>
           <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-red-700 border-b-4 border-red-950 shadow-[0_4px_0_red] active:translate-y-1 active:shadow-none transition-all cursor-pointer"></div>
               <span className="font-arcade text-[8px] text-gray-700">EXTRACT</span>
           </div>
           <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-blue-700 border-b-4 border-blue-950 shadow-[0_4px_0_blue] active:translate-y-1 active:shadow-none transition-all cursor-pointer"></div>
               <span className="font-arcade text-[8px] text-gray-700">VERIFY</span>
           </div>
           <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 rounded-full bg-yellow-600 border-b-4 border-yellow-800 shadow-[0_4px_0_yellow] active:translate-y-1 active:shadow-none transition-all cursor-pointer"></div>
               <span className="font-arcade text-[8px] text-gray-700">DEBUG</span>
           </div>
      </div>
    </div>
  );
};

export default CourtroomDebate;
