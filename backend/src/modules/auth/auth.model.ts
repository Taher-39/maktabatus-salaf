import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  address: {
    village: string;
    thana: string;
    district: string;
  };
  role: "user" | "admin";
  isBanned: boolean;
  wishlist: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    address: {
      village: { type: String, default: "" },
      thana:   { type: String, default: "" },
      district:{ type: String, default: "" },
    },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    isBanned: { type: Boolean, default: false },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
