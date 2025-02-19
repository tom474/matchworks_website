import mongoose, { Schema } from "mongoose";
import IResume from "../interfaces/Resume";

const resumeSchema: Schema = new Schema<IResume>(
	{
		fileId: { type: mongoose.Schema.Types.ObjectId, ref: "resumes.files", required: true },
		fileName: { type: String, required: true },
		overallScore: { type: Number },
		feedback: [
			{
				aspect: { type: String },
				score: { type: Number },
				strengths: { type: [String] },
				weaknesses: { type: [String] },
				suggestions: { type: [String] },
			},
		],
	},
	{ timestamps: true }
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
