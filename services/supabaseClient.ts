
import { createClient } from '@supabase/supabase-js';
import { CaseHistoryItem, NewsItem } from '../types';

// Credentials provided by user
const supabaseUrl = "https://zkikhyqordgpmonuchek.supabase.co";
const supabaseKey = "sb_publishable_5tbQN5TW-bixrdTUZfXrmw_Vd-pY8Js";

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Supabase Initialization Failed:", e);
  }
}

export const fetchBattles = async (username: string): Promise<CaseHistoryItem[]> => {
  if (!supabase || !username) return [];
  try {
    const { data, error } = await supabase
        .from('battles')
        .select('*')
        .like('id', `${username}-%`) 
        .order('timestamp', { ascending: false });
    if (error) {
      console.error("Fetch Error:", error);
      return [];
    }
    return data as CaseHistoryItem[];
  } catch (e) {
    console.error("Fetch Exception:", e);
    return [];
  }
};

export const fetchAllBattles = async (): Promise<CaseHistoryItem[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
        .from('battles')
        .select('*')
        .order('timestamp', { ascending: false });
    if (error) {
      console.error("Fetch All Error:", error);
      return [];
    }
    return data as CaseHistoryItem[];
  } catch (e) {
    return [];
  }
};

export const fetchLatestNewsSnapshot = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('news_snapshots')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
};

export const saveNewsSnapshot = async (newsData: NewsItem[]) => {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('news_snapshots').insert([{ data: newsData }]);
    if (error) console.error("Save News Error:", error);
  } catch (e) {}
};

export const saveBattle = async (item: CaseHistoryItem) => {
  if (!supabase) return;
  try {
    const payload = {
        id: item.id,
        query: item.query,
        verdict: item.verdict,
        confidence: item.confidence,
        timestamp: item.timestamp
    };
    const { error } = await supabase.from('battles').insert([payload]);
    if (error) throw error;
  } catch (e) {
    console.error("Save Battle Error:", e);
  }
};

export const deleteBattle = async (id: string) => {
  if (!supabase) return;
  
  // Properly await and check for error
  const { error } = await supabase.from('battles').delete().eq('id', id);
  
  if (error) {
    console.error("Supabase Delete Error:", error);
    throw new Error(error.message || "Failed to delete record");
  }
};
