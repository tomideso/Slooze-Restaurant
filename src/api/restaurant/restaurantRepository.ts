import mongoose, { type Document } from "mongoose";
import type { Restaurant } from "@/api/restaurant/restaurantModel";

// export const restaurants: Restaurant[] = [
//   {
//     id: 1,
//     name: "Alice",
//     email: "alice@example.com",
//     createdAt: new Date(),
//     updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
//   },
//   {
//     id: 2,
//     name: "Robert",
//     email: "Robert@example.com",
//     createdAt: new Date(),
//     updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
//   },
// ];

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    email: String,
  },
  {
    timestamps: true,
  }
);

export const RestaurantRepository = mongoose.model<Document & Restaurant>(
  "Restaurant",
  RestaurantSchema
);

// Note: The above code defines a Mongoose model for the Restaurant entity, which includes fields for name and email, along with automatic timestamping for creation and updates.
