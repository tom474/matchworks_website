import { useGetJobRecommendation } from "@/hooks/JobHook";
import JobCard from "./JobCard";
import JobDetail from "./JobDetail";
import { useEffect, useMemo, useState } from "react";
import Job from "@/model/Job";
import { useInView } from "react-intersection-observer";
import ClipLoader from "react-spinners/ClipLoader";

function JobRecommendation() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetJobRecommendation();

	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<string | null>(null);

	const { ref, inView } = useInView({
		rootMargin: "100px",
		threshold: 0.1
	});

	const allJobs = useMemo(
		() => (data?.pages ? data.pages.flatMap((page) => page.jobs) : []),
		[data]
	);

	useEffect(() => {
		setJobs(allJobs);
		if (!selectedJob && allJobs.length > 0) {
			setSelectedJob(allJobs[0]._id);
		}
	}, [allJobs, selectedJob]);

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			console.log("Fetching next page...");
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleSelectJob = (job: Job) => {
		setSelectedJob(job._id);
	};

	if (jobs.length === 0 && !isFetchingNextPage) {
		return <p>No job recommendations available.</p>;
	}

	return (
		<div>
			<div className="w-full flex gap-1 relative">
				<div className="flex flex-col w-5/12 gap-2">
					{jobs.map((job) => (
						<JobCard
							key={job._id}
							job={job}
							isSelected={selectedJob === job._id}
							onSelect={handleSelectJob}
						/>
					))}
					{hasNextPage && (
						<div ref={ref} className="h-10">
							{isFetchingNextPage && (
								<ClipLoader
									size={15}
									aria-label="Loading Spinner"
									data-testid="loader"
								/>
							)}
						</div>
					)}
				</div>
				<div className="w-7/12 ml-1">
					<div className="sticky top-20 h-[100vh] overflow-auto">
						{selectedJob && <JobDetail jobId={selectedJob} />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default JobRecommendation;
