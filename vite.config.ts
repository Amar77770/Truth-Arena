
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // LOGIC: 
  // 1. process.env.API_KEY -> System Variable (Vercel/Netlify Settings)
  // 2. env.API_KEY -> .env file variable
  // 3. VITE_API_KEY -> Standard Vite prefix fallback
  const apiKey = process.env.API_KEY || env.API_KEY || process.env.VITE_API_KEY || env.VITE_API_KEY || "";
  
  return {
    plugins: [react()],
    define: {
      // This replaces the text "process.env.API_KEY" in your client code with the actual string value of the key.
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
