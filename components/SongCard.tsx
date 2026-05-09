"use client";

import Link from "next/link";
import type { Song } from "@/lib/types";

const difficultyColor: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#e8c547",
  advanced: "#ef4444",
};

export default function SongCard({ song }: { song: Song }) {
  return (
    <Link
      href={`/songs/${song.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "12px",
          padding: "1.25rem",
          cursor: "pointer",
          transition: "all 0.2s",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#e8c547";
          (e.currentTarget as HTMLDivElement).style.background = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#2a2a2a";
          (e.currentTarget as HTMLDivElement).style.background = "#161616";
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "0.75rem",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#f0ede8",
                margin: "0 0 0.25rem",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {song.title}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#6b6b6b",
                margin: 0,
                fontWeight: "500",
              }}
            >
              {song.artist}
            </p>
          </div>
          {song.is_learned && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "3px 8px",
                background: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
                borderRadius: "4px",
                fontWeight: "600",
                flexShrink: 0,
                marginLeft: "8px",
              }}
            >
              ✓
            </span>
          )}
        </div>

        <div
          style={{ display: "flex", gap: "6px", flexWrap: "wrap", flex: 1 }}
        >
          {song.key && (
            <span
              style={{
                padding: "3px 8px",
                background: "rgba(232, 197, 71, 0.1)",
                border: "1px solid rgba(232, 197, 71, 0.2)",
                borderRadius: "4px",
                color: "#e8c547",
                fontSize: "0.7rem",
                fontWeight: "700",
              }}
            >
              {song.key}
            </span>
          )}
          {song.difficulty && (
            <span
              style={{
                padding: "3px 8px",
                background: "#1e1e1e",
                borderRadius: "4px",
                color: difficultyColor[song.difficulty],
                fontSize: "0.7rem",
              }}
            >
              {song.difficulty}
            </span>
          )}
          {song.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 8px",
                background: "#1e1e1e",
                borderRadius: "4px",
                color: "#4a4a4a",
                fontSize: "0.7rem",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #1e1e1e",
          }}
        >
          {song.lyrics_chords && (
            <span style={{ color: "#3a3a3a", fontSize: "0.7rem" }}>
              🎵 Аккорды
            </span>
          )}
          {song.tabs && (
            <span style={{ color: "#3a3a3a", fontSize: "0.7rem" }}>
              📄 Табы
            </span>
          )}
          {song.rhythm && (
            <span style={{ color: "#3a3a3a", fontSize: "0.7rem" }}>
              🥁 Бой
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
