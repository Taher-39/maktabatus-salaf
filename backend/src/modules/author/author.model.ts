import mongoose, { Document, Schema } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const authorSchema = new Schema<IAuthor>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    image:       { type: String, default: "" },
    description: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>("Author", authorSchema);
