import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import {
	CalendarDays,
	CheckCheck,
	CircleDollarSign,
	MapPin
} from "lucide-react";
import { Separator } from "../ui/separator";
import Job from "@/model/Job";
import { dateFormatter } from "@/utils";

interface JobCardProps {
	job: Job;
	isSelected?: boolean;
	onSelect?: (job: Job) => void;
	mode?: "home" | "save";
}

function JobCard({
	job,
	isSelected = false,
	mode = "home",
	onSelect
}: JobCardProps) {
	return (
		<Card
			onClick={mode == "home" ? () => onSelect?.(job) : undefined}
			className={`group cursor-pointer p-3 transition-all duration-300 ${
				mode == "save" && "h-full"
			} ${isSelected && "border-blue-500"}`}
		>
			<CardHeader className="text-start p-1 pb-3">
				<CardDescription className="flex justify-between">
					<p>Posted {dateFormatter(job.datePosted)}</p>
				</CardDescription>
				<CardTitle
					className={`text-xl transition-colors duration-300 group-hover:text-blue-300 ${
						isSelected && "text-blue-300"
					}`}
				>
					{job.title}
				</CardTitle>
				{job.company.logo && (
					<CardDescription className="flex items-center gap-2 ">
						<img
							src={job.company.logo}
							className="w-12 h-12 border-gray-200 border-solid border-[1px] rounded-sm object-contain"
						/>
						<p>{job.company.name}</p>
					</CardDescription>
				)}

				<CardDescription
					style={{
						marginTop: "10px"
					}}
					className="flex items-center gap-1 text-green-400 text-base font-semibold "
				>
					<CircleDollarSign size={20} />
					<p className="text-base">{job.salary}</p>
				</CardDescription>
			</CardHeader>

			<Separator />

			<CardContent className="text-start p-1 pb-3 mt-2">
				<CardDescription className="flex gap-1 items-center mb-2">
					<CalendarDays size={16} />
					<p>{job.type}</p>
				</CardDescription>
				<CardDescription
					className={`flex gap-1 items-center ${mode == "home" && "mb-2"}`}
				>
					<MapPin size={16} />
					<p>{job.location}</p>
				</CardDescription>

				{mode == "home" && (
					<CardDescription className="flex gap-1 items-center mb-3">
						<CheckCheck size={16} />
						<p>
							<span className="text-green-400">
								{job.matchedSkills?.length} / {job.skills?.length}
							</span>{" "}
							skills matched
						</p>
					</CardDescription>
				)}

				<div className="flex gap-2 mt-2">
					{job.skills.slice(0, 4).map((skill, index) => (
						<Badge key={index} variant={"secondary"}>
							{skill}
						</Badge>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default JobCard;
