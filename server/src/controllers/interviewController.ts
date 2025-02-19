import { Request, Response } from "express"
import Interview from "../models/Interview"
import User from "../models/User"
import {
    createMockInterview,
    generateInterviewFeedback,
} from "../utils/geminiUtils"

// Get an interview by ID
export const getInterviewById = async (req: Request, res: Response) => {
    const interviewId = req.params.interviewId

    // Validate input
    if (!interviewId) {
        res.status(400).json({ error: "Interview ID is required" })
        return
    }

    try {
        // Fetch the interview by ID
        const interview = await Interview.findById(interviewId)

        // Check if the interview exists
        if (!interview) {
            res.status(404).json({ error: "Interview not found" })
            return
        }

        res.status(200).json({ interview })
    } catch (error: any) {
        console.error("Failed to fetch interview by ID:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Create a new interview from a job description
export const createInterview = async (req: Request, res: Response) => {
    const { jobTitle, jobLevel, jobDescription, numQuestions } = req.body
    const userId = req.cookies.userId

    // Validate input
    if (!jobTitle) {
        res.status(400).json({ error: "Job Title is required" })
        return
    }
    if (!jobLevel) {
        res.status(400).json({ error: "Job Level is required" })
        return
    }
    if (!jobDescription) {
        res.status(400).json({ error: "Job Description is required" })
        return
    }
    if (!numQuestions || isNaN(numQuestions)) {
        res.status(400).json({
            error: "Number of Questions is required and must be a number",
        })
        return
    }

    try {
        // Generate a mock interview
        const mockInterview = await createMockInterview(
            jobTitle,
            jobLevel,
            jobDescription,
            numQuestions
        )

        // Initialize the questions with empty answers and feedback
        const questions = mockInterview.questions.map((question: string) => ({
            question,
            answer: "",
            feedback: "",
        }))
        console.log(questions)

        // Create a new interview
        const newInterview = new Interview({
            jobTitle,
            jobLevel,
            jobDescription,
            analysis: mockInterview.analysis,
            questions: questions,
            strengths: [],
            weaknesses: [],
            suggestions: [],
        })

        // Save the interview to the database
        await newInterview.save()

        // Update user's interview list
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }
        user.interviewIds = user.interviewIds || []
        user.interviewIds.push(newInterview._id as any)
        await user.save()

        res.status(201).json({
            interviewId: newInterview._id,
            analysis: mockInterview.analysis,
            questions: mockInterview.questions,
        })
    } catch (error: any) {
        console.error("Failed to create interview:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Generate interview feedback from user's answers
export const generateFeedback = async (req: Request, res: Response) => {
    const { interviewId, answers } = req.body

    // Validate input
    if (!interviewId) {
        res.status(400).json({ error: "Interview ID is required" })
        return
    }
    if (!answers) {
        res.status(400).json({
            error: "Answers is required",
        })
        return
    }

    try {
        // Fetch the interview by ID
        const interview = await Interview.findById(interviewId)

        // Check if the interview exists
        if (!interview) {
            res.status(404).json({ error: "Interview not found" })
            return
        }

        // Validate the number of answers matches the number of questions
        const parsedAnswers = JSON.parse(answers)
        if (parsedAnswers.length !== interview.questions.length) {
            res.status(400).json({
                error: "Number of answers must match the number of questions",
            })
            return
        }

        // Generate feedback for the interview
        const feedback = await generateInterviewFeedback(
            interview.jobTitle,
            interview.jobLevel,
            interview.jobDescription,
            interview.analysis,
            interview.questions.map((q) => q.question),
            parsedAnswers
        )

        // Update the interview with the feedback
        interview.questions.forEach((q, i) => {
            q.answer = parsedAnswers[i]
            q.feedback = feedback.feedbacks[i]
        })
        interview.strengths = feedback.strengths
        interview.weaknesses = feedback.weaknesses
        interview.suggestions = feedback.suggestions
        await interview.save()

        res.status(200).json({ interview })
    } catch (error: any) {
        console.error("Failed to generate feedback:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Delete an interview by ID
export const deleteInterview = async (req: Request, res: Response) => {
    const interviewId = req.params.interviewId
    const userId = req.cookies.userId

    // Validate input
    if (!interviewId) {
        res.status(400).json({ error: "Interview ID is required" })
        return
    }

    try {
        // Fetch the interview by ID
        const interview = await Interview.findById(interviewId)

        // Check if the interview exists
        if (!interview) {
            res.status(404).json({ error: "Interview not found" })
            return
        }

        // Delete the interview from the database
        await Interview.findByIdAndDelete(interviewId)

        // Update user's interview list
        const user = await User.findById(userId)
        if (user) {
            user.interviewIds = user.interviewIds?.filter(
                (id) => id.toString() !== interviewId
            )
            await user.save()
        }

        res.status(200).json({ message: "Interview deleted successfully" })
    } catch (error: any) {
        console.error("Failed to delete interview:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
