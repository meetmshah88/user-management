import mongoose, { Document, Model } from "mongoose";
import { IUser } from "../types/types";

// Define a document interface that extends both IUser and Document
export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, maxlength: 100 },
    lastName: { type: String, required: true, maxlength: 100 },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema,
);

export default User;
