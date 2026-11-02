"use client";

const roles = [
  { id: "broker", label: "Broker", desc: "Connect buyers and sellers" },
  { id: "buyer", label: "Buyer", desc: "Source grain" },
  { id: "seller", label: "Seller", desc: "Sell your harvest" },
  {
    id: "transporter",
    label: "Transporter",
    desc: "Move loads across the border",
  },
] as const;

export type Role = (typeof roles)[number]["id"];

export default function RolePicker({
  onSelect,
}: {
  onSelect: (role: Role) => void;
}) {
  return (
    <div>
      <p className="text-sm text-muted">I am a</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {roles.map((role, i) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            style={{ "--delay": `${i * 100}ms` } as React.CSSProperties}
            className="anim-fade-up rounded-xl border border-line bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-lime"
          >
            <span className="block font-display text-lg font-semibold text-snow">
              {role.label}
            </span>
            <span className="mt-1 block text-xs text-muted">{role.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
