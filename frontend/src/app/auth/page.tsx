import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthHero from "@/components/auth/AuthHero";

async function AuthCardLoader({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = mode === "signup" ? "signup" : "login";
  return <AuthCard initialMode={initialMode} />;
}

export default function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  return (
    <main className="min-h-screen p-3 md:p-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-3xl border border-line bg-card md:min-h-[calc(100vh-2rem)] md:grid-cols-2">
        <Suspense fallback={<div className="min-h-96" />}>
          <AuthHero />
          <Suspense fallback={<div className="min-h-96" />}>
            <AuthCardLoader searchParams={searchParams} />
          </Suspense>
        </Suspense>
      </div>
    </main>
  );
}
