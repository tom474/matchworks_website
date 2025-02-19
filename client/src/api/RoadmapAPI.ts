import Roadmap from "@/model/Roadmap";
import { axiosInstance } from "@/utils";

export interface RoadmapCreateRequest {
	jobTitle: string;
	jobLevel: string;
	jobDescription: string;
}

export const getRoadmapById = async (roadmapId: string) => {
	const response = await axiosInstance.get(`/roadmaps/${roadmapId}`);

	return response.data.roadmap as Roadmap;
};

export const createRoadmap = async ({
	jobTitle,
	jobLevel,
	jobDescription
}: RoadmapCreateRequest) => {
	const response = await axiosInstance.post("/roadmaps", {
		jobTitle,
		jobLevel,
		jobDescription
	});

	return response.data.roadmap as Roadmap;
};

interface ChecklistUpdateRequest {
	roadmapId: string;
	checklistId: string;
	isCompleted: boolean;
}

export const updateChecklistRoadmap = async ({
	roadmapId,
	checklistId,
	isCompleted
}: ChecklistUpdateRequest) => {
	const response = await axiosInstance.patch(`/roadmaps/${roadmapId}`, {
		checklistId,
		isCompleted
	});

	return response.data.roadmap as Roadmap;
};

interface RoadmapDeleteRequest {
	roadmapId: string;
	onSuccess: () => void;
}

export const deleteRoadmap = async ({
	roadmapId,
	onSuccess
}: RoadmapDeleteRequest) => {
	const response = await axiosInstance.delete(`/roadmaps/${roadmapId}`);

	if (response.status >= 200) {
		onSuccess();
	}
	return response.status;
};
