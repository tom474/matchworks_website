class Interview {
    _id: string
    jobTitle: string
    jobLevel: string
    jobDescription: string
    analysis: string
    questions: Question[]
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
    createdAt: Date
    updatedAt: Date

    constructor(
        _id: string,
        jobTitle: string,
        jobLevel: string,
        jobDescription: string,
        analysis: string,
        questions: Question[] = [],
        strengths: string[] = [],
        weaknesses: string[] = [],
        suggestions: string[] = [],
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = _id
        this.jobTitle = jobTitle
        this.jobLevel = jobLevel
        this.jobDescription = jobDescription
        this.analysis = analysis
        this.questions = questions
        this.strengths = strengths
        this.weaknesses = weaknesses
        this.suggestions = suggestions
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export interface Question {
    _id: string
    question: string
    answer: string
    feedback: string
}

export interface Message {
    role: "agent" | "user"
    content: string
    id: number
}

export default Interview
