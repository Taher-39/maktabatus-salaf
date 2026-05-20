import mongoose, { Document, Schema } from "mongoose";

export interface IPublisher extends Document {
  name: string;
  slug: string;
  description?: string;
}

const publisherSchema = new Schema<IPublisher>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Publisher = mongoose.model<IPublisher>("Publisher", publisherSchema);
