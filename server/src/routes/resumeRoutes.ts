import { Router } from "express";
import { getResumeById, generateFeedback } from "../controllers/resumeController";
import isAuthenticated from "../middlewares/authMiddleware";

const resumeRouter = Router();

resumeRouter.get("/:resumeId", isAuthenticated, getResumeById);
resumeRouter.post("/:resumeId/feedback", isAuthenticated, generateFeedback);

export default resumeRouter;
