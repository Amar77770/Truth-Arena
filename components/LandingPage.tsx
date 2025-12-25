
import React, { useState, useEffect, useRef } from 'react';
import { soundService } from '../services/soundService';
import { getApiKey } from '../services/geminiService';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState("VERIFYING_SIGNAL");
  
  // Loading State
  const [isInitializing, setIsInitializing] = useState(false);
  const [headerLines, setHeaderLines] = useState<string[]>([]);
  const [bodyLines, setBodyLines] = useState<string[]>([]);
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    const phrases = ["VERIFYING_SIGNAL", "SCANNING_TELEGRAM", "DECODING_WHATSAPP", "NTA_SYNC_ACTIVE", "TRUTH_ENGINE_ARMED"];
    let i = 0;
    const interval = setInterval(() => {
      setGlitchText(phrases[i % phrases.length]);
      i++;
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleStartSequence = () => {
    if (isInitializing) return;
    
    soundService.playStart();
    setIsInitializing(true);
    
    // Clear previous state
    setHeaderLines([]);
    setBodyLines([]);
    setMemoryCount(0);

    // Check API Key Status for Boot Log
    const hasKey = !!getApiKey();
    const linkStatus = hasKey ? "ONLINE (SECURE)" : "OFFLINE (SIMULATION MODE)";

    // Timeline Configuration
    const headers = [
        "Award Modular BIOS v4.51PG, An Energy Star Ally",
        "Copyright (C) 1984-2025, ExamGuard Systems Inc.",
        "PENTIUM-III PROCESSOR - 733MHZ",
    ];

    // Extended timeline for 5 seconds total
    const logs = [
        { text: "Award Plug and Play BIOS Extension v1.0A", delay: 1000 },
        { text: "Initialize Plug and Play Cards...", delay: 1400 },
        { text: "PNP Init Completed", delay: 1800 },
        { text: "Detecting Primary Master   ... GEMINI-3-FLASH (80GB)", delay: 2200 },
        { text: "Detecting Primary Slave    ... VEO-VIDEO-CORE (40GB)", delay: 2600 },
        { text: "Detecting Secondary Master ... SEARCH-GROUNDING-UNIT", delay: 3000 },
        { text: "", delay: 3300 },
        { text: `CHECKING SATELLITE UPLINK... ${linkStatus}`, delay: 3600 },
        { text: "Booting from Hard Disk...", delay: 4200 },
    ];

    // Animate Headers immediately
    headers.forEach((line, i) => {
        setTimeout(() => setHeaderLines(prev => [...prev, line]), i * 150);
    });

    // Animate Memory after headers (Slower count)
    setTimeout(() => {
        let mem = 0;
        const maxMem = 262144; // 256MB
        const memInterval = setInterval(() => {
            mem += 4096;
            if (mem >= maxMem) {
                setMemoryCount(maxMem);
                clearInterval(memInterval);
            } else {
                setMemoryCount(mem);
            }
        }, 20); // Slowed down from 10ms to 20ms
    }, 500);

    // Animate Body Logs
    logs.forEach(({ text, delay }) => {
        setTimeout(() => {
            setBodyLines(prev => [...prev, text]);
            if (text) soundService.playBlip();
        }, delay);
    });

    // Final Transition at 5000ms
    setTimeout(() => {
        onStart();
    }, 5000);
  };

  const rumors = [
    "INTERCEPTING: JEE_MAIN_POSTPONED_RUMOR_092",
    "DECODING: NEET_SYLLABUS_LEAK_TELEGRAM",
    "ANALYZING: CBSE_FAKE_DATESHEET_PNG",
    "VERIFYING: NTA_OFFICIAL_PORTAL_SYNC",
    "NEURAL_LINK: STABLE",
    "JUDGE_STATUS: ARMED",
    "BOSS_SPAWN: UPSC_2025_NOTIF_FAKE",
    "FATALITY: BOARD_RESULT_LINK_SCAM_DELETED",
  ];

  return (
    <div className="min-h-screen bg-black text-white font-arcade overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* === REALISTIC BIOS BOOT SCREEN === */}
      {isInitializing && (
        <div className="fixed inset-0 z-[100000] bg-black font-mono text-[#00ff00] pt-32 pl-6 md:pt-48 md:pl-20 flex flex-col items-start select-none cursor-none text-xs md:text-xl leading-relaxed uppercase overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]">
             
             {/* Energy Star Logo */}
             <div className="absolute top-12 right-6 md:top-24 md:right-24 border-4 border-[#00ff00] p-2 md:p-4 opacity-80">
                 <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 md:w-20 md:h-20 fill-[#00ff00]" viewBox="0 0 24 24">
                        <path d="M11.99 2L14.63 7.37L20.55 8.23L16.27 12.41L17.28 18.31L11.99 15.53L6.69 18.31L7.71 12.41L3.43 8.23L9.35 7.37L11.99 2Z" />
                    </svg>
                    <span className="text-[8px] md:text-[10px] font-bold mt-2 tracking-widest block">ENERGY STAR</span>
                 </div>
             </div>
             
             {/* Header Section */}
             <div className="w-full max-w-5xl space-y-1 mb-8">
                 {headerLines.map((l, i) => <div key={`h-${i}`} className="drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">{l}</div>)}
             </div>
             
             {/* Memory Test */}
             <div className="mb-8 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
                 Memory Test : <span className="text-white">{memoryCount}K OK</span>
             </div>

             {/* Separator */}
             <div className="w-full border-b-2 border-[#00ff00] opacity-50 mb-8 max-w-4xl"></div>

             {/* Body Logs */}
             <div className="w-full max-w-5xl space-y-1">
                 {bodyLines.map((l, i) => (
                    l === "" ? <div key={`b-${i}`} className="h-4"></div> :
                    <div key={`b-${i}`} className="drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">{l}</div>
                 ))}
                 {bodyLines.length > 0 && <div className="animate-pulse">_</div>}
             </div>

             {/* Footer */}
             <div className="mt-auto w-full border-t-2 border-[#00ff00] pt-2 flex justify-between text-[10px] md:text-sm opacity-80 max-w-6xl pb-8 md:pb-16 pr-8">
                 <span>Press DEL to enter SETUP</span>
                 <span>08/15/2025-i440BX-GEMINI-2.5-00</span>
             </div>

             {/* CRT Scanline Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30 z-50"></div>
             <div className="absolute inset-0 bg-radial-gradient(circle, transparent 70%, black 100%) pointer-events-none z-40"></div>
        </div>
      )}

      {/* 1. TOP TACTICAL TICKER */}
      <div className="fixed top-0 left-0 w-full h-8 bg-black border-b border-cyan-900/50 z-[100] flex items-center overflow-hidden whitespace-nowrap">
        <div className="relative z-[110] bg-cyan-600 h-full px-4 flex items-center text-black text-[8px] font-bold tracking-tighter shrink-0 border-r-2 border-black">
          LIVE_SIGNAL_HUD
        </div>
        
        <div className="flex-1 overflow-hidden relative z-[100] h-full flex items-center bg-black">
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite] pl-8">
            {[...rumors, ...rumors].map((r, i) => (
              <span key={i} className="text-cyan-500 text-[8px] flex items-center gap-2">
                <span className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></span>
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- GLOBAL PERSPECTIVE GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]"></div>
        <div className="absolute top-[-25%] left-[-50%] w-[200%] h-[150%] perspective-container opacity-40">
           <div 
             className="absolute inset-0 animate-grid-flow transform origin-center"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
               `,
               backgroundSize: '60px 60px'
             }}
           ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
        <div 
          className="absolute w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
          style={{ 
            left: '50%', 
            top: '50%', 
            transform: `translate(calc(-50% + ${mousePos.x * 0.05}px), calc(-50% + ${mousePos.y * 0.05}px))` 
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Floating Action Header */}
      <nav className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 border-b-2 ${scrolled ? 'bg-black border-cyan-500 py-2' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl animate-pulse">🛡️</span>
            <span className="text-[10px] md:text-xs tracking-tighter text-cyan-400 uppercase">ARENA_OS // {glitchText}</span>
          </div>
          <button 
            onClick={handleStartSequence}
            className="group bg-white text-black px-4 py-1 text-[8px] md:text-[10px] border-2 border-white hover:bg-cyan-500 hover:border-cyan-500 transition-all shadow-[4px_4px_0px_cyan] active:translate-x-1 active:translate-y-1 active:shadow-none font-bold"
          >
            INITIALIZE_LINK
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 z-10 pt-32 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[700px] bg-cyan-400/20 blur-[150px] rounded-full -z-10 animate-pulse"></div>
        <div className="mb-4 text-cyan-500 text-[10px] tracking-[1em] animate-pulse relative z-10">ESTABLISHING_CONSCIOUSNESS...</div>
        <h1 className="font-comic text-7xl md:text-[12rem] text-white leading-none mb-2 drop-shadow-[12px_12px_0px_#ff00ff] italic relative z-10 select-none">
          TRUTH<br/><span className="text-yellow-400">ARENA</span>
        </h1>
        <div className="max-w-2xl mx-auto relative z-10 mt-8 mb-16">
          <p className="text-gray-400 text-[10px] md:text-sm leading-relaxed tracking-wider uppercase">
              Deploying the world's most advanced <span className="text-white font-black italic">GROUNDED-AI</span> combat engine. <br/>
              Dismantling exam rumors with <span className="text-cyan-400 font-bold">pixel-perfect forensics</span>.
          </p>
        </div>
        <button 
          onClick={handleStartSequence}
          className="group relative bg-[#ff00ff] text-white px-20 py-8 text-3xl border-4 border-white shadow-[0_12px_0px_0px_#701a75] hover:shadow-[0_8px_0px_0px_#701a75] hover:translate-y-1 active:translate-y-3 active:shadow-none transition-all font-arcade overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-40"></div>
          START BATTLE
        </button>
      </section>

      {/* PROBLEM SECTION */}
      <section className="relative py-32 px-6 bg-red-950/10 border-t border-red-900/30">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 text-left">
                      <div className="font-arcade text-red-500 text-xs mb-4 animate-pulse">&gt;&gt; WARNING: THREAT DETECTED</div>
                      <h2 className="font-comic text-5xl md:text-7xl text-white mb-6 uppercase leading-tight">
                          THE SIGNAL IS <br/><span className="text-red-600">COMPROMISED</span>
                      </h2>
                      <p className="font-mono text-gray-400 text-sm md:text-lg leading-relaxed mb-8">
                          Every exam season, millions of students are bombarded with <span className="text-white font-bold">fake circulars</span>, 
                          <span className="text-white font-bold"> morphed screenshots</span>, and <span className="text-white font-bold">panic-inducing rumors</span>. 
                          It's not just annoying—it's psychological warfare.
                      </p>
                      <div className="flex gap-4">
                          <div className="bg-red-900/20 border border-red-500/50 p-4">
                              <div className="text-2xl mb-2">🦠</div>
                              <div className="font-arcade text-[10px] text-red-400">VIRAL_HOAXES</div>
                          </div>
                          <div className="bg-red-900/20 border border-red-500/50 p-4">
                              <div className="text-2xl mb-2">🎭</div>
                              <div className="font-arcade text-[10px] text-red-400">DEEPFAKES</div>
                          </div>
                          <div className="bg-red-900/20 border border-red-500/50 p-4">
                              <div className="text-2xl mb-2">💸</div>
                              <div className="font-arcade text-[10px] text-red-400">SCAMS</div>
                          </div>
                      </div>
                  </div>
                  <div className="flex-1 relative">
                      {/* Glitchy Card Visual */}
                      <div className="relative z-10 bg-black border-4 border-red-600 p-8 transform rotate-2 shadow-[10px_10px_0px_#7f1d1d]">
                          <div className="absolute -top-3 -right-3 bg-red-600 text-black font-arcade text-xs px-2 py-1">FAKE</div>
                          <div className="font-mono text-xs text-gray-500 mb-2">&gt;&gt; MESSAGE_ID: 99281</div>
                          <div className="font-serif text-lg text-white mb-4">"URGENT: JEE MAINS 2025 CANCELLED DUE TO SOLAR FLARES!!"</div>
                          <div className="h-2 w-full bg-gray-800 rounded overflow-hidden">
                              <div className="h-full bg-red-600 w-3/4"></div>
                          </div>
                          <div className="flex justify-between mt-2 font-arcade text-[8px] text-red-400">
                              <span>VIRALITY: CRITICAL</span>
                              <span>SOURCE: UNKNOWN</span>
                          </div>
                      </div>
                      <div className="absolute inset-0 border-4 border-gray-800 transform -rotate-2 scale-95 z-0"></div>
                  </div>
              </div>
          </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="relative py-32 px-6 bg-cyan-950/10 border-y-4 border-cyan-900/30 overflow-hidden">
          {/* Grid Background */}
          <div 
              className="absolute inset-0 opacity-10"
              style={{
              backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
              }}
          ></div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="inline-block bg-cyan-900/20 border border-cyan-500 px-4 py-1 font-arcade text-cyan-400 text-[10px] mb-6 rounded-full">
                  POWERED BY GOOGLE GEMINI 3.0
              </div>
              <h2 className="font-comic text-5xl md:text-8xl text-white mb-12 uppercase">
                  DEPLOYING <span className="text-cyan-400">TRUTH KERNEL</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="order-2 md:order-1 relative group">
                      <div className="absolute inset-0 bg-cyan-500 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <div className="relative bg-black border-2 border-cyan-500 p-8 text-left space-y-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-cyan-900 flex items-center justify-center text-2xl border border-cyan-500">🧠</div>
                              <div>
                                  <h4 className="font-arcade text-white text-lg mb-1">MULTI-AGENT DEBATE</h4>
                                  <p className="font-mono text-gray-400 text-xs">We don't just "check" facts. We simulate a courtroom battle between an AI Advocate (Fact) and an AI Skeptic (Rumor) to find the absolute truth.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-green-900 flex items-center justify-center text-2xl border border-green-500">🌍</div>
                              <div>
                                  <h4 className="font-arcade text-white text-lg mb-1">SEARCH GROUNDING</h4>
                                  <p className="font-mono text-gray-400 text-xs">Connected live to the internet. If the NTA released a notice 5 seconds ago, we know about it.</p>
                              </div>
                          </div>
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-pink-900 flex items-center justify-center text-2xl border border-pink-500">👁️</div>
                              <div>
                                  <h4 className="font-arcade text-white text-lg mb-1">VISUAL FORENSICS</h4>
                                  <p className="font-mono text-gray-400 text-xs">Upload that blurry screenshot. Our vision models scan for pixel manipulation and font inconsistencies.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="order-1 md:order-2 text-left md:text-right">
                      <h3 className="font-arcade text-3xl text-white mb-6 leading-tight">
                          "WE TURN FACT-CHECKING INTO A <span className="text-yellow-400">SPECTATOR SPORT</span>."
                      </h3>
                      <p className="font-mono text-gray-400 text-lg mb-8">
                          Truth Arena isn't a boring utility. It's a game where Logic is the weapon and Truth is the high score. 
                          Stop doom-scrolling. Start verifying.
                      </p>
                      <div className="flex flex-wrap gap-4 justify-end">
                          <span className="font-arcade text-[10px] bg-gray-800 text-gray-300 px-3 py-1">REACT 19</span>
                          <span className="font-arcade text-[10px] bg-gray-800 text-gray-300 px-3 py-1">SUPABASE</span>
                          <span className="font-arcade text-[10px] bg-gray-800 text-gray-300 px-3 py-1">GENAI SDK</span>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ROSTER TEASER */}
      <section className="relative py-24 px-6 border-b border-gray-800 bg-black/60">
         <div className="max-w-4xl mx-auto text-center">
             <h2 className="font-arcade text-yellow-400 text-xl mb-4 tracking-[0.5em] uppercase">MEET THE GUILD</h2>
             <p className="font-mono text-white text-xl md:text-2xl italic leading-relaxed">
                 "Admin11" is just the beginning. Join a community of <span className="text-cyan-400">Code Sorcerers</span>, <span className="text-pink-400">Bug Hunters</span>, and <span className="text-green-400">Data Navigators</span>.
             </p>
         </div>
      </section>

      {/* TACTICAL PROTOCOL */}
      <section className="relative py-32 px-6 z-10 border-t border-cyan-900/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-comic text-6xl md:text-8xl text-white mb-24 uppercase italic">TACTICAL_PROTOCOL</h2>
          <div className="grid md:grid-cols-3 gap-0 border-4 border-gray-900 bg-black/80">
            {[
              { step: "01", title: "INTERCEPT", desc: "Upload Telegram screenshots or WhatsApp forwards directly into the Arena.", color: "pink" },
              { step: "02", title: "INTERROGATE", desc: "Gemini-3.0 core cross-references live board portals and official API endpoints.", color: "cyan" },
              { step: "03", title: "TERMINATE", desc: "A final verdict is stamped with a confidence score and action directive.", color: "yellow" }
            ].map((s, idx) => (
              <div key={idx} className={`p-12 border-b-4 md:border-b-0 md:border-r-4 border-gray-900 hover:bg-${s.color}-500/10 transition-colors group text-left`}>
                <div className={`text-4xl font-arcade text-${s.color}-500 mb-6 group-hover:scale-110 transition-transform origin-left`}>{s.step}</div>
                <h3 className="text-xl text-white mb-4 tracking-tighter uppercase">{s.title}</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed uppercase">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative py-48 px-6 z-10 text-center bg-black/80 backdrop-blur-md overflow-hidden">
        <h2 className="font-comic text-7xl md:text-[10rem] text-white leading-none uppercase drop-shadow-[10px_10px_0px_#ff00ff] mb-12 italic relative z-10">
          NO CAP.<br/><span className="text-yellow-400">JUST FACTS.</span>
        </h2>
        <button 
          onClick={handleStartSequence} 
          className="group relative bg-white text-black px-16 py-6 text-2xl font-arcade border-4 border-cyan-500 shadow-[0_12px_0px_0px_#0e7490] hover:translate-y-1 active:translate-y-3 transition-all hover:bg-cyan-500 hover:text-white"
        >
          FIGHT THE FAKE
        </button>
      </section>

      <footer className="relative py-20 px-6 z-10 bg-black border-t border-gray-900 flex flex-col items-center gap-12">
        <div className="text-center">
          <h3 className="font-comic text-5xl text-white tracking-widest mb-4 uppercase">TRUTH ARENA</h3>
          <p className="text-[8px] font-arcade text-gray-700 uppercase tracking-[0.4em] mb-2">Designed for the class of 2025.</p>
          <span className="text-[8px] font-arcade text-cyan-900 uppercase tracking-[0.4em]">© 2025 EXAMGUARD_SYSTEMS</span>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes grid-flow { 
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); } 
          100% { transform: perspective(500px) rotateX(60deg) translateY(60px); } 
        }
        @keyframes scanning {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-grid-flow { animation: grid-flow 3s linear infinite; }
        .perspective-container { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default LandingPage;
