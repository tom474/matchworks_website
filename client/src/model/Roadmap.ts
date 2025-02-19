class Roadmap {
	_id: string;
	title: string;
	description: string;
	level: string;
	progress: number;
	checklist: {
		_id: string;
		skill: string;
		description: string;
		knowledge: string[];
		resources: string[];
		isCompleted: boolean;
	}[];

	constructor(
		_id: string,
		title: string,
		description: string,
		level: string,
		progress: number,
		checklist: {
			_id: string;
			skill: string;
			description: string;
			knowledge: string[];
			resources: string[];
			isCompleted: boolean;
		}[]
	) {
		this._id = _id;
		this.title = title;
		this.description = description;
		this.level = level;
		this.progress = progress;
		this.checklist = checklist;
	}
}

export default Roadmap;
