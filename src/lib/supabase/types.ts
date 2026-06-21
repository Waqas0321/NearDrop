export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          visibility_radius_km: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          visibility_radius_km?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          visibility_radius_km?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      share_sessions: {
        Row: {
          id: string;
          user_id: string;
          text_content: string;
          latitude: number | null;
          longitude: number | null;
          radius_km: number;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text_content?: string;
          latitude?: number | null;
          longitude?: number | null;
          radius_km?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text_content?: string;
          latitude?: number | null;
          longitude?: number | null;
          radius_km?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      share_files: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          file_name: string;
          file_size: number;
          file_type: string | null;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          file_name: string;
          file_size: number;
          file_type?: string | null;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string | null;
          storage_path?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ShareSession = Database["public"]["Tables"]["share_sessions"]["Row"];
export type ShareFile = Database["public"]["Tables"]["share_files"]["Row"];
