import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/authController";
import { uploadSingleFile } from "../middlewares/fileUploadMiddleware";
import isAuthenticated from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", uploadSingleFile("avatar"), register);
authRouter.post("/login", login);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;
