import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author?: mongoose.Types.ObjectId;
  category?: string;
  views: number;
  likes: number;
  isPublished: boolean;
}


const blogSchema = new Schema<IBlog>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    image:       { type: String, default: "" },
    author:      { type: Schema.Types.ObjectId, ref: "User", default: null },
    views:       { type: Number, default: 0 },
    likes:       { type: Number, default: 0 },
    category:    { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },


  { timestamps: true }
);


// // Auto-generate slug from title
// blogSchema.pre("validate", function (next: any) {
//   if (this.isModified("title") && !this.slug) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .trim();
//   }
//   next();
// });


export const Blog = mongoose.model<IBlog>("Blog", blogSchema);
