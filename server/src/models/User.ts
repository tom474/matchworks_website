import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/User";

const userSchema: Schema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		avatar: { type: mongoose.Schema.Types.ObjectId, ref: "avatars.files" },
		phone: { type: String, required: true },
		background: { type: String, default: "" },
		positions: { type: [String] },
		skills: { type: [String] },
		education: [
			{
				degree: { type: String },
				institution: { type: String },
				startDate: { type: Date },
				endDate: { type: Date },
				description: { type: String, default: "" },
			},
		],
		experience: [
			{
				jobTitle: { type: String },
				company: { type: String },
				startDate: { type: Date },
				endDate: { type: Date },
				description: { type: String, default: "" },
			},
		],
		interests: { type: [String] },
		saveJobIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
		resumeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }],
		interviewIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interview" }],
		roadmapIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Roadmap" }],
	},
	{ timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
