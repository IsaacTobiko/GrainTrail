export type DealStatus =
  | "negotiating"
  | "agreed"
  | "in_transit"
  | "delivered"
  | "paid"
  | "cancelled";

export type Deal = {
  id: string;
  broker_id: string;
  maize_type: string;
  quantity_bags: number;
  price_per_bag: string;
  status: DealStatus;
  created_at: string;
  updated_at: string;
  seller: Party | null;
  buyer: Party | null;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_verified: boolean;
};

export type Party = {
  id: string;
  first_name: string;
  last_name: string;
};

export type LoadStatus =
  | "ordered"
  | "loading"
  | "weighed"
  | "cleared"
  | "in_transit"
  | "delivered"
  | "closed"
  | "stopped";

export type Load = {
  id: string;
  deal_id: string;
  plate_number: string;
  bags: number;
  status: LoadStatus;
  created_at: string;
  transporter: Party | null;
};
