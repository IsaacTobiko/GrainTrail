"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get } from "../../lib/api";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_verified: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth");
      return;
    }
    get<User>("/auth/me", token)
      .then(setUser)
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
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="font-display text-3xl font-semibold">
        Welcome, {user.first_name}
      </h1>
      <p className="mt-2 text-muted">
        {user.role} · {user.phone}
      </p>
      <button
        onClick={logout}
        className="mt-6 rounded-lg border border-line px-4 py-2 text-sm text-muted hover:text-snow"
      >
        Log out
      </button>
    </main>
  );
}
