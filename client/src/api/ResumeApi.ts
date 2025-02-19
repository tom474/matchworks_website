import { url } from "@/utils/index"
import { axiosInstance } from "@/utils/index"
import { getCurrentUser } from "@/api/ProfileApi"

async function getResumeAnalysis(resumeId: string) {
    const response = await axiosInstance.get(url + `/resumes/${resumeId}`)
    if (!response.data) {
        throw new Error("Failed to fetch resume analysis")
    }
    return response.data
}

async function generateResumeFeedback(resumeId: string) {
    const response = await axiosInstance.post(
        url + `/resumes/${resumeId}/feedback`
    )
    return response.data
}

export async function getResumeFeedback(resumeId: string) {
    const analysis = await getResumeAnalysis(resumeId)
    if (analysis.resume.feedback.length > 0) {
        return analysis.resume
    } else {
        const feedback = await generateResumeFeedback(resumeId)
        return feedback
    }
}

export async function getResumeHasFeedback(resumeIds: string[]) {
    const newUser = await getCurrentUser()
    if (newUser.resumeIds !== resumeIds) {
        resumeIds = newUser.resumeIds
    }
    const resumeFeedbacks = []
    for (const resumeId of resumeIds) {
        const response = await getResumeAnalysis(resumeId)
        resumeFeedbacks.push(response)
    }
    return resumeFeedbacks
}
