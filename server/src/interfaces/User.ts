import { Document, Types } from "mongoose";

interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: Types.ObjectId;
	phone: string;
	background?: string;
	positions?: string[];
	skills?: string[];
	education?: IEducation[];
	experience?: IExperience[];
	interests?: string[];
	saveJobIds?: Types.ObjectId[];
	resumeIds?: Types.ObjectId[];
	interviewIds?: Types.ObjectId[];
	roadmapIds?: Types.ObjectId[];
}

interface IEducation {
	degree?: string;
	institution?: string;
	startDate?: Date;
	endDate?: Date;
	description?: string;
}

interface IExperience {
	jobTitle?: string;
	company?: string;
	startDate?: Date;
	endDate?: Date;
	description?: string;
}

export default IUser;
