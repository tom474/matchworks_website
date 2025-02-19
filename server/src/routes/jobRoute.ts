import { Router } from "express";
import {
	addJob,
	getJobs,
	getJobById,
	getSavedJobs,
	saveJob,
	unsaveJob,
	getJobRecommendations,
	getJobTypes,
	getJobLevels,
	getJobIndustries,
	getJobLocations,
} from "../controllers/jobController";
import isAuthenticated from "../middlewares/authMiddleware";

const jobRouter = Router();

jobRouter.post("/", isAuthenticated, addJob);
jobRouter.get("/", isAuthenticated, getJobs);
jobRouter.get("/saved", isAuthenticated, getSavedJobs);
jobRouter.post("/save", isAuthenticated, saveJob);
jobRouter.post("/unsave", isAuthenticated, unsaveJob);
jobRouter.get("/recommendations", isAuthenticated, getJobRecommendations);
jobRouter.get("/types", isAuthenticated, getJobTypes);
jobRouter.get("/levels", isAuthenticated, getJobLevels);
jobRouter.get("/industries", isAuthenticated, getJobIndustries);
jobRouter.get("/locations", isAuthenticated, getJobLocations);
jobRouter.get("/:id", isAuthenticated, getJobById);

export default jobRouter;
