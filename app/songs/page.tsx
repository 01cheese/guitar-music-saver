import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Song } from "@/lib/types";
import SongCard from "@/components/SongCard";
import Navbar from "@/components/Navbar";
import SearchFilter from "@/components/SearchFilter";

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string; learned?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const params = await searchParams;

  let query = supabase
    .from("songs")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,artist.ilike.%${params.q}%`
    );
  }

  if (params.learned === "true") {
    query = query.eq("is_learned", true);
  } else if (params.learned === "false") {
    query = query.eq("is_learned", false);
  }

  const { data: songs } = await query;

  const allTags = Array.from(
    new Set((songs ?? []).flatMap((s: Song) => s.tags ?? []))
  );

  const filteredSongs =
    params.tag
      ? (songs ?? []).filter((s: Song) => s.tags?.includes(params.tag!))
      : songs ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <Navbar user={user} />

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                letterSpacing: "-0.03em",
                color: "#f0ede8",
                margin: "0 0 0.25rem",
              }}
            >
              Мои песни
            </h1>
            <p style={{ color: "#6b6b6b", fontSize: "0.875rem", margin: 0 }}>
              {filteredSongs.length}{" "}
              {filteredSongs.length === 1 ? "песня" : filteredSongs.length < 5 ? "песни" : "песен"} в архиве
            </p>
          </div>

          <Link
            href="/songs/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.5rem",
              background: "#e8c547",
              color: "#0d0d0d",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.875rem",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>+</span>
            Добавить песню
          </Link>
        </div>

        {/* Search & Filters */}
        <SearchFilter allTags={allTags} />

        {/* Songs grid */}
        {filteredSongs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              color: "#3a3a3a",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎸</div>
            <p style={{ fontSize: "1rem", color: "#6b6b6b" }}>
              {params.q || params.tag
                ? "Ничего не найдено"
                : "Архив пуст — добавь первую песню"}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {filteredSongs.map((song: Song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
