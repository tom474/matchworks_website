import { CircleCheck, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import UnmatchSkillItemModal from "./UnmatchSkillItemModal";
import Job from "@/model/Job";

interface SkillsModalProps {
	job: Job;
	open: boolean;
	setIsOpen: () => void;
}

function SkillsModal({ open, setIsOpen, job }: SkillsModalProps) {
	return (
		<Dialog open={open} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-[700px] shadow-lg p-6 rounded-md mt-5 ">
				<DialogTitle className="font-semibold">
					Qualification details
				</DialogTitle>
				<Separator />
				<button
					onClick={setIsOpen}
					className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 text-gray-600 focus:border-none focus-visible:border-none"
					aria-label="Close"
				>
					<X size={16} />
				</button>
				<div>
					<h3 className="font-semibold">
						Skills associated with the job
					</h3>
					<p className="text-[14px] text-slate-600">
						{job?.matchedSkills?.length || 0} skills found on your
						profile match the skills associated with the job.
					</p>

					{job?.matchedSkills?.map((skill, index) => (
						<div key={index} className="flex gap-2 mt-5">
							<CircleCheck
								size={20}
								className="text-green-600 mt-1"
							/>
							<p className="text-[16px] font-normal">{skill}</p>
						</div>
					))}

					{job?.unmatchedSkills?.map((skill, index) => (
						<UnmatchSkillItemModal
							key={index}
							jobId={job._id}
							skill={skill}
						/>
					))}
				</div>
				<Separator />
				<div className="flex justify-end">
					<Button onClick={setIsOpen} variant={"default"}>
						Done
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default SkillsModal;
