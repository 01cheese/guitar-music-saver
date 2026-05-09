import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DeleteSongButton from "@/components/DeleteSongButton";
import MarkLearnedButton from "@/components/MarkLearnedButton";

export default async function SongPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { id } = await params;
  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!song) notFound();

  const difficultyLabel = {
    beginner: "Начинающий",
    intermediate: "Средний",
    advanced: "Продвинутый",
  };

  const difficultyColor = {
    beginner: "#22c55e",
    intermediate: "#e8c547",
    advanced: "#ef4444",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <Navbar user={user} />

      <main
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "2rem",
            fontSize: "0.8rem",
            color: "#6b6b6b",
          }}
        >
          <Link
            href="/songs"
            style={{ color: "#6b6b6b", textDecoration: "none" }}
          >
            Мои песни
          </Link>
          <span>/</span>
          <span style={{ color: "#a8a49e" }}>{song.title}</span>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "0.5rem",
              }}
            >
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "700",
                  letterSpacing: "-0.04em",
                  color: "#f0ede8",
                  margin: 0,
                }}
              >
                {song.title}
              </h1>
              {song.is_learned && (
                <span
                  style={{
                    padding: "4px 12px",
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "20px",
                    color: "#22c55e",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  ✓ Выучена
                </span>
              )}
            </div>
            <p
              style={{
                color: "#a8a49e",
                fontSize: "1.1rem",
                margin: "0 0 0.75rem",
                fontWeight: "500",
              }}
            >
              {song.artist}
            </p>

            {/* Meta pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {song.key && (
                <span
                  style={{
                    padding: "4px 12px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#e8c547",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                  }}
                >
                  🎵 {song.key}
                </span>
              )}
              {song.tempo && (
                <span
                  style={{
                    padding: "4px 12px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#a8a49e",
                    fontSize: "0.8rem",
                  }}
                >
                  ♩ {song.tempo} BPM
                </span>
              )}
              {song.difficulty && (
                <span
                  style={{
                    padding: "4px 12px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color:
                      difficultyColor[
                        song.difficulty as keyof typeof difficultyColor
                      ],
                    fontSize: "0.8rem",
                  }}
                >
                  {
                    difficultyLabel[
                      song.difficulty as keyof typeof difficultyLabel
                    ]
                  }
                </span>
              )}
              {song.tags?.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    padding: "4px 12px",
                    background: "#1e1e1e",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#6b6b6b",
                    fontSize: "0.8rem",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <MarkLearnedButton
              songId={song.id}
              isLearned={song.is_learned}
            />
            <Link
              href={`/songs/${song.id}/edit`}
              style={{
                padding: "0.625rem 1.25rem",
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#f0ede8",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Редактировать
            </Link>
            <DeleteSongButton songId={song.id} />
          </div>
        </div>

        {/* Content tabs */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Lyrics + Chords */}
          {song.lyrics_chords && (
            <section>
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b6b6b",
                  marginBottom: "0.75rem",
                }}
              >
                Текст и аккорды
              </h2>
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  color: "#f0ede8",
                  whiteSpace: "pre-wrap",
                  overflowX: "auto",
                }}
              >
                {song.lyrics_chords}
              </div>
            </section>
          )}

          {/* Rhythm */}
          {song.rhythm && (
            <section>
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b6b6b",
                  marginBottom: "0.75rem",
                }}
              >
                Ритм / Бой
              </h2>
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #e8c547",
                  borderLeft: "4px solid #e8c547",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "1rem",
                  color: "#f0ede8",
                  whiteSpace: "pre-wrap",
                  letterSpacing: "0.05em",
                }}
              >
                {song.rhythm}
              </div>
            </section>
          )}

          {/* Tabs */}
          {song.tabs && (
            <section>
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b6b6b",
                  marginBottom: "0.75rem",
                }}
              >
                Табулатура
              </h2>
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.8rem",
                  lineHeight: "1.6",
                  color: "#e8c547",
                  whiteSpace: "pre",
                  overflowX: "auto",
                }}
              >
                {song.tabs}
              </div>
            </section>
          )}

          {/* Notes */}
          {song.notes && (
            <section>
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b6b6b",
                  marginBottom: "0.75rem",
                }}
              >
                Заметки
              </h2>
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  fontSize: "0.9rem",
                  lineHeight: "1.7",
                  color: "#a8a49e",
                  whiteSpace: "pre-wrap",
                }}
              >
                {song.notes}
              </div>
            </section>
          )}

          {/* Source URL */}
          {song.source_url && (
            <section>
              <h2
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6b6b6b",
                  marginBottom: "0.75rem",
                }}
              >
                Источник
              </h2>
              <a
                href={song.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.75rem 1.25rem",
                  background: "#161616",
                  border: "1px solid #2a2a2a",
                  borderRadius: "10px",
                  color: "#e8c547",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  wordBreak: "break-all",
                }}
              >
                🔗 {song.source_url}
              </a>
            </section>
          )}
        </div>

        {/* Last played */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #1e1e1e",
            display: "flex",
            justifyContent: "space-between",
            color: "#3a3a3a",
            fontSize: "0.75rem",
          }}
        >
          <span>
            Добавлено:{" "}
            {new Date(song.created_at).toLocaleDateString("ru-RU")}
          </span>
          {song.last_played_at && (
            <span>
              Последний раз играл:{" "}
              {new Date(song.last_played_at).toLocaleDateString("ru-RU")}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
