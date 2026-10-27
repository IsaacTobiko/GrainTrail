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
    <main className="min-h-screen">
      <div className="grid min-h-screen w-full bg-card md:grid-cols-2">
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
