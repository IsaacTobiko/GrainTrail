import type { Load, LoadStatus } from "./types";

export const LOAD_NEXT: Record<LoadStatus, LoadStatus[]> = {
  ordered: ["loading", "stopped"],
  loading: ["weighed", "stopped"],
  weighed: ["cleared", "stopped"],
  cleared: ["in_transit", "stopped"],
  in_transit: ["delivered", "stopped"],
  delivered: ["closed"],
  closed: [],
  stopped: ["loading", "weighed", "cleared", "in_transit"],
};

const TRANSPORTER_MOVES: LoadStatus[] = ["in_transit", "delivered", "stopped"];

export const LOAD_LABEL: Record<LoadStatus, string> = {
  ordered: "Ordered",
  loading: "Loading",
  weighed: "Weighed",
  cleared: "Cleared",
  in_transit: "In transit",
  delivered: "Delivered",
  closed: "Closed",
  stopped: "Stopped",
};

export const LOAD_STYLE: Record<LoadStatus, string> = {
  ordered: "bg-gold/10 text-gold",
  loading: "bg-gold/10 text-gold",
  weighed: "bg-emerald/10 text-emerald",
  cleared: "bg-emerald/10 text-emerald",
  in_transit: "bg-lime/10 text-lime",
  delivered: "bg-leaf/10 text-leaf",
  closed: "bg-leaf/20 text-leaf",
  stopped: "bg-danger/10 text-danger",
};

export function movesFor(
  load: Load,
  who: "broker" | "transporter",
): LoadStatus[] {
  if (who === "broker") return LOAD_NEXT[load.status];
  if (load.status === "stopped") return [];
  return LOAD_NEXT[load.status].filter((s) => TRANSPORTER_MOVES.includes(s));
}
