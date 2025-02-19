import React, { createContext, useContext, ReactNode, useState } from "react";

interface RoadmapContextType {
	selectedRoadmapId: string | null;
	setSelectedRoadmap: (state: string | null) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

interface RoadmapProviderProps {
	children: ReactNode;
}

export const RoadmapProvider: React.FC<RoadmapProviderProps> = ({
	children
}) => {
	const [selectedRoadmap, setRoadmap] = useState<string | null>(null);

	return (
		<RoadmapContext.Provider
			value={{
				selectedRoadmapId: selectedRoadmap,
				setSelectedRoadmap: setRoadmap
			}}
		>
			{children}
		</RoadmapContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRoadmapContext = (): RoadmapContextType => {
	const context = useContext(RoadmapContext);
	if (!context) {
		throw new Error(
			"useRoadmapContext must be used within a RoadmapProvider"
		);
	}
	return context;
};
