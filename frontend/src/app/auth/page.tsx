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
    <main className="min-h-dvh bg-card">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1920px] md:grid-cols-2">
        <AuthHero />
        <Suspense fallback={<div className="min-h-96" />}>
          <AuthCardLoader searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
