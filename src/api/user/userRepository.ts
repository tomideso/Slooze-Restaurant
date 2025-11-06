import mongoose, { type Document } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import type { User } from "@/api/user/userModel";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const UserRepository = mongoose.model<Document & User>("User", UserSchema);

// Note: The above code defines a Mongoose model for the User entity, which includes fields for name, email, and password, along with automatic timestamping for creation and updates.
