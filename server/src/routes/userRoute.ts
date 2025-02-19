import { Router } from "express";
import {
	getCurrentUser,
	updateUserProfile,
	addPosition,
	removePosition,
	addSkill,
	removeSkill,
	addInterest,
	removeInterest,
	addEducation,
	updateEducation,
	removeEducation,
	addExperience,
	updateExperience,
	removeExperience,
} from "../controllers/userController";
import isAuthenticated from "../middlewares/authMiddleware";

const userRouter = Router();

// User details routes
userRouter.get("/current", isAuthenticated, getCurrentUser);
userRouter.patch("/profile", isAuthenticated, updateUserProfile);

// Positions routes
userRouter.post("/positions", isAuthenticated, addPosition);
userRouter.delete("/positions", isAuthenticated, removePosition);

// Skills routes
userRouter.post("/skills", isAuthenticated, addSkill);
userRouter.delete("/skills", isAuthenticated, removeSkill);

// Interests routes
userRouter.post("/interests", isAuthenticated, addInterest);
userRouter.delete("/interests", isAuthenticated, removeInterest);

// Education routes
userRouter.post("/education", isAuthenticated, addEducation);
userRouter.patch("/education", isAuthenticated, updateEducation);
userRouter.delete("/education", isAuthenticated, removeEducation);

// Experience routes
userRouter.post("/experience", isAuthenticated, addExperience);
userRouter.patch("/experience", isAuthenticated, updateExperience);
userRouter.delete("/experience", isAuthenticated, removeExperience);

export default userRouter;
