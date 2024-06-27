import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  messages: Message[];
  joinedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: [4, "Name lenght should be greater then 5 character"],
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
    required: true,
  },
  password: {
    type: String,
    minlength: [8, "Password Should be atleast 8 character"],
    required: true,
  },
  verifyCode: {
    type: String,
    required: [true, "VerifyCode is required"],
  },
  verifyCodeExpire: {
    type: Date,
    minlength: [8, "verifyCodeExpire is required"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
