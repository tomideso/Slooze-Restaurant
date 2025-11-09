import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import passport from "passport";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { menuItemRouter } from "@/api/menuItem/menuItemRouter";
import { userRouter } from "@/api/user/userRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { cartRouter } from "./api/cart/cartRouter";
import { publicRestaurantRouter, restaurantRouter } from "./api/restaurant/restaurantRouter";
import { initializeDabaseConnection } from "./database/database-init";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

initializeDabaseConnection();
app.use(passport.initialize());
// app.use(passport.session());

//initialize passport
require("@/database/passport-init");

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/user", userRouter);
app.use("/menu-item", menuItemRouter);
app.use("/restaurants", publicRestaurantRouter);
app.use("/restaurants", restaurantRouter);
app.use("/cart", cartRouter);

// Swagger UI
app.use("/swagger", openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
