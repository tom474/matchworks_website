import { CircleCheck, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useAddSkill } from "@/hooks/ProfileHooks";

interface UnmatchSkillItemModalProps {
	skill: string;
	jobId: string;
}

function UnmatchSkillItemModal({ skill, jobId }: UnmatchSkillItemModalProps) {
	const { mutateAddSkill, isPendingAddSkill } = useAddSkill(jobId);

	return (
		<div className="flex items-center justify-between mt-3">
			<div className="flex gap-2 items-center">
				<CircleCheck size={20} className="text-slate-500" />
				<p className="text-[16px] font-normal">{skill}</p>
			</div>

			<Button
				disabled={isPendingAddSkill}
				onClick={() => {
					mutateAddSkill(skill);
				}}
				variant={"outline"}
			>
				{isPendingAddSkill ? (
					"Adding skill..."
				) : (
					<>
						<Plus />
						Add skill
					</>
				)}
			</Button>
		</div>
	);
}

export default UnmatchSkillItemModal;
