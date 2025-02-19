import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Error:", err.message || err);
	res.status(err.status || 500).json({
		message: err.message || "Internal Server Error",
		stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
};

export default errorHandler;
