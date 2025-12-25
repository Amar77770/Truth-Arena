
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // PRIORITY ORDER:
  // 1. VITE_API_KEY (Standard for Frontend Apps)
  // 2. API_KEY (Generic fallback)
  // 3. process.env variants (For system-level injection)
  const apiKey = 
    process.env.VITE_API_KEY || 
    env.VITE_API_KEY || 
    process.env.API_KEY || 
    env.API_KEY || 
    "";
  
  // DEBUG LOGGING: This will show up in your Vercel/Netlify Build Logs
  if (apiKey) {
    console.log("✅ SUCCESS: API Key detected during build.");
  } else {
    console.log("⚠️ WARNING: No API Key detected during build. App will run in Simulation Mode unless key is in LocalStorage.");
  }

  return {
    plugins: [react()],
    define: {
      // This embeds the key into the code at build time
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
