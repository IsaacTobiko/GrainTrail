"use client";

import { useState } from "react";
import PhoneField from "./auth/PhoneField";
import { post } from "../lib/api";
import { normalizePhone } from "../lib/phone";
import type { Deal, Party } from "../lib/types";
import { buttonClass, inputClass } from "./auth/styles";

type Props = {
  deal: Deal;
  isBroker: boolean;
  onUpdated: (deal: Deal) => void;
};

function Row({ label, person }: { label: string; person: Party | null }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted">{label}</span>
      <span className={person ? "text-snow" : "text-muted"}>
        {person ? `${person.first_name} ${person.last_name}` : "Not added"}
      </span>
    </div>
  );
}

export default function PartiesPanel({ deal, isBroker, onUpdated }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const phone = normalizePhone(
      String(data.get("prefix")),
      String(data.get("phone")),
    );
    try {
      const updated = await post<Deal>(
        `/deals/${deal.id}/parties`,
        { party: data.get("party"), phone },
        localStorage.getItem("token") ?? "",
      );
      onUpdated(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-line bg-card p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">
        People on this deal
      </h2>
      <div className="space-y-2">
        <Row label="Seller" person={deal.seller} />
        <Row label="Buyer" person={deal.buyer} />
      </div>
      {isBroker && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-t border-line pt-4"
        >
          <select
            name="party"
            required
            defaultValue="seller"
            className={inputClass}
          >
            <option value="seller">Add a seller</option>
            <option value="buyer">Add a buyer</option>
          </select>
          <PhoneField />
          {error && <p className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className={buttonClass}>
            {loading ? "Adding..." : "Add to deal"}
          </button>
        </form>
      )}
    </section>
  );
}
