import { Suspense } from "react";
import DealView from "../../../components/DealView";

async function DealLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DealView id={id} />;
}

export default function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Loading...</p>}>
      <DealLoader params={params} />
    </Suspense>
  );
}
