import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  books: mongoose.Types.ObjectId[];
  isPublic: boolean;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user:  { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    books: { type: [Schema.Types.ObjectId], ref: "Book", default: [] },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
