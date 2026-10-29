"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Mode = "login" | "signup";

export default function AuthCard({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center gap-8 p-8 md:p-12">
      <div className="relative mx-auto grid w-56 grid-cols-2 rounded-lg border border-line bg-ink p-1 text-sm">
        <span
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-gradient-to-r from-leaf to-lime transition-transform duration-300 ${
            mode === "signup" ? "translate-x-full" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`relative z-10 rounded-md py-2 font-medium transition-colors ${mode === "login" ? "text-ink" : "text-muted"}`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`relative z-10 rounded-md py-2 font-medium transition-colors ${mode === "signup" ? "text-ink" : "text-muted"}`}
        >
          Sign Up
        </button>
      </div>

      <div className="text-center">
        <p className="mt-2 text-sm text-muted">
          {mode === "login"
            ? "Enter your phone number and we will text you a code."
            : "Join with your phone number, no password needed."}
        </p>
      </div>
      {mode === "login" ? <LoginForm /> : <SignupForm />}
    </section>
  );
}
