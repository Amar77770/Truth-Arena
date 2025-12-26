
import { GoogleGenAI } from "@google/genai";
import { FactCheckReport, Source, Claim, VerdictType, ClaimSeverity, NewsItem, ChatMessage } from "../types";

// --- CONFIGURATION ---
const LOCAL_STORAGE_KEY_API = 'truth_arena_api_key';
// FIX: 'gemini-2.0-flash' (Stable) was returning "Limit: 0" (Access Restricted).
// Switching to 'gemini-2.0-flash-exp' which is open to all free-tier users.
const MODEL_NAME = 'gemini-2.0-flash-exp'; 

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

// --- SIMULATION DATA ---
const getSimulationReport = (topic: string, reason: string): FactCheckReport => {
    let summaryPrefix = 'OFFLINE MODE';
    let summaryReason = 'The live analysis system is currently resting.';
    
    if (reason === 'DAILY_LIMIT_REACHED') {
        summaryPrefix = 'NEURAL LINK OVERLOAD';
        summaryReason = 'The daily API quota has been reached.';
    } else if (reason === 'MODEL_ACCESS_RESTRICTED') {
        summaryPrefix = 'ACCESS DENIED (LIMIT 0)';
        summaryReason = 'The API Key is valid, but the specific AI Model is currently restricted for this project.';
    }

    return {
        topic: topic || "UNKNOWN_SIGNAL",
        summary: `⚠️ SYSTEM NOTICE: ${summaryPrefix}. \n\n[SIMULATION PROTOCOL ENGAGED] \n${summaryReason} The data below is procedurally generated for demonstration purposes.`,
        timestamp: new Date().toISOString(),
        overallConfidence: 42, 
        isSimulation: true,
        sources: [
            { title: "Simulation Database (Offline)", uri: "#" },
            { title: "Cached Neural Pattern #8821", uri: "#" }
        ],
        debateScript: [
            { speaker: "Judge", text: "LIVE UPLINK SEVERED. INITIATING SIMULATION." },
            { speaker: "Advocate Rumor", text: "The system crashed! They are hiding the truth!" },
            { speaker: "Advocate Fact", text: "Incorrect. The connection was refused by the host." },
            { speaker: "Judge", text: "SUSTAINED. PROCEEDING WITH DEMO PROTOCOL." }
        ],
        officialTimeline: [
            { date: new Date().toISOString().split('T')[0], event: "System entered Simulation Mode due to connection issues." },
            { date: "2025-05-XX", event: "Projected Event (Simulated)" }
        ],
        commonMisconceptions: [
            "That the system is broken (It is just in offline mode).",
            "That simulated data is real (It is not)."
        ],
        actionRecommendation: "CHECK API KEY PERMISSIONS OR TRY AGAIN LATER.",
        claims: [
            {
                id: generateId(),
                text: `Simulation: Analysis of '${topic}'`,
                category: 'Other',
                severity: ClaimSeverity.LOW,
                verdict: VerdictType.UNVERIFIABLE,
                confidenceScore: 42,
                reasoning: `This is a generated response because the Live AI connection failed. Reason: ${reason}`,
                evidencePoints: ["Connection Error", "System Stable", "Simulation Active"],
                relatedSources: []
            }
        ]
    };
};

const getMockNews = (): NewsItem[] => [
    {
        id: "sim-1",
        headline: "SYSTEM ALERT: LIVE FEED OFFLINE",
        summary: "The application could not connect to the AI model to fetch live news. Running in cached/simulation mode.",
        sourceName: "SYSTEM_INTERNAL",
        sourceUrl: "#",
        timestamp: new Date().toISOString()
    },
    {
        id: "sim-2",
        headline: "JEE MAINS: ADMIT CARD EXPECTED SOON (CACHED)",
        summary: "While live verification is offline, historical patterns suggest admit cards are released 3-4 days before the exam.",
        sourceName: "ARCHIVE_DB",
        sourceUrl: "#",
        timestamp: new Date(Date.now() - 86400000).toISOString()
    }
];

// --- API FUNCTIONS ---

export async function analyzeExamNews(topic: string, media?: { mimeType: string; data: string }): Promise<FactCheckReport> {
  const apiKey = getApiKey();
  if (!apiKey) return getSimulationReport(topic, "API KEY MISSING");

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
    let errorMessage = "API ERROR";
    
    // Defensive extraction of error message
    if (error?.message) {
        errorMessage = error.message;
    } else if (error?.error?.message) {
        errorMessage = error.error.message;
    } else {
        try {
            errorMessage = JSON.stringify(error);
        } catch {
            errorMessage = String(error);
        }
    }
    
    // Check for "Limit: 0" (Access Restricted) vs "Quota Exceeded"
    if (errorMessage.includes("limit: 0")) {
        return getSimulationReport(topic, "MODEL_ACCESS_RESTRICTED");
    }

    // Check for standard 429
    if (errorMessage.includes("429") || errorMessage.includes("Quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        return getSimulationReport(topic, "DAILY_LIMIT_REACHED");
    }
    
    if (errorMessage.includes("404")) {
         return getSimulationReport(topic, `MODEL '${MODEL_NAME}' NOT FOUND`);
    }

    return getSimulationReport(topic, errorMessage);
  }
}

export async function getLatestExamNews(): Promise<NewsItem[]> {
  const apiKey = getApiKey();
  if (!apiKey) return getMockNews();

  const ai = new GoogleGenAI({ apiKey });

  try {
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

  } catch (e: any) {
    console.error("News Fetch Error:", e);
    return getMockNews();
  }
}

export async function getStudyCoachResponse(history: ChatMessage[], message: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) return "API KEY MISSING";

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const chat = ai.chats.create({
        model: MODEL_NAME,
        config: { systemInstruction: "You are a helpful study coach." }
    });

    const res = await chat.sendMessage({ message });
    return res.text || "...";
  } catch (e) {
      return "COACH IS OFFLINE (CONNECTION ERROR). TRY AGAIN LATER.";
  }
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
    return getSimulationReport(originalTopic, "AI RESPONSE INVALID JSON");
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
    isSimulation: false,
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
