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
  previewPdf: string;
  soldCount: number;
  viewCount: number;
  isActive: boolean;
  bookPage: number;
  edition: number;
  weight: number;
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
    previewPdf:  { type: String, default: "" },
    soldCount:   { type: Number, default: 0 },
    viewCount:   { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
    bookPage:    { type: Number, default: 0 },
    edition:     { type: Number, default: 1 },
    weight:      { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>("Book", bookSchema);
