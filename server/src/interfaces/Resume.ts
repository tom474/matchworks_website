import { Document, Types } from "mongoose";

interface IResume extends Document {
	fileId: Types.ObjectId;
	fileName: string;
	overallScore?: number;
	feedback?: IFeedback[];
}

interface IFeedback {
	aspect: string;
	score: number;
	strengths: string[];
	weaknesss: string[];
	suggestions: string[];
}

export default IResume;
