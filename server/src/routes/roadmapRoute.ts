import { Router } from "express";
import { getRoadmapById, createRoadmap, updateRoadmap, deleteRoadmap } from "../controllers/roadmapController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const roadmapRouter = Router();

roadmapRouter.get("/:roadmapId", isAuthenticated, getRoadmapById);
roadmapRouter.post("/", isAuthenticated, createRoadmap);
roadmapRouter.patch("/:roadmapId", isAuthenticated, updateRoadmap);
roadmapRouter.delete("/:roadmapId", isAuthenticated, deleteRoadmap);

export default roadmapRouter;
