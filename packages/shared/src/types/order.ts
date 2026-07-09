export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled';

export interface OrderLineItem {
  productId: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderLineItem[];
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
}
