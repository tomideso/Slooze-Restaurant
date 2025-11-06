import mongoose, { type Document } from "mongoose";
import type { MenuItem } from "@/api/menuItem/menuItemModel";

const Schema = mongoose.Schema;

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, min: 0, required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  },
  {
    timestamps: true,
  }
);

export const MenuItemRepository = mongoose.model<Document & MenuItem>("MenuItem", MenuItemSchema);

// Note: The above code defines a Mongoose model for the MenuItem entity, which includes fields for name, description, and price, along with automatic timestamping for creation and updates.
