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
    <main className="mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Welcome, {user.first_name}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted">
            {user.role} · {user.phone}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-snow"
        >
          Log out
        </button>
      </header>

      {user.role === "broker" && (
        <NewDealForm onCreated={(d) => setDeals((prev) => [d, ...prev])} />
      )}

      <section className="space-y-3">
        <h2 className="font-display text-xl font-semibold">Your deals</h2>
        {deals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            No deals yet.
          </p>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </section>
    </main>
  );
}
