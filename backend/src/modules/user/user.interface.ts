import { Types } from 'mongoose';

export type TUserRole = 'customer' | 'admin';

export type TUserAddress = {
  village?: string;
  thana?: string;
  district?: string;
};

export type TUser = {
  name: string;
  phone: string;
  password: string;
  address?: TUserAddress;
  role?: TUserRole;
  isBanned?: boolean;
  wishlist?: Types.ObjectId[];
};
