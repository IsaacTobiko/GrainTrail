"use client";

import PhoneField from "./PhoneField";
import { type Role } from "./RolePicker";
import { buttonClass, inputClass } from "./styles";

export default function SignupForm({ role }: { role: Role }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log("signup", Object.fromEntries(data));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="role" value={role} />

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

      <button type="submit" className={buttonClass}>
        Create account
      </button>
    </form>
  );
}
