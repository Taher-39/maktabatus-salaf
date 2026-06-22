import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  book: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  helpful: number;
  isApproved: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    book:       { type: Schema.Types.ObjectId, ref: "Book", required: true },
    user:       { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating:     { type: Number, required: true, min: 1, max: 5 },
    comment:    { type: String, required: true },
    helpful:    { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from same user for same book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
