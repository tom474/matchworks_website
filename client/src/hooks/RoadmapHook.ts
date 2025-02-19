import {
	createRoadmap,
	deleteRoadmap,
	getRoadmapById,
	updateChecklistRoadmap
} from "@/api/RoadmapAPI";
import { useRoadmapContext } from "@/context/RoadmapContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import Roadmap from "@/model/Roadmap";
import { queryClient } from "@/utils";

export const useGetRoadmapById = (roadmapId: string) => {
	const { data, isPending } = useQuery({
		queryKey: ["roadmap", roadmapId],
		queryFn: () => getRoadmapById(roadmapId),
		enabled: !!roadmapId
	});

	return {
		roadmap: data,
		isPendingRoadmap: isPending
	};
};

export const useUpdateChecklist = (roadmapId: string) => {
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationFn: updateChecklistRoadmap,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["roadmap", roadmapId]
			});
			toast({
				title: "Checklist updated!",
				description: "Keep up the good work!"
			});
		},
		onError: () => {
			toast({
				title: "Failed to update checklist",
				description: "Please try again later.",
				variant: "destructive"
			});
		}
	});

	return {
		updateChecklist: mutate,
		isPendingUpdateChecklist: isPending
	};
};

export const useCreateRoadmap = () => {
	const { setSelectedRoadmap } = useRoadmapContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	const { mutate, isPending } = useMutation({
		mutationFn: createRoadmap,
		onSuccess: (data: Roadmap) => {
			console.log("Roadmap created:", data);

			setSelectedRoadmap(data._id);

			toast({
				title: "Roadmap created!",
				description: "You have successfully created a roadmap."
			});

			navigate(`/roadmap-generator/${data._id}/roadmap`);
		},
		onError: (error) => {
			console.error("Failed to create roadmap:", error);

			toast({
				title: "Failed to create roadmap",
				description: "Please try again later.",
				variant: "destructive"
			});
		}
	});

	return {
		createRoadmap: mutate,
		isPendingCreateRoad: isPending
	};
};

export const useDeleteRoadmap = () => {
	const { toast } = useToast();
	const { mutate, isPending } = useMutation({
		mutationFn: deleteRoadmap,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["roadmap"]
			});

			queryClient.invalidateQueries({
				queryKey: ["user_data"]
			});

			toast({
				title: "Roadmap deleted!",
				description: "You have successfully deleted the roadmap."
			});
		},
		onError: () => {
			toast({
				title: "Failed to delete roadmap",
				description: "Please try again later.",
				variant: "destructive"
			});
		}
	});

	return {
		deleteRoadmap: mutate,
		isPendingDeleteRoadmap: isPending
	};
};
