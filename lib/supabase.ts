// 檔案路徑：lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      itineraries: {
        Row: {
          id: string;
          title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
        };
      };
      itinerary_events: {
        // 👇 這裡已經更新為符合你 PDF 欄位的新架構
        Row: {
          id: string;
          itinerary_id: string;
          event_date: string; // <-- 新增此行，取代 day_number
          start_time: string | null;
          end_time: string | null;
          category: string | null;
          content: string;
          transportation: string | null;
          notes: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          itinerary_id: string;
          day_number: number;
          event_time?: string | null;
          category?: string | null;
          content: string;
          transportation?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          itinerary_id?: string;
          day_number?: number;
          event_time?: string | null;
          category?: string | null;
          content?: string;
          transportation?: string | null;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);