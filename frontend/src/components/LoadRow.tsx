"use client";

import { useState } from "react";
import { patch } from "../lib/api";
import { LOAD_LABEL, LOAD_STYLE, movesFor } from "../lib/loads";
import type { Load, LoadStatus } from "../lib/types";
import { buttonClass, inputClass } from "./auth/styles";

const REASONS = [
  "Moisture too high",
  "Missing documents",
  "Overloaded",
  "Other",
];

const kes = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

type Props = {
  load: Load;
  who: "broker" | "transporter" | null;
  onChange: (load: Load) => void;
};

export default function LoadRow({ load, who, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [stopping, setStopping] = useState(false);
  const moves = who ? movesFor(load, who) : [];

  async function move(
    status: LoadStatus,
    extra: Record<string, unknown> = {},
  ): Promise<boolean> {
    setBusy(true);
    setError("");
    try {
      const updated = await patch<Load>(
        `/loads/${load.id}/status`,
        { status, ...extra },
        localStorage.getItem("token") ?? "",
      );
      onChange(updated);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function submitStop(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const cost = String(data.get("cost") ?? "").trim();
    const ok = await move("stopped", {
      reason: data.get("reason"),
      ...(cost ? { cost: Number(cost) } : {}),
    });
    if (ok) setStopping(false);
  }

  return (
    <li className="space-y-3 rounded-lg border border-line p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold tracking-wide">{load.plate_number}</p>
          <p className="text-xs text-muted">
            {load.bags} bags
            {load.transporter
              ? ` · ${load.transporter.first_name} ${load.transporter.last_name}`
              : " · no driver yet"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${LOAD_STYLE[load.status]}`}
        >
          {LOAD_LABEL[load.status]}
        </span>
      </div>

      {load.status === "stopped" && load.stop_reason && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-2 text-xs text-danger">
          Stopped: {load.stop_reason}
          {load.stop_cost
            ? ` · est. cost ${kes.format(Number(load.stop_cost))}`
            : ""}
        </p>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}

      {moves.length > 0 && !stopping && (
        <div className="flex flex-wrap gap-2">
          {moves.map((next) =>
            next === "stopped" ? (
              <button
                key={next}
                disabled={busy}
                onClick={() => setStopping(true)}
                className="rounded-lg border border-danger/40 px-3 py-1.5 text-xs text-danger transition hover:bg-danger/10 disabled:opacity-50"
              >
                Report stopped
              </button>
            ) : (
              <button
                key={next}
                disabled={busy}
                onClick={() => move(next)}
                className="rounded-lg bg-gradient-to-r from-leaf to-lime px-3 py-1.5 text-xs font-semibold text-ink transition hover:brightness-110 disabled:opacity-50"
              >
                {LOAD_LABEL[next]}
              </button>
            ),
          )}
        </div>
      )}

      {stopping && (
        <form
          onSubmit={submitStop}
          className="space-y-2 rounded-lg border border-line bg-ink p-3"
        >
          <select
            name="reason"
            required
            defaultValue={REASONS[0]}
            className={inputClass}
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            name="cost"
            type="number"
            min={0}
            step="0.01"
            placeholder="Estimated cost in KES, optional"
            className={inputClass}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className={`${buttonClass} !py-2`}
            >
              {busy ? "Saving..." : "Confirm stop"}
            </button>
            <button
              type="button"
              onClick={() => setStopping(false)}
              className="rounded-lg border border-line px-4 text-sm text-muted hover:text-snow"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
