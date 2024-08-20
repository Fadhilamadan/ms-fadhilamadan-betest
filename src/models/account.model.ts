import { Document, model, Schema } from "mongoose";

export interface AccountModel extends Document {
  accountId: string;
  userName: string;
  password: string;
  lastLoginDateTime: Date;
  userId: string;
}

const accountSchema = new Schema<AccountModel>({
  accountId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLoginDateTime: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

accountSchema.index({ lastLoginDateTime: 1 });

export const Account = model<AccountModel>("Account", accountSchema);
