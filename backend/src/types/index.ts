// User Types
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Auth Types
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Gadget/Product Types
export enum GadgetCategory {
  SMARTPHONE = 'smartphone',
  LAPTOP = 'laptop',
  TABLET = 'tablet',
  SMARTWATCH = 'smartwatch',
  HEADPHONES = 'headphones',
  CAMERA = 'camera',
  GAMING = 'gaming',
  ACCESSORIES = 'accessories'
}

export interface IGadget {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: GadgetCategory;
  brand: string;
  model: string;
  images: string[];
  specifications: ISpecification[];
  stock: number;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISpecification {
  key: string;
  value: string;
}

// Review Types
export interface IReview {
  _id: string;
  userId: string;
  gadgetId: string;
  user?: Pick<IUser, '_id' | 'name' | 'avatar'>;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface ICartItem {
  gadgetId: string;
  gadget?: IGadget;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface IOrderItem {
  gadgetId: string;
  gadget?: Pick<IGadget, '_id' | 'name' | 'images' | 'brand'>;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  _id: string;
  userId: string;
  user?: Pick<IUser, '_id' | 'name' | 'email'>;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: IAddress;
  billingAddress?: IAddress;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: IPagination;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Search and Filter Types
export interface IGadgetFilters {
  category?: GadgetCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  search?: string;
}

export interface ISortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface ISearchParams {
  page?: number;
  limit?: number;
  filters?: IGadgetFilters;
  sort?: ISortOptions;
}

// Analytics Types
export interface ISalesReport {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topCategories: { category: string; count: number; revenue: number }[];
  topGadgets: { gadget: Pick<IGadget, '_id' | 'name'>; count: number; revenue: number }[];
}

// Error Types
export interface IErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}

// Notification Types
export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}
