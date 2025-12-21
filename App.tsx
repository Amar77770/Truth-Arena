
import React, { useState, useEffect, useRef } from 'react';
import { analyzeExamNews } from './services/geminiService';
import { soundService } from './services/soundService';
import { fetchBattles, saveBattle, deleteBattle } from './services/supabaseClient';
import { FactCheckReport, ViewState, CaseHistoryItem, VerdictType } from './types';
import VerdictBadge from './components/VerdictBadge';
import ConfidenceGauge from './components/ConfidenceGauge';
import SourceList from './components/SourceList';
import CourtroomDebate from './components/CourtroomDebate';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import NavBar from './components/NavBar';
import CasesPage from './components/CasesPage';
import AboutPage from './components/AboutPage';
import CommunityPage from './components/CommunityPage';
import NewsPage from './components/NewsPage';
import AdminDashboard from './components/AdminDashboard';

const LOADING_MESSAGES = [
  "INTERCEPTING SIGNAL...",
  "DECODING WHATSAPP ENCRYPTION...",
  "SCANNING TELEGRAM METADATA...",
  "CONSULTING THE ANCIENT ARCHIVES...",
  "SHARPENING TRUTH BLADES...",
  "CALCULATING DECEPTION INDEX...",
];

const RELEVANCE_KEYWORDS = [
  'exam', 'test', 'syllabus', 'date', 'schedule', 'neet', 'jee', 'cbse', 'icse', 'upsc', 
  'ssc', 'bank', 'railway', 'cuet', 'cat', 'mat', 'gate', 'board', 'university', 'college', 
  'school', 'nta', 'ugc', 'mhrd', 'education', 'student', 'result', 'card', 'admit', 'hall ticket', 
  'cutoff', 'merit', 'rank', 'counselling', 'seat', 'admission', 'paper', 'question', 'answer', 
  'solution', 'physics', 'chemistry', 'math', 'biology', 'botany', 'zoology', 'science', 'commerce', 
  'arts', 'stream', 'class', 'standard', 'fail', 'pass', 'percentage', 'cgpa', 'postponed', 
  'cancelled', 'conducted', 'held', 'center', 'centre', 'invigilator', 'cheating', 'leak', 'grace', 
  'bonus', 'attempt', 'form', 'fee', 'scholarship', 'phd', 'degree', 'diploma', 'certificate',
  'study', 'prepare', 'preparation', 'mark', 'score', 'percent', 'news', 'notice', 'circular', 
  'official', 'verified', 'rumor', 'fake', 'true', 'checklist'
];

