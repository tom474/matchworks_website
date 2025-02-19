import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { validateEnv } from "../validations/envValidation";
import { uploadFileToGridFS } from "../utils/fileUtils";
import { generateToken, verifyToken } from "../utils/jwtUtils";

validateEnv(["ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "ACCESS_TOKEN_LIFE", "REFRESH_TOKEN_LIFE"]);
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "default-access-token-secret";
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "30m";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "default-refresh-token-secret";
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || "30d";
const SALT_ROUNDS = 10;

// Register a new user
export const register = async (req: Request, res: Response) => {
	const { name, email, password, phone } = req.body;
	const avatar = req.file;

	// Validate input
	if (!name) {
		res.status(400).json({ error: "Name is required." });
		return;
	}
	if (!email) {
		res.status(400).json({ error: "Email is required." });
		return;
	}
	if (!password) {
		res.status(400).json({ error: "Password is required." });
		return;
	}
	if (!phone) {
		res.status(400).json({ error: "Phone is required." });
		return;
	}

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ email });
		console.log("existingUser", existingUser);
		if (existingUser) {
			res.status(400).json({ error: "User already exists." });
			return;
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		// Upload avatar
		let avatarId;
		if (!avatar) {
			avatarId = undefined;
		} else {
			const fileId = await uploadFileToGridFS(avatar, "avatars");
			avatarId = fileId;
		}

		// Create new user
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			phone,
			avatar: avatarId,
		});

		// Generate tokens
		const payload = { userId: newUser._id, email: newUser.email };
		const accessToken = generateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
		const refreshToken = generateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);

		// Set cookies
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 60 * 1000,
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});
		res.cookie("userId", newUser._id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({ message: "User created successfully", userId: newUser._id });
	} catch (error: any) {
		console.error("Register error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Login user
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	// Validate input
	if (!email) {
		res.status(400).json({ error: "Email is required." });
		return;
	}
	if (!password) {
		res.status(400).json({ error: "Password is required." });
		return;
	}

	try {
		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			res.status(401).json({ error: "User not found." });
			return;
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(401).json({ error: "Wrong password." });
			return;
		}

		// Generate tokens
		const payload = { userId: user._id, email: user.email };
		const accessToken = generateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);
		const refreshToken = generateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);

		// Set cookies
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 60 * 1000,
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});
		res.cookie("userId", user._id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Logout user
export const logout = (req: Request, res: Response) => {
	// Clear cookies
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");
	res.clearCookie("userId");
	res.status(200).json({ message: "Logout successful" });
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;

	// Validate input
	if (!refreshToken) {
		res.status(401).json({ error: "Unauthorized: No refresh token provided." });
		return;
	}

	try {
		// Verify refresh token
		const payload = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);
		if (payload === null) {
			throw new Error("Invalid or expired refresh token.");
		}

		// Generate new access token
		const newAccessToken = generateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);

		// Set new access token cookie
		res.cookie("accessToken", newAccessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * 60 * 1000,
		});

		res.status(200).json({ accessToken: newAccessToken });
	} catch (error) {
		res.status(403).json({ error: "Forbidden: Invalid or expired refresh token." });
	}
};
