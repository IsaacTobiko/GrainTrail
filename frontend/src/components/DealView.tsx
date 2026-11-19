"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, patch } from "../lib/api";
import type { Deal, DealStatus, User } from "../lib/types";

const STAGES: DealStatus[] = [
  "negotiating",
  "agreed",
  "in_transit",
  "delivered",
  "paid",
];

const NEXT: Record<DealStatus, DealStatus[]> = {
  negotiating: ["agreed", "cancelled"],
  agreed: ["in_transit", "cancelled"],
  in_transit: ["delivered"],
  delivered: ["paid"],
  paid: [],
  cancelled: [],
};

const LABEL: Record<DealStatus, string> = {
  negotiating: "Negotiating",
  agreed: "Mark as agreed",
  in_transit: "Start transit",
  delivered: "Mark as delivered",
  paid: "Mark as paid",
  cancelled: "Cancel deal",
};

const kes = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export default function DealView({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }
    Promise.all([
      get<User>("/auth/me", token),
      get<Deal>(`/deals/${id}`, token),
    ])
      .then(([u, d]) => {
        setUser(u);
        setDeal(d);
      })
      .catch((e) => {
        if (e instanceof Error && e.message === "Deal not found") {
          setError("Deal not found");
          return;
        }
        localStorage.removeItem("token");
        router.replace("/auth");
      });
  }, [id, router]);

  async function move(status: DealStatus) {
    const token = localStorage.getItem("token") ?? "";
    setBusy(true);
    setError("");
    try {
      setDeal(await patch<Deal>(`/deals/${id}/status`, { status }, token));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (error && !deal) {
    return (
      <main className="mx-auto w-full max-w-2xl space-y-4 p-4 sm:p-6 md:p-8">
        <p className="text-danger">{error}</p>
        <Link href="/dashboard" className="text-sm text-muted hover:text-snow">
          ← Back to dashboard
        </Link>
      </main>
    );
  }

  if (!deal || !user) return <p className="p-8 text-muted">Loading...</p>;

  const isBroker = user.id === deal.broker_id;
  const currentIndex = STAGES.indexOf(deal.status);
  const total = deal.quantity_bags * Number(deal.price_per_bag);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-4 sm:p-6 md:p-8 lg:max-w-3xl">
      <Link href="/dashboard" className="text-sm text-muted hover:text-snow">
        ← Back to dashboard
      </Link>

      <header>
        <h1 className="font-display text-2xl font-semibold capitalize sm:text-3xl">
          {deal.maize_type} maize
        </h1>
        <p className="mt-1 text-sm text-muted">
          {deal.quantity_bags} bags · {kes.format(Number(deal.price_per_bag))}{" "}
          per bag · {kes.format(total)} total
        </p>
      </header>

      {deal.status === "cancelled" ? (
        <p className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          This deal was cancelled.
        </p>
      ) : (
        <ol className="space-y-3 rounded-xl border border-line bg-card p-4 sm:p-5">
          {STAGES.map((stage, i) => (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < currentIndex
                    ? "bg-leaf text-ink"
                    : i === currentIndex
                      ? "bg-gradient-to-r from-leaf to-lime text-ink"
                      : "border border-line text-muted"
                }`}
              >
                {i < currentIndex ? "✓" : i + 1}
              </span>
              <span
                className={`text-sm capitalize ${i <= currentIndex ? "text-snow" : "text-muted"}`}
              >
                {stage.replace("_", " ")}
              </span>
            </li>
          ))}
        </ol>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {isBroker && NEXT[deal.status].length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {NEXT[deal.status].map((next) => (
            <button
              key={next}
              disabled={busy}
              onClick={() => move(next)}
              className={
                next === "cancelled"
                  ? "w-full rounded-lg border border-danger/40 px-4 py-2 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50 sm:w-auto"
                  : "w-full rounded-lg bg-gradient-to-r from-leaf to-lime px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
              }
            >
              {LABEL[next]}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
