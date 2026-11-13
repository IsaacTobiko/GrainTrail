"use client";

import { useState } from "react";
import PhoneField from "./PhoneField";
import OtpStep from "./OtpStep";
import { ApiError, post } from "../../lib/api";
import { normalizePhone } from "../../lib/phone";
import { buttonClass } from "./styles";

export default function LoginForm({
  onNotRegistered,
}: {
  onNotRegistered: () => void;
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
      await post("/auth/login", { phone: full });
      setPhone(full);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        onNotRegistered();
        return;
      }
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (phone) return <OtpStep phone={phone} onBack={() => setPhone("")} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-muted">Phone number</label>
      <PhoneField />
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Sending..." : "Send code"}
      </button>
    </form>
  );
}
