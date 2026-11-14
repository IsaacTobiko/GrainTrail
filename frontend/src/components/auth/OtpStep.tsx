"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "../../lib/api";
import { buttonClass, inputClass } from "./styles";

type Props = {
  phone: string;
  mode: "login" | "signup";
  onBack: () => void;
  onVerified?: () => void;
};

export default function OtpStep({ phone, mode, onBack, onVerified }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const code = String(new FormData(event.currentTarget).get("code"));
    try {
      const res = await post<{ access_token: string }>("/auth/verify-otp", {
        phone,
        code,
      });
      if (mode === "signup") {
        onVerified?.();
        return;
      }
      localStorage.setItem("token", res.access_token);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted">
        Enter the 6 digit code sent to {phone}.
      </p>
      <input
        name="code"
        required
        inputMode="numeric"
        maxLength={6}
        minLength={6}
        placeholder="123456"
        className={inputClass}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Checking..." : "Verify"}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-muted hover:text-snow"
      >
        Use a different number
      </button>
    </form>
  );
}
