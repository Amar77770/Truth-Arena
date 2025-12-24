
import { GoogleGenAI, Type } from "@google/genai";
import { FactCheckReport, Source, Claim, VerdictType, ClaimSeverity, DebateTurn, NewsItem, ChatMessage } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface MediaData {
  mimeType: string;
  data: string;
}

// Robust API Key Retrieval
const getApiKey = () => {
  // Check process.env (injected by Vite define)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // Check import.meta.env (Standard Vite)
  const meta = import.meta as any;
  if (meta && meta.env && meta.env.VITE_API_KEY) {
    return meta.env.VITE_API_KEY;
  }
  return '';
};

// Helper to clean JSON strings from Markdown code blocks
const cleanJsonText = (text: string): string => {
  if (!text) return "{}";
  let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  // Attempt to find the first valid JSON character
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  
  // If it looks like an array and starts before an object, or if there is no object
  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      const lastBracket = clean.lastIndexOf(']');
      if (lastBracket !== -1) {
          return clean.substring(firstBracket, lastBracket + 1);
      }
  }
  
  // Otherwise treat as object
  if (firstBrace !== -1) {
      const lastBrace = clean.lastIndexOf('}');
      if (lastBrace !== -1) {
          return clean.substring(firstBrace, lastBrace + 1);
      }
  }
  
  return clean;
};

// --- MOCK DATA GENERATORS FOR FALLBACK ---

const getMockNews = (): NewsItem[] => [
    {
        id: "sim-1",
        headline: "JEE MAIN 2025: SESSION 1 ADMIT CARDS RELEASED (SIMULATION)",
        summary: "National Testing Agency (NTA) has reportedly activated the download link for Session 1 admit cards. Students are advised to check the official portal immediately. (This is a simulated headline for demo purposes).",
        sourceName: "NTA PORTAL (SIMULATED)",
        sourceUrl: "https://jeemain.nta.ac.in",
        timestamp: new Date().toISOString()
    },
    {
        id: "sim-2",
        headline: "NEET UG 2025: NO SYLLABUS CHANGE CONFIRMED",
        summary: "Officials have clarified that the syllabus for NEET UG 2025 will remain identical to the previous year, debunking viral rumors about chapter reductions.",
        sourceName: "PIB FACT CHECK (SIMULATED)",
        sourceUrl: "https://pib.gov.in",
        timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: "sim-3",
        headline: "CBSE CLASS 12: PHYSICS PAPER PATTERN UPDATE",
        summary: "New competency-based questions added to the physics sample paper. Teachers advise focusing on conceptual clarity over rote memorization.",
        sourceName: "CBSE ACADEMIC (SIMULATED)",
        sourceUrl: "https://cbseacademic.nic.in",
        timestamp: new Date(Date.now() - 7200000).toISOString()
    }
];

const getMockReport = (topic: string): FactCheckReport => ({
    topic: topic || "UNKNOWN_SIGNAL",
    summary: "SIMULATION PROTOCOL ACTIVE. Live uplink unavailable. Analyzing based on heuristic patterns and historical archive data. (Check API Key for live results).",
    timestamp: new Date().toISOString(),
    overallConfidence: 65,
    sources: [
        { title: "Official NTA Website (Simulated Link)", uri: "https://nta.ac.in" },
        { title: "Press Information Bureau Fact Check", uri: "https://pib.gov.in/factcheck" },
        { title: "ExamGuard Archives (Offline DB)", uri: "#" }
    ],
    debateScript: [
        { speaker: "Judge", text: "SYSTEM ALERT: LIVE UPLINK FAILED. INITIATING ARCHIVE BATTLE." },
        { speaker: "Advocate Rumor", text: "The students are panicking! The screenshot looks authentic!" },
        { speaker: "Advocate Fact", text: "Authenticity cannot be determined without a live signal. However, the font kerning is suspicious." },
        { speaker: "Judge", text: "I cannot access the live web. I must rule based on training data patterns." },
        { speaker: "Advocate Fact", text: "Agreed. Without a source link on the official domain, this remains unverified." },
        { speaker: "Judge", text: "VERDICT: UNVERIFIABLE. PROCEED WITH CAUTION." }
    ],
    officialTimeline: [
        { date: "2024-11-01", event: "Last known official notification (Simulated)" }
    ],
    commonMisconceptions: [
        "That all viral PDFs are real.",
        "That NTA releases news on WhatsApp first."
    ],
    actionRecommendation: "DO NOT SHARE. Visit the official website manually to verify. This is a generated simulation due to connection error.",
    claims: [
        {
            id: generateId(),
            text: "The rumor claims a major schedule change or leak.",
            category: "Other",
            severity: ClaimSeverity.MEDIUM,
            verdict: VerdictType.UNVERIFIABLE,
            confidenceScore: 50,
            reasoning: "API connection failed. Unable to cross-reference with live Google Search. Defaulting to skeptical stance.",
            evidencePoints: ["Live Search Unavailable", "Heuristic Analysis Only"],
            relatedSources: []
        }
    ]
});

