"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import RolePicker, { type Role } from "./RolePicker";

type Mode = "login" | "signup";

export default function AuthCard({ initialMode }: { initialMode: Mode }) {
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<Role | null>(null);

  const choosingRole = mode === "signup" && !role;

  return (
    <section className="mx-auto flex w-full max-w-md flex-col justify-center gap-8 p-8 md:p-12">
      <div className="anim-fade-up relative mx-auto grid w-56 grid-cols-2 rounded-lg border border-line bg-ink p-1 text-sm [--delay:100ms]">
        <span
          className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-gradient-to-r from-leaf to-lime transition-transform duration-300 ${
            mode === "signup" ? "translate-x-full" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setNotice("");
          }}
          className={`relative z-10 rounded-md py-2 font-medium transition-colors ${mode === "login" ? "text-ink" : "text-muted"}`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setNotice("");
            setRole(null);
          }}
          className={`relative z-10 rounded-md py-2 font-medium transition-colors ${mode === "signup" ? "text-ink" : "text-muted"}`}
        >
          Sign Up
        </button>
      </div>

      <div key={`${mode}-${role}-text`} className="text-center">
        <h1 className="anim-fade-up font-display text-3xl font-semibold [--delay:200ms]">
          {mode === "login"
            ? "Welcome back"
            : choosingRole
              ? "Choose your path"
              : "Create your account"}
        </h1>
        <p className="anim-fade-up mt-2 text-sm text-muted [--delay:300ms]">
          {mode === "login"
            ? "Enter your phone number and we will text you a code."
            : choosingRole
              ? "Select how you'll use GrainTrail."
              : "Join with your phone number, no password needed."}
        </p>
        {notice && <p className="mt-2 text-sm text-gold">{notice}</p>}
      </div>

      <div
        key={`${mode}-${role}-body`}
        className="anim-fade-up [--delay:400ms]"
      >
        {mode === "login" ? (
          <LoginForm
            onNotRegistered={() => {
              setMode("signup");
              setRole(null);
              setNotice("Create an account to continue.");
            }}
          />
        ) : choosingRole ? (
          <RolePicker onSelect={setRole} />
        ) : (
          <>
            <button
              type="button"
              onClick={() => setRole(null)}
              className="mb-4 text-sm text-muted hover:text-snow"
            >
              ← Change role ({role})
            </button>
            <SignupForm role={role!} />
          </>
        )}
      </div>
    </section>
  );
}
