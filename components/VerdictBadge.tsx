
import React from 'react';
import { VerdictType } from '../types';

interface VerdictBadgeProps {
  verdict: VerdictType;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  let colorClass = '';
  let label = '';
  let rotate = 'rotate-0';
  let auraColor = '';
  let statusCode = '';

  switch (verdict) {
    case VerdictType.SUPPORTED:
      colorClass = 'bg-green-500 text-black border-green-800 shadow-[8px_8px_0px_#14532d]';
      label = 'VERIFIED_TRUTH';
      rotate = '-rotate-2';
      auraColor = 'bg-green-500';
      statusCode = 'SYS_OK_01';
      break;
    case VerdictType.CONTRADICTED:
      colorClass = 'bg-red-600 text-white border-red-900 shadow-[8px_8px_0px_#7f1d1d]';
      label = 'DEBUNKED_FAKE';
      rotate = 'rotate-2';
      auraColor = 'bg-red-600';
      statusCode = 'SYS_ERR_99';
      break;
    case VerdictType.MISLEADING:
      colorClass = 'bg-orange-500 text-black border-orange-800 shadow-[8px_8px_0px_#7c2d12]';
      label = 'MISLEADING_DATA';
      rotate = '-rotate-1';
      auraColor = 'bg-orange-500';
      statusCode = 'SYS_WARN_42';
      break;
    case VerdictType.UNVERIFIABLE:
    default:
      colorClass = 'bg-gray-700 text-white border-gray-900 shadow-[8px_8px_0px_#111827]';
      label = 'UNKNOWN_SIG';
      rotate = 'rotate-1';
      auraColor = 'bg-gray-400';
      statusCode = 'SYS_NULL_00';
      break;
  }

  return (
    <div className="relative inline-block group py-4 px-6">
        {/* Dynamic Pulsing Aura - Increased spread with -inset-4 */}
        <div className={`absolute -inset-4 ${auraColor} blur-2xl animate-aura pointer-events-none rounded-full opacity-40 group-hover:opacity-80 transition-opacity`}></div>
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 z-20 group-hover:border-white transition-colors"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 z-20 group-hover:border-white transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 z-20 group-hover:border-white transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 z-20 group-hover:border-white transition-colors"></div>

        <div className={`relative z-10 overflow-hidden ${rotate} transform group-hover:scale-110 group-hover:rotate-0 transition-all duration-300`}>
            {/* The Badge Core */}
            <span 
              key={verdict} 
              className={`font-arcade tracking-tighter text-[11px] md:text-xs px-10 py-4 border-4 ${colorClass} animate-glitch-once block uppercase font-black relative overflow-hidden`}
            >
              {label}
              
              {/* Internal Scanline Beam */}
              <div className="absolute top-0 bottom-0 w-16 bg-white/40 blur-md -skew-x-12 animate-beam pointer-events-none"></div>
              
              {/* Internal decorative micro-text */}
              <span className="absolute bottom-1 right-2 text-[6px] opacity-30 font-mono tracking-widest hidden md:block">
                {statusCode}
              </span>
            </span>
        </div>

        {/* Small floating tag */}
        <div className="absolute -top-1 -right-4 bg-black border border-white/10 px-2 py-0.5 z-30 transform -rotate-12 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 group-hover:-translate-y-2">
            <span className="font-arcade text-[6px] text-white">ARENA_VERDICT</span>
        </div>
    </div>
  );
};

export default VerdictBadge;
