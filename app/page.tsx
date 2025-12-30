"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "./firebase";
import { useUserRole } from "./useUserRole";

export default function Home() {
  const router = useRouter();
  const role = useUserRole();

  // auth
  const [user, setUser] = useState<User | null>(null);

  // register / login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // message
  const [text, setText] = useState("");
  const [hasMessage, setHasMessage] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [locked, setLocked] = useState(false);

  // auth listener
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // load message
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const snap = await getDoc(doc(db, "messages", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setText(d.text || "");
        setHasMessage(true);
        setEditCount(d.editCount || 0);
        setLocked(d.locked || false);
      }
    };

    load();
  }, [user]);

  /* =====================
     NOT LOGGED IN
     ===================== */
  if (!user) {
    return (
      <main style={{ padding: 40, maxWidth: 420, margin: "auto" }}>
        <h1>Jenny’s Space 🤍</h1>

        {isRegister && (
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 12 }}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 20 }}
        />

        {isRegister ? (
          <button
            style={{ width: "100%", padding: 12 }}
            onClick={async () => {
              if (!name.trim()) {
                alert("Please enter your name");
                return;
              }

              const cred =
                await createUserWithEmailAndPassword(
                  auth,
                  email,
                  password
                );

              await setDoc(doc(db, "users", cred.user.uid), {
                name,
                email,
                role: "friend",
                createdAt: serverTimestamp(),
              });
            }}
          >
            Register
          </button>
        ) : (
          <button
            style={{ width: "100%", padding: 12 }}
            onClick={() =>
              signInWithEmailAndPassword(
                auth,
                email,
                password
              )
            }
          >
            Login
          </button>
        )}

        <p
          style={{
            marginTop: 20,
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New here? Register"}
        </p>
      </main>
    );
  }

  /* =====================
     JENNY → VIEW ONLY
     ===================== */
  if (role === "admin") {
    router.push("/messages");
    return null;
  }

  /* =====================
     WRITE PAGE
     ===================== */
  return (
    <main style={{ padding: 40, maxWidth: 700, margin: "auto" }}>
      <h1>Write for Jenny 🤍</h1>

      <p style={{ opacity: 0.75, lineHeight: 1.8, fontSize: 16 }}>
  This is a quiet little space where you can pour your heart out.
  <br /><br />
  Write freely — about what Jenny means to you, the role she played in your life,
  a moment you still carry with you, or simply how she made you feel.
  There are no rules here, only honesty.
  <br /><br />
  Whatever you write will become a part of her personal journal.
  Your words will be visible only to Jenny — no one else will read them.
  Take your time, write gently, and write from the heart.
</p>


      {locked ? (
        <p>Your message is locked 🤍</p>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Write as if she’s reading this years from now…"
            style={{
              width: "100%",
              padding: 16,
              marginBottom: 16,
              fontSize: 16,
            }}
          />

          <button
            onClick={async () => {
              if (!text.trim()) return;

              const nextEditCount = hasMessage
                ? editCount + 1
                : 0;

              const userSnap = await getDoc(
                doc(db, "users", user.uid)
              );

              const name =
                userSnap.data()?.name || "Someone";

              await setDoc(
                doc(db, "messages", user.uid),
                {
                  uid: user.uid,
                  name,
                  text,
                  editCount: nextEditCount,
                  locked: nextEditCount >= 1,
                  createdAt: serverTimestamp(),
                }
              );

              router.push("/messages");
            }}
          >
            {hasMessage
              ? "Update (this will lock)"
              : "Submit Message"}
          </button>
        </>
      )}
    </main>
  );
}

