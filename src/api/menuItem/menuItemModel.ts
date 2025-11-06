import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { RestaurantSchema } from "../restaurant/restaurantModel";

extendZodWithOpenApi(z);

export type MenuItem = z.infer<typeof MenuItemSchema>;
export const MenuItemSchema = z.object({
  _id: z.uuid(),
  name: z.string(),
  restaurant: RestaurantSchema.shape._id || RestaurantSchema.shape,
  description: z.string(),
  price: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET menu-items/:id' endpoint
export const GetMenuItemSchema = z.object({
  params: z.object({ id: z.uuid() }),
});

//Input Validation for 'GET menu-items/restaurant/:restaurantId' endpoint
export const GetMenuItemsByRestaurantSchema = z.object({
  params: z.object({ restaurantId: z.uuid() }),
});

// Input Validation for 'CREATE menu-items' endpoint
export const CreateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    restaurant: z.uuid(),
    price: z.number().min(0, "Price must be a non-negative number"),
  }),
});

// Input Validation for 'UPDATE menu-items/:id' endpoint
export const UpdateMenuItemSchema = z.object({
  params: z.object({ id: z.uuid() }),
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be a non-negative number").optional(),
  }),
});

//Input Validation for 'DELETE menu-items/:id' endpoint
export const DeleteMenuItemSchema = z.object({
  params: z.object({ id: z.uuid() }),
});
