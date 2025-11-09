import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import passport from "passport";
import { z } from "zod";
import { CreateRestaurantSchema, GetRestaurantSchema, RestaurantSchema } from "@/api/restaurant/restaurantModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { commonValidations } from "@/common/utils/commonValidation";
import { validateRequests } from "@/common/utils/httpHandlers";
import { restaurantController } from "./restaurantController";

export const restaurantRegistry = new OpenAPIRegistry();
export const restaurantRouter: Router = express.Router();
export const publicRestaurantRouter: Router = express.Router();

//protect route
restaurantRouter.use(passport.authenticate("jwt", { session: false }));

const bearerAuthComponent = restaurantRegistry.registerComponent("securitySchemes", "BearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "JWT Bearer token for authentication",
});

restaurantRegistry.register("Restaurant", RestaurantSchema);

restaurantRegistry.registerPath({
  method: "get",
  path: "/restaurants",
  tags: ["Restaurant"],
  request: {
    headers: commonValidations.authHeader,
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  responses: createApiResponse(z.array(RestaurantSchema), "Success"),
});

restaurantRouter.get("/", restaurantController.getRestaurants);

restaurantRegistry.registerPath({
  method: "get",
  path: "/restaurants/{id}",
  tags: ["Restaurant"],
  request: {
    params: GetRestaurantSchema.shape.params,
    headers: [commonValidations.authHeader],
  },
  responses: createApiResponse(RestaurantSchema, "Success"),
});

restaurantRouter.get("/:id", validateRequests(GetRestaurantSchema), restaurantController.getRestaurant);

restaurantRegistry.registerPath({
  method: "post",
  path: "/restaurants",
  tags: ["Restaurant"],
  request: {
    headers: [commonValidations.authHeader],
    body: {
      content: {
        "application/json": { schema: CreateRestaurantSchema.shape.body },
      },
    },
  },

  responses: createApiResponse(RestaurantSchema, "Success"),
});

restaurantRouter.post("/", validateRequests(CreateRestaurantSchema), restaurantController.createRestaurant);
