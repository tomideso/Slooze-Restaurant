import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";
import { MenuItemSchema } from "../menuItem/menuItemModel";
import { UserSchema } from "../user/userModel";

extendZodWithOpenApi(z);

export type Cart = z.infer<typeof CartSchema>;
export const CartSchema = z.object({
  _id: commonValidations._id,
  user: z.union([commonValidations._id, UserSchema]),
  items: z.array(
    z.object({ quantity: z.number().positive(), menuItem: z.union([commonValidations._id, MenuItemSchema]) })
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET cart/:id' endpoint
export const GetCartSchema = z.object({
  params: z
    .object({ id: commonValidations._id })
    .optional()
    .openapi({ description: "Returns cart of loggedin user by default" }),
});

// Input Validation for 'CREATE cart' endpoint
export const CreateCartSchema = z.object({
  body: z
    .object({
      items: z.array(
        z.object({
          menuItem: commonValidations._id.openapi({ description: "menuItem Id" }),
          quantity: z.number().nonnegative(),
        })
      ),
    })
    .optional(),
});

// Input Validation for 'UPDATE cart' endpoint
export const UpdateCartSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          menuItem: commonValidations._id.openapi({ description: "menuItem Id" }),
          quantity: z.number().nonnegative(),
        })
      )
      .nonempty(),
  }),
});

//Input Validation for 'DELETE cart/:id' endpoint
export const DeleteCartSchema = z.object({
  params: z.object({ id: commonValidations._id }),
});
