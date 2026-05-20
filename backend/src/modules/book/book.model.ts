import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  slug: string;
  description: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  publisher: mongoose.Types.ObjectId;
  price: number;
  stock: number;
  coverImage: string;
  previewPages: string[];
  soldCount: number;
  viewCount: number;
  isActive: boolean;
}

const bookSchema = new Schema<IBook>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    author:      { type: Schema.Types.ObjectId, ref: "Author", required: true },
    category:    { type: Schema.Types.ObjectId, ref: "Category", required: true },
    publisher:   { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
    price:       { type: Number, required: true, min: 0 },
    stock:       { type: Number, default: 0, min: 0 },
    coverImage:  { type: String, default: "" },
    previewPages:{ type: [String], validate: [(v: string[]) => v.length <= 7, "সর্বোচ্চ ৭ পেজ"] },
    soldCount:   { type: Number, default: 0 },
    viewCount:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title
bookSchema.pre("validate", function (next: any) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  next();
});

export const Book = mongoose.model<IBook>("Book", bookSchema);
