
import React from 'react';

const CommunityPage: React.FC = () => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto p-4 text-center">
       <h2 className="font-comic text-5xl text-pink-500 mb-8 drop-shadow-[4px_4px_0px_white] uppercase transform rotate-1">
          Multiplayer Lobby
       </h2>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Telegram */}
           <a href="#" className="group relative block">
               <div className="absolute inset-0 bg-blue-500 transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
               <div className="relative bg-black border-4 border-blue-500 p-8 flex flex-col items-center hover:-translate-y-1 transition-transform cursor-pointer">
                   {/* Telegram Icon (Paper Plane) */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                     <path d="M21.928 2.528c-.378-.427-.937-.585-1.469-.415L2.502 8.783c-.768.252-.962 1.285-.297 1.8l6.39 4.957 1.248 4.293c.189.65 1.045.85 1.517.355l2.122-2.227 4.542 3.522c.606.47 1.493.186 1.666-.566l3.354-15.54c.123-.574-.278-1.127-.852-1.233-.06-.011-.122-.016-.184-.016zm-5.698 12.33l-5.748-4.456 8.356-6.082-6.526 7.425-.562 3.55 4.48-3.437z"/>
                   </svg>
                   <h3 className="font-arcade text-blue-400 text-lg mb-2">TELEGRAM</h3>
                   <p className="font-mono text-gray-400 text-xs">The chaos zone. Join for leaked papers (jk).</p>
                   <span className="mt-4 px-4 py-1 bg-blue-900 text-blue-200 font-arcade text-xs">JOIN SERVER</span>
               </div>
           </a>

           {/* Instagram */}
           <a href="#" className="group relative block">
               <div className="absolute inset-0 bg-pink-500 transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
               <div className="relative bg-black border-4 border-pink-500 p-8 flex flex-col items-center hover:-translate-y-1 transition-transform cursor-pointer">
                   {/* Instagram Icon (Brand) */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                   </svg>
                   <h3 className="font-arcade text-pink-400 text-lg mb-2">INSTAGRAM</h3>
                   <p className="font-mono text-gray-400 text-xs">Visual Proof & Exam Memes.</p>
                   <span className="mt-4 px-4 py-1 bg-pink-900 text-pink-200 font-arcade text-xs">FOLLOW</span>
               </div>
           </a>

           {/* WhatsApp */}
           <a href="#" className="group relative block">
               <div className="absolute inset-0 bg-green-500 transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
               <div className="relative bg-black border-4 border-green-500 p-8 flex flex-col items-center hover:-translate-y-1 transition-transform cursor-pointer">
                   {/* WhatsApp Icon (Brand) */}
                   <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-green-400 mb-4 group-hover:scale-110 transition-transform">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                   </svg>
                   <h3 className="font-arcade text-green-400 text-lg mb-2">WHATSAPP</h3>
                   <p className="font-mono text-gray-400 text-xs">Direct Alerts. Don't trust forwards.</p>
                   <span className="mt-4 px-4 py-1 bg-green-900 text-green-200 font-arcade text-xs">JOIN CHANNEL</span>
               </div>
           </a>
       </div>

       <div className="mt-12 bg-gray-900 border-2 border-gray-700 p-6 inline-block">
           <p className="font-arcade text-yellow-400 text-xs mb-2">📢 SERVER ANNOUNCEMENT</p>
           <p className="font-mono text-white">"Don't trust the forward button. Verify before you terrify."</p>
       </div>
    </div>
  );
};

export default CommunityPage;
