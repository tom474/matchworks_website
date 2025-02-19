import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";
import { validateEnv } from "../validations/envValidation";

validateEnv(["ACCESS_TOKEN_SECRET"]);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default-access-token-secret";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
	const token = req.cookies.accessToken || req.body.accessToken || req.query.accessToken;

	if (!token) {
		res.status(401).json({ error: "Unauthorized: No token provided" });
		return;
	}

	try {
		const payload = verifyToken(token, ACCESS_TOKEN_SECRET);
		(req as any).jwtPayload = payload;
		next();
	} catch (error) {
		res.status(403).json({ error: "Forbidden: Invalid or expired token" });
	}
};

export default isAuthenticated;
