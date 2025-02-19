import { Request, Response } from "express";
import Job from "../models/Job";
import User from "../models/User";

// Add a new job
export const addJob = async (req: Request, res: Response) => {
	const {
		title,
		type,
		level,
		industry,
		description,
		location,
		salary,
		url,
		company,
		contactEmail,
		skills,
		datePosted,
	} = req.body;

	// Validate input
	if (
		!title ||
		!type ||
		!level ||
		!industry ||
		!description ||
		!location ||
		!salary ||
		!url ||
		!company ||
		!contactEmail ||
		!skills ||
		!datePosted
	) {
		res.status(400).json({ message: "All fields are required" });
		return;
	}

	try {
		const newJob = new Job({
			title,
			type,
			level,
			industry,
			description,
			location,
			salary,
			url,
			company,
			contactEmail,
			skills,
			datePosted,
		});
		await newJob.save();
		res.status(201).json({ message: "Job added successfully" });
	} catch (error: any) {
		console.error("Failed to add job:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get jobs with searching, filtering, and pagination
export const getJobs = async (req: Request, res: Response) => {
	const { search, type, level, industry, location, page = 1, limit = 10 } = req.query;
	const userId = req.cookies.userId;

	try {
		// Build query filters
		const filters: any = {};

		// Search by title or company name
		if (search) {
			filters.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ "company.name": { $regex: search, $options: "i" } },
			];
		}

		// Filter by type
		if (type) {
			filters.type = type;
		}

		// Filter by level
		if (level) {
			filters.level = level;
		}

		// Filter by industry
		if (industry) {
			filters.industry = industry;
		}

		// Filter by location
		if (location) {
			filters.location = location;
		}

		// Pagination
		const skip = (Number(page) - 1) * Number(limit);

		// Fetch the user's saved jobs
		const user = userId ? await User.findById(userId) : null;
		const userSkills = user?.skills || [];
		const savedJobIds = user?.saveJobIds?.map((id) => id.toString()) || [];

		// Fetch jobs from the database with projection
		const jobs = await Job.find(filters, {
			title: 1,
			type: 1,
			level: 1,
			location: 1,
			salary: 1,
			"company.name": 1,
			"company.logo": 1,
			skills: 1,
			datePosted: 1,
		})
			.skip(skip)
			.limit(Number(limit))
			.sort({ datePosted: -1 });

		// Add `isSaved` and `matchingPoint` attributes to each job
		const formattedJobs = jobs.map((job) => {
			const matchedSkills = userSkills.length > 0 ? job.skills.filter((skill) => userSkills.includes(skill)) : [];
			const unmatchedSkills =
				userSkills.length > 0 ? job.skills.filter((jobSkill) => !userSkills.includes(jobSkill)) : [];
			const matchingPoint = matchedSkills.length;

			return {
				...job.toObject(),
				isSaved: savedJobIds.includes(job._id!.toString()),
				matchedSkills,
				unmatchedSkills,
				matchingPoint,
			};
		});

		// Count total jobs for pagination
		const totalJobs = await Job.countDocuments(filters);

		res.status(200).json({
			jobs: formattedJobs,
			pagination: {
				totalJobs,
				currentPage: Number(page),
				totalPages: Math.ceil(totalJobs / Number(limit)),
			},
		});
	} catch (error: any) {
		console.error("Failed to fetch jobs:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get a job by ID
export const getJobById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.cookies.userId;

	// Validate the ID
	if (!id) {
		res.status(400).json({ error: "Job ID is required." });
		return;
	}

	try {
		// Fetch the job by ID
		const job = await Job.findById(id);

		// Check if the job exists
		if (!job) {
			res.status(404).json({ error: "Job not found." });
			return;
		}

		// Check if the job is saved by the user
		const user = await User.findById(userId);
		const userSkills = user?.skills || [];
		const userSavedJobIds = user?.saveJobIds?.map((id) => id.toString()) || [];
		const isSaved = userSavedJobIds.includes(id);

		// Calculate matchingPoint based on user's skills
		const matchedSkills = userSkills.length > 0 ? job.skills.filter((skill) => userSkills.includes(skill)) : [];
		const unmatchedSkills =
			userSkills.length > 0 ? job.skills.filter((jobSkill) => !userSkills.includes(jobSkill)) : [];
		const matchingPoint = matchedSkills.length;

		// Include the isSaved attribute
		res.status(200).json({
			job: {
				...job.toObject(),
				isSaved,
				matchedSkills,
				unmatchedSkills,
				matchingPoint,
			},
		});
	} catch (error: any) {
		console.error("Failed to fetch job by ID:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get the user's saved jobs list
export const getSavedJobs = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const { page = 1, limit = 10 } = req.query;

	try {
		// Find the user
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Calculate pagination
		const skip = (Number(page) - 1) * Number(limit);

		// Retrieve the saved jobs with the specified fields
		const savedJobs = await Job.find(
			{ _id: { $in: user.saveJobIds } },
			{
				title: 1,
				type: 1,
				level: 1,
				location: 1,
				salary: 1,
				"company.name": 1,
				"company.logo": 1,
				skills: 1,
				datePosted: 1,
			}
		)
			.skip(skip)
			.limit(Number(limit))
			.sort({ datePosted: -1 });

		// Add `isSaved` and `matchingPoint` attribute to each job
		const userSkills = user.skills || [];
		const formattedJobs = savedJobs.map((job) => {
			const matchedSkills = userSkills.length > 0 ? job.skills.filter((skill) => userSkills.includes(skill)) : [];
			const unmatchedSkills =
				userSkills.length > 0 ? job.skills.filter((jobSkill) => !userSkills.includes(jobSkill)) : [];
			const matchingPoint = matchedSkills.length;

			return {
				...job.toObject(),
				isSaved: true,
				matchedSkills,
				unmatchedSkills,
				matchingPoint,
			};
		});

		// Count total saved jobs for pagination
		const totalSavedJobs = await Job.countDocuments({ _id: { $in: user.saveJobIds } });

		res.status(200).json({
			savedJobs: formattedJobs,
			pagination: {
				totalSavedJobs,
				currentPage: Number(page),
				totalPages: Math.ceil(totalSavedJobs / Number(limit)),
			},
		});
	} catch (error: any) {
		console.error("Failed to fetch saved jobs:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Save a job to the user's saved jobs list
export const saveJob = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const { jobId } = req.body;

	// Validate input
	if (!jobId) {
		res.status(400).json({ error: "Job ID is required." });
		return;
	}

	try {
		// Check if the job exists
		const job = await Job.findById(jobId);
		if (!job) {
			res.status(404).json({ error: "Job not found." });
			return;
		}

		// Find the user and update their saved jobs list
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Check if the job is already saved
		if (user.saveJobIds?.includes(jobId)) {
			res.status(400).json({ error: "Job is already saved." });
			return;
		}

		// Save the job
		user.saveJobIds = user.saveJobIds || [];
		user.saveJobIds.push(jobId);
		await user.save();

		res.status(200).json({ message: "Job saved successfully." });
	} catch (error: any) {
		console.error("Failed to save job:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Unsave a job from the user's saved jobs list
export const unsaveJob = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const { jobId } = req.body;

	// Validate input
	if (!jobId) {
		res.status(400).json({ error: "Job ID is required." });
		return;
	}

	try {
		// Find the user
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		// Check if the job is in the saved jobs list
		if (!user.saveJobIds?.includes(jobId)) {
			res.status(400).json({ error: "Job is not in the saved jobs list." });
			return;
		}

		// Remove the job from the saved jobs list
		user.saveJobIds = user.saveJobIds.filter((id) => id.toString() !== jobId);
		await user.save();

		res.status(200).json({ message: "Job unsaved successfully." });
	} catch (error: any) {
		console.error("Failed to unsave job:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get job recommendations for the user
export const getJobRecommendations = async (req: Request, res: Response) => {
	const userId = req.cookies.userId;
	const { page = 1, limit = 10 } = req.query;

	try {
		// Fetch the user
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ error: "User not found." });
			return;
		}

		const { skills = [] } = user;

		// Fetch all jobs
		const jobs = await Job.find(
			{},
			{
				title: 1,
				type: 1,
				level: 1,
				location: 1,
				salary: 1,
				"company.name": 1,
				"company.logo": 1,
				skills: 1,
				datePosted: 1,
			}
		);

		// Check user's saved jobs
		const savedJobIds = user.saveJobIds?.map((id) => id.toString()) || [];

		// Format job recommendations with `matchingPoint`
		const recommendations = jobs.map((job) => {
			const matchedSkills = skills.length > 0 ? job.skills.filter((jobSkill) => skills.includes(jobSkill)) : [];
			const unmatchedSkills =
				skills.length > 0 ? job.skills.filter((jobSkill) => !skills.includes(jobSkill)) : [];
			const matchingPoint = matchedSkills.length;

			return {
				...job.toObject(),
				isSaved: savedJobIds.includes(job._id!.toString()),
				matchedSkills,
				unmatchedSkills,
				matchingPoint,
			};
		});

		// Sort recommendations by `matchingPoint` (descending) and `datePosted` (descending)
		const sortedRecommendations = recommendations.sort((a, b) => {
			if (b.matchingPoint !== a.matchingPoint) {
				return b.matchingPoint - a.matchingPoint;
			}
			return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
		});

		// Apply pagination to sorted recommendations
		const startIndex = (Number(page) - 1) * Number(limit);
		const paginatedRecommendations = sortedRecommendations.slice(startIndex, startIndex + Number(limit));

		res.status(200).json({
			recommendations: paginatedRecommendations,
			pagination: {
				totalJobs: sortedRecommendations.length,
				currentPage: Number(page),
				totalPages: Math.ceil(sortedRecommendations.length / Number(limit)),
			},
		});
	} catch (error: any) {
		console.error("Failed to fetch job recommendations:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get job types
export const getJobTypes = async (req: Request, res: Response) => {
	try {
		const types = ["Full-time", "Part-time", "Remote", "Hybrid"];
		res.status(200).json({ types });
	} catch (error: any) {
		console.error("Failed to fetch job types:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get job levels
export const getJobLevels = async (req: Request, res: Response) => {
	try {
		const levels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Manager", "Director"];
		res.status(200).json({ levels });
	} catch (error: any) {
		console.error("Failed to fetch job levels:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get job industries
export const getJobIndustries = async (req: Request, res: Response) => {
	try {
		// Retrieve distinct industries from the Job collection
		const industries = await Job.distinct("industry");

		// Sort industries alphabetically
		industries.sort((a: string, b: string) => a.localeCompare(b));

		res.status(200).json({ industries });
	} catch (error: any) {
		console.error("Failed to fetch job industries:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// Get job locations
export const getJobLocations = async (req: Request, res: Response) => {
	try {
		// Retrieve distinct locations from the Job collection
		const locations = await Job.distinct("location");

		// Sort locations alphabetically
		locations.sort((a: string, b: string) => a.localeCompare(b));

		res.status(200).json({ locations });
	} catch (error: any) {
		console.error("Failed to fetch job locations:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
