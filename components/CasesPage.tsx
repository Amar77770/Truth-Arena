
import React from 'react';
import { CaseHistoryItem } from '../types';
import { soundService } from '../services/soundService';

interface CasesPageProps {
  history: CaseHistoryItem[];
  onDelete: (id: string) => void;
}

const CasesPage: React.FC<CasesPageProps> = ({ history, onDelete }) => {
  const openRetroPrint = (item: CaseHistoryItem) => {
    soundService.playClick();
    
    // Status color mapping based on verdict
    let themeColor = '#00ff00'; // Neon Green (Default/Verified)
    let stampLabel = 'VERIFIED';
    
    if (item.verdict.includes('CONTRADICTED')) {
        themeColor = '#ff0000'; // Pure Red
        stampLabel = 'DEBUNKED';
    } else if (item.verdict.includes('MISLEADING') || item.verdict === 'UNVERIFIABLE' || item.verdict === 'UNCERTAIN') {
        themeColor = '#ffaa00'; // Amber
        stampLabel = 'UNCERTAIN';
    } else if (item.verdict.includes('SUPPORTED') || item.verdict === 'TRUE') {
        themeColor = '#00ff00';
        stampLabel = 'TRUE';
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>BATTLE_REPORT_${item.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @page { size: landscape; margin: 0; }
            * { box-sizing: border-box; }
            body { 
              background-color: #000; 
              color: #fff; 
              font-family: 'Space Grotesk', sans-serif; 
              padding: 0; 
              margin: 0; 
              overflow: hidden;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              width: 95%;
              height: 90%;
              border: 10px solid ${themeColor};
              background: #000;
              padding: 40px;
              position: relative;
              display: flex;
              flex-direction: column;
            }
            
            /* Dotted separator */
            .separator {
              width: 100%;
              border-top: 4px dotted ${themeColor};
              margin: 30px 0;
            }

            header {
              text-align: center;
              margin-bottom: 20px;
            }
            header h1 {
              font-family: 'Press Start 2P', cursive;
              font-size: 28px;
              margin: 0 0 10px 0;
              letter-spacing: 2px;
            }
            header p {
              font-family: 'Press Start 2P', cursive;
              font-size: 8px;
              color: rgba(255,255,255,0.6);
              margin: 0;
            }

            /* Slanted Stamp */
            .stamp {
              position: absolute;
              top: 40px;
              right: 40px;
              border: 5px solid ${themeColor};
              padding: 10px 30px;
              font-family: 'Press Start 2P', cursive;
              font-size: 18px;
              color: ${themeColor};
              transform: rotate(15deg);
              text-transform: uppercase;
              background: #000;
              z-index: 10;
            }

            .sections {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .section {
              background: rgba(255,255,255,0.03);
              border-left: 5px solid ${themeColor};
              padding: 15px 20px;
            }
            .section-label {
              font-family: 'Press Start 2P', cursive;
              font-size: 9px;
              color: rgba(255,255,255,0.5);
              margin-bottom: 8px;
              display: block;
              text-transform: uppercase;
            }
            .section-value {
              font-size: 18px;
              font-weight: 700;
              color: #fff;
            }
            .verdict-text {
              color: ${themeColor};
            }

            footer {
              margin-top: auto;
              text-align: center;
              font-family: 'Press Start 2P', cursive;
              font-size: 7px;
              color: rgba(255,255,255,0.3);
              letter-spacing: 1px;
            }

            /* Background Watermark */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-family: 'Press Start 2P', cursive;
              font-size: 150px;
              color: rgba(255,255,255,0.02);
              white-space: nowrap;
              pointer-events: none;
              z-index: 0;
            }
          </style>
        </head>
        <body>
          <div class="watermark">IF - TRUE</div>
          <div class="container">
            <div class="stamp">${stampLabel}</div>
            
            <header>
              <h1>TRUTH ARENA 2025</h1>
              <p>OFFICIAL BATTLE REPORT // ARCHIVE ID: ${item.id}</p>
            </header>

            <div class="separator"></div>

            <div class="sections">
              <div class="section">
                <span class="section-label">TIMESTAMP</span>
                <div class="section-value">${new Date(item.timestamp).toLocaleString()}</div>
              </div>

              <div class="section">
                <span class="section-label">TARGET SUBJECT</span>
                <div class="section-value">"${item.query}"</div>
              </div>

              <div class="section">
                <span class="section-label">INTELLIGENCE ANALYSIS</span>
                <div class="section-value">
                  FINAL VERDICT: <span class="verdict-text">${item.verdict}</span><br/>
                  <span style="font-size: 14px; margin-top: 10px; display: block; opacity: 0.8;">CONFIDENCE SCORE: ${item.confidence}%</span>
                </div>
              </div>

              <div class="section">
                <span class="section-label">SYSTEM NOTES</span>
                <div class="section-value" style="font-size: 12px; font-weight: 400; line-height: 1.6;">
                  > SCANNING SOURCES... COMPLETE.<br/>
                  > CROSS-REFERENCING OFFICIAL DATA... COMPLETE.<br/>
                  > DEBATE SIMULATION... LOGGED.<br/>
                  > THIS DOCUMENT IS CERTIFIED BY THE TRUTH ARENA ALGORITHM.
                </div>
              </div>
            </div>

            <footer>
              GENERATED BY EXAMGUARD AI • KEEP IT REAL • FIGHT THE FAKE
            </footer>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-12 border-b-4 border-cyan-500 pb-6 relative">
          <div className="absolute -top-6 left-0 font-arcade text-[8px] text-gray-600 tracking-widest uppercase">ENCRYPTED_DATABASE_ACCESS: LEVEL_2</div>
          <h2 className="font-comic text-7xl text-cyan-400 mb-2 drop-shadow-[4px_4px_0px_black] uppercase leading-none">
              BATTLE LOG
          </h2>
          <p className="font-arcade text-gray-500 text-[10px] mt-2 uppercase tracking-tighter">
              Archive of decoded rumors and logical fatalities
          </p>
      </div>

      {history.length === 0 ? (
          <div className="text-center py-32 bg-black/40 backdrop-blur-sm border-4 border-dashed border-gray-800 rounded-lg">
              <span className="text-8xl grayscale opacity-10 block mb-6">🗄️</span>
              <p className="font-arcade text-gray-600 text-xs mb-4">THE ARCHIVES ARE EMPTY.</p>
              <p className="font-mono text-gray-500 text-sm italic">Initiate verification protocols to log data.</p>
          </div>
      ) : (
          <div className="bg-black/90 backdrop-blur-md border-4 border-gray-800 shadow-[16px_16px_0px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="grid grid-cols-12 gap-2 bg-gray-900/80 p-5 font-arcade text-[10px] text-cyan-500 border-b-4 border-gray-800 uppercase tracking-tighter sticky top-0 z-10 backdrop-blur-md">
                  <div className="col-span-2">TIMESTAMP_UTC</div>
                  <div className="col-span-5">TARGET_SUBJECT</div>
                  <div className="col-span-2 text-center">OUTCOME</div>
                  <div className="col-span-1 text-center">CONF</div>
                  <div className="col-span-2 text-center">ACTIONS</div>
              </div>

              <div className="divide-y-2 divide-gray-900 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-black">
                {history.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 p-5 font-mono text-sm items-center hover:bg-cyan-500/5 transition-all group relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-cyan-500 transition-colors"></div>
                        <div className="col-span-2 text-gray-500 text-[10px] font-arcade">
                            {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                        </div>
                        <div className="col-span-5 text-white font-bold truncate pr-6 text-lg group-hover:text-cyan-300 transition-colors">
                            "{item.query}"
                        </div>
                        <div className="col-span-2 text-center">
                            <span className={`px-3 py-1 text-[9px] font-arcade border-2 border-current shadow-[2px_2px_0px_black] ${
                                item.verdict.includes('SUPPORTED') ? 'text-green-400 bg-green-950/40' : 
                                item.verdict.includes('CONTRADICTED') ? 'text-red-500 bg-red-950/40' : 
                                'text-orange-400 bg-orange-950/40'
                            }`}>
                                {item.verdict === 'CONTRADICTED' ? 'FAKE_NEWS' : item.verdict === 'SUPPORTED' ? 'VERIFIED' : 'UNCERTAIN'}
                            </span>
                        </div>
                        <div className="col-span-1 text-center font-arcade text-cyan-500 text-xs">
                            {item.confidence}%
                        </div>
                        <div className="col-span-2 flex justify-center gap-2">
                             <button 
                                onClick={() => openRetroPrint(item)}
                                className="text-2xl hover:scale-125 hover:rotate-6 transition-all text-white active:scale-90 bg-gray-900 w-10 h-10 flex items-center justify-center border border-gray-700 shadow-[2px_2px_0px_black]"
                                title="Download Dossier PDF"
                            >
                                📂
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                className="text-2xl hover:scale-125 hover:-rotate-6 transition-all text-red-500 active:scale-90 bg-gray-900 w-10 h-10 flex items-center justify-center border border-red-900/50 hover:border-red-500 shadow-[2px_2px_0px_black]"
                                title="Delete Record"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
              </div>
              <div className="bg-gray-900 p-2 border-t-2 border-gray-800 flex justify-between px-4">
                  <span className="font-arcade text-[8px] text-gray-600">DB_COUNT: {history.length}</span>
                  <span className="font-arcade text-[8px] text-gray-600 tracking-widest animate-pulse">SYSTEM_STABLE</span>
              </div>
          </div>
      )}
    </div>
  );
};

export default CasesPage;
