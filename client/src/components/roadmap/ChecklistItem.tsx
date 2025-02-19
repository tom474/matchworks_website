import { Check, Dot } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "../ui/accordion";
import { Button } from "../ui/button";
import { useUpdateChecklist } from "@/hooks/RoadmapHook";

interface ChecklistItemProps {
	index: number;
	item: {
		_id: string;
		skill: string;
		description: string;
		knowledge: string[];
		resources: string[];
		isCompleted: boolean;
	};
	isUpdate: boolean;
	roadmapId: string;
}

const ChecklistItem = ({
	index,
	item,
	isUpdate,
	roadmapId
}: ChecklistItemProps) => {
	const { updateChecklist } = useUpdateChecklist(roadmapId);

	const handleUpdateChecklist = () => {
		updateChecklist({
			roadmapId: roadmapId!,
			checklistId: item._id,
			isCompleted: !item.isCompleted
		});
	};

	return (
		<>
			<Accordion type="single" collapsible className="w-full relative">
				<AccordionItem value={"item" + index}>
					<AccordionTrigger className="bg-transparent border-none border-bottom">
						<div className="flex items-center gap-2 ">
							<label
								className={`${
									isUpdate ? "ml-6" : "ml-0"
								} flex gap-2 cursor-pointer transition-all duration-200`}
							>
								<span>{item.skill}</span>{" "}
								{item.isCompleted && (
									<Check
										size={20}
										className="text-green-500"
									/>
								)}
							</label>
						</div>
					</AccordionTrigger>
					<AccordionContent className="ml-[30px]">
						<p className="font-semibold mt-2">
							Description:{" "}
							<span className="font-normal ">
								{item.description}
							</span>
						</p>
						<p className="font-semibold mt-2">
							Skills:{" "}
							<span className="font-normal">{item.skill}</span>
						</p>
						<p className="font-semibold mt-2">Knowledge:</p>
						<ul>
							{item.knowledge.map((knowledge) => (
								<li className="flex gap-2" key={knowledge}>
									<Dot />
									<span>{knowledge}</span>
								</li>
							))}
						</ul>
						<p className="font-semibold mt-2">Resources:</p>
						<ul>
							{item &&
								item.resources.map((resource) => {
									const split = resource.split(": ");

									const title = split[0];
									const link = split[1];

									return (
										<li
											className="flex gap-2 items-center mt-2"
											key={resource}
										>
											<Dot />
											<div className="flex flex-wrap items-center gap-2">
												{title}:&nbsp;
												<a
													href={link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 underline break-all"
												>
													{link}
												</a>
											</div>
										</li>
									);
								})}
						</ul>
					</AccordionContent>

					{isUpdate && (
						<Button
							onClick={handleUpdateChecklist}
							className="absolute top-3 left-2 p-1 h-fit bg-white border-[1px] border-foreground hover:bg-transparent transition-all duration-300"
						>
							{item.isCompleted ? (
								<Check className="text-black" />
							) : (
								<Check className="text-transparent" />
							)}
						</Button>
					)}
				</AccordionItem>
			</Accordion>
		</>
	);
};

export default ChecklistItem;
