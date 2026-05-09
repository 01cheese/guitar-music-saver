export type RhythmPattern = string;

export type Song = {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  key?: string | null;
  tempo?: number | null;
  difficulty?: "beginner" | "intermediate" | "advanced" | null;
  lyrics_chords?: string | null;
  tabs?: string | null;
  rhythm?: string | null;
  notes?: string | null;
  source_url?: string | null;
  tags?: string[] | null;
  is_learned: boolean;
  last_played_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type SongInsert = Omit<Song, "id" | "created_at" | "updated_at">;
export type SongUpdate = Partial<SongInsert>;
