import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import SongForm from "@/components/SongForm";

export default async function NewSongPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

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
            Новая песня
          </h1>
          <p style={{ color: "#6b6b6b", fontSize: "0.875rem", margin: 0 }}>
            Добавь аккорды, текст и всё что нужно чтобы не забыть
          </p>
        </div>
        <SongForm userId={user.id} />
      </main>
    </div>
  );
}
