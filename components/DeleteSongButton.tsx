"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteSongButton({ songId }: { songId: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    await supabase.from("songs").delete().eq("id", songId);
    router.push("/songs");
    router.refresh();
  };

  if (confirming) {
    return (
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={handleDelete}
          style={{
            padding: "0.625rem 1rem",
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "0.8rem",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Удалить
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            padding: "0.625rem 0.875rem",
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#6b6b6b",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        padding: "0.625rem 0.875rem",
        background: "transparent",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        color: "#6b6b6b",
        fontSize: "0.875rem",
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      🗑
    </button>
  );
}
