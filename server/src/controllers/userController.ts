import { Request, Response } from "express"
import User from "../models/User"

// Get the current user's details
export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.cookies.userId

    try {
        // Find the user by ID
        const user = await User.findById(userId).select("-password")
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        res.status(200).json({ user })
    } catch (error: any) {
        console.error("Failed to fetch user details:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Update the current user's details
export const updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { name, email, phone, background } = req.body
    console.log(req.body)

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Update the fields if they are provided
        if (name) user.name = name
        if (email) user.email = email
        if (phone) user.phone = phone
        if (background) user.background = background

        // Save the updated user
        await user.save()

        res.status(200).json({ message: "Profile updated successfully." })
    } catch (error: any) {
        console.error("Failed to update user profile:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// ---------- Positions ----------
// Add a position
export const addPosition = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { position } = req.body

    // Validate input
    if (!position) {
        res.status(400).json({ error: "Position is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the position exists
        user.positions = user.positions || []
        if (user.positions.includes(position)) {
            res.status(400).json({ error: "Position already exists." })
            return
        }

        // Add the position
        user.positions.push(position)
        await user.save()

        res.status(200).json({ message: "Position added successfully." })
    } catch (error: any) {
        console.error("Failed to add position:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Remove a position
export const removePosition = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { position } = req.body

    // Validate input
    if (!position) {
        res.status(400).json({ error: "Position is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the position exists
        if (!user.positions || !user.positions.includes(position)) {
            res.status(404).json({ error: "Position not found." })
            return
        }

        // Remove the position
        user.positions = user.positions.filter((p) => p !== position)
        await user.save()

        res.status(200).json({ message: "Position removed successfully." })
    } catch (error: any) {
        console.error("Failed to delete position:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// ---------- Skills ----------
// Add a skill
export const addSkill = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { skill } = req.body

    // Validate input
    if (!skill) {
        res.status(400).json({ error: "Skill is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the skill already exists
        user.skills = user.skills || []
        if (user.skills.includes(skill)) {
            res.status(400).json({ error: "Skill already exists." })
            return
        }

        // Add the skill
        user.skills.push(skill)
        await user.save()

        res.status(200).json({ message: "Skill added successfully." })
    } catch (error: any) {
        console.error("Failed to add skill:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Remove a skill
export const removeSkill = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { skill } = req.body

    // Validate input
    if (!skill) {
        res.status(400).json({ error: "Skill is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the skill exists
        if (!user.skills || !user.skills.includes(skill)) {
            res.status(404).json({ error: "Skill not found." })
            return
        }

        // Remove the skill
        user.skills = user.skills.filter((s) => s !== skill)
        await user.save()

        res.status(200).json({ message: "Skill removed successfully." })
    } catch (error: any) {
        console.error("Failed to remove skill:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// ---------- Interests ----------
// Add an interest
export const addInterest = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { interest } = req.body

    // Validate input
    if (!interest) {
        res.status(400).json({ error: "Interest is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the interest already exists
        user.interests = user.interests || []
        if (user.interests.includes(interest)) {
            res.status(400).json({ error: "Interest already exists." })
            return
        }

        // Add the interest
        user.interests.push(interest)
        await user.save()

        res.status(200).json({ message: "Interest added successfully." })
    } catch (error: any) {
        console.error("Failed to add interest:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Remove an interest
export const removeInterest = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { interest } = req.body

    // Validate input
    if (!interest) {
        res.status(400).json({ error: "Interest is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Check if the interest exists
        if (!user.interests || !user.interests.includes(interest)) {
            res.status(404).json({ error: "Interest not found." })
            return
        }

        // Remove the interest
        user.interests = user.interests.filter((i) => i !== interest)
        await user.save()

        res.status(200).json({ message: "Interest removed successfully." })
    } catch (error: any) {
        console.error("Failed to remove interest:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// ---------- Education ----------
// Add an education
export const addEducation = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { degree, institution, startDate, endDate, description } = req.body

    // Validate input
    if (!degree) {
        res.status(400).json({ error: "Degree is required." })
        return
    }
    if (!institution) {
        res.status(400).json({ error: "Institution is required." })
        return
    }
    if (!startDate) {
        res.status(400).json({ error: "Start date is required." })
        return
    }
    if (!endDate) {
        res.status(400).json({ error: "End date is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Add the education entry to the user's education array
        const newEducation = {
            degree,
            institution,
            startDate,
            endDate,
            description,
        }
        user.education = user.education || []
        user.education.push(newEducation)
        await user.save()

        res.status(200).json({ message: "Education added successfully." })
    } catch (error: any) {
        console.error("Failed to add education:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Update an education
export const updateEducation = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const {
        educationId,
        degree,
        institution,
        startDate,
        endDate,
        description,
    } = req.body

    // Validate input
    if (!educationId) {
        res.status(400).json({ error: "Education id is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Find the specific education entry
        const educationEntry = user.education?.find(
            (e) => (e as any)._id.toString() === educationId
        )
        if (!educationEntry) {
            res.status(404).json({ error: "Education entry not found." })
            return
        }

        // Update the education entry fields
        if (degree) educationEntry.degree = degree
        if (institution) educationEntry.institution = institution
        if (startDate) educationEntry.startDate = startDate
        if (endDate) educationEntry.endDate = endDate
        if (description) educationEntry.description = description
        await user.save()

        res.status(200).json({ message: "Education updated successfully." })
    } catch (error: any) {
        console.error("Failed to update education:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Remove an education
export const removeEducation = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { educationId } = req.body

    // Validate input
    if (!educationId) {
        res.status(400).json({ error: "Education id is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Find and remove the education entry
        const educationIndex = user.education?.findIndex(
            (e) => (e as any)._id.toString() === educationId
        )
        if (educationIndex === -1) {
            res.status(404).json({ error: "Education entry not found." })
            return
        }
        user.education?.splice(educationIndex!, 1)
        await user.save()

        res.status(200).json({ message: "Education removed successfully." })
    } catch (error: any) {
        console.error("Failed to remove education:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// ---------- Experience ----------
// Add an experience
export const addExperience = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { jobTitle, company, startDate, endDate, description } = req.body

    // Validate input
    if (!jobTitle) {
        res.status(400).json({ error: "Job title is required." })
        return
    }
    if (!company) {
        res.status(400).json({ error: "Company is required." })
        return
    }
    if (!startDate) {
        res.status(400).json({ error: "Start date is required." })
        return
    }
    if (!endDate) {
        res.status(400).json({ error: "End date is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Add the experience entry to the user's experience array
        const newExperience = {
            jobTitle,
            company,
            startDate,
            endDate,
            description,
        }
        user.experience = user.experience || []
        user.experience.push(newExperience)
        await user.save()

        res.status(200).json({ message: "Experience added successfully." })
    } catch (error: any) {
        console.error("Failed to add experience:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Update an experience
export const updateExperience = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { experienceId, jobTitle, company, startDate, endDate, description } =
        req.body

    // Validate input
    if (!experienceId) {
        res.status(400).json({ error: "ExperienceId is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Find the specific experience entry
        const experienceEntry = user.experience?.find(
            (e) => (e as any)._id.toString() === experienceId
        )
        if (!experienceEntry) {
            res.status(404).json({ error: "Experience entry not found." })
            return
        }

        // Update the experience entry fields
        if (jobTitle) experienceEntry.jobTitle = jobTitle
        if (company) experienceEntry.company = company
        if (startDate) experienceEntry.startDate = startDate
        if (endDate) experienceEntry.endDate = endDate
        if (description) experienceEntry.description = description
        await user.save()

        res.status(200).json({ message: "Experience updated successfully." })
    } catch (error: any) {
        console.error("Failed to update experience:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// Remove an experience
export const removeExperience = async (req: Request, res: Response) => {
    const userId = req.cookies.userId
    const { experienceId } = req.body

    // Validate input
    if (!experienceId) {
        res.status(400).json({ error: "ExperienceId is required." })
        return
    }

    try {
        // Find the user
        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return
        }

        // Find and remove the experience entry
        const experienceIndex = user.experience?.findIndex(
            (e) => (e as any)._id.toString() === experienceId
        )
        if (experienceIndex === -1) {
            res.status(404).json({ error: "Experience entry not found." })
            return
        }
        user.experience?.splice(experienceIndex!, 1)
        await user.save()

        res.status(200).json({ message: "Experience removed successfully." })
    } catch (error: any) {
        console.error("Failed to remove experience:", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
