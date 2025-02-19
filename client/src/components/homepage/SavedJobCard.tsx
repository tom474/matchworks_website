import Job from "@/model/Job";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger
} from "../ui/context-menu";
import JobCard from "./JobCard";
import { useUnSaveJob } from "@/hooks/JobHook";

interface SavedJobCardProps {
	job: Job;
	onOpenDetail: (id: string) => void;
}

function SavedJobCard({ onOpenDetail, job }: SavedJobCardProps) {
	const { unSaveJob, isPendingUnSaveJob } = useUnSaveJob(job._id);

	return (
		<ContextMenu>
			<ContextMenuTrigger
				onClick={() => {
					onOpenDetail(job._id);
				}}
				className="flex w-[32%]  items-center justify-center rounded-md border border-dashed text-sm"
			>
				<div className="w-full h-full">
					<JobCard job={job} mode="save" />
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				<ContextMenuItem
					inset
					onClick={() => {
						unSaveJob(job._id);
					}}
					disabled={isPendingUnSaveJob}
				>
					Remove from favourite
				</ContextMenuItem>
				<ContextMenuItem
					inset
					onClick={() => {
						onOpenDetail(job._id);
					}}
				>
					View Details
				</ContextMenuItem>
				<ContextMenuItem inset>Apply Now</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export default SavedJobCard;
