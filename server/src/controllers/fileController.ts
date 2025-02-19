import { Request, Response } from "express";
import { GridFSBucket, ObjectId } from "mongodb";
import User from "../models/User";
import Resume from "../models/Resume";
import {
	uploadFileToGridFS,
	retrieveFileFromGridFS,
	renameFileInGridFS,
	deleteFileFromGridFS,
} from "../utils/fileUtils";
import { validateFileType } from "../validations/fileValidation";
import { getGridFSBucket } from "../config/database";
import { generateUserProfile } from "../utils/geminiUtils";

// Retrieve a avatar file metadata from GridFS
export const retrieveAvatar = async (req: Request, res: Response) => {
	const avatarId = req.params.avatarId as string;
	const bucketName = "avatars";

	// Validate input
	if (!avatarId) {
		res.status(400).json({ error: "Avatar ID is required." });
		return;
	}

	try {
		// Retrieve the avatar metadata from GridFS
		const avatarFile = await retrieveFileFromGridFS(new ObjectId(avatarId), bucketName);
		if (!avatarFile) {
			res.status(404).json({ error: "Avatar file not found." });
			return;
		}
		res.status(200).json({ avatarFile });
	} catch (error: any) {
		console.error("Failed to retrieve avatar metadata:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Download a avatar file from GridFS
export const downloadAvatar = async (req: Request, res: Response) => {
	const avatarId = req.params.avatarId as string;
	const bucketName = "avatars";

	// Validate input
	if (!avatarId) {
		res.status(400).json({ error: "Avatar ID is required." });
		return;
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	try {
		// Retrieve the avatar metadata from GridFS
		const avatarFile = await retrieveFileFromGridFS(new ObjectId(avatarId), bucketName);
		if (!avatarFile) {
			res.status(404).json({ error: "Avatar not found." });
			return;
		}

		// Set the correct headers
		const contentType = avatarFile.metadata?.mimeType || "application/octet-stream";
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", `attachment; filename="${avatarFile.filename}"`);

		// Stream the file
		const fileStream = bucket.openDownloadStream(new ObjectId(avatarId));
		fileStream.pipe(res);

		// Handle stream errors
		fileStream.on("error", (err) => {
			console.error("Error during file streaming:", err);
			if (!res.headersSent) {
				res.status(500).json({ error: "Error streaming the file." });
			}
		});

		fileStream.on("end", () => {
			console.log(`File ${avatarFile.filename} streamed successfully.`);
		});
	} catch (error: any) {
		console.error("Failed to download file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Upload a avatar file to GridFS
export const uploadAvatar = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const avatar = req.file;

	// Validate input
	if (!avatar) {
		res.status(400).json({ error: "Avatar file is required." });
		return;
	}

	// Validate the avatar file type
	const allowedTypes = ["image/jpeg", "image/png"];
	if (!validateFileType(avatar.mimetype, allowedTypes)) {
		res.status(400).json({ error: "Invalid file type. Only JPEG and PNG images are allowed." });
		return;
	}

	try {
		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Delete the user's existing avatar
		if (user.avatar) {
			await deleteFileFromGridFS(user.avatar, "avatars");
		}

		// Upload the avatar to GridFS
		const avatarId = await uploadFileToGridFS(avatar, "avatars");

		// Update the user's avatar
		user.avatar = avatarId;
		await user.save();

		res.status(200).json({ message: "Avatar uploaded successfully.", avatarId });
	} catch (error: any) {
		console.error("Failed to upload avatar:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Rename a avatar file in GridFS
export const renameAvatar = async (req: Request, res: Response) => {
	const avatarId = req.params.avatarId as string;
	const { newName } = req.body;
	const bucketName = "avatars";

	// Validate input
	if (!avatarId) {
		res.status(400).json({ error: "Avatar ID is required." });
		return;
	}
	if (!newName) {
		res.status(400).json({ error: "New name is required." });
		return;
	}

	try {
		// Rename the file in GridFS
		const success = await renameFileInGridFS(new ObjectId(avatarId), newName, bucketName);

		if (!success) {
			res.status(404).json({ error: "Avatar file not found." });
			return;
		}

		res.status(200).json({ message: "Avatar file renamed successfully." });
	} catch (error: any) {
		console.error("Failed to rename file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete a avatar file from GridFS
export const deleteAvatar = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const avatarId = req.params.avatarId as string;
	const bucketName = "avatars";

	// Validate input
	if (!avatarId) {
		res.status(400).json({ error: "Avatar ID is required." });
		return;
	}

	try {
		// Delete the file from GridFS
		const deletionSuccess = await deleteFileFromGridFS(new ObjectId(avatarId), bucketName);
		if (!deletionSuccess) {
			res.status(404).json({ error: "Avatar file not found in GridFS." });
			return;
		}

		// Update the user's avatar
		await User.findByIdAndUpdate(userId, { $unset: { avatar: 1 } });

		res.status(200).json({ message: "Avatar file deleted successfully." });
	} catch (error: any) {
		console.error("Failed to delete file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Retrieve a resume file metadata from GridFS
export const retrieveResume = async (req: Request, res: Response) => {
	const resumeId = req.params.resumeId as string;
	const bucketName = "resumes";

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "Resume ID is required." });
		return;
	}

	try {
		// Get the resume
		const resume = await Resume.findById(resumeId);
		if (!resume) {
			res.status(404).json({ error: "Resume not found." });
			return;
		}

		// Retrieve the file metadata from GridFS
		const fileId = resume.fileId;
		const file = await retrieveFileFromGridFS(new ObjectId(fileId), bucketName);
		if (!file) {
			res.status(404).json({ error: "Resume file not found." });
			return;
		}
		res.status(200).json({ file });
	} catch (error: any) {
		console.error("Failed to retrieve file metadata:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Download a resume file from GridFS
export const downloadResume = async (req: Request, res: Response) => {
	const resumeId = req.params.resumeId as string;
	const bucketName = "resumes";

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "Resume ID is required." });
		return;
	}

	// Get the GridFS bucket
	const bucket: GridFSBucket = getGridFSBucket(bucketName);

	try {
		// Get the resume
		const resume = await Resume.findById(resumeId);
		if (!resume) {
			res.status(404).json({ error: "Resume not found." });
			return;
		}

		// Retrieve the file metadata from GridFS
		const fileId = resume.fileId;
		const file = await retrieveFileFromGridFS(new ObjectId(fileId), bucketName);
		if (!file) {
			res.status(404).json({ error: "Resume file not found." });
			return;
		}

		// Set the correct headers
		const contentType = file.metadata?.mimeType || "application/octet-stream";
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);

		// Stream the file
		const fileStream = bucket.openDownloadStream(new ObjectId(fileId));
		fileStream.pipe(res);

		// Handle stream errors
		fileStream.on("error", (err) => {
			console.error("Error during file streaming:", err);
			if (!res.headersSent) {
				res.status(500).json({ error: "Error streaming the file." });
			}
		});

		fileStream.on("end", () => {
			console.log(`Resume file ${file.filename} streamed successfully.`);
		});
	} catch (error: any) {
		console.error("Failed to download file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Upload a resume file to GridFS
export const uploadResume = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const resume = req.file;
	const { isUpdateProfile = "false" } = req.body;

	// Validate input
	if (!resume) {
		res.status(400).json({ error: "Resume file is required." });
		return;
	}

	// Validate the resume file type
	const allowedTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	];
	if (!validateFileType(resume.mimetype, allowedTypes)) {
		res.status(400).json({ error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed." });
		return;
	}

	try {
		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Upload the resume file to GridFS
		const fileId = await uploadFileToGridFS(resume, "resumes");

		// Create a new resume
		const newResume = new Resume({
			fileId,
			fileName: resume.originalname,
		});
		await newResume.save();

		// Update the user's resumes
		if (!user.resumeIds) {
			user.resumeIds = [];
		}
		user.resumeIds.push(newResume._id as ObjectId);

		// Update the user's profile if the resume is being uploaded during profile creation
		if (isUpdateProfile === "true") {
			const resumeId = newResume._id!.toString();
			const response = await generateUserProfile(resumeId);

			user.background = response.background;
			user.positions = response.positions;
			user.skills = response.skills;
			user.education = response.education;
			user.experience = response.experience;
			user.interests = response.interests;
		}

		await user.save();

		res.status(200).json({ message: "Resume uploaded successfully.", resumeId: newResume._id });
	} catch (error: any) {
		console.error("Failed to upload resume:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Rename a resume file in GridFS
export const renameResume = async (req: Request, res: Response) => {
	const resumeId = req.params.resumeId as string;
	const { newName } = req.body;
	const bucketName = "resumes";

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "File ID is required." });
		return;
	}
	if (!newName) {
		res.status(400).json({ error: "New name is required." });
		return;
	}

	try {
		// Get the resume
		const resume = await Resume.findById(resumeId);
		if (!resume) {
			res.status(404).json({ error: "Resume not found." });
			return;
		}

		// Rename the file in GridFS
		const fileId = resume.fileId;
		const success = await renameFileInGridFS(new ObjectId(fileId), newName, bucketName);

		if (!success) {
			res.status(404).json({ error: "Resume file not found." });
			return;
		}

		// Update the resume's filename
		resume.fileName = newName;
		await resume.save();

		res.status(200).json({ message: "Resume renamed successfully." });
	} catch (error: any) {
		console.error("Failed to rename file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Delete a resume file from GridFS
export const deleteResume = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const resumeId = req.params.resumeId as string;
	const bucketName = "resumes";

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "Resume ID is required." });
		return;
	}

	try {
		// Get the resume
		const resume = await Resume.findById(resumeId);
		if (!resume) {
			res.status(404).json({ error: "Resume not found." });
			return;
		}

		// Delete the file from GridFS
		const fileId = resume.fileId;
		const deletionSuccess = await deleteFileFromGridFS(new ObjectId(fileId), bucketName);
		if (!deletionSuccess) {
			res.status(404).json({ error: "Resume file not found in GridFS." });
			return;
		}

		// Update the user's resumes
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}
		user.resumeIds = user.resumeIds?.filter((id) => id.toString() !== resumeId);
		await user.save();

		// Delete the resume
		await Resume.findByIdAndDelete(resumeId);

		res.status(200).json({ message: "Resume deleted successfully." });
	} catch (error: any) {
		console.error("Failed to delete file:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
