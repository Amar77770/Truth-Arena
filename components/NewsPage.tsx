
import React, { useEffect, useState } from 'react';
import { getLatestExamNews } from '../services/geminiService';
import { fetchLatestNewsSnapshot, saveNewsSnapshot } from '../services/supabaseClient';
import { NewsItem } from '../types';
import { soundService } from '../services/soundService';

const CACHE_KEY_DATA = 'truth_arena_news_data';
const CACHE_KEY_TIME = 'truth_arena_news_timestamp';
const REFRESH_INTERVAL = 3600000; // 1 Hour in ms

interface NewsPageProps {
  username: string;
}

const NewsPage: React.FC<NewsPageProps> = ({ username }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextUpdate, setNextUpdate] = useState<string>('');
  const [sourceType, setSourceType] = useState<'GLOBAL_DB' | 'LOCAL_CACHE' | 'LIVE_AI'>('LIVE_AI');

  const fetchNews = async () => {
    setLoading(true);

    const globalData = await fetchLatestNewsSnapshot();
    const now = Date.now();

    if (globalData && globalData.created_at) {
        const globalTime = new Date(globalData.created_at).getTime();
        const age = now - globalTime;

        if (age < REFRESH_INTERVAL) {
            setNews(globalData.data);
            setSourceType('GLOBAL_DB');
            localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(globalData.data));
            localStorage.setItem(CACHE_KEY_TIME, globalTime.toString());
            setLoading(false);
            return;
        }
    }

    const data = await getLatestExamNews();
    if (data && data.length > 0) {
      setNews(data);
      setSourceType('LIVE_AI');
      localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data));
      localStorage.setItem(CACHE_KEY_TIME, now.toString());
      saveNewsSnapshot(data);
    } else {
        // Handle empty response (likely API key missing or AI refusal)
        setNews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAndFetch = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY_DATA);
      const cachedTime = localStorage.getItem(CACHE_KEY_TIME);
      const now = Date.now();

      if (cachedData && cachedTime) {
        const age = now - parseInt(cachedTime);
        if (age < REFRESH_INTERVAL) {
          try {
            const parsed = JSON.parse(cachedData);
            if (parsed.length > 0) {
                setNews(parsed);
                setSourceType('LOCAL_CACHE');
                setLoading(false);
                return;
            }
          } catch(e) {}
        }
      }
      await fetchNews();
    };
    checkAndFetch();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
        const cachedTime = localStorage.getItem(CACHE_KEY_TIME);
        if (cachedTime) {
            const nextTime = parseInt(cachedTime) + REFRESH_INTERVAL;
            const diff = nextTime - Date.now();
            if (diff > 0) {
                const minutes = Math.floor(diff / 60000);
                setNextUpdate(`${minutes}m`);
            } else {
                setNextUpdate("0m");
            }
        }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [news]);

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto p-4 md:p-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-green-500 pb-4 relative">
           <div className="absolute -top-6 left-0 font-arcade text-[8px] text-gray-600 tracking-widest uppercase">SIG_INT_SATELLITE_LINK: ESTABLISHED</div>
           <div>
               <h2 className="font-comic text-6xl md:text-7xl text-green-400 drop-shadow-[4px_4px_0px_black] uppercase leading-none">
                  INTEL FEED
               </h2>
               <p className="font-arcade text-gray-500 text-[10px] mt-2 uppercase tracking-tighter">
                  Real-time intercepts from official academic channels
               </p>
           </div>
           <div className="mt-4 md:mt-0 text-right font-arcade text-[9px] bg-black/50 p-3 border border-green-900 shadow-inner">
               <div className="flex items-center justify-end gap-2 text-green-500 mb-1">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   NEURAL_SYNC_ONLINE
               </div>
               <div className="text-gray-500">NEXT_RECALIBRATION: {nextUpdate}</div>
               <div className="text-[10px] text-gray-700 mt-1">SOURCE: {sourceType}</div>
           </div>
       </div>

       {loading ? (
           <div className="flex flex-col items-center justify-center py-24 space-y-6">
               <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-green-900 rounded-full opacity-20"></div>
                    <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
               <div className="font-arcade text-green-400 text-xs animate-pulse tracking-[0.2em]">DECRYPTING_SIGNALS...</div>
           </div>
       ) : news.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 border-4 border-dashed border-gray-800 bg-black/40">
               <div className="text-6xl grayscale opacity-20 mb-4">📡</div>
               <h3 className="font-arcade text-gray-500 text-sm mb-2">NO_INTEL_FOUND</h3>
               <p className="font-mono text-gray-600 text-xs italic max-w-md text-center">
                   The satellites are offline or the API Uplink key is missing. 
                   <br/>Check your connection credentials (API_KEY).
               </p>
               <button 
                  onClick={() => { soundService.playClick(); fetchNews(); }}
                  className="mt-6 font-arcade text-[10px] bg-gray-900 text-green-500 px-4 py-2 border border-green-900 hover:border-green-500 hover:text-white transition-all"
               >
                   RETRY_UPLINK
               </button>
           </div>
       ) : (
           <div className="grid gap-8">
               {news.map((item) => (
                   <div key={item.id} className="group relative bg-black/80 backdrop-blur-md border-2 border-gray-800 hover:border-green-500 transition-all duration-300 p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.5)] overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 group-hover:bg-green-500/10 transition-colors pointer-events-none"></div>
                       <div className="absolute top-0 right-0 w-1 h-8 bg-green-900 group-hover:bg-green-500"></div>
                       <div className="absolute top-0 right-0 w-8 h-1 bg-green-900 group-hover:bg-green-500"></div>
                       <div className="absolute bottom-0 left-0 w-12 h-1 bg-gray-900 group-hover:bg-green-500"></div>

                       <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-green-900/30 border border-green-500 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                                   🗞️
                               </div>
                               <div>
                                   <span className="bg-green-900/40 text-green-400 border border-green-800 px-3 py-1 text-[9px] font-arcade uppercase tracking-tighter">
                                       ORG: {item.sourceName}
                                   </span>
                               </div>
                           </div>
                           <span className="text-gray-600 font-mono text-[10px] bg-black px-2 py-1">
                               LOG_ID: {item.id.slice(0, 6)} // {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                       </div>

                       <h3 className="font-bold text-white text-2xl md:text-3xl font-mono mb-4 group-hover:text-green-300 transition-colors uppercase leading-tight pr-4">
                           {item.headline}
                       </h3>
                       
                       <div className="relative mb-6">
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-900/30 group-hover:bg-green-500/50 transition-colors"></div>
                           <p className="text-gray-400 text-base font-mono leading-relaxed pl-6 italic">
                               {item.summary}
                           </p>
                       </div>

                       <div className="flex items-center justify-between">
                           <a 
                               href={item.sourceUrl} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               onClick={() => soundService.playClick()}
                               className="inline-flex items-center gap-3 bg-green-600 text-black px-5 py-2 font-arcade text-[10px] border-2 border-white hover:bg-green-400 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-[4px_4px_0px_black]"
                           >
                               READ_FULL_DOSSIER <span>↗</span>
                           </a>
                           <div className="font-arcade text-[8px] text-gray-700 animate-pulse">SECURITY_LEVEL: VERIFIED</div>
                       </div>
                   </div>
               ))}
           </div>
       )}

       {username === 'Crazy Admin' && (
        <div className="mt-12 text-center">
            <button 
                onClick={() => { soundService.playClick(); fetchNews(); }}
                className="group relative bg-gray-900 text-green-500 font-arcade text-[10px] px-8 py-4 border-2 border-green-900 hover:border-green-500 hover:text-white transition-all shadow-[6px_6px_0px_black] active:translate-y-1 active:shadow-none"
            >
                <span className="animate-pulse">▶</span> FORCE_SYSTEM_RELOAD
            </button>
        </div>
       )}
    </div>
  );
};

export default NewsPage;
