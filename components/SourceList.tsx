
import React from 'react';
import { Source } from '../types';

interface SourceListProps {
  sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  return (
    <div className="mt-10 bg-[#0a0a0a] border-2 border-green-800 p-6 font-mono relative shadow-[0_0_20px_rgba(20,83,45,0.2)] min-h-[150px]">
      <div className="absolute -top-3 left-4 bg-black px-2 text-green-500 font-arcade text-xs border border-green-800 shadow-[0_0_10px_rgba(0,255,0,0.3)] z-10">
        CHEAT CODES (SOURCES)
      </div>
      
      {sources.length === 0 ? (
          <div className="text-center py-6">
              <p className="font-arcade text-[10px] text-gray-600 mb-2">NO_OPEN_SOURCE_INTEL_DETECTED</p>
              <p className="font-mono text-xs text-gray-700 italic">
                  The analysis was generated using internal logic models only.
              </p>
          </div>
      ) : (
          <ul className="space-y-3 mt-4">
            {sources.map((source, index) => (
              <li key={index} className="group relative">
                {/* Link Container */}
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 bg-black/40 border border-green-900/50 hover:border-green-500 hover:bg-green-900/20 transition-all duration-300 relative overflow-hidden block group-hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                >
                  {/* Sliding Scanline Effect */}
                  <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent skew-x-12 group-hover:animate-[scanning_1s_linear_infinite] pointer-events-none"></div>
                  
                  {/* Left Accent Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-bottom"></div>

                  {/* Index Number */}
                  <span className="font-arcade text-xs text-green-800 group-hover:text-green-400 group-hover:drop-shadow-[0_0_5px_#22c55e] transition-colors pt-1">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Link Content */}
                  <div className="flex-1 relative z-10">
                      <div className="text-sm text-green-600 group-hover:text-green-300 font-bold transition-all break-all group-hover:tracking-wide font-mono uppercase">
                        {source.title || source.uri}
                      </div>
                      <div className="text-[10px] text-green-900 group-hover:text-green-500 mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span>ACCESS_ARCHIVE</span>
                        <span className="text-xs">↗</span>
                      </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
      )}
      <style>{`
        @keyframes scanning {
            0% { left: -100%; }
            100% { left: 200%; }
        }
      `}</style>
    </div>
  );
};

export default SourceList;
