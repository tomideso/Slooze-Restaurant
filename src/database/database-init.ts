import mongoose from "mongoose";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

export const initializeDabaseConnection = async () => {
	try {
		await mongoose.connect(env.DATABASE_URL);
		logger.info(`Mongoose connection successful`);
	} catch (error) {
		logger.error(`Mongoose connection  error + ${error}`);
	}
};

// If the connection throws an error
mongoose.connection.on("error", (err) => {
	logger.error(`Mongoose default connection error:  ${err}`);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
	logger.info("Mongoose default connection disconnected");
});
