import { z } from "zod"

export const BasicSchema = z.object({
    name: z.string().min(1).max(255),
    phone: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    avatar: z.instanceof(File).optional(),
})

export const BasicSchemaDefaultValues = {
    name: "",
    phone: "",
    email: "",
    avatar: undefined,
}

export interface Education {
    _id: string
    degree: string
    institution: string
    startDate: string
    endDate: string
    description: string
}

export interface Experience {
    _id: string
    jobTitle: string
    company: string
    startDate: string
    endDate: string
    description: string
}

const educationSchema = z.object({
    _id: z.string().optional(),
    degree: z.string(),
    institution: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
})

const experienceSchema = z.object({
    _id: z.string().optional(),
    jobTitle: z.string(),
    company: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
})

export const ProfileSchema = z.object({
    resume: z.instanceof(File).optional(),
    background: z.string().optional(),
    positions: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    education: z.array(educationSchema).optional(),
    experience: z.array(experienceSchema).optional(),
    interests: z.array(z.string()).optional(),
})

export const ProfileSchemaDefaultValues = {
    resume: undefined,
    background: "",
    positions: [],
    skills: [],
    education: [],
    experience: [],
    interests: [],
}
