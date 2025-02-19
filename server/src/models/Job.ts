import mongoose, { Schema } from "mongoose";
import IJob from "../interfaces/Job";

const jobSchema: Schema = new Schema<IJob>(
	{
		title: { type: String, required: true },
		type: { type: String, required: true },
		level: { type: String, required: true },
		industry: { type: [String], required: true },
		description: { type: String, required: true },
		location: { type: String, required: true },
		salary: { type: String, required: true },
		url: { type: String, required: true },
		company: {
			name: { type: String, required: true },
			description: { type: String, required: true },
			logo: { type: String, required: true },
			url: { type: String, required: true },
			location: { type: String, required: true },
		},
		contactEmail: { type: String, required: true },
		skills: { type: [String], required: true },
		datePosted: { type: Date, required: true },
	},
	{ timestamps: true }
);

const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
