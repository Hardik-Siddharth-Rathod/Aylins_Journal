"use client";

import { MessageFeed } from "../MessageFeed";
import { useUserRole } from "../useUserRole";

export default function MessagesPage() {
  const role = useUserRole();
  const isAdmin = role === "admin";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 20px",
        background:
          `
          linear-gradient(180deg, #ede6dc 0%, #f3eee8 40%, #faf9f7 100%),
          repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.015),
            rgba(0,0,0,0.015) 1px,
            transparent 1px,
            transparent 4px
          )
        `,
      }}
    >
      <div style={{ maxWidth: 920, margin: "auto" }}>
        {/* HEADING */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: isAdmin ? 18 : 56,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: "0.5px",
          }}
        >
          {isAdmin
            ? "A personal space for Jenny 🤍"
            : "To our beloved Jenny 🤍"}
        </h1>

        {/* ADMIN-ONLY INTRO */}
        {isAdmin && (
  <>
    <p
      style={{
        textAlign: "center",
        opacity: 0.8,
        marginBottom: 16,
        lineHeight: 1.9,
        fontSize: 18,
      }}
    >
      This space was created just for you.
      <br />
      Every message you see here was written by someone whose life you touched
      in ways they may not always have known how to say out loud.
      <br />
      These words were written with care, honesty, and love.
    </p>

    <p
      style={{
        textAlign: "center",
        fontSize: 15,
        opacity: 0.55,
        marginBottom: 70,
      }}
    >
      Take your time with them.  
      There is no rush — this journal will wait for you.
    </p>
  </>
)}


        {/* WHITE JOURNAL PAGE */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 32,
            padding: "clamp(30px, 6vw, 70px) clamp(20px, 5vw, 50px)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          {/* subtle page edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 32,
              pointerEvents: "none",
              boxShadow:
                "inset 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          />

          <MessageFeed />
        </div>
      </div>
    </main>
  );
}

