import mongoose, { Schema, Document } from 'mongoose';
import { IGadget, GadgetCategory, ISpecification } from '@/types';

// Define the Specification schema
const SpecificationSchema = new Schema<ISpecification>({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

// Define the Gadget interface extending Document
export interface IGadgetDocument extends Omit<IGadget, '_id'>, Omit<Document, 'model'> {
  model: string;
}

// Define the Gadget schema
const GadgetSchema = new Schema<IGadgetDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: Object.values(GadgetCategory)
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: [50, 'Brand name cannot exceed 50 characters']
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      maxlength: [50, 'Model name cannot exceed 50 characters']
    },
    images: [{
      type: String,
      required: true
    }],
    specifications: [SpecificationSchema],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative']
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
GadgetSchema.index({ name: 'text', description: 'text' });
GadgetSchema.index({ category: 1 });
GadgetSchema.index({ brand: 1 });
GadgetSchema.index({ price: 1 });
GadgetSchema.index({ averageRating: -1 });
GadgetSchema.index({ createdAt: -1 });
GadgetSchema.index({ isActive: 1 });

// Virtual for discounted price
GadgetSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Pre-save middleware to validate original price
GadgetSchema.pre<IGadgetDocument>('save', function(next) {
  if (this.originalPrice && this.originalPrice < this.price) {
    return next(new Error('Original price cannot be less than current price'));
  }
  next();
});

// Static method to find products by category
GadgetSchema.statics.findByCategory = function(category: GadgetCategory) {
  return this.find({ category, isActive: true });
};

// Static method to search products
GadgetSchema.statics.searchProducts = function(query: string, filters: any = {}) {
  const searchQuery = {
    ...filters,
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  return this.find(searchQuery);
};

// Create and export the model
export const Gadget = mongoose.model<IGadgetDocument>('Gadget', GadgetSchema);
