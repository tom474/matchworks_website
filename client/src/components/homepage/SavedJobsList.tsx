import { useState } from "react";
import SavedJobCard from "./SavedJobCard";
import { useGetSavedJobs } from "@/hooks/JobHook";
import JobDetailModal from "./JobDetailModal";

function SavedJobsList() {
	const { savedJobs, isPendingSavedJobs } = useGetSavedJobs();
	const [selectedJob, setSelectedJob] = useState<string | null>(null);

	const toggleOpen = (id: string) => {
		setSelectedJob((prev) => {
			if (prev === id) {
				return null;
			}
			return id;
		});
	};

	if (isPendingSavedJobs) {
		return <p>Loading...</p>;
	}

	if (savedJobs && savedJobs.length === 0) {
		return (
			<div className="flex justify-center mt-5">
				<p>No saved jobs. You can add any job you like to this list</p>
			</div>
		);
	}
	return (
		<>
			<div className="flex flex-row flex-wrap gap-3">
				{savedJobs &&
					savedJobs.length > 0 &&
					savedJobs.map((job) => (
						<SavedJobCard
							key={job._id}
							job={job}
							onOpenDetail={toggleOpen}
						/>
					))}
			</div>
			{selectedJob && (
				<JobDetailModal
					jobId={selectedJob}
					open={selectedJob !== null}
					setIsOpen={toggleOpen}
				/>
			)}
		</>
	);
}
export default SavedJobsList;
