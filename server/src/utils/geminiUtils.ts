import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// Generate a user profile from a resume
export const generateUserProfile = async (resumeId: string) => {
    // Define the prompt for the model
    const prompt = `
        Analyze the content of this resume and extract information for a user profile. Return the response in the following JSON format:
        {
            "background": String (A brief professional summary or background from the resume,
            "positions": [String] (List of positions held by the user, extracted from experience. e.g. Software Engineer, Backend Developer),
            "skills": [String] (List of skills mentioned in the resume. e.g. JavaScript, Python),
            "education": [
                {
                    "degree": String (Degree title),
                    "institution": String (Institution name),
                    "startDate": Date (Start date in yyyy-mm-dd format),
                    "endDate": Date (End date in yyyy-mm-dd format or null if ongoing),
                    "description": String (Description of the education)
                }
            ],
            "experience": [
                {
                    "jobTitle": String (Title of the job),
                    "company": String (Company name),
                    "startDate": Date (Start date in yyyy-mm-dd format),
                    "endDate": Date (End date in yyyy-mm-dd format or null if ongoing),
                    "description": String (Description of the job)
                }
            ],
            "interests": [String] (List of interests. e.g. Machine Learning, Web Development)
        }
    	Note that the experience is different from the projects.`

    // Fetch the resume PDF
    const pdfResponse = await fetch(
        `http://localhost:8080/api/files/resumes/${resumeId}/download`
    )
    if (!pdfResponse.ok) {
        throw new Error("Failed to download resume")
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(pdfBuffer).toString("base64"),
                mimeType: "application/pdf",
            },
        },
        prompt,
    ])

    // Parse and validate the response
    let responseText = result.response.text()
    responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    const userProfileResponse = JSON.parse(responseText)
    if (
        !userProfileResponse ||
        typeof userProfileResponse.background != "string" ||
        !Array.isArray(userProfileResponse.positions) ||
        !Array.isArray(userProfileResponse.skills) ||
        !Array.isArray(userProfileResponse.education) ||
        !Array.isArray(userProfileResponse.experience) ||
        !Array.isArray(userProfileResponse.interests)
    ) {
        throw new Error("Invalid user profile response format")
    }

    return userProfileResponse
}

// Generate feedback on a resume
export const generateResumeFeedback = async (resumeId: string) => {
    // Define the prompt for the model
    const prompt = `Analyze this resume and provide feedback. Return the response in the following JSON format:
    {
        "feedback": [
            {
                "aspect": String (Aspect being evaluated),
                "score": Number (A numerical score out of 100 for this aspect),
                "strengths": [String], (List specific strengths related to this aspect),
                "weaknesses": [String], (List specific weaknesses related to this aspect),
                "suggestions": [String], ("List actionable suggestions for improvement)
            }
        ]
    }
    The aspects include: Presentation, Structure, Content, Skills, and Language. The feedback should be detailed and actionable.`

    // Fetch the resume PDF
    const pdfResponse = await fetch(
        `http://localhost:8080/api/files/resumes/${resumeId}/download`
    )
    if (!pdfResponse.ok) {
        throw new Error("Failed to download resume")
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()

    // Generate content using the model
    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(pdfBuffer).toString("base64"),
                mimeType: "application/pdf",
            },
        },
        prompt,
    ])

    // Parse and validate the response
    let responseText = result.response.text()
    responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    const feedbackResponse = JSON.parse(responseText)
    if (!feedbackResponse || !Array.isArray(feedbackResponse.feedback)) {
        throw new Error("Invalid feedback response format")
    }

    return feedbackResponse
}

// Generate a roadmap from a job description
export const generateRoadmap = async (
    jobTitle: string,
    jobLevel: string,
    jobDescription: string
) => {
    const prompt = `
		Job Title: ${jobTitle}
		Job Level: ${jobLevel}
		Job Description: 
		${jobDescription}
		
		Based on the provided job description, generate a comprehensive and actionable roadmap to prepare for the role. 
		Return the response in the following detailed JSON format:
		{
			"title": String (Roadmap Title),
			"description": String (Roadmap Description),
			"level": String (Level of expertise. Beginner, Intermediate, or Advanced),
			"progress": Number (Progress percentage from 0 to 100, initially set to 0),
			"checklist": [
				{
					"skill": String (Skill to learn.),
					"description": String (Description of the skill),
					"knowledge": [String] (List of knowledge areas),
					"resources": [String] (List of resources - online courses, books, articles - with link. e.g. Coursera: https://www.coursera.org),
					"isCompleted": Boolean (Completion status, initially set to false)
				}
			]
		}
		
		Ensure the following:
		1. **Checklist Content**: Each checklist item should focus on a specific, actionable skill or step that directly prepares the individual for the role.
		2. **Relevance**: Tailor skills and resources to the job's core requirements as outlined in the job description.
		3. **Detail**: Provide a thorough explanation of each skill, its relevance, and how it applies to the role. Include industry best practices where relevant.
		4. **Actionable Resources**: Recommend practical and credible resources, such as online platforms (e.g., Coursera, Udemy), books, or articles. Whenever possible, include links to the resources.
		5. **Structured Approach**: Organize the roadmap logically, starting with foundational skills and progressing to more advanced topics.

		The roadmap should be comprehensive, clear, and tailored to help an individual systematically prepare for the specified role. Provide actionable and practical steps for each part of the checklist.
	`
    const result = await model.generateContent([prompt])

    // Parse and validate the response
    let responseText = result.response.text()
    responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    const roadmapResponse = JSON.parse(responseText)
    console.log(roadmapResponse)
    if (
        !roadmapResponse ||
        typeof roadmapResponse.title != "string" ||
        typeof roadmapResponse.description != "string" ||
        typeof roadmapResponse.level != "string" ||
        typeof roadmapResponse.progress != "number" ||
        !Array.isArray(roadmapResponse.checklist)
    ) {
        throw new Error("Invalid roadmap response format")
    }

    return roadmapResponse
}

