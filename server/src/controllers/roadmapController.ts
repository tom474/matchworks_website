import { Request, Response } from "express";
import Roadmap from "../models/Roadmap";
import User from "../models/User";
import { generateRoadmap } from "../utils/geminiUtils";

// Get a roadmap by ID
export const getRoadmapById = async (req: Request, res: Response) => {
	const roadmapId = req.params.roadmapId;

	// Validate input
	if (!roadmapId) {
		res.status(400).json({ error: "Roadmap ID is required" });
		return;
	}

	try {
		// Fetch the roadmap by ID
		const roadmap = await Roadmap.findById(roadmapId);

		// Check if the roadmap exists
		if (!roadmap) {
			res.status(404).json({ error: "Roadmap not found" });
			return;
		}

		res.status(200).json({ roadmap });
	} catch (error: any) {
		console.error("Failed to fetch roadmap by ID:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Create a new roadmap from a job description
export const createRoadmap = async (req: Request, res: Response) => {
	const { jobTitle, jobLevel, jobDescription } = req.body;
	const userId = req.cookies.userId;

	// Validate input
	if (!jobTitle) {
		res.status(400).json({ error: "Job Title is required" });
		return;
	}
	if (!jobLevel) {
		res.status(400).json({ error: "Job Level is required" });
		return;
	}
	if (!jobDescription) {
		res.status(400).json({ error: "Job Description is required" });
		return;
	}

	try {
		// Generate the roadmap
		const roadmap = await generateRoadmap(jobTitle, jobLevel, jobDescription);

		// Save the roadmap to the database
		const newRoadmap = new Roadmap({
			title: roadmap.title,
			description: roadmap.description,
			level: roadmap.level,
			progress: roadmap.progress,
			checklist: roadmap.checklist,
		});
		const savedRoadmap = await newRoadmap.save();

		// Update the user's roadmap list
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}
		user.roadmapIds = user.roadmapIds || [];
		user.roadmapIds.push(savedRoadmap._id as any);
		await user.save();

		res.status(201).json({
			message: "Roadmap created successfully.",
			roadmap: newRoadmap,
		});
	} catch (error: any) {
		console.error("Failed to create roadmap:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateRoadmap = async (req: Request, res: Response) => {
	const { roadmapId } = req.params;
	const { checklistId, isCompleted = true } = req.body;

	// Validate inputs
	if (!roadmapId) {
		res.status(400).json({ error: "Roadmap ID is required." });
		return;
	}
	if (!checklistId) {
		res.status(400).json({ error: "Checklist ID is required." });
		return;
	}
	if (typeof isCompleted != "boolean") {
		res.status(400).json({ error: "isCompleted must be boolean." });
		return;
	}

	try {
		// Fetch the roadmap by ID
		const roadmap = await Roadmap.findById(roadmapId);

		// Check if the roadmap exists
		if (!roadmap) {
			res.status(404).json({ error: "Roadmap not found." });
			return;
		}

		// Find the checklist
		const checklist = roadmap.checklist.find((item) => (item as any)._id.toString() === checklistId);
		if (!checklist) {
			res.status(404).json({ error: "Checklist not found in the roadmap." });
			return;
		}

		// Update the skill's completion status
		checklist.isCompleted = isCompleted;

		// Recalculate the progress
		const totalChecklist = roadmap.checklist.length;
		const completedChecklist = roadmap.checklist.filter((item) => item.isCompleted).length;
		roadmap.progress = Math.round((completedChecklist / totalChecklist) * 100);

		// Save the updated roadmap
		await roadmap.save();

		res.status(200).json({
			message: "Roadmap updated successfully.",
		});
	} catch (error: any) {
		console.error("Failed to update roadmap:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteRoadmap = async (req: Request, res: Response) => {
	const { roadmapId } = req.params;
	const userId = req.cookies.userId;

	// Validate inputs
	if (!roadmapId) {
		res.status(400).json({ error: "Roadmap ID is required." });
		return;
	}

	try {
		// Fetch the roadmap by ID
		const roadmap = await Roadmap.findById(roadmapId);

		// Check if the roadmap exists
		if (!roadmap) {
			res.status(404).json({ error: "Roadmap not found." });
			return;
		}

		// Delete the roadmap from the database
		await Roadmap.findByIdAndDelete(roadmapId);

		// Update the user's roadmap data
		const user = await User.findById(userId);
		if (user) {
			user.roadmapIds = user.roadmapIds?.filter((id) => id.toString() !== roadmapId);
			await user.save();
		}

		res.status(200).json({ message: "Roadmap deleted successfully." });
	} catch (error: any) {
		console.error("Failed to delete roadmap:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
