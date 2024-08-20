import { Document, model, Schema } from "mongoose";

export interface UserModel extends Document {
  userId: string;
  fullName: string;
  accountNumber: string;
  emailAddress: string;
  registrationNumber: string;
}

const userSchema = new Schema<UserModel>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.index({ accountNumber: 1 });
userSchema.index({ registrationNumber: 1 });

export const User = model<UserModel>("User", userSchema);
