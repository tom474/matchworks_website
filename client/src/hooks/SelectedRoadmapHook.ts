import Cookies from "js-cookie";
import { useEffect } from "react";

export const useSelectedRoadmap = (selectedRoadmapId: string) => {
	useEffect(() => {
		if (selectedRoadmapId !== null) {
			const handleBeforeUnload = () => {
				Cookies.set("selectedRoadmapId", selectedRoadmapId, {
					expires: 1
				});
			};

			window.addEventListener("beforeunload", handleBeforeUnload);

			return () => {
				window.removeEventListener("beforeunload", handleBeforeUnload);
			};
		}
	}, [selectedRoadmapId]);
};
