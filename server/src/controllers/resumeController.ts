import { Request, Response } from "express";
import Resume from "../models/Resume";
import { generateResumeFeedback } from "../utils/geminiUtils";

// Get a resume by ID
export const getResumeById = async (req: Request, res: Response) => {
	const resumeId = req.params.resumeId;

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "Resume ID is required" });
		return;
	}

	try {
		// Fetch the resume bi ID
		const resume = await Resume.findById(resumeId);

		// Check if the resume exists
		if (!resume) {
			res.status(404).json({ error: "Resume not found" });
			return;
		}

		res.status(200).json({ resume });
	} catch (error: any) {
		console.error("Failed to fetch resume by ID:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Generate feedback for a resume
export const generateFeedback = async (req: Request, res: Response) => {
	const resumeId = req.params.resumeId;

	// Validate input
	if (!resumeId) {
		res.status(400).json({ error: "Resume ID is required" });
		return;
	}

	try {
		// Fetch the resume by ID
		const resume = await Resume.findById(resumeId);

		// Check if the resume exists
		if (!resume) {
			res.status(404).json({ error: "Resume not found" });
			return;
		}

		// Generate feedback for the resume
		const response = await generateResumeFeedback(resumeId);

		// Validate the response structure
		if (!response || !response.feedback || !Array.isArray(response.feedback)) {
			res.status(400).json({ error: "Invalid response structure" });
			return;
		}

        // Calculate the overall score
        let overallScore = 0;
        response.feedback.forEach((aspect: any) => {
            overallScore += aspect.score;
        });
        overallScore /= response.feedback.length;
        overallScore = Math.round(overallScore);

		// Update the resume with the overall score and feedback
		resume.overallScore = overallScore;
		resume.feedback = response.feedback;
		await resume.save();

		res.status(200).json({ overallScore: overallScore, feedback: response.feedback });
	} catch (error: any) {
		console.error("Failed to generate feedback for resume:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
