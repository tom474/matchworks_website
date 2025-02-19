import { Document } from "mongoose";

interface IJob extends Document {
	title: string;
	type: string;
	level: string;
	industry: string[];
	description: string;
	location: string;
	salary: string;
	url: string;
	company: ICompany;
	contactEmail: string;
	skills: string[];
	datePosted: Date;
}

interface ICompany {
	name: string;
	description: string;
	logo: string;
	url: string;
	location: string;
}

export default IJob;
