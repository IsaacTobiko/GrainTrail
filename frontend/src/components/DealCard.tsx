import Link from "next/link";
import type { Deal, DealStatus } from "../lib/types";

const STATUS_STYLE: Record<DealStatus, string> = {
  negotiating: "bg-gold/10 text-gold",
  agreed: "bg-emerald/10 text-emerald",
  in_transit: "bg-lime/10 text-lime",
  delivered: "bg-leaf/10 text-leaf",
  paid: "bg-leaf/20 text-leaf",
  cancelled: "bg-danger/10 text-danger",
};

const kes = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export default function DealCard({ deal }: { deal: Deal }) {
  const total = deal.quantity_bags * Number(deal.price_per_bag);
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block rounded-xl border border-line bg-card p-5 transition hover:border-emerald"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold capitalize">
            {deal.maize_type} maize
          </p>
          <p className="mt-1 text-sm text-muted">
            {deal.quantity_bags} bags · {kes.format(Number(deal.price_per_bag))}{" "}
            per bag
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLE[deal.status]}`}
        >
          {deal.status.replace("_", " ")}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">
          {new Date(deal.created_at).toLocaleDateString("en-KE")}
        </span>
        <span className="font-semibold text-snow">{kes.format(total)}</span>
      </div>
    </Link>
  );
}