// --- MAIN FUNCTIONS ---

export async function analyzeExamNews(topic: string, media?: MediaData): Promise<FactCheckReport> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn("API Key missing. Returning Simulation Data.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return getMockReport(topic);
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are the Game Master of "TRUTH ARENA 2025". 
    Your job is to verify entrance exam news by simulating a CHAOTIC ARCADE BATTLE debate.
    
    The Challenger (User Input) is: "${topic || "NO TEXT PROVIDED, CHECK MEDIA"}".
    ${media ? "WARNING: VISUAL/AUDIO EVIDENCE ATTACHED." : ""}

    STRICT DOMAIN RULE:
    Your domain is STRICTLY restricted to: Education, Exams (JEE, NEET, CBSE, UPSC, CUET, etc.), Results, Syllabus, and Student Life Rumors.
    
    IF THE USER INPUT (Text or Media) IS UNRELATED:
    1. Set "topic" to "OFF-TOPIC DETECTED".
    2. Set "summary" to "SYSTEM ERROR: This court only hears cases regarding Exam Rumors and Academic News."
    3. Set "overallConfidence" to 0.
    4. Return exactly one claim indicating a jurisdiction error.

    IF RELEVANT, PROCEED WITH NORMAL TASK:
    1. IDENTIFY THE TOPIC.
    2. Verify using Google Search.
    3. Generate a "Battle Script" (at least 6 turns). 
       Speakers MUST be exactly: "Advocate Rumor", "Advocate Fact", and "Judge".
    4. Extract claims and verdicts.
    5. Provide an official timeline of events if applicable.
    6. Identify common misconceptions.
    7. Give a clear action recommendation for students.

    OUTPUT FORMAT: Return ONLY a raw JSON object. Do not include any text before or after the JSON.
    {
      "topic": "...",
      "summary": "...",
      "overallConfidence": 85,
      "debateScript": [
        { "speaker": "Advocate Rumor", "text": "..." },
        { "speaker": "Advocate Fact", "text": "..." },
        { "speaker": "Judge", "text": "..." }
      ],
      "claims": [{ "text": "...", "category": "...", "severity": "...", "verdict": "...", "confidenceScore": 0, "reasoning": "...", "evidencePoints": ["...", "..."] }],
      "officialTimeline": [{ "date": "...", "event": "..." }],
      "commonMisconceptions": ["...", "..."],
      "actionRecommendation": "..."
    }
  `;

  // Fix: explicitly type 'parts' as any[] to avoid inference error when pushing inlineData
  const parts: any[] = [{ text: systemInstruction }];
  
  if (media) {
    parts.push({
      inlineData: {
        mimeType: media.mimeType,
        data: media.data
      }
    });
  }

  try {
    const result = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.9,
      },
    });

    return parseResponse(result, topic);

  } catch (error: any) {
    console.warn("Primary Grounding Attempt Failed, falling back to Simulation...", error);
    return getMockReport(topic);
  }
}

export async function getLatestExamNews(): Promise<NewsItem[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
      console.warn("API Key missing for News Feed. Returning Mock Feed.");
      return getMockNews();
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "List 5 critical recent news items about Indian competitive exams (JEE, NEET, UPSC) from the last 48 hours. Return a JSON array with fields: id, headline, summary, sourceName, sourceUrl, timestamp. Ensure strictly valid JSON.",
        config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                sourceName: { type: Type.STRING },
                sourceUrl: { type: Type.STRING },
                timestamp: { type: Type.STRING }
            },
            required: ["id", "headline", "summary", "sourceName", "sourceUrl", "timestamp"],
            }
        }
        }
    });

    if (response.text) {
        const cleaned = cleanJsonText(response.text);
        try {
            const parsed = JSON.parse(cleaned);
            // CRITICAL FIX: If API returns empty array (no recent news found), use Mock Data
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error("News JSON Parse Error", e);
        }
    }
    // Fallback if text is empty or array is empty
    return getMockNews();

  } catch (e) {
    console.error("News Fetch Error:", e);
    return getMockNews();
  }
}

export async function getStudyCoachResponse(history: ChatMessage[], message: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) return "COMM_ERROR: API KEY MISSING. (Simulated Response: Keep studying!)";
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
        systemInstruction: "You are Dr. Byte, an AI study coach with a retro-arcade/cyberpunk persona. Help students with academic stress, study techniques, and syllabus queries. Use markdown and be encouraging but concise.",
        },
    });
    
    const response = await chat.sendMessage({ message });
    return response.text || "COMM_ERROR: NO SIGNAL.";
  } catch (e) {
      return "COMM_ERROR: SERVER UNREACHABLE. TRY AGAIN LATER.";
  }
}

function parseResponse(result: any, originalTopic: string): FactCheckReport {
  let text = result.text || "{}";
  
  // Use robust cleaning
  const cleanJson = cleanJsonText(text);
  
  let data: any = {};
  try {
    data = JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text, e);
    return getMockReport(originalTopic);
  }

  const sources: Source[] = [];
  
  // Robust extraction of grounding chunks
  const candidate = result.candidates?.[0];
  const groundingMetadata = candidate?.groundingMetadata;
  const chunks = groundingMetadata?.groundingChunks;

  if (chunks && Array.isArray(chunks)) {
    chunks.forEach((c: any) => {
      if (c.web?.uri && c.web?.title) {
        sources.push({ title: c.web.title, uri: c.web.uri });
      }
    });
  }

  // CRITICAL FIX: Ensure sources list is never empty
  if (sources.length === 0) {
      const lowerTopic = originalTopic.toLowerCase();
      // Add smart defaults based on topic if no live sources were returned
      if (lowerTopic.includes('jee') || lowerTopic.includes('mains')) {
          sources.push({ title: "Official NTA JEE Portal", uri: "https://jeemain.nta.ac.in" });
      } else if (lowerTopic.includes('neet')) {
          sources.push({ title: "Official NTA NEET Portal", uri: "https://exams.nta.ac.in/NEET" });
      } else if (lowerTopic.includes('cbse')) {
          sources.push({ title: "CBSE Official Website", uri: "https://cbse.gov.in" });
      } else if (lowerTopic.includes('upsc')) {
          sources.push({ title: "UPSC Official Website", uri: "https://upsc.gov.in" });
      }

      // Always add a verification link
      sources.push({ 
          title: "Google Search Verification", 
          uri: `https://www.google.com/search?q=${encodeURIComponent(originalTopic + " official news")}` 
      });
  }

  const finalTopic = (data.topic && data.topic !== "NO TEXT PROVIDED, CHECK MEDIA") ? data.topic : (originalTopic || "Unknown Rumor");

  return {
    topic: finalTopic,
    summary: data.summary || "No summary available.",
    timestamp: new Date().toISOString(),
    overallConfidence: data.overallConfidence || 0,
    sources,
    debateScript: data.debateScript || [],
    officialTimeline: data.officialTimeline || [],
    commonMisconceptions: data.commonMisconceptions || [],
    actionRecommendation: data.actionRecommendation || "No specific recommendation provided.",
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
