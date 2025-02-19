import { axiosInstance } from "@/utils"
import Interview, { Question } from "@/model/Interview"

export interface createInterviewProps {
    jobTitle: string
    jobLevel: string
    jobDescription: string
    numQuestions: number
}

export async function createInterview({
    jobTitle,
    jobLevel,
    jobDescription,
    numQuestions,
}: createInterviewProps) {
    const response = await axiosInstance.post("/interviews", {
        jobTitle,
        jobLevel,
        jobDescription,
        numQuestions,
    })

    return response.data
}

export async function getInterview(id: string) {
    const response = await axiosInstance.get(`/interviews/${id}`)
    return response.data.interview
}

export async function generateFeedback(id: string, answers: string[]) {
    const form = new FormData()
    form.append("interviewId", id)
    form.append("answers", JSON.stringify(answers))
    const response = await axiosInstance.post(`/interviews/feedback`, form, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

export async function getQuestions(interview: Interview) {
    return interview.questions.map((q: Question) => q.question)
}

export async function deleteInterview(id: string) {
    const response = await axiosInstance.delete(`/interviews/${id}`)
    return response.data
}
