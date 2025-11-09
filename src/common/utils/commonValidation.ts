import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import mongoose from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
  _id: z.string().refine((val) => {
    return mongoose.Types.ObjectId.isValid(val);
  }),

  authHeader: z.object({
    Authorization: z.string().openapi({
      description: "Bearer token for authentication",
      example: "Bearer your_auth_token",
    }),
  }),
};
