
import { createClient } from '@supabase/supabase-js';
import { CaseHistoryItem, NewsItem } from '../types';

// Credentials provided by user
// NOTE: Ensure these are valid. If not, the app will degrade gracefully to local-only mode.
const supabaseUrl = "https://zkikhyqordgpmonuchek.supabase.co";
const supabaseKey = "sb_publishable_5tbQN5TW-bixrdTUZfXrmw_Vd-pY8Js";

let supabase: any = null;

if (supabaseUrl && supabaseKey && supabaseKey.length > 10) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.warn("Supabase Client Init Failed:", e);
  }
}

export const fetchBattles = async (username: string): Promise<CaseHistoryItem[]> => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
        .from('battles')
        .select('*')
        .like('id', `${username}-%`) 
        .order('timestamp', { ascending: false });
        
    if (error) {
      // Log less verbosely if it's just a missing table or auth issue
      console.warn("Supabase Fetch Warning (battles):", error.message || JSON.stringify(error));
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn("Supabase Network Exception:", e);
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
      console.warn("Supabase Fetch All Warning:", error.message || JSON.stringify(error));
      return [];
    }
    return data || [];
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
    
    if (error) {
       // It's common for .single() to return error if no rows found, which is fine
       if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
           console.warn("News Snapshot Fetch Warning:", error.message || JSON.stringify(error));
       }
       return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

export const saveNewsSnapshot = async (newsData: NewsItem[]) => {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('news_snapshots').insert([{ data: newsData }]);
    if (error) {
        console.warn("Save News Snapshot Warning:", error.message || JSON.stringify(error));
    }
  } catch (e) {
      console.warn("Save News Exception:", e);
  }
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
    if (error) {
        console.warn("Save Battle Warning:", error.message || JSON.stringify(error));
    }
  } catch (e) {
    console.warn("Save Battle Exception:", e);
  }
};

export const deleteBattle = async (id: string) => {
  if (!supabase) return;
  
  const { error } = await supabase.from('battles').delete().eq('id', id);
  
  if (error) {
    console.warn("Delete Battle Warning:", error.message || JSON.stringify(error));
    throw new Error(error.message || "Failed to delete record");
  }
};
