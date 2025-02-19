import {
	CalendarDays,
	CircleDollarSign,
	Clock,
	Heart,
	MapPin
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@radix-ui/react-tooltip";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { dateFormat } from "@/utils";
import { Markdown } from "../Markdown";
import { useState } from "react";
import SkillsModal from "./SkillsModal";
import Qualification from "./Qualification";
import CompanyInfo from "./CompanyInfo";
import { useGetJobById, useSaveJob, useUnSaveJob } from "@/hooks/JobHook";
import ClipLoader from "react-spinners/ClipLoader";

interface JobDetailProps {
	jobId: string;
}

function JobDetail({ jobId }: JobDetailProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { job, isPendingJob } = useGetJobById(jobId);
	const { saveJob, isPendingSaveJob } = useSaveJob(jobId);
	const { unSaveJob, isPendingUnSaveJob } = useUnSaveJob(jobId);
	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	if (isPendingJob) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Card className="h-[calc(100vh-85px)] flex flex-col">
				<div className="sticky top-0  z-10">
					<CardHeader className="text-start flex flex-row gap-2 px-6 pt-6 pb-2">
						{job && job.company.logo && (
							<img
								src={job.company.logo}
								className="mt-2 w-[100px] h-[100px] border-[1px] border-gray-200 rounded-md object-contain"
							/>
						)}

						<div>
							<CardTitle className="text-[22px] transition-colors duration-300 group-hover:text-blue-300">
								{job && job.title}
							</CardTitle>
							<CardDescription>{job && job.company.name}</CardDescription>
							<CardDescription
								style={{
									marginTop: "20px"
								}}
								className="flex items-center gap-1 text-green-400 text-base font-semibold "
							>
								<CircleDollarSign size={20} />
								<p className="text-base">{job && job.salary}</p>
							</CardDescription>
						</div>
					</CardHeader>
					<CardDescription>
						<div className="flex gap-2 mx-6 mb-4">
							<Button
								onClick={() => {
									window.open(job && job.url, "_blank");
								}}
								className="w-full bg-blue-600 hover:bg-blue-400 border-none transition-all duration-300"
							>
								Apply Now
							</Button>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											onClick={() => {
												if (job?.isSaved === false) {
													saveJob(jobId);
												} else {
													console.log("unsave");
													unSaveJob(jobId);
												}
											}}
											variant={"outline"}
											className={`group hover:border-red-400 transition-all duration-300 ${
												job &&
												job.isSaved &&
												"bg-red-500 text-white border-red-600"
											}`}
										>
											{isPendingSaveJob ? (
												<ClipLoader loading={true} size={15} />
											) : isPendingUnSaveJob ? (
												<ClipLoader loading={true} size={15} />
											) : (
												<Heart className="group-hover:text-red-400 transition-all duration-300" />
											)}
										</Button>
									</TooltipTrigger>

									<TooltipContent>
										<Badge className="mb-3">
											{job && job.isSaved
												? "Remove from favourite"
												: "Add to favourite"}
										</Badge>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</CardDescription>
					<Separator />
				</div>

				{/* Scrollable Content Section */}
				<CardContent className="flex-1 overflow-y-auto custom-scrollbar">
					<div className="flex flex-col gap-4 mt-3">
						<CardDescription className="flex gap-1 items-center">
							<MapPin size={16} />
							<p>{job && job.location}</p>
						</CardDescription>
						<CardDescription className="flex gap-1 items-center">
							<CalendarDays size={16} />
							<p>{job && job.type}</p>
						</CardDescription>
						<CardDescription className="flex gap-1 items-center">
							<Clock size={16} />
							<p>
								{job && job.datePosted ? dateFormat(job.datePosted) : "N/A"}
							</p>
						</CardDescription>
						<div className="flex items-center gap-2 flex-wrap">
							<p>Skills: </p>
							{job &&
								job.skills.map((skill, index) => (
									<Badge key={index} variant={"secondary"}>
										{skill}
									</Badge>
								))}
						</div>
					</div>
					<Separator className="mt-3" />

					<Markdown>{job && job.description}</Markdown>

					{job && <Qualification job={job} setIsOpen={setIsOpen} />}

					{job && job.company && <CompanyInfo company={job.company} />}
				</CardContent>
			</Card>
			{job && <SkillsModal open={isOpen} setIsOpen={toggleOpen} job={job} />}
		</>
	);
}

export default JobDetail;
