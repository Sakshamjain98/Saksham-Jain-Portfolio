import mongoose, { Schema, type Model, type Types } from "mongoose";

export type UserRole = "admin" | "editor" | "viewer";

export interface UserDoc {
  _id: Types.ObjectId;
  email: string;
  name?: string;
  passwordHash?: string; // optional — magic-link-only users have no password
  role: UserRole;
  emailVerified?: Date | null; // populated by NextAuth EmailProvider
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer", required: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
  },
  { timestamps: true, collection: "users" },
);

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema);
