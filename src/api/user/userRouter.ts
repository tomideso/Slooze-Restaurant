import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { CreateUserSchema, LoginUserSchema, UserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequests } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "post",
  path: "/user/login",
  tags: ["User"],
  responses: createApiResponse(LoginUserSchema.shape.response, "Success"),
  request: {
    body: {
      content: {
        "application/json": { schema: LoginUserSchema.shape.body },
      },
    },
  },
});
userRouter.post("/user/login", validateRequests(LoginUserSchema), userController.loginUser);

userRegistry.registerPath({
  method: "post",
  path: "/user/register",
  tags: ["User", "Register"],
  responses: createApiResponse(CreateUserSchema, "Success"),
  request: {
    body: {
      content: {
        "application/json": { schema: CreateUserSchema.shape.body },
      },
    },
  },
});

userRouter.post("/user/register", validateRequests(CreateUserSchema), userController.registerUser);
