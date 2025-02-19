import { Document } from "mongoose";

interface IInterview extends Document {
	jobTitle: string;
	jobLevel: string;
	jobDescription: string;
	analysis: string;
	questions: IQuestion[];
	strengths: string[];
	weaknesses: string[];
	suggestions: string[];
}

interface IQuestion {
	question: string;
	answer: string;
	feedback: string;
}

export default IInterview;