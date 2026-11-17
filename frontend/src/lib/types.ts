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
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_verified: boolean;
};