// Create a mock interview from job details
export const createMockInterview = async (
    jobTitle: string,
    jobLevel: string,
    jobDescription: string,
    numQuestions: number
) => {
    const prompt = `
        Job Title: ${jobTitle}
        Job Level: ${jobLevel}
        Job Description: ${jobDescription}
        Number of Questions: ${numQuestions}

        Based on the above information, perform the following tasks:
        1. Analyze the job details thoroughly and provide insights. Include:
            - Key technical skills and competencies required for the role.
            - Core responsibilities and expectations from the candidate.
            - Importance of soft skills (e.g., teamwork, communication) and how they relate to the job description.
            - Any notable challenges or unique aspects of the role that a candidate should be prepared for.

        2. Generate ${numQuestions} diverse and relevant mock interview questions for the role. Ensure:
            - A balance between technical and soft skills questions.
            - Technical questions should align with the core skills and technologies mentioned in the job description.
            - Soft skills questions should focus on scenarios like problem-solving, teamwork, communication, and adaptability.
            - Questions should progressively challenge the candidate, starting with foundational concepts and advancing to more complex scenarios.

        Return the response in the following JSON format:
        {
            "analysis": String (Comprehensive analysis of the job details, including technical and soft skills insights),
            "questions": [String] (A list of ${numQuestions} mock interview questions tailored to the role)
        }

        Ensure the response is:
        - Detailed and structured to provide actionable insights for interview preparation.
        - Tailored specifically to the provided job title, level, and description.
        - Designed to help the candidate understand the role and demonstrate readiness during an interview.
    `

    const result = await model.generateContent([prompt])

    // Parse and validate the response
    let responseText = result.response.text()
    responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    const interviewResponse = JSON.parse(responseText)
    if (
        !interviewResponse ||
        typeof interviewResponse.analysis != "string" ||
        !Array.isArray(interviewResponse.questions)
    ) {
        throw new Error("Invalid interview response format")
    }

    return interviewResponse
}

// Generate interview feedback from user's answers
export const generateInterviewFeedback = async (
    jobTitle: string,
    jobLevel: string,
    jobDescription: string,
    analysis: string,
    questions: string[],
    answer: string[]
) => {
    const prompt = `
		Job Title: ${jobTitle}
		Job Level: ${jobLevel}
		Job Description: ${jobDescription}
		Analysis: ${analysis}
		Questions: ${questions}
		Answers: ${answer}

		Create feedback for each question. Then, provide an overall assessment of the interview performance:
		1. Summarize the candidate's key strengths observed across all answers (e.g., technical expertise, critical thinking, ability to articulate thoughts).
		2. Highlight overall weaknesses or recurring patterns that need improvement (e.g., lack of depth, unclear communication, or gaps in knowledge).
		3. Offer practical and tailored suggestions to improve future performance, considering the job level and description.

		Return the response in the following detailed JSON format:
		{
			"feedbacks": [String] (Detailed feedback for each question),
			"strengths": [String] (Key strengths observed during the interview, summarizing areas of excellence),
			"weaknesses": [String] (Key weaknesses observed during the interview, summarizing areas for improvement),
			"suggestions": [String] (Actionable and practical suggestions to improve interview performance and readiness for the role)
		}

		Ensure the feedback is:
		- Detailed and tailored to the job title, level, and description.
		- Actionable, providing clear steps for improvement.
		- Constructive and professional, aimed at helping the candidate prepare effectively for similar roles in the future.
	`

    const result = await model.generateContent([prompt])

    // Parse and validate the response
    let responseText = result.response.text()
    responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    const feedbackResponse = JSON.parse(responseText)
    if (
        !feedbackResponse ||
        !Array.isArray(feedbackResponse.feedbacks) ||
        !Array.isArray(feedbackResponse.strengths) ||
        !Array.isArray(feedbackResponse.weaknesses) ||
        !Array.isArray(feedbackResponse.suggestions)
    ) {
        throw new Error("Invalid feedback response format")
    }
    console.log(feedbackResponse)

    return feedbackResponse
}
