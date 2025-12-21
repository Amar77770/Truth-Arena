
import React, { useState, useEffect, useRef } from 'react';

interface PlayerProfile {
  id: string;
  name: string;
  emoji: string;
  defaultImage?: string;
  level: number;
  class: string;
  bio: string;
  stats: {
    label: string;
    value: string;
    percent: number;
    color: string;
  }[];
}

const players: PlayerProfile[] = [
  {
    id: "amar",
    name: "AMAR",
    emoji: "👨‍💻",
    defaultImage: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=400&h=400", // 3D Glowing Crystal/Energy
    level: 99,
    class: "CODE SORCERER",
    bio: "I built this because I was tired of my relatives sending fake exam dates on WhatsApp. Now I have an AI Judge to yell at them.",
    stats: [
      { label: "CAFFEINE", value: "110%", percent: 100, color: "cyan" },
      { label: "SLEEP", value: "404 NOT FOUND", percent: 5, color: "pink" },
      { label: "HUMOR", value: "BROKEN", percent: 85, color: "yellow" }
    ]
  },
  {
    id: "ansh",
    name: "ANSH",
    emoji: "👾",
    defaultImage: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=400&h=400", // 3D Retro Robot Character
    level: 88,
    class: "BUG HUNTER",
    bio: "If it's fake, I'll find the glitch in the logic. I don't just verify news; I dismantle the rumors frame by frame.",
    stats: [
      { label: "LOGIC", value: "MAX", percent: 100, color: "cyan" },
      { label: "PATIENCE", value: "20%", percent: 20, color: "pink" },
      { label: "RED BULL", value: "90%", percent: 90, color: "yellow" }
    ]
  },
  {
    id: "bhavesh",
    name: "BHAVESH",
    emoji: "🚀",
    defaultImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400&h=400", // 3D Stylized Rocket
    level: 92,
    class: "DATA NAVIGATOR",
    bio: "Cruising through the noise at light speed. While others are still reading the headline, I've already mapped the source.",
    stats: [
      { label: "SPEED", value: "95%", percent: 95, color: "cyan" },
      { label: "FOCUS", value: "80%", percent: 80, color: "pink" },
      { label: "CHILL", value: "50%", percent: 50, color: "yellow" }
    ]
  },
  {
    id: "shivam",
    name: "SHIVAM",
    emoji: "🕵️",
    defaultImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=400&h=400", // 3D Shield/Security Icon
    level: 95,
    class: "RUMOR SPECIALIST",
    bio: "My undercover agents are everywhere. If the NTA hasn't tweeted it, it doesn't exist in my world. Verified or nothing.",
    stats: [
      { label: "STEALTH", value: "100%", percent: 100, color: "cyan" },
      { label: "TRUTH", value: "100%", percent: 100, color: "pink" },
      { label: "SLEEP", value: "10%", percent: 10, color: "yellow" }
    ]
  }
];

const PlayerCard: React.FC<{ player: PlayerProfile, idx: number }> = ({ player, idx }) => {
  const [imageError, setImageError] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`dossier_img_${player.id}`);
    if (saved) setLocalImage(saved);
  }, [player.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLocalImage(base64);
        localStorage.setItem(`dossier_img_${player.id}`, base64);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayImage = localImage || player.defaultImage;

  return (
    <div className="group relative bg-black/60 backdrop-blur-md border-4 border-white p-8 shadow-[15px_15px_0px_0px_rgba(0,255,255,0.1)] hover:shadow-[20px_20px_0px_0px_rgba(255,0,255,0.1)] transition-all hover:-translate-y-2 overflow-hidden">
      {/* Level Badge */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-white flex items-center justify-center font-arcade text-black text-[10px] transform rotate-45 translate-x-6 -translate-y-6 z-20">
        {player.level}
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Avatar Section */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className={`w-full aspect-square bg-gradient-to-br ${idx % 2 === 0 ? 'from-cyan-900 to-purple-900' : 'from-pink-900 to-indigo-900'} border-4 border-yellow-400 flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-white transition-colors shadow-[6px_6px_0px_black]`}>
            
            {displayImage && !imageError ? (
              <div className="w-full h-full relative group/img">
                <img 
                  src={displayImage} 
                  alt={player.name} 
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-125"
                />
                {/* Image Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="font-arcade text-[8px] bg-yellow-400 text-black px-3 py-2 border-2 border-black hover:bg-white"
                    >
                        RE-CALIBRATE
                    </button>
                </div>
                {/* CRT Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-30 pointer-events-none"></div>
                <div className="absolute inset-0 border-2 border-white/10 pointer-events-none"></div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="relative group/emoji">
                  <span className="text-8xl filter drop-shadow-[0_0_15px_white] group-hover:scale-110 transition-transform duration-500 block">
                    {player.emoji}
                  </span>
                  <div className="absolute -inset-4 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="font-arcade text-[6px] text-cyan-400 hover:text-white mt-2 underline z-10"
                >
                    UPLOAD_SIGNAL_MANUAL
                </button>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="absolute bottom-0 w-full bg-yellow-400 text-black font-arcade text-[8px] text-center py-1 font-black group-hover:bg-white transition-colors z-10 border-t-2 border-black">
                RANK: MASTER
            </div>
          </div>
          <h3 className="font-arcade text-2xl text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tighter">{player.name}</h3>
          <div className="font-mono text-pink-400 text-[10px] mt-1 tracking-widest uppercase">{player.class}</div>
        </div>

        {/* Stats Section */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-[#0a0a0a] p-4 border-2 border-gray-800 group-hover:border-gray-600 transition-colors relative">
            <div className="absolute -top-3 left-2 bg-black px-2 font-arcade text-[8px] text-gray-500 uppercase">Mission_Dossier</div>
            <p className="font-mono text-gray-400 text-xs leading-relaxed italic">
              "{player.bio}"
            </p>
          </div>

          <div className="space-y-4 font-arcade text-[9px] text-white">
            {player.stats.map((stat, sIdx) => (
              <div key={sIdx}>
                <div className="flex justify-between mb-1">
                  <span className={`text-${stat.color}-400 uppercase`}>{stat.label}</span>
                  <span className="font-mono">{stat.value}</span>
                </div>
                <div className="h-3 bg-gray-900 border-2 border-gray-700">
                  <div 
                    className={`h-full bg-${stat.color}-400 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                    style={{ width: `${stat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto p-4 md:p-8 space-y-16">
       <div className="text-center">
          <h2 className="font-comic text-7xl md:text-9xl text-yellow-400 mb-4 drop-shadow-[6px_6px_0px_black] uppercase italic tracking-tighter">
             PLAYER SELECT
          </h2>
          <div className="font-arcade text-cyan-400 text-xs tracking-widest animate-pulse uppercase">CHOOSE YOUR CHAMPION OF TRUTH</div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
          {players.map((player, idx) => (
            <PlayerCard key={idx} player={player} idx={idx} />
          ))}
       </div>
    </div>
  );
};

export default AboutPage;
