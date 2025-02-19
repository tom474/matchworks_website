import { Document } from "mongoose";

interface IRoadmap extends Document {
	title: string;
	description: string;
	level: string;
	progress: number;
	checklist: IChecklist[];
}

interface IChecklist {
	skill: string;
	description: string;
	knowledge: string[];
	resources: string[];
	isCompleted: boolean;
}

export default IRoadmap;
