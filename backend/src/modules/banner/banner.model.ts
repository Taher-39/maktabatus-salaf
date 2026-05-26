import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  description: string;
  image: string;
  link: string;
  position: "hero" | "featured" | "promotion";
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image:       { type: String, required: true },
    link:        { type: String, default: "" },
    position:    { type: String, enum: ["hero", "featured", "promotion"], default: "promotion" },
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-deactivate expired banners
bannerSchema.query.active = function () {
  return this.find({ isActive: true, endDate: { $gte: new Date() } });
};

export const Banner = mongoose.model<IBanner>("Banner", bannerSchema);
