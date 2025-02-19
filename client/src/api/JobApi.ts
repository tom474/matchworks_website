import Job, { Company } from "@/model/Job";
import { axiosInstance } from "@/utils";

export interface JobWithPagination {
	jobs: Job[];
	total: number;
	currentPage: number;
	totalPages: number;
}

export interface JobSearchQuery {
	search?: string;
	type?: string;
	level?: string;
	industry?: string;
	location?: string;
	page?: number;
}

export const getJobs = async ({
	search,
	type,
	level,
	industry,
	location,
	page
}: JobSearchQuery) => {
	const response = await axiosInstance.get(
		`/jobs?search=${search}&type=${type}&level=${level}&industry=${industry}&location=${location}&page=${page}&limit=5`
	);

	const jobs: Job[] = response.data.jobs.map((data: Job) => toJob(data));
	return {
		jobs,
		total: response.data.pagination.totalJobs,
		currentPage: response.data.pagination.currentPage,
		totalPages: response.data.pagination.totalPages
	} as JobWithPagination;
};

export const getJobRecommendation = async (page: number) => {
	const response = await axiosInstance.get(
		`/jobs/recommendations?page=${page}&limit=5`
	);

	const jobs: Job[] = response.data.recommendations.map((data: Job) =>
		toJob(data)
	);
	return {
		jobs,
		total: response.data.pagination.totalJobs,
		currentPage: response.data.pagination.currentPage,
		totalPages: response.data.pagination.totalPages
	} as JobWithPagination;
};

export const getJobById = async (id: string) => {
	const response = await axiosInstance.get(`/jobs/${id}`);
	return toJob(response.data.job);
};

export const getSavedJobs = async () => {
	const response = await axiosInstance.get("/jobs/saved?page=1&limit=100");
	const jobs: Job[] = response.data.savedJobs.map((data: Job) => toJob(data));
	return jobs;
};

export const saveJob = async (id: string) => {
	await axiosInstance.post(`/jobs/save`, {
		jobId: id
	});
};

export const unSaveJob = async (id: string) => {
	await axiosInstance.post(`/jobs/unsave`, {
		jobId: id
	});
};

export const getJobLevels = async () => {
	const response = await axiosInstance.get("/jobs/levels");
	return response.data.levels as string[];
};

export const getJobTypes = async () => {
	const response = await axiosInstance.get("/jobs/types");
	return response.data.types as string[];
};

export const getJobLocations = async () => {
	const response = await axiosInstance.get("/jobs/locations");
	return response.data.locations as string[];
};

export const getJobIndustries = async () => {
	const response = await axiosInstance.get("/jobs/industries");
	return response.data.industries as string[];
};

const toJob = (data: Job): Job => {
	if (!data) {
		throw new Error("Invalid data: Data is null or undefined.");
	}

	const company: Company = {
		name: data.company?.name || "Unknown Company",
		description: data.company?.description || "No description provided",
		logo: data.company?.logo || "default-logo.png", // Provide a default logo if none is given
		url: data.company?.url || "",
		location: data.company?.location || "Unknown Location"
	};

	const job = new Job(
		data._id,
		company,
		data.title,
		data.type,
		data.level,
		data.description,
		data.location,
		data.salary,
		data.url,
		data.contactEmail,
		data.skills || [],
		new Date(data.datePosted),
		new Date(data.createdAt),
		new Date(data.updatedAt),
		data.isSaved,
		data.matchedSkills || [],
		data.unmatchedSkills || [],
		data.matchingPoint
	);

	return job;
};
