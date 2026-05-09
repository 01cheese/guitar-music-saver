"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <nav
      style={{
        borderBottom: "1px solid #1e1e1e",
        padding: "0 1.5rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(13, 13, 13, 0.95)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
      }}
    >
      <Link
        href="/songs"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: "1.25rem" }}>🎸</span>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            color: "#f0ede8",
            letterSpacing: "-0.02em",
          }}
        >
          Guitar Vault
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          style={{
            padding: "0.375rem 0.875rem",
            background: "transparent",
            border: "1px solid #2a2a2a",
            borderRadius: "6px",
            color: "#6b6b6b",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "#f0ede8";
            (e.target as HTMLButtonElement).style.borderColor = "#6b6b6b";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "#6b6b6b";
            (e.target as HTMLButtonElement).style.borderColor = "#2a2a2a";
          }}
        >
          Выйти
        </button>
      </div>
    </nav>
  );
}
