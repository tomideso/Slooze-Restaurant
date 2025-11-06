import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  HOST: z.string().min(1).default("localhost"),

  JWT_SECRET: z.string().min(10),

  JWT_EXPIRE: z.union([
    z.number().positive(),
    z.templateLiteral([z.number().positive(), z.enum(["h", "d", "s", "ms"])]),
    z.templateLiteral([z.coerce.number<number>(), "*", z.coerce.number<number>()]).transform((val) => {
      const [a, b] = val.split(/\*/).map(Number);
      return a * b;
    }),
  ]),

  PORT: z.coerce.number().int().positive().default(8080),

  DATABASE_URL: z
    .url({
      protocol: /^mongodb$/,
    })
    .default("mongodb://localhost:27017/slooze"),

  CORS_ORIGIN: z.url().default("http://localhost:8080"),

  COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(1000),

  COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
};
