import JobSearch from "@/components/homepage/JobSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	useGetJobIndustries,
	useGetJobLevels,
	useGetJobTypes,
	useGetLocations
} from "@/hooks/JobHook";
import useSearchFilter from "@/hooks/useSearchFilter";
import { Search, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchPage() {
	const [query] = useSearchParams();
	const navigate = useNavigate();
	const { jobLevels, isPendingJobLevels } = useGetJobLevels();
	const { jobTypes, isPendingJobTypes } = useGetJobTypes();
	const { locations, isPendingLocations } = useGetLocations();
	const { industries, isPendingIndustries } = useGetJobIndustries();

	const { filterState, setFilterState } = useSearchFilter({
		levels: jobLevels,
		types: jobTypes,
		locations: locations,
		industries: industries
	});

	// Search function.
	const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const searchValue = (
			form.elements.namedItem("search") as HTMLInputElement
		)?.value;

		if (searchValue) {
			const currentParams = onUpdateQuery(searchValue);
			// Navigate to the updated URL
			navigate(`/search/?${currentParams}`);
		} else {
			navigate("/");
		}
	};

	const onUpdateQuery = (searchValue: string) => {
		// Get the current filtering options
		const currentParams = new URLSearchParams(window.location.search);

		// Update the query with the new search value
		currentParams.set("q", searchValue.trim());

		// Ensure filtering options are retained in the URL
		if (filterState.level) {
			currentParams.set("level", filterState.level);
		}
		if (filterState.workType) {
			currentParams.set("workType", filterState.workType);
		}
		if (filterState.city) {
			currentParams.set("city", filterState.city);
		}

		return currentParams.toString();
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
						defaultValue={query.get("q") || ""}
						placeholder="Search for your jobs"
						className="w-full border-0 p-6 focus-within:border-none focus:border-none focus-visible:"
					/>
					<Button className="py-4 px-4 mr-2">
						<Search />
					</Button>
				</form>
			</div>
			<div className="my-3 flex gap-2">
				<Select
					name="level"
					onValueChange={(e) => {
						console.log(e);
						setFilterState((prev) => ({ ...prev, level: e }));
					}}
					value={filterState.level}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a level" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Level</SelectLabel>
							{jobLevels &&
								jobLevels.map((level) => (
									<SelectItem key={level} value={level}>
										{level}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select
					name="work-type"
					onValueChange={(e) => {
						console.log(e);
						setFilterState((prev) => ({ ...prev, workType: e }));
					}}
					value={filterState.workType}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select work type" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Work type</SelectLabel>
							{jobTypes &&
								jobTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select
					name="city"
					onValueChange={(e) => {
						console.log(e);
						setFilterState((prev) => ({ ...prev, city: e }));
					}}
					value={filterState.city}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a city" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>City</SelectLabel>
							{locations &&
								locations.map((city) => (
									<SelectItem key={city} value={city}>
										{city}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<Select
					name="industry"
					onValueChange={(e) => {
						console.log(e);
						setFilterState((prev) => ({ ...prev, industry: e }));
					}}
					value={filterState.industry}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select an industry" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Industry</SelectLabel>
							{industries &&
								industries.map((industry) => (
									<SelectItem key={industry} value={industry}>
										{industry}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>

				{(filterState.level ||
					filterState.workType ||
					filterState.city ||
					filterState.industry) && (
					<div
						onClick={() => {
							setFilterState({
								level: "",
								workType: "",
								city: "",
								industry: ""
							});
						}}
						className="flex items-center gap-1 transition-all duration-300 hover:text-blue-400 cursor-pointer"
					>
						<X size={20} />
						<p>clear</p>
					</div>
				)}
			</div>

			{!isPendingJobLevels &&
				!isPendingJobTypes &&
				!isPendingLocations &&
				!isPendingIndustries && (
					<JobSearch
						city={filterState.city}
						level={filterState.level}
						workType={filterState.workType}
						industry={filterState.industry}
						query={query.get("q") || ""}
					/>
				)}
		</div>
	);
}

export default SearchPage;
