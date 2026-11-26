"use client";

import { useState } from "react";
import { patch } from "../lib/api";
import { LOAD_LABEL, LOAD_STYLE, movesFor } from "../lib/loads";
import type { Load, LoadStatus } from "../lib/types";

type Props = {
  load: Load;
  who: "broker" | "transporter" | null;
  onChange: (load: Load) => void;
};

export default function LoadRow({ load, who, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const moves = who ? movesFor(load, who) : [];

  async function move(status: LoadStatus) {
    setBusy(true);
    setError("");
    try {
      const updated = await patch<Load>(
        `/loads/${load.id}/status`,
        { status },
        localStorage.getItem("token") ?? "",
      );
      onChange(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
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

      {error && <p className="text-xs text-danger">{error}</p>}

      {moves.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {moves.map((next) => (
            <button
              key={next}
              disabled={busy}
              onClick={() => move(next)}
              className={
                next === "stopped"
                  ? "rounded-lg border border-danger/40 px-3 py-1.5 text-xs text-danger transition hover:bg-danger/10 disabled:opacity-50"
                  : "rounded-lg bg-gradient-to-r from-leaf to-lime px-3 py-1.5 text-xs font-semibold text-ink transition hover:brightness-110 disabled:opacity-50"
              }
            >
              {next === "stopped" ? "Report stopped" : LOAD_LABEL[next]}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}
