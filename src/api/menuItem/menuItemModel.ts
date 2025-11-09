import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";
import { RestaurantSchema } from "../restaurant/restaurantModel";

extendZodWithOpenApi(z);

export type MenuItem = z.infer<typeof MenuItemSchema>;
export const MenuItemSchema = z.object({
  _id: commonValidations._id,
  name: z.string(),
  restaurant: RestaurantSchema.shape._id || RestaurantSchema.shape,
  description: z.string(),
  price: z.number().positive().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET menu-items/:id' endpoint
export const GetMenuItemSchema = z.object({
  params: z.object({ id: commonValidations._id }),
});

//Input Validation for 'GET menu-items/restaurant/:restaurantId' endpoint
export const GetMenuItemsByRestaurantSchema = z.object({
  params: z.object({ restaurantId: commonValidations._id }),
});

// Input Validation for 'CREATE menu-items' endpoint
export const CreateMenuItemSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    restaurant: commonValidations._id,
    price: z.number().positive().min(0, "Price must be a non-negative number"),
  }),
});

// Input Validation for 'UPDATE menu-items/:id' endpoint
export const UpdateMenuItemSchema = z.object({
  params: z.object({ id: commonValidations._id }),
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().optional(),
    price: z.number().positive().min(0, "Price must be a non-negative number").optional(),
  }),
});

//Input Validation for 'DELETE menu-items/:id' endpoint
export const DeleteMenuItemSchema = z.object({
  params: z.object({ id: commonValidations._id }),
});
