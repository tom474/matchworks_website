import mongoose, { Schema } from "mongoose";
import IRoadmap from "../interfaces/Roadmap";

const roadmapSchema: Schema = new Schema<IRoadmap>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		level: { type: String, required: true },
		progress: { type: Number, required: true },
		checklist: [
			{
				skill: { type: String },
				description: { type: String },
				knowledge: { type: [String] },
				resources: { type: [String] },
				isCompleted: { type: Boolean },
			},
		],
	},
	{ timestamps: true }
);

const Roadmap = mongoose.model<IRoadmap>("Roadmap", roadmapSchema);

export default Roadmap;
