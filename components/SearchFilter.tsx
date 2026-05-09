"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilter({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const currentTag = searchParams.get("tag") ?? "";
  const currentLearned = searchParams.get("learned") ?? "";

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/songs?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update("q", q);
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.625rem 1rem",
    background: "#161616",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#f0ede8",
    fontSize: "0.875rem",
    fontFamily: "Montserrat, sans-serif",
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: "6px", flex: 1, minWidth: "200px" }}
      >
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию или исполнителю..."
          onFocus={(e) =>
            ((e.target as HTMLInputElement).style.borderColor = "#e8c547")
          }
          onBlur={(e) =>
            ((e.target as HTMLInputElement).style.borderColor = "#2a2a2a")
          }
        />
        <button
          type="submit"
          style={{
            ...inputStyle,
            padding: "0.625rem 1rem",
            cursor: "pointer",
            background: "#e8c547",
            color: "#0d0d0d",
            fontWeight: "700",
            border: "none",
          }}
        >
          🔍
        </button>
      </form>

      {/* Learned filter */}
      <select
        style={{ ...inputStyle, cursor: "pointer" }}
        value={currentLearned}
        onChange={(e) => update("learned", e.target.value)}
      >
        <option value="">Все песни</option>
        <option value="true">Выученные</option>
        <option value="false">В процессе</option>
      </select>

      {/* Tags */}
      {allTags.length > 0 && (
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={currentTag}
          onChange={(e) => update("tag", e.target.value)}
        >
          <option value="">Все теги</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      )}

      {/* Clear filters */}
      {(searchParams.get("q") ||
        searchParams.get("tag") ||
        searchParams.get("learned")) && (
        <button
          onClick={() => {
            setQ("");
            router.push("/songs");
          }}
          style={{
            ...inputStyle,
            cursor: "pointer",
            color: "#6b6b6b",
            border: "1px solid #2a2a2a",
          }}
        >
          ✕ Сбросить
        </button>
      )}
    </div>
  );
}
