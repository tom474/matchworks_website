import { Router } from "express";
import {
	getInterviewById,
	createInterview,
	generateFeedback,
	deleteInterview,
} from "../controllers/interviewController";
import isAuthenticated from "../middlewares/authMiddleware";

const interviewRouter = Router();

interviewRouter.get("/:interviewId", isAuthenticated, getInterviewById);
interviewRouter.post("/", isAuthenticated, createInterview);
interviewRouter.post("/feedback", isAuthenticated, generateFeedback);
interviewRouter.delete("/:interviewId", isAuthenticated, deleteInterview);

export default interviewRouter;
