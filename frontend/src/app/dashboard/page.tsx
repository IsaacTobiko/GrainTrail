"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "../../lib/api";
import type { Deal, User } from "../../lib/types";
import DealCard from "../../components/DealCard";
import NewDealForm from "../../components/NewDealForm";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }
    Promise.all([get<User>("/auth/me", token), get<Deal[]>("/deals", token)])
      .then(([u, d]) => {
        setUser(u);
        setDeals(d);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/auth");
      });
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.replace("/auth");
  }

  if (!user) return <p className="p-8 text-muted">Loading...</p>;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6 md:p-8 lg:max-w-5xl 2xl:max-w-6xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            Welcome, {user.first_name}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted">
            {user.role} · {user.phone}
          </p>
        </div>
        <button
          onClick={logout}
          className="self-start rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-snow sm:self-auto"
        >
          Log out
        </button>
      </header>

      {user.role === "broker" && (
        <div className="max-w-xl">
          <NewDealForm onCreated={(d) => setDeals((prev) => [d, ...prev])} />
        </div>
      )}

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold sm:text-xl">
          Your deals
        </h2>
        {deals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            No deals yet.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
