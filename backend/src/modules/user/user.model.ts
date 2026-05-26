import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'নাম দিন'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'ফোন নম্বর দিন'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'পাসওয়ার্ড দিন'],
      minlength: [6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'],
      select: false, // default-এ password আসবে না
    },
    // ঠিকানা — গ্রাম, থানা, জেলা একসাথে single field
    address: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    // Firebase OTP verification এর UID
    firebaseUid: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Save করার আগে password hash করো
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Password compare method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model('User', userSchema);