const FUNNY_REJECTIONS = [
  "SYSTEM ERROR: ACADEMIC CONTEXT NOT FOUND.",
  "BLOCKED: THIS ARENA IS FOR EXAMS ONLY.",
  "RELEVANCE CHECK FAILED: ZERO MARKS AWARDED.",
  "OFF-TOPIC ALERT: CALIBRATE TO 'STUDY MODE'.",
  "JURISDICTION ERROR: I ONLY FIGHT EXAM RUMORS.",
];

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const HudCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const styles = {
    tl: 'top-0 left-0 border-t-4 border-l-4',
    tr: 'top-0 right-0 border-t-4 border-r-4',
    bl: 'bottom-0 left-0 border-b-4 border-l-4',
    br: 'bottom-0 right-0 border-b-4 border-r-4'
  };
  return <div className={`absolute w-6 h-6 border-cyan-500 z-10 pointer-events-none opacity-50 ${styles[position]}`}></div>;
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [report, setReport] = useState<FactCheckReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<{ mimeType: string; data: string } | null>(null);
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video' | 'audio' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVsScreen, setShowVsScreen] = useState(false);
  const [vsImpact, setVsImpact] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [history, setHistory] = useState<CaseHistoryItem[]>([]);

  useEffect(() => {
    if (!username) { setHistory([]); return; }
    if (view === 'CASES' || view === 'FIGHT') {
      const loadData = async () => {
        const data = await fetchBattles(username);
        if (data) setHistory(data);
      };
      loadData();
    }
  }, [username, view]);

  useEffect(() => {
    let msgInterval: any;
    let impactTimeout: any;

    if (showVsScreen) {
      msgInterval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 800);

      // Trigger impact shake/flash after clash animation duration
      impactTimeout = setTimeout(() => {
        setVsImpact(true);
        soundService.playError(); // Use low buzz as a clash sound
        setTimeout(() => setVsImpact(false), 400);
      }, 700); 
    }

    return () => {
      clearInterval(msgInterval);
      clearTimeout(impactTimeout);
    };
  }, [showVsScreen]);

  const handleLogin = (user: string) => {
    soundService.init();
    soundService.playStart();
    setUsername(user);
    if (user === 'Admin11') {
      setView('ADMIN');
    } else {
      setView('FIGHT');
    }
  };

  const handleLogout = () => {
    soundService.playNav();
    setUsername('');
    setView('LANDING');
    setReport(null);
    setQuery('');
    handleClearMedia();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("FILE TOO LARGE. DATA TAPE CAPACITY EXCEEDED (10MB LIMIT).");
      soundService.playError();
      return;
    }
    soundService.playClick();
    if (file.type.startsWith('image/')) {
      try {
        const optimizedDataUrl = await resizeImage(file);
        const base64Data = optimizedDataUrl.split(',')[1];
        setMediaFile({ mimeType: 'image/jpeg', data: base64Data });
        setMediaPreview({ url: optimizedDataUrl, type: 'image' });
      } catch (error) {
        setError("IMAGE PROCESSING ERROR. TRY A SMALLER FILE.");
        soundService.playError();
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setMediaFile({ mimeType: file.type, data: base64Data });
        let type: 'image' | 'video' | 'audio' = 'image';
        if (file.type.startsWith('video')) type = 'video';
        else if (file.type.startsWith('audio')) type = 'audio';
        setMediaPreview({ url: URL.createObjectURL(file), type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview.url);
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    soundService.playNav();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !mediaFile) return;
    if (!mediaFile && query.trim()) {
      const hasKeyword = RELEVANCE_KEYWORDS.some(keyword => query.toLowerCase().includes(keyword));
      if (!hasKeyword) {
        soundService.playError();
        setError(FUNNY_REJECTIONS[Math.floor(Math.random() * FUNNY_REJECTIONS.length)]);
        return;
      }
    }
    soundService.playClick();
    setLoading(true);
    setShowVsScreen(true);
    setError(null);
    setReport(null);
    try {
      // Extended animation time for more epic VS screen
      const minAnimationTime = new Promise(resolve => setTimeout(resolve, 5000));
      const analysisRequest = analyzeExamNews(query, mediaFile || undefined);
      const [_, data] = await Promise.all([minAnimationTime, analysisRequest]);
      setReport(data);
      setShowVsScreen(false);
      soundService.playSuccess();
      const newItem: CaseHistoryItem = {
        id: `${username}-${Date.now().toString(36)}`,
        query: data.topic,
        timestamp: new Date().toISOString(),
        verdict: data.claims.length > 0 ? data.claims[0].verdict : 'UNKNOWN',
        confidence: data.overallConfidence
      };
      setHistory(prev => [newItem, ...prev]);
      saveBattle(newItem);
      setLoading(false);
    } catch (err: any) {
      setError("CONNECTION SEVERED BY SOLAR FLARE.");
      setLoading(false);
      setShowVsScreen(false);
      soundService.playError();
    }
  };

  const handleDeleteCase = async (id: string) => {
    soundService.playError(); // Use error/delete sound
    // Optimistic Update
    const oldHistory = [...history];
    setHistory(prev => prev.filter(item => item.id !== id));
    
    try {
        await deleteBattle(id);
    } catch (e) {
        // Revert on failure
        setHistory(oldHistory);
        setError("DELETE FAILED: SECURE LOCK ENGAGED");
    }
  };

  const handleShare = async () => {
    if (!report) return;
    soundService.playClick();
    
    const verdict = report.claims.length > 0 ? report.claims[0].verdict : 'UNKNOWN';
    const text = `🚨 TRUTH ARENA BATTLE LOG 🚨\n\nTOPIC: "${report.topic}"\nVERDICT: ${verdict}\nCONFIDENCE: ${report.overallConfidence}%\n\nVerified by #TruthArena #ExamGuard`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Truth Arena Verdict',
                text: text,
            });
        } catch (e) {
            console.log('Share aborted');
        }
    } else {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
  };

  const getThemeClasses = (verdict: VerdictType | undefined) => {
    switch (verdict) {
      case VerdictType.SUPPORTED:
        return { border: 'border-green-500', shadow: 'shadow-[10px_10px_0px_0px_#22c55e]', title: 'text-green-400', badgeBg: 'bg-green-500', summaryBorder: 'border-green-500', summaryText: 'text-green-100' };
      case VerdictType.CONTRADICTED:
        return { border: 'border-red-600', shadow: 'shadow-[10px_10px_0px_0px_#dc2626]', title: 'text-red-500', badgeBg: 'bg-red-600', summaryBorder: 'border-red-500', summaryText: 'text-red-100' };
      default:
        return { border: 'border-orange-500', shadow: 'shadow-[10px_10px_0px_0px_#f97316]', title: 'text-orange-400', badgeBg: 'bg-orange-500', summaryBorder: 'border-orange-500', summaryText: 'text-orange-100' };
    }
  };

  if (view === 'LANDING') return <LandingPage onStart={() => setView('LOGIN')} />;

  const showChrome = view !== 'ADMIN' && view !== 'LOGIN';

  return (
    <div className={`h-screen flex flex-col bg-black selection:bg-cyan-500 selection:text-black overflow-hidden relative ${vsImpact ? 'animate-shake' : ''}`}>
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[200px] animate-[scan_10s_linear_infinite]"></div>
      </div>

      {showVsScreen ? (
          <div className="fixed inset-0 bg-black flex flex-col items-center justify-center relative overflow-hidden z-[100] font-arcade">
              {/* Dynamic Speed Lines Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                  {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="streak" 
                        style={{ 
                            top: `${Math.random() * 100}%`, 
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${0.1 + Math.random() * 0.3}s`,
                            transform: `scale(${0.4 + Math.random() * 1.5})`
                        }}
                      ></div>
                  ))}
              </div>

               {/* Impact Flash Overlay */}
               <div className={`absolute inset-0 bg-white z-[110] transition-opacity duration-200 pointer-events-none ${vsImpact ? 'opacity-50' : 'opacity-0'}`}></div>

               {/* VS Screen Layout */}
               <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 relative z-10 w-full h-full px-4 overflow-hidden">
                   
                   {/* CHALLENGER: RUMOR (Flies in from Left) */}
                   <div className="flex flex-col items-center animate-clash-left flex-1 h-full justify-center group relative w-full">
                       <div className="relative z-10 flex flex-col items-center">
                           <div className="text-[12rem] md:text-[20rem] transform -scale-x-100 filter drop-shadow-[0_0_80px_#ec4899] mb-4 animate-glitch transition-transform group-hover:scale-110">🦜</div>
                           <div className="space-y-4 text-center w-full max-w-sm">
                               <div className="font-arcade text-pink-500 text-3xl md:text-5xl bg-black px-10 py-4 border-4 border-pink-500 shadow-[12px_12px_0px_#701a75] uppercase tracking-[0.2em] inline-block">RUMOR</div>
                               <div className="h-8 w-full bg-gray-900 border-2 border-pink-900 overflow-hidden mt-6 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                                   <div className="h-full bg-pink-500 w-[85%] animate-pulse"></div>
                               </div>
                               <div className="text-[12px] text-pink-400 tracking-[0.4em] uppercase font-black mt-2">DANGER_LEVEL: CRITICAL</div>
                           </div>
                       </div>
                   </div>

                   {/* VS LOGO (Zooms and Slams) */}
                   <div className="flex flex-col items-center animate-zoom-slam relative z-20 shrink-0 md:mx-[-6rem]">
                       <div className="absolute inset-0 bg-yellow-500/50 blur-[180px] rounded-full animate-pulse scale-150"></div>
                       <div className="relative">
                           <div className="font-comic text-[14rem] md:text-[26rem] text-white italic font-bold drop-shadow-[20px_20px_0px_#000] animate-fight relative leading-none select-none z-10">VS</div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-3 bg-white/40 -rotate-45 hidden md:block opacity-50"></div>
                       </div>
                   </div>

                   {/* DEFENDER: LOGIC (Flies in from Right) */}
                   <div className="flex flex-col items-center animate-clash-right flex-1 h-full justify-center group relative w-full">
                       <div className="relative z-10 flex flex-col items-center">
                           <div className="text-[12rem] md:text-[20rem] filter drop-shadow-[0_0_80px_#06b6d4] mb-4 transition-transform group-hover:scale-110">🕵️‍♂️</div>
                           <div className="space-y-4 text-center w-full max-w-sm">
                               <div className="font-arcade text-cyan-400 text-3xl md:text-5xl bg-black px-10 py-4 border-4 border-cyan-400 shadow-[12px_12px_0px_#164e63] uppercase tracking-[0.2em] inline-block">LOGIC</div>
                               <div className="h-8 w-full bg-gray-900 border-2 border-cyan-900 overflow-hidden mt-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                   <div className="h-full bg-cyan-500 w-[98%]"></div>
                               </div>
                               <div className="text-[12px] text-cyan-400 tracking-[0.4em] uppercase font-black mt-2">SYSTEM_INTEGRITY: MAXIMUM</div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* BOTTOM CINEMATIC HUD */}
               <div className="absolute bottom-12 w-full max-w-5xl px-8 z-30">
                   <div className="bg-black/95 border-4 border-white/30 p-10 relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,1)]">
                       <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 animate-pulse"></div>
                       <div className="absolute top-0 right-0 w-2 h-full bg-pink-500 animate-pulse"></div>
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-white to-pink-500"></div>
                       
                       <div className="flex flex-col items-center gap-6">
                           <div className="text-white font-arcade text-xl md:text-3xl tracking-[0.3em] text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-glitch uppercase font-black">
                               {LOADING_MESSAGES[loadingMsgIndex]}
                           </div>
                           <div className="flex items-center gap-8 w-full">
                               <span className="font-arcade text-[10px] text-cyan-500 whitespace-nowrap">CALCULATING...</span>
                               <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                   <div className="h-full bg-yellow-400 animate-[progress_1.5s_linear_infinite]" style={{ width: '60%' }}></div>
                               </div>
                               <span className="font-arcade text-[10px] text-pink-500 whitespace-nowrap">DECODING...</span>
                           </div>
                       </div>
                   </div>
               </div>
               
               {/* Global CRT Noise Overlay */}
               <div className="absolute inset-0 pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')] opacity-20 mix-blend-overlay"></div>
          </div>
      ) : (
        <>
          {showChrome && (
            <header className="shrink-0 border-b-4 border-white bg-black/90 backdrop-blur-md z-40 shadow-[0px_4px_15px_rgba(0,255,255,0.1)] py-[1.125rem]">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-[4.5rem]">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { soundService.playNav(); setView('FIGHT'); }}>
                    <div className="h-12 w-12 bg-yellow-400 border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:bg-cyan-400 transition-colors">
                    <span className="text-2xl">⚔️</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-comic text-white tracking-wide uppercase drop-shadow-[2px_2px_0px_#ff00ff]">
                        TRUTH<span className="text-yellow-400">ARENA</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => { soundService.playNav(); setView('ABOUT'); }}
                        className={`font-arcade text-[12px] border-2 px-6 py-2 shadow-[4px_4px_0px_black] transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none ${view === 'ABOUT' ? 'bg-yellow-400 text-black border-yellow-400' : 'text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black'}`}>
                        CREDENTIALS
                    </button>
                </div>
                </div>
            </header>
          )}

          <div className="flex-1 overflow-y-auto relative z-10 w-full scrollbar-thumb-pink-500 scrollbar-track-gray-900">
              <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 min-h-full flex flex-col justify-center">
                {view === 'LOGIN' && <LoginPage onLogin={handleLogin} />}
                {view === 'FIGHT' && (
                    <div className="animate-fade-in-up w-full">
                        {!report && (
                          <div className="block">
                            <div className="text-center mb-10 md:mb-14 relative">
                                <h2 className="font-arcade text-cyan-400 text-2xl md:text-4xl uppercase tracking-[0.2em] mb-4">CHOOSE YOUR FIGHT</h2>
                                <h1 className="font-comic text-7xl md:text-9xl text-white italic drop-shadow-[6px_6px_0px_#ff00ff] leading-none uppercase tracking-tight flex items-center justify-center gap-4">
                                  FACT <span className="text-yellow-400">CHECK</span>
                                </h1>
                            </div>
                            {error && (
                              <div className="bg-red-950/40 backdrop-blur-xl text-white font-arcade text-xs p-8 border-4 border-red-500 mb-10 text-center animate-shake max-w-2xl mx-auto relative z-30">
                                  <span className="text-4xl block mb-4 uppercase text-red-500">💀 PROTOCOL ERROR 💀</span>
                                  <div className="font-mono text-gray-300">{error}</div>
                              </div>
                            )}
                            <div className="max-w-6xl mx-auto mb-6 relative z-20">
                                <form onSubmit={handleVerify} className="flex flex-col lg:flex-row gap-5 items-stretch">
                                    <div className="flex-1 relative">
                                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,audio/*,video/*" className="hidden" />
                                        <div className="border-4 border-white h-full relative group">
                                             <input 
                                                type="text" 
                                                value={query} 
                                                onChange={(e) => setQuery(e.target.value)} 
                                                placeholder="INSERT RUMOR OR UPLOAD EVIDENCE.."
                                                className="w-full h-24 md:h-32 bg-black text-gray-400 font-arcade placeholder-gray-800 px-10 py-3 focus:outline-none uppercase text-lg md:text-xl transition-all" 
                                            />
                                            {mediaPreview && (
                                                <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-900 border border-white p-1">
                                                    {mediaPreview.type === 'image' ? <img src={mediaPreview.url} className="w-12 h-12 object-cover" /> : <span className="text-2xl">📼</span>}
                                                    <button type="button" onClick={handleClearMedia} className="text-red-500 text-xs px-2">X</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-5 h-24 md:h-32">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-32 md:w-40 border-4 border-white bg-cyan-600 hover:bg-cyan-500 transition-colors flex flex-col items-center justify-center gap-2 group">
                                            <span className="text-2xl grayscale group-hover:grayscale-0">💾</span>
                                            <span className="font-arcade text-[10px] md:text-xs text-white uppercase font-black">EVIDENCE</span>
                                        </button>
                                        <button type="submit" disabled={loading} className="w-48 md:w-60 bg-[#ff00ff] text-white font-arcade text-xl md:text-2xl border-4 border-white uppercase hover:bg-pink-600 transition-all active:translate-y-1 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none"></div>
                                            <span className="relative z-10 group-hover:scale-110 transition-transform inline-block">FIGHT!</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="text-center font-arcade text-gray-700 text-[10px] md:text-xs uppercase tracking-widest mt-4">SUPPORTED FORMATS: JPG, PNG, MP3, WAV, MP4, WEBM</div>
                          </div>
                        )}
                        {report && (
                        <div className="space-y-12 max-w-5xl mx-auto animate-fade-in-up pb-20">
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                                <button onClick={() => { soundService.playNav(); setReport(null); }} className="font-arcade text-xs text-yellow-400 hover:text-white transition-colors flex items-center gap-3 group">
                                    <span className="text-lg">◀</span> RETURN_TO_COMMAND_CENTER
                                </button>
                                <button onClick={handleShare} className="font-arcade text-xs bg-cyan-950/50 text-cyan-400 border border-cyan-500 px-6 py-2 hover:bg-cyan-500 hover:text-black transition-all shadow-[4px_4px_0px_#0891b2] active:shadow-none active:translate-y-1 flex items-center gap-2 group">
                                    <span className="group-hover:animate-pulse">📡</span> BROADCAST_VERDICT
                                </button>
                            </div>
                            <div className="relative">
                                <HudCorner position="tl" />
                                <HudCorner position="tr" />
                                <CourtroomDebate script={report.debateScript} />
                            </div>
                            {(() => {
                                const theme = getThemeClasses(report.claims[0]?.verdict);
                                return (
                                    <div className={`border-4 ${theme.border} bg-black/90 backdrop-blur-md p-10 ${theme.shadow} relative group transition-all`}>
                                        <div className={`absolute top-0 right-0 ${theme.badgeBg} text-black font-arcade text-[10px] px-4 py-2 border-b-4 border-l-4 border-black font-black uppercase tracking-tighter`}>COMMAND_VERDICT</div>
                                        <div className="flex flex-col md:flex-row gap-10 items-start">
                                            <div className="flex-1">
                                              <h2 className={`font-comic text-6xl ${theme.title} mb-6 uppercase drop-shadow-[3px_3px_0px_#000] tracking-tight`}>"{report.topic}"</h2>
                                              <div className={`font-mono ${theme.summaryText} text-xl leading-relaxed border-l-8 ${theme.summaryBorder} pl-8 bg-white/5 p-6 italic`}>{report.summary}</div>
                                              <div className="mt-8 bg-black/40 border border-gray-800 p-4">
                                                  <h4 className="font-arcade text-[10px] text-yellow-400 mb-2 uppercase tracking-widest">>> COMBAT_DIRECTIVE:</h4>
                                                  <p className="font-mono text-white text-sm uppercase">{report.actionRecommendation}</p>
                                              </div>
                                            </div>
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border-4 border-gray-800 min-w-[200px] shadow-inner">
                                                <ConfidenceGauge score={report.overallConfidence} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                            
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="bg-black/80 border-4 border-gray-900 p-8 shadow-[10px_10px_0px_black] relative">
                                    <div className="absolute top-0 left-4 bg-gray-900 px-3 py-1 font-arcade text-[8px] text-cyan-400 -translate-y-1/2 border border-cyan-400">OFFICIAL_TIMELINE</div>
                                    <div className="space-y-4">
                                        {report.officialTimeline.map((ev, i) => (
                                            <div key={i} className="flex gap-4 items-start group">
                                                <div className="font-arcade text-[8px] text-gray-600 mt-1 whitespace-nowrap">{ev.date}</div>
                                                <div className="flex-1 border-l-2 border-gray-800 pl-4 group-hover:border-cyan-500 transition-colors">
                                                    <p className="font-mono text-white text-xs uppercase">{ev.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {report.officialTimeline.length === 0 && <div className="font-arcade text-gray-700 text-[8px] text-center py-4">NO_TIMELINE_DATA_EXTRACTED</div>}
                                    </div>
                                </div>
                                <div className="bg-black/80 border-4 border-gray-900 p-8 shadow-[10px_10px_0px_black] relative">
                                    <div className="absolute top-0 left-4 bg-gray-900 px-3 py-1 font-arcade text-[8px] text-pink-500 -translate-y-1/2 border border-pink-500">INTEL_MISCONCEPTIONS</div>
                                    <ul className="space-y-4">
                                        {report.commonMisconceptions.map((mis, i) => (
                                            <li key={i} className="flex gap-3 items-start">
                                                <span className="text-pink-600">⚠</span>
                                                <p className="font-mono text-gray-400 text-xs italic">"{mis}"</p>
                                            </li>
                                        ))}
                                        {report.commonMisconceptions.length === 0 && <div className="font-arcade text-gray-700 text-[8px] text-center py-4">CLEAN_INTEL_SIGNAL</div>}
                                    </ul>
                                </div>
                            </div>

                            <div className="grid gap-10">
                                <h3 className="font-arcade text-lg text-white text-center tracking-[0.4em] mb-4 uppercase">DETAILED_CLAIMS_ANALYSIS</h3>
                                {report.claims.map((claim) => (
                                    <div key={claim.id} className="bg-black/90 backdrop-blur-sm border-4 border-gray-900 p-10 hover:border-cyan-500 transition-all group relative overflow-hidden shadow-[12px_12px_0_0_black]">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8 border-b-2 border-gray-800 pb-8">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white font-mono text-3xl uppercase mb-6 leading-tight group-hover:text-cyan-100 transition-colors">"{claim.text}"</h4>
                                                <p className="text-gray-500 font-mono text-lg leading-relaxed max-w-2xl italic border-l-2 border-gray-800 pl-6">&gt; {claim.reasoning}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-6">
                                                <VerdictBadge verdict={claim.verdict} />
                                                <div className="font-arcade text-[10px] text-gray-800 bg-black px-3 py-1.5 border border-gray-900 uppercase">CAT: {claim.category}</div>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h5 className="font-arcade text-[10px] text-cyan-500 mb-4 uppercase tracking-widest">FORENSIC_EVIDENCE:</h5>
                                                <ul className="space-y-3">
                                                    {claim.evidencePoints.map((point, pi) => (
                                                        <li key={pi} className="flex gap-2 items-start">
                                                            <span className="text-cyan-600 text-[10px]">■</span>
                                                            <span className="font-mono text-gray-400 text-xs uppercase">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex items-center justify-center border-l-2 border-gray-800 pl-8">
                                                <div className="text-center">
                                                    <div className="font-arcade text-[10px] text-gray-600 mb-2">CLAIM_CONFIDENCE</div>
                                                    <div className="text-4xl font-arcade text-white">{claim.confidenceScore}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <SourceList sources={report.sources} />
                        </div>
                        )}
                    </div>
                )}
                {view === 'CASES' && <CasesPage history={history} onDelete={handleDeleteCase} />}
                {view === 'NEWS' && <NewsPage username={username} />}
                {view === 'ADMIN' && <AdminDashboard onExit={() => setView('FIGHT')} />}
                {view === 'ABOUT' && <AboutPage />}
                {view === 'COMMUNITY' && <CommunityPage />}
              </main>
          </div>
          {showChrome && <NavBar currentView={view} setView={setView} onLogout={handleLogout} username={username} />}
        </>
      )}
    </div>
  );
};

export default App;
