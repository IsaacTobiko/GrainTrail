"use client";

import { useState } from "react";
import PhoneField from "./PhoneField";
import OtpStep from "./OtpStep";
import { type Role } from "./RolePicker";
import { post } from "../../lib/api";
import { normalizePhone } from "../../lib/phone";
import { buttonClass, inputClass } from "./styles";

export default function SignupForm({
  role,
  onVerified,
}: {
  role: Role;
  onVerified: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const full = normalizePhone(
      String(data.get("prefix")),
      String(data.get("phone")),
    );
    try {
      await post("/auth/signup", {
        first_name: data.get("first_name"),
        last_name: data.get("last_name"),
        phone: full,
        role,
      });
      setPhone(full);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (phone)
    return (
      <OtpStep
        phone={phone}
        mode="signup"
        onVerified={onVerified}
        onBack={() => setPhone("")}
      />
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <input
          name="first_name"
          required
          placeholder="First name"
          className={inputClass}
        />
        <input
          name="last_name"
          required
          placeholder="Last name"
          className={inputClass}
        />
      </div>
      <PhoneField />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 accent-[#22c55e]"
        />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
