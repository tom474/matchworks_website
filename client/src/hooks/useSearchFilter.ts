import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface filterType {
	level: string;
	workType: string;
	city: string;
	industry: string;
}

interface searchProps {
	levels?: string[];
	types?: string[];
	locations?: string[];
	industries?: string[];
}

const useSearchFilter = ({
	levels = [],
	types = [],
	locations = [],
	industries = []
}: searchProps) => {
	const [query] = useSearchParams();
	const navigate = useNavigate();
	const [filterState, setFilterState] = useState<filterType>({
		level: "",
		workType: "",
		city: "",
		industry: ""
	});

	// Sync the filterState with URL query params
	useEffect(() => {
		const level = query.get("level");
		const workType = query.get("workType");
		const city = query.get("city");
		const industry = query.get("industry");

		setFilterState((prev) => ({
			...prev,
			level: level && levels.includes(level) ? level : "",
			workType: workType && types.includes(workType) ? workType : "",
			city: city && locations.includes(city) ? city : "",
			industry: industry && industries.includes(industry) ? industry : ""
		}));
	}, [industries, levels, locations, query, types]);

	// Update the URL when filterState changes
	useEffect(() => {
		const currentParams = new URLSearchParams(window.location.search);

		// Update or remove search params
		Object.entries(filterState).forEach(([key, value]) => {
			if (value) {
				currentParams.set(key, value);
			} else {
				currentParams.delete(key);
			}
		});

		navigate(`/search/?${currentParams.toString()}`, { replace: true });
	}, [filterState, navigate]);

	return { filterState, setFilterState };
};

export default useSearchFilter;
