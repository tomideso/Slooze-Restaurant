import mongoose, { type Document } from "mongoose";
import type { Cart } from "./cartModel";

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: [
      {
        quantity: Number,
        menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CartRepository = mongoose.model<Document & Cart>("Cart", CartSchema);
export type CartRepositoryType = typeof CartRepository;

// Note: The above code defines a Mongoose model for the MenuItem entity, which includes fields for name, description, and price, along with automatic timestamping for creation and updates.
