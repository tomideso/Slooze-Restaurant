import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  _id: z.uuid(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.uuid() }),
});

// Input Validation for 'CREATE /users' endpoint
export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "password is too short"),
  }),
});

//Input Validation for 'LOGIN /users/login' endpoint
export const LoginUserSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "password is too short"),
  }),
  response: z.object({
    token: z.string(),
    ...UserSchema.pick({ _id: true, email: true, name: true }).shape,
  }),
});

// Input Validation for 'UPDATE /users/:id' endpoint
export const UpdateUserSchema = z.object({
  params: z.object({ id: z.uuid() }),
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Invalid email address").optional(),
  }),
});
