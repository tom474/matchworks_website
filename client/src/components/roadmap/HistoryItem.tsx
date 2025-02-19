import { useDeleteRoadmap, useGetRoadmapById } from "@/hooks/RoadmapHook";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "../ui/card";
import { useRoadmapContext } from "@/context/RoadmapContext";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "../ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import ClipLoader from "react-spinners/ClipLoader";

interface HistoryItemProps {
	roadmapId: string;
}

function HistoryItem({ roadmapId }: HistoryItemProps) {
	const navigate = useNavigate();
	const { selectedRoadmapId, setSelectedRoadmap } = useRoadmapContext();
	const { roadmap } = useGetRoadmapById(roadmapId);
	const { deleteRoadmap, isPendingDeleteRoadmap } = useDeleteRoadmap();

	const handleViewRoadmap = () => {
		setSelectedRoadmap(roadmapId);
		navigate(`/roadmap-generator/${roadmapId}/roadmap`);
	};

	const handleDeleteRoadmap = () => {
		console.log("Delete roadmap");

		deleteRoadmap({
			roadmapId: roadmapId,
			onSuccess: () => {
				if (selectedRoadmapId === roadmapId) {
					setSelectedRoadmap(null);
				}
			}
		});
	};

	return (
		<>
			<AlertDialog>
				<Card className="w-[24%] mt-2 flex flex-col justify-between">
					<CardHeader>
						<div className="flex justify-between gap-2">
							<div className="flex flex-col gap-2">
								<CardTitle className="max-w-[250px]">
									{roadmap?.title || "Loading..."}
								</CardTitle>
								<CardDescription>
									{roadmap?.level || "Loading..."}
								</CardDescription>
							</div>

							<div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="rounded-full w-8 h-8" variant="outline">
											<EllipsisVertical className="cursor-pointer" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56">
										<DropdownMenuLabel>Options</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem onClick={handleViewRoadmap}>
												Views
											</DropdownMenuItem>
											<AlertDialogTrigger className="bg-transparent p-0 w-full hover:border-none hover:text-red-500 ">
												<DropdownMenuItem className="text-red-400 ">
													Delete
												</DropdownMenuItem>
											</AlertDialogTrigger>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</CardHeader>

					<CardContent className="mt-5">
						<div className="w-full flex justify-between">
							<p>
								Status:{" "}
								<span className="text-green-500 text-lg">
									{roadmap?.progress || 0}
								</span>
								<span className="text-sm">%</span>
							</p>

							<Button onClick={handleViewRoadmap}>View</Button>
						</div>
					</CardContent>
				</Card>

				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							roadmap from your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteRoadmap}>
							{isPendingDeleteRoadmap ? <ClipLoader size={17} /> : "Continue"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default HistoryItem;