import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() to avoid TypeScript error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, '.', '');
  
  // Vercel/Vite Priority:
  // 1. VITE_API_KEY (Best Practice)
  // 2. API_KEY (Fallback)
  const apiKey = env.VITE_API_KEY || env.API_KEY || "";

  if (mode === 'production' && !apiKey) {
    console.warn("⚠️ BUILD WARNING: No API Key found. App will require manual key entry.");
  }

  return {
    plugins: [react()],
    define: {
      // This allows 'process.env.VITE_API_KEY' to work even in client-side code
      'process.env.VITE_API_KEY': JSON.stringify(apiKey),
    }
  };
});