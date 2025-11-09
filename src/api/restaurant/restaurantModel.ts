import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Restaurant = z.infer<typeof RestaurantSchema>;
export const RestaurantSchema = z.object({
	_id: commonValidations._id,
	name: z.string(),
	email: z.email(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Input Validation for 'GET restaurants/:id' endpoint
export const GetRestaurantSchema = z.object({
	params: z.object({ id: commonValidations._id }),
});

//Input Validation for 'CREATE /restaurants' endpoint
export const CreateRestaurantSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		email: z.email("Invalid email address"),
	}),
});
