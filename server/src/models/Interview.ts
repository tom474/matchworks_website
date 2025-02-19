import mongoose, { Schema } from "mongoose";
import IInterview from "../interfaces/Interview";
import { ChatSession } from "@google/generative-ai";

const interviewSchema: Schema = new Schema<IInterview>(
	{
		jobTitle: { type: String, required: true },
		jobLevel: { type: String, required: true },
		jobDescription: { type: String, required: true },
		analysis: { type: String, required: true },
		questions: [
			{
				question: { type: String, required: true },
				answer: { type: String },
				feedback: { type: String },
			},
		],
		strengths: { type: [String], required: true },
		weaknesses: { type: [String], required: true },
		suggestions: { type: [String], required: true },
	},
	{ timestamps: true }
);

const Interview = mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview;
