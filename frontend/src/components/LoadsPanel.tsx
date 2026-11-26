"use client";

import { useEffect, useState } from "react";
import { get, post } from "../lib/api";
import type { Load } from "../lib/types";
import LoadRow from "./LoadRow";
import { buttonClass, inputClass } from "./auth/styles";

type Props = {
  dealId: string;
  dealBags: number;
  canAdd: boolean;
  isBroker: boolean;
};

export default function LoadsPanel({
  dealId,
  dealBags,
  canAdd,
  isBroker,
}: Props) {
  const [loads, setLoads] = useState<Load[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    get<Load[]>(`/deals/${dealId}/loads`, token)
      .then(setLoads)
      .catch(() => setError("Could not load the trucks"));
  }, [dealId]);

  const used = loads.reduce((sum, l) => sum + l.bags, 0);
  const left = dealBags - used;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");
    setLoading(true);
    const data = new FormData(form);
    const driver = String(data.get("transporter_phone") ?? "").trim();
    try {
      const load = await post<Load>(
        `/deals/${dealId}/loads`,
        {
          plate_number: data.get("plate_number"),
          bags: Number(data.get("bags")),
          ...(driver ? { transporter_phone: driver } : {}),
        },
        localStorage.getItem("token") ?? "",
      );
      setLoads((prev) => [...prev, load]);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-line bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">Trucks</h2>
        <span className="text-sm text-muted">
          {used}/{dealBags} bags loaded
        </span>
      </div>

      {loads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-4 text-center text-sm text-muted">
          No trucks yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {loads.map((load) => (
            <LoadRow
              key={load.id}
              load={load}
              who={isBroker ? "broker" : null}
              onChange={(updated) =>
                setLoads((prev) =>
                  prev.map((l) => (l.id === updated.id ? updated : l)),
                )
              }
            />
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {canAdd && left > 0 && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-2 border-t border-line pt-4 sm:grid-cols-2"
        >
          <input
            name="plate_number"
            required
            minLength={3}
            maxLength={20}
            placeholder="Number plate, e.g. KDA 123A"
            className={inputClass}
          />
          <input
            name="bags"
            type="number"
            min={1}
            max={left}
            required
            placeholder={`Bags (up to ${left})`}
            className={inputClass}
          />
          <input
            name="transporter_phone"
            type="tel"
            pattern="^\+(254[17]|255[67])[0-9]{8}$"
            title="Use the full number, for example +254744444444"
            placeholder="Driver phone, optional (+254...)"
            className={`${inputClass} sm:col-span-2`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`${buttonClass} sm:col-span-2`}
          >
            {loading ? "Adding..." : "Add truck"}
          </button>
        </form>
      )}
    </section>
  );
}
