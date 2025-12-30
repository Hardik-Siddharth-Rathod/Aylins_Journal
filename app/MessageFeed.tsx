"use client";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { db, auth } from "./firebase";
import { useUserRole } from "./useUserRole";

export function MessageFeed() {
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const role = useUserRole();

  // 🔐 auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // 📄 fetch messages
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
  }, []);

  return (
    <div>
      {messages.map((m) => {
        const isOwner = user?.uid === m.uid;
        const canReadClearly =
          role === "admin" ||
          role === "aylin" ||
          isOwner;

        const initial =
          m.name?.charAt(0).toUpperCase() || "?";

        return (
          <div
            key={m.id}
            style={{
              background:
                "linear-gradient(180deg, #fffdfa 0%, #fffaf2 100%)",
              padding: "44px 40px",
              marginBottom: 64,
              borderRadius: 26,
              boxShadow:
                "0 18px 45px rgba(0,0,0,0.08)",
              position: "relative",
              borderLeft: "6px solid #e6dccc",
            }}
          >
            {/* 🗑️ ADMIN DELETE */}
            {role === "admin" && (
              <button
                onClick={() =>
                  deleteDoc(
                    doc(db, "messages", m.id)
                  )
                }
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  opacity: 0.35,
                  fontSize: 16,
                }}
                title="Delete message"
              >
                🗑️
              </button>
            )}

            {/* CONTENT ROW */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              {/* AVATAR */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #f1ede6, #e4ded4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 20,
                  marginRight: 24,
                  flexShrink: 0,
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.6)",
                }}
              >
                {initial}
              </div>

              {/* MESSAGE */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "clamp(16px, 4.5vw, 19px)",
                    lineHeight: 2,
                    whiteSpace: "pre-wrap",
                    color: "#2a2a2a",
                    filter: canReadClearly
                      ? "none"
                      : "blur(6px)",
                    opacity: canReadClearly ? 1 : 0.45,
                    transition:
                      "filter 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  {canReadClearly
                    ? m.text
                    : "This message is private 🤍"}
                </div>

                {/* SIGNATURE */}
                <div
                  style={{
                    marginTop: 32,
                    fontSize: 15,
                    opacity: 0.6,
                    textAlign: "right",
                  }}
                >
                  — {m.name}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

