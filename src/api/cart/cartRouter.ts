import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import passport from "passport";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { commonValidations } from "@/common/utils/commonValidation";
import { validateRequests } from "@/common/utils/httpHandlers";
import { cartController } from "./cartController";
import { CartSchema, CreateCartSchema, DeleteCartSchema, UpdateCartSchema } from "./cartModel";

export const cartRegistry = new OpenAPIRegistry();
export const cartRouter: Router = express.Router();

cartRegistry.register("Cart", CartSchema);
cartRouter.use(passport.authenticate("jwt", { session: false }));

cartRegistry.registerPath({
  method: "get",
  path: "/cart",
  tags: ["Cart"],
  request: {
    headers: [commonValidations.authHeader],
  },
  responses: createApiResponse(z.array(CartSchema), "Success"),
});

cartRouter.get("/", cartController.getCart);

// cartRegistry.registerPath({
//   method: "get",
//   path: "/menu-item/restaurant/{restaurantId}",
//   tags: ["MenuItem"],
//   description: "Get all menu items for a specific restaurant",
//   request: { params: GetMenuItemsByRestaurantSchema.shape.params },
//   responses: createApiResponse(z.array(MenuItemSchema), "Success"),
// });
// cartRouter.get(
//   "/restaurant/:restaurantId",
//   validateRequests(GetMenuItemsByRestaurantSchema),
//   cartController.getMenuItemsByRestaurant
// );

cartRegistry.registerPath({
  method: "post",
  path: "/cart",
  tags: ["Cart"],
  description: "create cart for the current user",
  request: {
    headers: [commonValidations.authHeader],
    body: {
      content: {
        "application/json": { schema: CreateCartSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CartSchema, "Success"),
});
cartRouter.post("/", validateRequests(CreateCartSchema), cartController.createCart);

cartRegistry.registerPath({
  method: "put",
  path: "/cart",
  tags: ["Cart"],
  description: "Update cart for the current user",
  request: {
    // params: UpdateCartSchema.shape.params,
    headers: [commonValidations.authHeader],
    body: {
      content: {
        "application/json": { schema: UpdateCartSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(CartSchema, "Success"),
});
cartRouter.put("{/:id}", validateRequests(UpdateCartSchema), cartController.updateCart);

cartRegistry.registerPath({
  method: "delete",
  path: "/cart",
  tags: ["Cart"],
  description: "Deletes cart for the current user",
  request: {
    params: DeleteCartSchema.shape.params,
    headers: [commonValidations.authHeader],
  },
  responses: createApiResponse(z.literal("Cart deleted successfully"), "Success"),
});

cartRouter.delete("/", validateRequests(DeleteCartSchema), cartController.deleteCart);
