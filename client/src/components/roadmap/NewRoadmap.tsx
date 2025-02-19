import { useGetJobLevels } from "@/hooks/JobHook";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useCreateRoadmap } from "@/hooks/RoadmapHook";
import { LoadingIcon } from "../loading-icon";

function NewRoadmap() {
	const { jobLevels, isPendingJobLevels } = useGetJobLevels();
	const { createRoadmap, isPendingCreateRoad } = useCreateRoadmap();
	const [roadmapInfo, setRoadmapInfo] = useState({
		jobTitle: "",
		jobLevel: "",
		jobDescription: ""
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		createRoadmap(roadmapInfo);
	};

	if (isPendingCreateRoad) {
		return (
			<div className="h-[30rem] flex flex-col gap-5 items-center justify-center">
				<LoadingIcon size={"size-20"} />
				<p>Generating your roadmap...</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex gap-3">
				<div className="ml-4 w-6/12 flex flex-col mt-12">
					<div className="mr-12">
						<h1 className="text-xl font-bold">Create a new roadmap</h1>
						<p className="text-base text-slate-500">
							Plan your journey, set goals, and track your progress with ease.
							Turn your vision into actionable steps and achieve success one
							milestone at a time.
						</p>
					</div>

					<img
						src="/image/new-roadmap.png"
						className="w-[400px] m-auto"
						alt="new roadmap"
					/>
				</div>
				<form onSubmit={onSubmit} className="flex-1 mt-12 flex flex-col gap-7">
					<div className="grid w-full max-w-lg items-center gap-1.5">
						<Label htmlFor="job" className="mb-2 font-semibold">
							Job title
						</Label>
						<Input
							type="text"
							id="job"
							value={roadmapInfo.jobTitle}
							onChange={(e) =>
								setRoadmapInfo({
									...roadmapInfo,
									jobTitle: e.target.value
								})
							}
							placeholder="Enter you dream job..."
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="level" className="mb-2 font-semibold">
							Job level
						</Label>
						<Select
							value={roadmapInfo.jobLevel}
							onValueChange={(value) =>
								setRoadmapInfo({
									...roadmapInfo,
									jobLevel: value
								})
							}
							name="level"
						>
							<SelectTrigger className=" max-w-lg">
								<SelectValue placeholder="Select a level" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Level</SelectLabel>
									{!isPendingJobLevels &&
										jobLevels &&
										jobLevels.map((level) => (
											<SelectItem key={level} value={level}>
												{level}
											</SelectItem>
										))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="grid w-full max-w-lg items-center gap-1.5">
						<Label htmlFor="message" className="mb-2 font-semibold">
							Job description
						</Label>
						<Textarea
							rows={10}
							placeholder="Provide your job description here..."
							value={roadmapInfo.jobDescription}
							onChange={(e) =>
								setRoadmapInfo({
									...roadmapInfo,
									jobDescription: e.target.value
								})
							}
							id="message"
						/>
					</div>

					<Button className="w-full max-w-lg">Create roadmap</Button>
				</form>
			</div>
		</>
	);
}

export default NewRoadmap;
