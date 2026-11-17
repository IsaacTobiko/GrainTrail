"use client";

import { useState } from "react";
import { post } from "../lib/api";
import type { Deal } from "../lib/types";
import { buttonClass, inputClass } from "./auth/styles";

export default function NewDealForm({
  onCreated,
}: {
  onCreated: (deal: Deal) => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setLoading(true);
    const data = new FormData(form);
    try {
      const deal = await post<Deal>(
        "/deals",
        {
          maize_type: data.get("maize_type"),
          quantity_bags: Number(data.get("quantity_bags")),
          price_per_bag: Number(data.get("price_per_bag")),
        },
        localStorage.getItem("token") ?? "",
      );
      form.reset();
      onCreated(deal);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-line bg-card p-5"
    >
      <p className="font-display text-lg font-semibold">New deal</p>
      <select
        name="maize_type"
        required
        className={inputClass}
        defaultValue="white"
      >
        <option value="white">White maize</option>
        <option value="yellow">Yellow maize</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          name="quantity_bags"
          type="number"
          min={1}
          required
          placeholder="Bags"
          className={inputClass}
        />
        <input
          name="price_per_bag"
          type="number"
          min={1}
          step="0.01"
          required
          placeholder="KES per bag"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Saving..." : "Create deal"}
      </button>
    </form>
  );
}
