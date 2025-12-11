import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '@/types';

// Define the Review interface extending Document
export interface IReviewDocument extends Omit<IReview, '_id' | 'userId' | 'gadgetId'>, Document {
  userId: mongoose.Types.ObjectId;
  gadgetId: mongoose.Types.ObjectId;
}

// Define the Review schema
const ReviewSchema = new Schema<IReviewDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gadgetId: {
      type: Schema.Types.ObjectId,
      ref: 'Gadget',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5']
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters long'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    pros: [{
      type: String,
      trim: true,
      maxlength: [200, 'Pro item cannot exceed 200 characters']
    }],
    cons: [{
      type: String,
      trim: true,
      maxlength: [200, 'Con item cannot exceed 200 characters']
    }],
    isVerified: {
      type: Boolean,
      default: false
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: [0, 'Helpful count cannot be negative']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to ensure one review per user per gadget
ReviewSchema.index({ userId: 1, gadgetId: 1 }, { unique: true });

// Indexes for better query performance
ReviewSchema.index({ gadgetId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ createdAt: -1 });
ReviewSchema.index({ isVerified: 1 });

// Virtual to populate user details
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: '_id name avatar'
});

// Static method to calculate average rating for a gadget
ReviewSchema.statics.calculateAverageRating = async function(gadgetId: string) {
  const stats = await this.aggregate([
    {
      $match: { gadgetId: new mongoose.Types.ObjectId(gadgetId) }
    },
    {
      $group: {
        _id: '$gadgetId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    const { averageRating, totalReviews } = stats[0];
    // Update the gadget with new rating statistics
    await mongoose.model('Gadget').findByIdAndUpdate(gadgetId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews
    });
  } else {
    // No reviews found, reset to defaults
    await mongoose.model('Gadget').findByIdAndUpdate(gadgetId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
};

// Post-save middleware to update gadget rating
ReviewSchema.post<IReviewDocument>('save', async function() {
  await (this.constructor as any).calculateAverageRating(this.gadgetId);
});

// Post-remove middleware to update gadget rating
ReviewSchema.post<IReviewDocument>('findOneAndDelete', async function() {
  if (this) {
    await (this.constructor as any).calculateAverageRating(this.gadgetId);
  }
});

// Static method to find reviews by gadget
ReviewSchema.statics.findByGadget = function(gadgetId: string) {
  return this.find({ gadgetId }).populate('user', '_id name avatar').sort({ createdAt: -1 });
};

// Static method to find reviews by user
ReviewSchema.statics.findByUser = function(userId: string) {
  return this.find({ userId }).populate('gadgetId', '_id name images').sort({ createdAt: -1 });
};

// Instance method to mark as helpful
ReviewSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

// Create and export the model
export const Review = mongoose.model<IReviewDocument>('Review', ReviewSchema);
