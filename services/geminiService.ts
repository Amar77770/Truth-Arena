
import { GoogleGenAI } from "@google/genai";
import { FactCheckReport, Source, Claim, VerdictType, ClaimSeverity, NewsItem, ChatMessage } from "../types";

// --- CONFIGURATION ---
const LOCAL_STORAGE_KEY_API = 'truth_arena_api_key';
// CRITICAL FIX: 'gemini-2.5-flash-preview' does not exist. 
// We use 'gemini-2.0-flash' which is stable and supports Google Search.
const MODEL_NAME = 'gemini-2.0-flash'; 

// --- HELPERS ---

const generateId = () => Math.random().toString(36).substr(2, 9);

export const getApiKey = () => {
  // 1. Check Manual Override (LocalStorage)
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY_API);
    if (local) return local;
  }

  // 2. Check injected Vite variables
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_KEY) {
    // @ts-ignore
    return process.env.VITE_API_KEY;
  }
  
  // 3. Fallback for standard Vite env
  // @ts-ignore
  if (import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  return '';
};

export const setManualApiKey = (key: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_API, key);
};

// Robust JSON Cleaner
const cleanJsonText = (text: string): string => {
  if (!text) return "{}";
  // Remove Markdown code blocks
  let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  // Find valid JSON start/end
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      const lastBracket = clean.lastIndexOf(']');
      if (lastBracket !== -1) return clean.substring(firstBracket, lastBracket + 1);
  }
  
  if (firstBrace !== -1) {
      const lastBrace = clean.lastIndexOf('}');
      if (lastBrace !== -1) return clean.substring(firstBrace, lastBrace + 1);
  }
  
  return clean;
};

// --- MOCK DATA ---
const getMockReport = (topic: string, errorDetails?: string): FactCheckReport => ({
    topic: topic || "UNKNOWN_SIGNAL",
    summary: errorDetails ? `SYSTEM ERROR: ${errorDetails}` : "SYSTEM ALERT: LIVE UPLINK FAILED.",
    timestamp: new Date().toISOString(),
    overallConfidence: 0,
    sources: [],
    debateScript: [
        { speaker: "Judge", text: "SYSTEM FAILURE. UNABLE TO ACCESS NEURAL NETWORK." },
        { speaker: "Judge", text: errorDetails || "CHECK API KEY CONFIGURATION." }
    ],
    officialTimeline: [],
    commonMisconceptions: [],
    actionRecommendation: "CHECK CONNECTION",
    claims: []
});

const getMockNews = (): NewsItem[] => [
    {
        id: "sim-1",
        headline: "CONNECTION ERROR: UNABLE TO FETCH NEWS",
        summary: "The application could not connect to the AI model. Please check your API Key settings.",
        sourceName: "SYSTEM",
        sourceUrl: "#",
        timestamp: new Date().toISOString()
    }
];

// --- API FUNCTIONS ---

