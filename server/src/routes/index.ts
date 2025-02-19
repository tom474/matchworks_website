import { Router } from "express";
import authRouter from "./authRoute";
import fileRouter from "./fileRoute";
import userRouter from "./userRoute";
import jobRouter from "./jobRoute";
import resumeRouter from "./resumeRoutes";
import roadmapRouter from "./roadmapRoute";
import interviewRouter from "./interviewRoute";

const router = Router();

router.use("/auth", authRouter);
router.use("/files", fileRouter);
router.use("/users", userRouter);
router.use("/jobs", jobRouter);
router.use("/resumes", resumeRouter);
router.use("/roadmaps", roadmapRouter);
router.use("/interviews", interviewRouter);

export default router;
