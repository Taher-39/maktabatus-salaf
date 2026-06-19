import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  password: string;
  address?: {
    village?: string;
    thana?: string;
    district?: string;
  };
  role: "customer" | "admin";
  isBanned: boolean;
  firebaseUid?: string;
  avatar?: string;
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "নাম দিন"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "ফোন নম্বর দিন"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, "পাসওয়ার্ড দিন"],
      minlength: [6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"],
      select: false, // default-এ password আসবে না
    },
    address: {
      village: { type: String, default: "" },
      thana: { type: String, default: "" },
      district: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    firebaseUid: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  { timestamps: true }
);

// Save করার আগে password hash করো
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Password compare method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