export async function analyzeExamNews(topic: string, media?: { mimeType: string; data: string }): Promise<FactCheckReport> {
  const apiKey = getApiKey();
  if (!apiKey) return getMockReport(topic, "API KEY MISSING");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are the "TRUTH ARENA" Game Master. Verify exam news (JEE, NEET, CBSE, UPSC).
    
    CRITICAL PROTOCOL:
    1. USE THE "googleSearch" TOOL. You have internet access. Use it.
    2. Search for: "${topic} official notification", "${topic} latest news", "${topic} fact check".
    3. Analyze the Search Results to determine truth.
    4. Generate a Debate Script between "Advocate Rumor", "Advocate Fact", and "Judge".
    
    OUTPUT FORMAT:
    Return ONLY a raw JSON object. No Markdown. No text outside the JSON.
    {
      "topic": "string",
      "summary": "string",
      "overallConfidence": number (0-100),
      "debateScript": [{ "speaker": "Advocate Rumor" | "Advocate Fact" | "Judge", "text": "string" }],
      "claims": [{ "text": "string", "verdict": "SUPPORTED" | "CONTRADICTED" | "UNVERIFIABLE", "confidenceScore": number, "reasoning": "string", "evidencePoints": ["string"], "category": "string", "severity": "LOW" | "MEDIUM" | "HIGH" }],
      "officialTimeline": [{ "date": "string", "event": "string" }],
      "commonMisconceptions": ["string"],
      "actionRecommendation": "string"
    }
  `;

  try {
    const parts: any[] = [{ text: `User Query: ${topic}` }];
    if (media) {
      parts.push({ inlineData: { mimeType: media.mimeType, data: media.data } });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        // System instruction MUST be here for tools to work reliably
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        // DO NOT use responseMimeType: 'application/json' here, it often breaks tool use
        temperature: 0.7, 
      },
    });

    return parseReportResponse(response, topic);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    let errorMessage = error.message || "API ERROR";
    if (errorMessage.includes("404")) errorMessage = `MODEL '${MODEL_NAME}' NOT FOUND. CHECK REGION/ACCESS.`;
    return getMockReport(topic, errorMessage);
  }
}

export async function getLatestExamNews(): Promise<NewsItem[]> {
  const apiKey = getApiKey();
  if (!apiKey) return getMockNews();

  const ai = new GoogleGenAI({ apiKey });

  try {
    // We use a forceful prompt instead of responseSchema to ensure the tool triggers first
    const prompt = `
      USE GOOGLE SEARCH.
      Find 5 recent, critical news updates about Indian Exams (JEE, NEET, CBSE, UPSC) from the last 24 hours.
      Return a JSON ARRAY.
      Format: [{ "id": "1", "headline": "...", "summary": "...", "sourceName": "...", "sourceUrl": "...", "timestamp": "..." }]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
        temperature: 0.5,
      }
    });

    if (response.text) {
        const cleaned = cleanJsonText(response.text);
        try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            console.warn("News parsing failed, text was:", response.text);
        }
    }
    return getMockNews();

  } catch (e) {
    console.error("News Fetch Error:", e);
    return getMockNews();
  }
}

export async function getStudyCoachResponse(history: ChatMessage[], message: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) return "API KEY MISSING";

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: MODEL_NAME,
    config: { systemInstruction: "You are a helpful study coach." }
  });

  const res = await chat.sendMessage({ message });
  return res.text || "...";
}

// --- PARSERS ---

function parseReportResponse(result: any, originalTopic: string): FactCheckReport {
  const text = result.text || "{}";
  const cleanJson = cleanJsonText(text);
  
  let data: any = {};
  try {
    data = JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Fail:", text);
    return getMockReport(originalTopic, "AI RESPONSE INVALID JSON");
  }

  // Extract Grounding Sources
  const sources: Source[] = [];
  const candidate = result.candidates?.[0];
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];
  
  chunks.forEach((c: any) => {
    if (c.web?.uri && c.web?.title) {
      sources.push({ title: c.web.title, uri: c.web.uri });
    }
  });

  // Fallback Sources if Google Search didn't return metadata (happens sometimes even if it searched)
  if (sources.length === 0) {
     sources.push({ title: "Google Search Verification", uri: `https://www.google.com/search?q=${encodeURIComponent(originalTopic + " official news")}` });
  }

  return {
    topic: data.topic || originalTopic,
    summary: data.summary || "Analysis complete.",
    timestamp: new Date().toISOString(),
    overallConfidence: data.overallConfidence || 0,
    sources,
    debateScript: data.debateScript || [],
    officialTimeline: data.officialTimeline || [],
    commonMisconceptions: data.commonMisconceptions || [],
    actionRecommendation: data.actionRecommendation || "Verify manually.",
    claims: (data.claims || []).map((c: any) => ({
      id: generateId(),
      text: c.text,
      category: c.category || 'Other',
      severity: (c.severity as ClaimSeverity) || ClaimSeverity.LOW,
      verdict: (c.verdict as VerdictType) || VerdictType.UNVERIFIABLE,
      confidenceScore: c.confidenceScore || 0,
      reasoning: c.reasoning,
      evidencePoints: c.evidencePoints || [],
      relatedSources: []
    }))
  };
}
