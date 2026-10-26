"use client";

import PhoneField from "./PhoneField";
import { buttonClass } from "./styles";

export default function LoginForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log("login", Object.fromEntries(data));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm text-muted">Phone number</label>

      <PhoneField />

      <button type="submit" className={buttonClass}>
        Send code
      </button>
    </form>
  );
}
