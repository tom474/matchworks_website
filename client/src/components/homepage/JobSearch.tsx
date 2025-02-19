import { useGetJobs } from "@/hooks/JobHook";
import JobCard from "./JobCard";
import JobDetail from "./JobDetail";
import { useEffect, useState } from "react";
import Job from "@/model/Job";
import { useInView } from "react-intersection-observer";
import ClipLoader from "react-spinners/ClipLoader";

interface JobSearchProps {
	query?: string;
	level?: string;
	workType?: string;
	city?: string;
	industry?: string;
}

function JobSearch({ query, city, level, workType, industry }: JobSearchProps) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetJobs(
		{
			search: query,
			level: level,
			type: workType,
			location: city,
			industry: industry
		}
	);

	const [jobs, setJobs] = useState<Job[]>([]);
	const [selectedJob, setSelectedJob] = useState<string | null>(null);

	const { ref, inView } = useInView({
		rootMargin: "100px", // Trigger fetch 100px before reaching the end
		threshold: 0.1
	});

	useEffect(() => {
		if (data?.pages) {
			const allJobs = data.pages.flatMap((page) => page.jobs);
			setJobs(allJobs);

			if (!selectedJob && allJobs.length > 0) {
				setSelectedJob(allJobs[0]._id);
			}
		}
	}, [data, selectedJob]);

	// Trigger fetching the next page when `inView` becomes true
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleSelectJob = (job: Job) => {
		setSelectedJob(job._id);
	};

	if (jobs.length === 0) {
		return (
			<div>
				<h1 className="text-2xl font-bold">No Jobs Found</h1>
			</div>
		);
	}

	return (
		<div>
			<div className="w-full flex gap-1 relative">
				{/* Job List Section */}
				<div className="flex flex-col w-5/12 gap-2">
					{jobs.map((job) => (
						<JobCard
							key={job._id}
							job={job}
							isSelected={selectedJob === job._id}
							onSelect={handleSelectJob}
						/>
					))}

					{/* Invisible div to trigger the next page fetch */}
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

				{/* Job Detail Section */}
				<div className="w-7/12 ml-1">
					<div className="sticky top-20 h-[100vh] overflow-auto">
						{selectedJob && <JobDetail jobId={selectedJob} />}
					</div>
				</div>
			</div>
		</div>
	);
}

export default JobSearch;
