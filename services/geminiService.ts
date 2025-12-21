
import { GoogleGenAI, Type } from "@google/genai";
import { FactCheckReport, Source, Claim, VerdictType, ClaimSeverity, DebateTurn, NewsItem, ChatMessage } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface MediaData {
  mimeType: string;
  data: string;
}

// Updated to use gemini-3-flash-preview and correct API patterns
export async function analyzeExamNews(topic: string, media?: MediaData): Promise<FactCheckReport> {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    console.warn("Primary Grounding Attempt Failed, falling back to LLM knowledge...", error);
    try {
        const fallbackResult = await ai.models.generateContent({
            model,
            contents: { parts },
            config: {
                temperature: 0.9
            }
        });
        return parseResponse(fallbackResult, topic);
    } catch (finalError: any) {
        throw new Error("Analysis failed: " + finalError.message);
    }
  }
}

export async function getLatestExamNews(): Promise<NewsItem[]> {
  if (!process.env.API_KEY) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "List the 5 most critical recent news items about Indian competitive exams (JEE, NEET, UPSC, etc.) from the last 2 days. Ensure they are verified and official.",
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
          propertyOrdering: ["id", "headline", "summary", "sourceName", "sourceUrl", "timestamp"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("News Parse Error", e);
    return [];
  }
}

export async function getStudyCoachResponse(history: ChatMessage[], message: string): Promise<string> {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Dr. Byte, an AI study coach with a retro-arcade/cyberpunk persona. Help students with academic stress, study techniques, and syllabus queries. Use markdown and be encouraging but concise.",
    },
  });
  
  const response = await chat.sendMessage({ message });
  return response.text || "COMM_ERROR: NO SIGNAL.";
}

function parseResponse(result: any, originalTopic: string): FactCheckReport {
  let text = result.text || "{}";
  const startIndex = text.indexOf('{');
  const endIndex = text.lastIndexOf('}');
  if (startIndex !== -1 && endIndex !== -1) {
      text = text.substring(startIndex, endIndex + 1);
  }
  const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
  let data: any = {};
  try {
    data = JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error. Raw text:", text, e);
    throw new Error("Failed to decode the Battle Report.");
  }

  const sources: Source[] = [];
  if (result.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    result.candidates[0].groundingMetadata.groundingChunks.forEach((c: any) => {
      if (c.web?.uri && c.web?.title) {
        sources.push({ title: c.web.title, uri: c.web.uri });
      }
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
