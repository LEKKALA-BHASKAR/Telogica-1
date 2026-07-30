/** Shapes returned by the Express API (server/src/models). */

export type Category = "Telecommunication" | "Railway" | "Defence";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: PageMeta;
  message?: string;
}

export interface PageMeta {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiProduct {
  _id: string;
  legacyId?: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  category: Category;
  sectors: Category[];
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  specs?: { key: string; value: string }[];
  tags?: string[];
  price: number;
  mrp: number;
  stock: number;
  warrantyMonths: number | null;
  requiresQuote: boolean;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  soldCount?: number;
  createdAt?: string;
}

export interface Address {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: "user" | "admin";
  addresses: Address[];
  wishlist: string[];
  createdAt?: string;
}

export interface CartLine {
  product: string;
  slug: string;
  name: string;
  image: string;
  sku: string;
  price: number;
  mrp: number;
  qty: number;
  stock: number;
  lineTotal: number;
  priceChangedFrom?: number;
  outOfStock: boolean;
  qtyAdjusted: boolean;
}

export interface OrderTotals {
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export interface StoreConfig {
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingFlatRate: number;
  paymentProvider: "razorpay" | "mock";
  razorpayKeyId: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "razorpay" | "cod" | "mock";

export interface OrderItem {
  product: string;
  name: string;
  slug: string;
  image: string;
  sku: string;
  price: number;
  qty: number;
}

export interface Order extends OrderTotals {
  _id: string;
  orderNumber: string;
  user: string | { _id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentResult?: { id?: string; status?: string; orderId?: string };
  currency: string;
  isPaid: boolean;
  paidAt?: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string; note?: string }[];
  trackingNumber?: string;
  courier?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  customerNote?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string | { _id: string; name: string; slug: string; images: string[] };
  user: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export type QuoteStatus = "new" | "in_review" | "quoted" | "won" | "lost";

export interface Quote {
  _id: string;
  quoteNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  items: { product?: string; name: string; qty: number }[];
  message: string;
  status: QuoteStatus;
  quotedAmount?: number;
  adminNotes?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  productRef?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DashboardStats {
  revenue: { paidTotal: number; paidOrders: number; averageOrderValue: number };
  orders: { total: number; byStatus: Record<string, number>; awaitingFulfilment: number };
  catalogue: {
    active: number;
    quoteOnly: number;
    lowStock: { _id: string; name: string; slug: string; sku: string; stock: number; price: number }[];
    lowStockThreshold: number;
  };
  customers: number;
  openQuotes: number;
  newMessages: number;
  recentOrders: Order[];
  topProducts: { _id: string; name: string; qty: number; revenue: number }[];
  monthly: { month: string; revenue: number; orders: number }[];
}
