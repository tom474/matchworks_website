import { Router } from "express";
import {
	retrieveAvatar,
	downloadAvatar,
	uploadAvatar,
	renameAvatar,
	deleteAvatar,
	retrieveResume,
	downloadResume,
	uploadResume,
	renameResume,
	deleteResume,
} from "../controllers/fileController";
import { uploadSingleFile } from "../middlewares/fileUploadMiddleware";

const fileRouter = Router();

// Avatar routes
fileRouter.get("/avatars/:avatarId/retrieve", retrieveAvatar);
fileRouter.get("/avatars/:avatarId/download", downloadAvatar);
fileRouter.post("/avatars", uploadSingleFile("avatar"), uploadAvatar);
fileRouter.patch("/avatars/:avatarId", renameAvatar);
fileRouter.delete("/avatars/:avatarId", deleteAvatar);

// Resume routes
fileRouter.get("/resumes/:resumeId/retrieve", retrieveResume);
fileRouter.get("/resumes/:resumeId/download", downloadResume);
fileRouter.post("/resumes", uploadSingleFile("resume"), uploadResume);
fileRouter.patch("/resumes/:resumeId", renameResume);
fileRouter.delete("/resumes/:resumeId", deleteResume);

export default fileRouter;
