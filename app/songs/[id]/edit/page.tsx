import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SongForm from "@/components/SongForm";

export default async function EditSongPage({
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

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <Navbar user={user} />
      <main
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              letterSpacing: "-0.03em",
              color: "#f0ede8",
              margin: "0 0 0.25rem",
            }}
          >
            Редактировать
          </h1>
          <p style={{ color: "#a8a49e", fontSize: "0.875rem", margin: 0 }}>
            {song.title} — {song.artist}
          </p>
        </div>
        <SongForm userId={user.id} song={song} />
      </main>
    </div>
  );
}
