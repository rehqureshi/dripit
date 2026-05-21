"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

export default function TestSignupPage() {
  const supabase = createBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    setMessage("Loading...");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: "Rehan Test",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Signup successful. Check Supabase.");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Test Signup</h1>

      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="rounded bg-black px-4 py-2 text-white"
        onClick={handleSignup}
      >
        Sign Up
      </button>

      <p>{message}</p>
    </div>
  );
}