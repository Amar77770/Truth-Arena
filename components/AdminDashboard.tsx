
import React, { useEffect, useState } from 'react';
import { fetchAllBattles, deleteBattle } from '../services/supabaseClient';
import { CaseHistoryItem } from '../types';
import { soundService } from '../services/soundService';

interface AdminDashboardProps {
    onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [logs, setLogs] = useState<CaseHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalCases: 0,
    uniqueUsers: 0,
    fakeCount: 0,
    verifiedCount: 0,
    uncertainCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Initial Fetch
  useEffect(() => {
    const loadAdminData = async () => {
      const data = await fetchAllBattles();
      setLogs(data);
      setLoading(false);
    };

    loadAdminData();
  }, []);

  // Recalculate stats whenever logs change (including after deletion)
  useEffect(() => {
    if (loading) return;

    const uniqueUsers = new Set(logs.map(item => item.id.split('-')[0])).size;
    const fakeCount = logs.filter(item => item.verdict.includes('CONTRADICTED')).length;
    const verifiedCount = logs.filter(item => item.verdict.includes('SUPPORTED')).length;
    const uncertainCount = logs.length - fakeCount - verifiedCount;

    setStats({
      totalCases: logs.length,
      uniqueUsers,
      fakeCount,
      verifiedCount,
      uncertainCount
    });
  }, [logs, loading]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("WARNING: PERMANENTLY ERASE RECORD FROM MAINFRAME?")) return;
    soundService.playError(); // Use error sound for destructive action

    // Optimistic update
    const prevLogs = [...logs];
    setLogs(prev => prev.filter(l => l.id !== id));

