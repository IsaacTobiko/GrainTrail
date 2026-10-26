"use client";

import { useState } from "react";

const roles = ["Broker", "Buyer", "Seller", "Transporter"];

export default function RoleSelect() {
  const [role, setRole] = useState("Broker");

  return (
    <div>
      <p className="mb-2 text-sm text-muted">I am a</p>

      <input type="hidden" name="role" value={role} />

      <div className="flex flex-wrap gap-2">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              role === item
                ? "border-transparent bg-gradient-to-r from-leaf to-lime font-semibold text-ink"
                : "border-line text-muted hover:border-emerald"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
