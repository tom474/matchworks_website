import { X } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import JobDetail from "./JobDetail";
import { DialogTitle } from "@radix-ui/react-dialog";

interface JobDetailModalProps {
	jobId: string;
	open: boolean;
	setIsOpen: (id: string) => void;
}

function JobDetailModal({ jobId, open, setIsOpen }: JobDetailModalProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setIsOpen(jobId);
			}}
		>
			<DialogContent className="max-w-[700px] shadow-lg p-6 rounded-md mt-5 ">
				<DialogTitle className="font-semibold">Job Detail</DialogTitle>
				<button
					onClick={() => {
						setIsOpen("");
					}}
					className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 text-gray-600 focus:border-none focus-visible:border-none"
					aria-label="Close"
				>
					<X size={16} />
				</button>
				{/* Content */}
				<div>
					<JobDetail jobId={jobId} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default JobDetailModal;