    try {
        await deleteBattle(id);
    } catch (e) {
        console.error("Delete failed", e);
        setLogs(prevLogs); // Revert on failure
        alert("SYSTEM ERROR: UNABLE TO DELETE");
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-red-500 font-mono animate-pulse gap-4">
            <div className="text-6xl">⚠️</div>
            <div className="font-arcade text-xl tracking-widest">>> ACCESSING CLASSIFIED MAINFRAME...</div>
            <div className="text-xs text-red-800">AUTHORIZATION CODE: OMEGA</div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto p-4 md:p-8 relative">
       {/* Exit Button for God Mode */}
       <button 
           onClick={onExit}
           className="fixed top-6 right-6 bg-red-600/20 text-red-500 border border-red-500 px-4 py-2 font-arcade text-xs hover:bg-red-600 hover:text-white transition-all z-50 uppercase shadow-[0_0_10px_rgba(220,38,38,0.5)] active:translate-y-1"
       >
           [ ESC ] TERMINATE_SESSION
       </button>

       {/* Decorative Background */}
       <div className="absolute inset-0 border-x-2 border-red-900/30 pointer-events-none"></div>

       {/* Header */}
       <div className="text-center mb-16 border-b-8 border-red-600 pb-8 relative overflow-hidden bg-black/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-[scanning_2s_linear_infinite]"></div>
            <h1 className="font-comic text-6xl md:text-8xl text-red-500 tracking-tighter drop-shadow-[5px_5px_0px_#7f1d1d] uppercase animate-pulse">SYSTEM OVERRIDE</h1>
            <p className="font-arcade text-red-400 text-xs md:text-sm mt-4 tracking-[0.5em] bg-red-950/50 inline-block px-4 py-2 border border-red-800">
                GOD_MODE ACTIVE // PLAYER: ADMIN11
            </p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            <div className="bg-black border-4 border-gray-800 p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity text-4xl">💾</div>
                <h3 className="font-arcade text-[10px] text-gray-500 mb-2 tracking-widest">TOTAL_INCIDENTS</h3>
                <p className="font-mono text-5xl text-white font-bold">{stats.totalCases}</p>
                <div className="w-full h-1 bg-gray-800 mt-4"><div className="h-full bg-white w-full"></div></div>
            </div>

            <div className="bg-black border-4 border-gray-800 p-6 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity text-4xl">👤</div>
                <h3 className="font-arcade text-[10px] text-gray-500 mb-2 tracking-widest">ACTIVE_AGENTS</h3>
                <p className="font-mono text-5xl text-white font-bold">{stats.uniqueUsers}</p>
                <div className="w-full h-1 bg-gray-800 mt-4"><div className="h-full bg-cyan-500 w-3/4"></div></div>
            </div>

            <div className="bg-red-950/20 border-4 border-red-600 p-6 relative group overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity text-4xl text-red-500">🚫</div>
                <h3 className="font-arcade text-[10px] text-red-400 mb-2 tracking-widest">THREATS_NEUTRALIZED</h3>
                <p className="font-mono text-5xl text-red-500 font-bold">{stats.fakeCount}</p>
                <div className="w-full h-1 bg-red-900 mt-4"><div className="h-full bg-red-500 w-1/2 animate-pulse"></div></div>
            </div>

            <div className="bg-green-950/20 border-4 border-green-600 p-6 relative group overflow-hidden shadow-[0_0_20px_rgba(22,163,74,0.2)]">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity text-4xl text-green-500">✅</div>
                <h3 className="font-arcade text-[10px] text-green-400 mb-2 tracking-widest">TRUTH_VERIFIED</h3>
                <p className="font-mono text-5xl text-green-500 font-bold">{stats.verifiedCount}</p>
                <div className="w-full h-1 bg-green-900 mt-4"><div className="h-full bg-green-500 w-2/3"></div></div>
            </div>
       </div>

       {/* Master Log Table */}
       <div className="border-4 border-red-900/50 bg-black relative shadow-[0_0_40px_rgba(0,0,0,0.8)]">
           <div className="absolute -top-3 left-4 bg-black px-2 text-red-500 font-arcade text-xs border border-red-900">
               MASTER_SYSTEM_LOG
           </div>
           
           <div className="bg-red-950/10 p-4 border-b-4 border-red-900/30 flex justify-between items-center">
               <div className="flex gap-2">
                   <div className="w-3 h-3 bg-red-600 rounded-sm animate-pulse"></div>
                   <div className="w-3 h-3 bg-red-600/50 rounded-sm"></div>
                   <div className="w-3 h-3 bg-red-600/20 rounded-sm"></div>
               </div>
               <span className="font-mono text-[10px] text-red-700">ENCRYPTION: NONE</span>
           </div>

           <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-black">
               <table className="w-full text-left font-mono text-xs">
                   <thead className="bg-red-950/20 text-red-500 sticky top-0 backdrop-blur-sm z-10 border-b-2 border-red-900">
                       <tr>
                           <th className="p-4 font-arcade tracking-wider">TIMESTAMP_UTC</th>
                           <th className="p-4 font-arcade tracking-wider">AGENT_ID</th>
                           <th className="p-4 font-arcade tracking-wider w-1/3">TARGET_QUERY</th>
                           <th className="p-4 font-arcade tracking-wider">STATUS</th>
                           <th className="p-4 font-arcade tracking-wider text-right">CONF%</th>
                           <th className="p-4 font-arcade tracking-wider text-center">ACTIONS</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-red-900/20 text-gray-400">
                       {logs.map((log) => {
                           const user = log.id.split('-')[0];
                           return (
                               <tr key={log.id} className="hover:bg-red-900/10 transition-colors group">
                                   <td className="p-4 whitespace-nowrap text-gray-600 font-mono">
                                       {new Date(log.timestamp).toLocaleString()}
                                   </td>
                                   <td className="p-4 text-white font-bold uppercase tracking-wide group-hover:text-red-400">{user}</td>
                                   <td className="p-4 truncate max-w-xs text-gray-300 italic">"{log.query}"</td>
                                   <td className="p-4">
                                       <span className={`px-2 py-1 font-arcade text-[9px] border ${
                                           log.verdict.includes('CONTRADICTED') ? 'border-red-600 text-red-500 bg-red-950/30' :
                                           log.verdict.includes('SUPPORTED') ? 'border-green-600 text-green-500 bg-green-950/30' :
                                           'border-yellow-600 text-yellow-500 bg-yellow-950/30'
                                       }`}>
                                           {log.verdict}
                                       </span>
                                   </td>
                                   <td className="p-4 text-right font-bold text-white">{log.confidence}%</td>
                                   <td className="p-4 text-center">
                                       <button 
                                           onClick={() => handleDelete(log.id)}
                                           className="text-red-500 hover:text-white hover:bg-red-600 border border-transparent hover:border-red-500 rounded px-2 py-1 transition-all active:scale-95"
                                           title="DELETE_RECORD"
                                       >
                                           🗑️
                                       </button>
                                   </td>
                               </tr>
                           )
                       })}
                   </tbody>
               </table>
           </div>
           
           <div className="p-2 bg-red-950/30 text-center font-arcade text-[8px] text-red-500/50">
               END OF STREAM // 0xFF
           </div>
       </div>

       <style>{`
        @keyframes scanning {
            0% { top: 0%; opacity: 0; }
            50% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
       `}</style>
    </div>
  );
};

export default AdminDashboard;
