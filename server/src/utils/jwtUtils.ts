import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
	[key: string]: any;
}

/**
 * Generates a JSON Web Token (JWT) with the given payload, secret, and expiration time.
 *
 * @param payload - The payload to be encoded in the JWT.
 * @param secret - The secret key used to sign the JWT.
 * @param expiresIn - The time duration after which the token will expire. Defaults to "30m".
 * @returns The generated JWT as a string.
 */
export const generateToken = (payload: object, secret: string, expiresIn: string = "30m") => {
	return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies a JWT token and extracts the payload.
 *
 * @param token - The JWT token to verify.
 * @param secret - The secret key to use for verification.
 * @returns An object containing the userId and email from the token payload if verification is successful, or null if the token is invalid or expired.
 */
export const verifyToken = (token: string, secret: string): object | null => {
	try {
		const payload = jwt.verify(token, secret) as TokenPayload;
		return {
			userId: payload.userId,
			email: payload.email,
		};
	} catch (error: any) {
		console.error("Invalid or expired token:", error.message);
		return null;
	}
};

/**
 * Refreshes a JWT token by creating a new token with the same payload but a new expiration time.
 *
 * @param oldToken - The old JWT token that needs to be refreshed.
 * @param secret - The secret key used to sign the JWT token.
 * @param newExpiration - The new expiration time for the refreshed token. Defaults to "30m".
 * @returns The new JWT token with the refreshed expiration time, or null if the token could not be refreshed.
 */
export const refreshToken = (oldToken: string, secret: string, newExpiration: string = "30m") => {
	try {
		const payload = jwt.verify(oldToken, secret, { ignoreExpiration: true }) as TokenPayload;
		delete payload.iat;
		delete payload.exp;
		return jwt.sign(payload, secret, { expiresIn: newExpiration });
	} catch (error: any) {
		console.error("Failed to refresh token:", error.message);
		return null;
	}
};
