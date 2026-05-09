"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MarkLearnedButton({
  songId,
  isLearned,
}: {
  songId: string;
  isLearned: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggle = async () => {
    setLoading(true);
    await supabase
      .from("songs")
      .update({
        is_learned: !isLearned,
        last_played_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", songId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        padding: "0.625rem 1rem",
        background: isLearned
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(232, 197, 71, 0.1)",
        border: `1px solid ${isLearned ? "rgba(34, 197, 94, 0.3)" : "rgba(232, 197, 71, 0.3)"}`,
        borderRadius: "8px",
        color: isLearned ? "#22c55e" : "#e8c547",
        fontSize: "0.8rem",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        transition: "all 0.2s",
      }}
    >
      {loading ? "..." : isLearned ? "✓ Выучена" : "Отметить как выученную"}
    </button>
  );
}
