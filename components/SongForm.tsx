"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Song } from "@/lib/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#1e1e1e",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  color: "#f0ede8",
  fontSize: "0.9rem",
  fontFamily: "Montserrat, sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: "600",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#6b6b6b",
  marginBottom: "0.5rem",
};

const sectionStyle: React.CSSProperties = {
  background: "#161616",
  border: "1px solid #2a2a2a",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1rem",
};

export default function SongForm({
  userId,
  song,
}: {
  userId: string;
  song?: Song;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: song?.title ?? "",
    artist: song?.artist ?? "",
    key: song?.key ?? "",
    tempo: song?.tempo?.toString() ?? "",
    difficulty: song?.difficulty ?? "",
    lyrics_chords: song?.lyrics_chords ?? "",
    tabs: song?.tabs ?? "",
    rhythm: song?.rhythm ?? "",
    notes: song?.notes ?? "",
    source_url: song?.source_url ?? "",
    tags: song?.tags?.join(", ") ?? "",
    is_learned: song?.is_learned ?? false,
  });

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFetchUrl = async () => {
    if (!form.source_url) return;
    setFetchingUrl(true);
    try {
      const res = await fetch("/api/fetch-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.source_url }),
      });
      const data = await res.json();
      if (data.title && !form.title) set("title", data.title);
      if (data.artist && !form.artist) set("artist", data.artist);
      if (data.lyrics_chords && !form.lyrics_chords)
        set("lyrics_chords", data.lyrics_chords);
    } catch {
      // silently fail
    }
    setFetchingUrl(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.artist) {
      setError("Название и исполнитель обязательны");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      user_id: userId,
      title: form.title.trim(),
      artist: form.artist.trim(),
      key: form.key || null,
      tempo: form.tempo ? parseInt(form.tempo) : null,
      difficulty: form.difficulty || null,
      lyrics_chords: form.lyrics_chords || null,
      tabs: form.tabs || null,
      rhythm: form.rhythm || null,
      notes: form.notes || null,
      source_url: form.source_url || null,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : null,
      is_learned: form.is_learned,
    };

    let error;

    if (song) {
      const result = await supabase
        .from("songs")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", song.id);
      error = result.error;
    } else {
      const result = await supabase.from("songs").insert(payload);
      error = result.error;
    }

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/songs");
    router.refresh();
  };

  return (
    <div>
      {/* Basic info */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            marginBottom: "1rem",
            margin: "0 0 1rem",
          }}
        >
          Основное
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Название *</label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Название песни"
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Исполнитель *</label>
            <input
              style={inputStyle}
              value={form.artist}
              onChange={(e) => set("artist", e.target.value)}
              placeholder="Исполнитель"
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>Тональность</label>
            <input
              style={inputStyle}
              value={form.key}
              onChange={(e) => set("key", e.target.value)}
              placeholder="Am, C, G..."
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Темп (BPM)</label>
            <input
              style={inputStyle}
              type="number"
              value={form.tempo}
              onChange={(e) => set("tempo", e.target.value)}
              placeholder="120"
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Сложность</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.difficulty}
              onChange={(e) => set("difficulty", e.target.value)}
            >
              <option value="">— выбери —</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>
        </div>
      </div>

      {/* Source URL */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            margin: "0 0 1rem",
          }}
        >
          Источник
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={form.source_url}
            onChange={(e) => set("source_url", e.target.value)}
            placeholder="https://tabs.ultimate-guitar.com/..."
            onFocus={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
            }
            onBlur={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
            }
          />
          <button
            onClick={handleFetchUrl}
            disabled={!form.source_url || fetchingUrl}
            style={{
              padding: "0.75rem 1.25rem",
              background: form.source_url ? "#e8c547" : "#1e1e1e",
              border: "none",
              borderRadius: "8px",
              color: form.source_url ? "#0d0d0d" : "#3a3a3a",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: form.source_url ? "pointer" : "not-allowed",
              fontFamily: "Montserrat, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {fetchingUrl ? "⏳ Загрузка..." : "↓ Импорт"}
          </button>
        </div>
        <p
          style={{
            color: "#3a3a3a",
            fontSize: "0.75rem",
            marginTop: "0.5rem",
            margin: "0.5rem 0 0",
          }}
        >
          Вставь ссылку на аккорды — данные подтянутся автоматически
        </p>
      </div>

      {/* Lyrics + Chords */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            margin: "0 0 1rem",
          }}
        >
          Текст и аккорды
        </p>
        <textarea
          style={{
            ...inputStyle,
            height: "220px",
            resize: "vertical",
            fontFamily: "'Courier New', monospace",
            lineHeight: "1.8",
          }}
          value={form.lyrics_chords}
          onChange={(e) => set("lyrics_chords", e.target.value)}
          placeholder={`[Am]Слова первого куплета\nCем продолжение строки [G]\n\n[C]Припев начинается тут`}
          onFocus={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#e8c547")
          }
          onBlur={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#2a2a2a")
          }
        />
      </div>

      {/* Rhythm */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            margin: "0 0 1rem",
          }}
        >
          Ритм / Гитарный бой
        </p>
        <textarea
          style={{
            ...inputStyle,
            height: "100px",
            resize: "vertical",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.05em",
          }}
          value={form.rhythm}
          onChange={(e) => set("rhythm", e.target.value)}
          placeholder={`↓ ↓ ↑ ↑ ↓ ↑\nили: d dud udu\nили: 1 и 2 и 3 и 4 и`}
          onFocus={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#e8c547")
          }
          onBlur={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#2a2a2a")
          }
        />
      </div>

      {/* Tabs */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            margin: "0 0 1rem",
          }}
        >
          Табулатура
        </p>
        <textarea
          style={{
            ...inputStyle,
            height: "150px",
            resize: "vertical",
            fontFamily: "'Courier New', monospace",
            fontSize: "0.8rem",
          }}
          value={form.tabs}
          onChange={(e) => set("tabs", e.target.value)}
          placeholder={`e|--0--2--3--2--0-|\nB|--1--3--3--3--1-|\nG|--0--2--0--2--0-|\nD|--2--0--0--0--2-|\nA|--3--x--2--x--3-|\nE|--x--x--3--x--x-|`}
          onFocus={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#e8c547")
          }
          onBlur={(e) =>
            ((e.target as HTMLTextAreaElement).style.borderColor = "#2a2a2a")
          }
        />
      </div>

      {/* Notes + Tags */}
      <div style={sectionStyle}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#e8c547",
            margin: "0 0 1rem",
          }}
        >
          Заметки и теги
        </p>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Заметки</label>
          <textarea
            style={{
              ...inputStyle,
              height: "90px",
              resize: "vertical",
            }}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Советы, сложные моменты, на что обратить внимание..."
            onFocus={(e) =>
              ((e.target as HTMLTextAreaElement).style.borderColor = "#e8c547")
            }
            onBlur={(e) =>
              ((e.target as HTMLTextAreaElement).style.borderColor = "#2a2a2a")
            }
          />
        </div>
        <div>
          <label style={labelStyle}>Теги (через запятую)</label>
          <input
            style={inputStyle}
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="рок, баллада, любимые, разучиваю..."
            onFocus={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
            }
            onBlur={(e) =>
              ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
            }
          />
        </div>
      </div>

      {/* Learned toggle */}
      <div
        style={{
          ...sectionStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => set("is_learned", !form.is_learned)}
      >
        <div>
          <p
            style={{
              color: "#f0ede8",
              fontWeight: "600",
              fontSize: "0.9rem",
              margin: "0 0 0.25rem",
            }}
          >
            Песня выучена
          </p>
          <p style={{ color: "#6b6b6b", fontSize: "0.8rem", margin: 0 }}>
            Отметь, когда освоишь песню полностью
          </p>
        </div>
        <div
          style={{
            width: "48px",
            height: "26px",
            background: form.is_learned ? "#e8c547" : "#2a2a2a",
            borderRadius: "13px",
            position: "relative",
            transition: "background 0.2s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: form.is_learned ? "25px" : "3px",
              width: "20px",
              height: "20px",
              background: form.is_learned ? "#0d0d0d" : "#6b6b6b",
              borderRadius: "50%",
              transition: "all 0.2s",
            }}
          />
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "#ef4444",
            fontSize: "0.875rem",
            padding: "0.75rem 1rem",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "12px", paddingBottom: "2rem" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.875rem",
            background: loading ? "#c9a82c" : "#e8c547",
            border: "none",
            borderRadius: "10px",
            color: "#0d0d0d",
            fontSize: "0.9rem",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {loading
            ? "Сохраняем..."
            : song
            ? "Сохранить изменения"
            : "Добавить в архив"}
        </button>
        <button
          onClick={() => router.back()}
          style={{
            padding: "0.875rem 1.5rem",
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
            color: "#6b6b6b",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
