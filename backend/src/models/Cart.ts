import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICart, ICartItem } from '@/types';

// Define the CartItem schema with proper typing
interface ICartItemDocument extends Omit<ICartItem, 'gadgetId'> {
  gadgetId: Types.ObjectId;
}

const CartItemSchema = new Schema<ICartItemDocument>({
  gadgetId: {
    type: Schema.Types.ObjectId,
    ref: 'Gadget',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10 per item']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

// Define the Cart interface extending Document
export interface ICartDocument extends Omit<ICart, '_id' | 'userId'>, Document {
  userId: Types.ObjectId;
}

// Define the Cart schema
const CartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // One cart per user
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
CartSchema.index({ userId: 1 });

// Virtual to populate gadget details in items
CartSchema.virtual('items.gadget', {
  ref: 'Gadget',
  localField: 'items.gadgetId',
  foreignField: '_id'
});

// Pre-save middleware to calculate total amount
CartSchema.pre<ICartDocument>('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

// Static method to find cart by user
CartSchema.statics.findByUser = function(userId: string) {
  return this.findOne({ userId }).populate('items.gadgetId', '_id name price images stock isActive');
};

// Instance method to add item to cart
CartSchema.methods.addItem = function(gadgetId: string, quantity: number, price: number) {
  const existingItemIndex = this.items.findIndex((item: any) => 
    item.gadgetId.toString() === gadgetId
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price; // Update price in case it changed
  } else {
    // Add new item
    this.items.push({ gadgetId, quantity, price });
  }

  return this.save();
};

// Instance method to update item quantity
CartSchema.methods.updateItemQuantity = function(gadgetId: string, quantity: number) {
  const itemIndex = this.items.findIndex((item: any) => 
    item.gadgetId.toString() === gadgetId
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }

  return this.save();
};

// Instance method to remove item from cart
CartSchema.methods.removeItem = function(gadgetId: string) {
  this.items = this.items.filter((item: any) => 
    item.gadgetId.toString() !== gadgetId
  );
  return this.save();
};

// Instance method to clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Instance method to get total items count
CartSchema.methods.getTotalItemsCount = function() {
  return this.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
};

// Create and export the model
export const Cart = mongoose.model<ICartDocument>('Cart', CartSchema);
