"use client";

import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0d",
        padding: "2rem",
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(232, 197, 71, 0.04) 0%, transparent 50%), 
            radial-gradient(circle at 80% 20%, rgba(232, 197, 71, 0.03) 0%, transparent 40%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Icon */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 1.5rem",
              background: "linear-gradient(135deg, #e8c547 0%, #c9a82c 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🎸
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              letterSpacing: "-0.04em",
              color: "#f0ede8",
              margin: "0 0 0.5rem",
            }}
          >
            Guitar Vault
          </h1>
          <p
            style={{
              color: "#6b6b6b",
              fontSize: "0.9rem",
              fontWeight: "400",
              letterSpacing: "0.02em",
            }}
          >
            Твой личный архив песен
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            padding: "2rem",
          }}
        >
          <p
            style={{
              color: "#a8a49e",
              fontSize: "0.85rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              lineHeight: "1.6",
            }}
          >
            Войди, чтобы сохранять аккорды, табулатуры и тексты своих песен
          </p>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "0.875rem 1.5rem",
              background: "#1e1e1e",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              color: "#f0ede8",
              fontSize: "0.9rem",
              fontWeight: "600",
              fontFamily: "Montserrat, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.2s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#e8c547";
              (e.target as HTMLButtonElement).style.background = "#252525";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#2a2a2a";
              (e.target as HTMLButtonElement).style.background = "#1e1e1e";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              />
              <path
                fill="#34A853"
                d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
              />
              <path
                fill="#FBBC05"
                d="M4.5 10.48A4.8 4.8 0 0 1 4.5 7.52V5.45H1.83a8 8 0 0 0 0 7.1z"
              />
              <path
                fill="#EA4335"
                d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.45L4.5 7.52A4.77 4.77 0 0 1 8.98 4.18z"
              />
            </svg>
            Войти через Google
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#3a3a3a",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
          }}
        >
          Данные хранятся только в твоём аккаунте
        </p>
      </div>
    </div>
  );
}
