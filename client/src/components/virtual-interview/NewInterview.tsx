import { useGetJobLevels } from "@/hooks/JobHook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCreateInterview } from "@/hooks/InterviewHook";
import { Slider } from "@/components/ui/slider";
import { LoadingIcon } from "../loading-icon";

export default function NewInterview() {
	const { jobLevels, isPendingJobLevels } = useGetJobLevels();
	const { createInterview, isPendingCreate } = useCreateInterview();
	const [interviewInfo, setInterviewInfo] = useState({
		jobTitle: "",
		jobLevel: "",
		jobDescription: "",
		numQuestions: 5
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createInterview(interviewInfo);
	};

	if (isPendingCreate) {
		return (
			<div className="h-[30rem] flex flex-col gap-5 items-center justify-center">
				<LoadingIcon size={"size-20"} />
				<p>Generating your interview...</p>
			</div>
		);
	}

	return (
		<>
			<div className="flex gap-3 p-10 pt-0">
				<div className="w-6/12 flex flex-col mt-10">
					<div className="mr-12 text-start">
						<h1 className="text-xl font-bold">
							Create a new virtual interview
						</h1>
						<p className="text-base text-slate-500">
							Create a new virtual interview and start practicing for your dream
							job. You can select the job level and number of questions you want
							to practice.
						</p>
					</div>

					<img
						src="/image/new-interview.png"
						className="w-[400px] m-auto"
						alt="new roadmap"
					/>
				</div>
				<form onSubmit={onSubmit} className="flex-1 mt-12 flex flex-col gap-7">
					<div className="grid w-full max-w-lg items-center gap-1.5">
						<Label htmlFor="job" className="mb-2 font-semibold text-start">
							Job title
						</Label>
						<Input
							type="text"
							id="job"
							value={interviewInfo.jobTitle}
							onChange={(e) =>
								setInterviewInfo({
									...interviewInfo,
									jobTitle: e.target.value
								})
							}
							placeholder="Enter you dream job..."
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="level" className="mb-2 font-semibold text-start">
							Job level
						</Label>
						<Select
							value={interviewInfo.jobLevel}
							onValueChange={(value) =>
								setInterviewInfo({
									...interviewInfo,
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

					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="numberofquestions"
							className="mb-2 font-semibold text-start"
						>
							Number of Questions: {interviewInfo.numQuestions}
						</Label>
						<Slider
							defaultValue={[5]}
							max={10}
							step={1}
							className="max-w-lg"
							onChange={(e) =>
								setInterviewInfo({
									...interviewInfo,
									// @ts-expect-error - slider value is an array
									numQuestions: e.target.value
								})
							}
						/>
					</div>

					<div className="grid w-full max-w-lg items-center gap-1.5">
						<Label htmlFor="message" className="mb-2 font-semibold text-start">
							Job description
						</Label>
						<Textarea
							rows={10}
							placeholder="Provide your job description here..."
							value={interviewInfo.jobDescription}
							onChange={(e) =>
								setInterviewInfo({
									...interviewInfo,
									jobDescription: e.target.value
								})
							}
							id="message"
						/>
					</div>

					<Button className="w-full max-w-lg">Create interview</Button>
				</form>
			</div>
		</>
	);
}
