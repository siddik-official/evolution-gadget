import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, OrderStatus, PaymentMethod, PaymentStatus, IOrderItem, IAddress } from '@/types';

// Define the Address schema
const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true }
});

// Define the OrderItem schema
const OrderItemSchema = new Schema<IOrderItem>({
  gadgetId: {
    type: String,
    ref: 'Gadget',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  }
});

// Define the Order interface extending Document
export interface IOrderDocument extends Omit<IOrder, '_id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVG-${timestamp.slice(-6)}${random}`;
}

// Define the Order schema
const OrderSchema = new Schema<IOrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderNumber: {
      type: String,
      unique: true,
      default: generateOrderNumber
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    tax: {
      type: Number,
      required: true,
      min: [0, 'Tax cannot be negative'],
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative'],
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    shippingAddress: {
      type: AddressSchema,
      required: true
    },
    billingAddress: {
      type: AddressSchema
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate totals
OrderSchema.pre<IOrderDocument>('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate total (subtotal + tax + shipping)
  this.total = this.subtotal + this.tax + this.shipping;
  
  next();
});

// Virtual to populate user details
OrderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate gadget details in items
OrderSchema.virtual('items.gadget', {
  ref: 'Gadget',
  localField: 'items.gadgetId',
  foreignField: '_id'
});

// Static method to find orders by user
OrderSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
OrderSchema.statics.findByStatus = function(status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Instance method to update order status
OrderSchema.methods.updateStatus = function(newStatus: OrderStatus) {
  this.status = newStatus;
  return this.save();
};

// Create and export the model
export const Order = mongoose.model<IOrderDocument>('Order', OrderSchema);
