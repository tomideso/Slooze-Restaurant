import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import passport from "passport";
import { z } from "zod";
import {
  CreateMenuItemSchema,
  DeleteMenuItemSchema,
  GetMenuItemSchema,
  GetMenuItemsByRestaurantSchema,
  MenuItemSchema,
  UpdateMenuItemSchema,
} from "@/api/menuItem/menuItemModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { commonValidations } from "@/common/utils/commonValidation";
import { validateRequests } from "@/common/utils/httpHandlers";
import { menuItemController } from "./menuItemController";

export const menuItemRegistry = new OpenAPIRegistry();
export const menuItemRouter: Router = express.Router();

menuItemRegistry.register("MenuItem", MenuItemSchema);

menuItemRegistry.registerPath({
  method: "get",
  path: "/menu-item",
  tags: ["MenuItem"],
  responses: createApiResponse(z.array(MenuItemSchema), "Success"),
});

menuItemRouter.get("/", menuItemController.getMenuItems);

menuItemRegistry.registerPath({
  method: "get",
  path: "/menu-item/{id}",
  tags: ["MenuItem"],
  request: { params: GetMenuItemSchema.shape.params, headers: [commonValidations.authHeader] },
  responses: createApiResponse(MenuItemSchema, "Success"),
});
menuItemRouter.get("/:id", validateRequests(GetMenuItemSchema), menuItemController.getMenuItem);

menuItemRegistry.registerPath({
  method: "get",
  path: "/menu-item/restaurant/{restaurantId}",
  tags: ["MenuItem"],
  description: "Get all menu items for a specific restaurant",
  request: { params: GetMenuItemsByRestaurantSchema.shape.params, headers: [commonValidations.authHeader] },
  responses: createApiResponse(z.array(MenuItemSchema), "Success"),
});
menuItemRouter.get(
  "/restaurant/:restaurantId",
  validateRequests(GetMenuItemsByRestaurantSchema),
  menuItemController.getMenuItemsByRestaurant
);

menuItemRegistry.registerPath({
  method: "post",
  path: "/menu-item",
  tags: ["MenuItem"],
  request: {
    headers: commonValidations.authHeader,
    body: {
      content: {
        "application/json": { schema: CreateMenuItemSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(MenuItemSchema, "Success"),
});
menuItemRouter.post("/", validateRequests(CreateMenuItemSchema), menuItemController.createMenuItem);

menuItemRegistry.registerPath({
  method: "put",
  path: "/menu-item/{id}",
  tags: ["MenuItem"],
  request: {
    headers: commonValidations.authHeader,
    params: UpdateMenuItemSchema.shape.params,
    body: {
      content: {
        "application/json": { schema: UpdateMenuItemSchema.shape.body },
      },
    },
  },
  responses: createApiResponse(MenuItemSchema, "Success"),
});
menuItemRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateRequests(UpdateMenuItemSchema),
  menuItemController.updateMenuItem
);

menuItemRegistry.registerPath({
  method: "delete",
  path: "/menu-item/{id}",
  tags: ["MenuItem"],
  request: { params: DeleteMenuItemSchema.shape.params, headers: [commonValidations.authHeader] },
  responses: createApiResponse(z.literal("Item deleted successfully"), "Success"),
});

menuItemRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateRequests(DeleteMenuItemSchema),
  menuItemController.deleteMenuItem
);
