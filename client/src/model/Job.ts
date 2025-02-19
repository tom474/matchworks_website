export interface Company {
	name: string;
	description: string;
	logo: string;
	url: string;
	location: string;
}

class Job {
	_id: string;
	company: Company;
	title: string;
	type: string;
	description: string;
	location: string;
	level: string;
	salary: string;
	url: string;
	contactEmail: string;
	skills: string[];
	datePosted: Date;
	createdAt: Date;
	updatedAt: Date;
	isSaved: boolean;
	matchedSkills?: string[];
	unmatchedSkills?: string[];
	matchingPoint?: number;

	constructor(
		_id: string,
		company: Company,
		title: string,
		type: string,
		level: string,
		description: string,
		location: string,
		salary: string,
		url: string,
		contactEmail: string,
		skills: string[],
		datePosted: Date,
		createdAt: Date,
		updatedAt: Date,
		isSaved: boolean,
		matchedSkills?: string[],
		unmatchedSkills?: string[],
		matchingPoint?: number
	) {
		this._id = _id;
		this.company = company;
		this.title = title;
		this.type = type;
		this.description = description;
		this.location = location;
		this.salary = salary;
		this.url = url;
		this.contactEmail = contactEmail;
		this.skills = skills;
		this.datePosted = datePosted;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.level = level;
		this.isSaved = isSaved;
		this.matchedSkills = matchedSkills;
		this.unmatchedSkills = unmatchedSkills;
		this.matchingPoint = matchingPoint;
	}
}

export default Job;
