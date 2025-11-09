import mongoose from "mongoose";
import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";

const server = app.listen(env.PORT, async () => {
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = async () => {
	logger.info("sigint received, shutting down");
	server.close(() => {
		logger.info("server closed");
		process.exit();
	});

	for (const conn of mongoose.connections) {
		await conn.close();
	}

	setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

server.on("listening", () => {
	const addr = server.address();

	const bind = typeof addr === "string" ? `pipe ${addr}` : `"port " ${addr?.port}`;
	logger.debug(`Listening on ${bind}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
	if (error.syscall !== "listen") {
		throw error;
	}

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			logger.error(`${env.PORT}  requires elevated privileges`);
			return process.exit(1);
		case "EADDRINUSE":
			logger.error(`${env.PORT}  is already in use`);
			return process.exit(1);
		default:
			throw error;
	}
});

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
