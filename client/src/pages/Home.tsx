import JobRecommendation from "@/components/homepage/JobRecommendation";
import SavedJobsList from "@/components/homepage/SavedJobsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
	const [currentTab, setCurrentTab] = useState<string>("recommendation");
	const navigate = useNavigate();

	const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const searchValue = (
			form.elements.namedItem("search") as HTMLInputElement
		)?.value;

		if (searchValue) {
			navigate(`/search/?q=${searchValue.trim()}`);
		}
	};

	return (
		<div className="max-w-7xl w-[1200px] mt-[75px]">
			<div className="w-8/12 m-auto">
				<form
					onSubmit={onSearch}
					className="flex w-full items-center border border-gray-300 rounded-lg"
				>
					<Input
						type="search"
						name="search"
						placeholder="Search for your jobs"
						className="w-full border-0 p-6 focus-within:border-none focus:border-none focus-visible:"
					/>
					<Button className="py-4 px-4 mr-2">
						<Search />
					</Button>
				</form>
			</div>
			<Tabs
				value={currentTab}
				onValueChange={setCurrentTab}
				className="mt-2"
			>
				<TabsList>
					<TabsTrigger
						className="bg-transparent w-52"
						value="recommendation"
					>
						Job Recommendations
					</TabsTrigger>
					<TabsTrigger className="bg-transparent w-52" value="saved">
						Saved Jobs
					</TabsTrigger>
				</TabsList>

				<TabsContent value="recommendation">
					<JobRecommendation />
				</TabsContent>
				<TabsContent value="saved">
					<SavedJobsList />
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default Home;
