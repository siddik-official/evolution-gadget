import React from 'react';

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

export interface IAuthAPIResponse {
  success: boolean;
  message: string;
  data: IAuthResponse;
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

// Frontend-specific State Types
export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ICartState {
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
}

export interface IGadgetState {
  gadgets: IGadget[];
  currentGadget: IGadget | null;
  loading: boolean;
  error: string | null;
  pagination: IPagination | null;
}

export interface IGadgetsState {
  gadgets: IGadget[];
  currentGadget: IGadget | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  filters: IGadgetFilters;
}

export interface IGadgetFilters {
  category: string;
  priceRange: { min: number; max: number };
  rating: number;
  searchTerm: string;
}

export interface IOrderState {
  orders: IOrder[];
  currentOrder: IOrder | null;
  loading: boolean;
  error: string | null;
  pagination: IPagination | null;
}

export interface IReviewState {
  reviews: IReview[];
  loading: boolean;
  error: string | null;
  pagination: IPagination | null;
}

// Form Types
export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IGadgetForm {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: GadgetCategory;
  brand: string;
  model: string;
  stock: number;
  specifications: ISpecification[];
  tags: string[];
}

export interface IReviewForm {
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
}

export interface IAddressForm {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Component Props Types
export interface IRouteProps {
  children: React.ReactNode;
}

export interface IProtectedRouteProps extends IRouteProps {
  requiredRole?: UserRole;
}

// Hook Types
export interface IUseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// UI Types
export interface ITableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface IButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Navigation Types
export interface INavItem {
  path: string;
  label: string;
  icon?: React.ComponentType;
  role?: UserRole[];
  children?: INavItem[];
}
