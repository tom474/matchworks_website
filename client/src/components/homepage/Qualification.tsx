import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Job from "@/model/Job";

interface QualificationProps {
	job: Job;
	setIsOpen: (state: boolean) => void;
}

function Qualification({ job, setIsOpen }: QualificationProps) {
	return (
		<Card className="mt-2">
			<CardHeader className="text-start flex flex-row gap-2 px-6 pt-6 pb-2">
				<div>
					<CardTitle className="text-[22px] transition-colors duration-300 group-hover:text-blue-300">
						Qualifications
					</CardTitle>
					<CardDescription>
						Your profile is missing skills. Update your profile to
						stand out to the employer.
					</CardDescription>
				</div>
			</CardHeader>
			<Separator className="mt-3" />

			<CardContent className="text-start p-6">
				<h3 className="font-semibold">
					Skills associated with the job post
				</h3>
				<CardDescription className="text-xs">
					<p>Identify by MatchWorks.</p>
				</CardDescription>

				<div className="flex gap-2 mt-3 items-start">
					<CircleCheck size={16} className="text-green-600 mt-1" />
					<p className="font-semibold text-[14px]">
						{job.matchedSkills?.length} skills on your profile
						<div
							className="w-full flex gap-1 flex-wrap"
							style={{
								textOverflow: "ellipsis",
								maxWidth: "100%"
							}}
						>
							{job.matchedSkills &&
								job.matchedSkills.map((skill, index) => (
									<span
										key={index}
										className="text-[14px] font-normal"
									>
										{skill}
										{job.matchedSkills &&
											index !==
												job.matchedSkills.length - 1 &&
											","}
									</span>
								))}
						</div>
					</p>
				</div>

				<div className="flex gap-2 mt-3 items-start">
					<CircleX size={16} className="text-red-600 mt-1" />
					<p className="font-semibold text-[14px]">
						{job.unmatchedSkills?.length} skills missing on your
						profile
						<div
							className="w-full flex gap-1 flex-wrap"
							style={{
								textOverflow: "ellipsis",
								maxWidth: "100%"
							}}
						>
							{job.unmatchedSkills &&
								job.unmatchedSkills.map((skill, index) => (
									<span
										key={index}
										className="text-[14px] font-normal"
									>
										{skill}
										{job.unmatchedSkills &&
											index !==
												job.unmatchedSkills.length -
													1 &&
											","}
									</span>
								))}
						</div>
					</p>
				</div>

				<Button
					onClick={() => {
						setIsOpen(true);
					}}
					className="mt-4 bg-transparent text-slate-500 border-slate-500 hover:bg-transparent hover:border-"
				>
					Add skills to your profile
					<ArrowRight size={16} />
				</Button>
			</CardContent>
		</Card>
	);
}

export default Qualification;
