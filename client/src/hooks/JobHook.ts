import {
	getJobById,
	getJobIndustries,
	getJobLevels,
	getJobLocations,
	getJobRecommendation,
	getJobs,
	getJobTypes,
	getSavedJobs,
	JobSearchQuery,
	saveJob,
	unSaveJob
} from "@/api/JobApi";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { queryClient } from "@/utils";

export const useGetJobs = ({
	search,
	type,
	level,
	industry,
	location
}: JobSearchQuery) => {
	const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery({
			queryKey: ["jobs", { search, type, level, industry, location }],
			queryFn: ({ pageParam = 1 }) =>
				getJobs({
					search,
					type,
					level,
					industry,
					location,
					page: pageParam
				}),
			getNextPageParam: (lastPage) => {
				const nextPage =
					lastPage.currentPage < lastPage.totalPages
						? lastPage.currentPage + 1
						: undefined;

				return nextPage;
			},
			initialPageParam: 1
		});

	return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
};

export const useGetJobRecommendation = () => {
	const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["jobRecommendation"],
			queryFn: ({ pageParam = 1 }) => getJobRecommendation(pageParam),
			getNextPageParam: (lastPage) => {
				const nextPage =
					lastPage.currentPage < lastPage.totalPages
						? lastPage.currentPage + 1
						: undefined;

				return nextPage;
			},
			initialPageParam: 1
		});

	return { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage };
};

export const useGetSavedJobs = () => {
	const { data, isPending } = useQuery({
		queryKey: ["savedJobs"],
		queryFn: () => getSavedJobs()
	});

	return { savedJobs: data, isPendingSavedJobs: isPending };
};

export const useSaveJob = (id: string) => {
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationFn: saveJob,
		onSuccess: () => {
			toast({
				title: "Job saved!",
				description: "You have successfully saved the job."
			});

			queryClient.invalidateQueries({
				queryKey: ["job", id]
			});

			console.log("Job saved successfully.");
		},
		onError: () => {
			toast({
				title: "Failed to save job",
				description: "Please try again later.",
				variant: "destructive"
			});
			console.error("Failed to save job.");
		}
	});

	return { saveJob: mutate, isPendingSaveJob: isPending };
};

export const useUnSaveJob = (id: string) => {
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationFn: unSaveJob,
		onSuccess: () => {
			toast({
				title: "Job unsaved!",
				description: "You have successfully unsaved the job."
			});

			queryClient.invalidateQueries({
				queryKey: ["job", id]
			});

			queryClient.invalidateQueries({
				queryKey: ["savedJobs"]
			});

			console.log("Job unsaved successfully.");
		},
		onError: () => {
			toast({
				title: "Failed to un save this job",
				description: "Please try again later.",
				variant: "destructive"
			});
		}
	});

	return { unSaveJob: mutate, isPendingUnSaveJob: isPending };
};

export const useGetJobById = (id: string) => {
	const { data, isPending } = useQuery({
		queryKey: ["job", id],
		queryFn: () => getJobById(id)
	});

	return { job: data, isPendingJob: isPending };
};

export const useGetJobLevels = () => {
	const { data, isPending } = useQuery({
		queryKey: ["jobLevels"],
		queryFn: () => getJobLevels()
	});

	return { jobLevels: data, isPendingJobLevels: isPending };
};

export const useGetJobTypes = () => {
	const { data, isPending } = useQuery({
		queryKey: ["jobTypes"],
		queryFn: () => getJobTypes()
	});

	return { jobTypes: data, isPendingJobTypes: isPending };
};

export const useGetLocations = () => {
	const { data, isPending } = useQuery({
		queryKey: ["jobLocations"],
		queryFn: () => getJobLocations()
	});

	return { locations: data, isPendingLocations: isPending };
};

export const useGetJobIndustries = () => {
	const { data, isPending } = useQuery({
		queryKey: ["jobIndustries"],
		queryFn: () => getJobIndustries()
	});

	return { industries: data, isPendingIndustries: isPending };
};
