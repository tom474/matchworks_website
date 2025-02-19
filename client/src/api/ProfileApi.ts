import { axiosInstance } from "@/utils/index"
import { z } from "zod"
import { ProfileSchema, BasicSchema, Education, Experience } from "@/model/User"
import { url } from "@/utils/index"

export async function getCurrentUser() {
    const response = await axiosInstance.get("/users/current")
    return response.data.user
}

export async function refreshToken() {
    const response = await axiosInstance.post("/auth/refresh-token")
    return response.data
}

export async function updateAvatar(avatar: File) {
    const formData = new FormData()
    formData.append("avatar", avatar)
    await axiosInstance.post("/files/avatars", formData)
}

async function checkUpdateAvatar(
    data: z.infer<typeof BasicSchema>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentUser: any
) {
    if (!data.avatar) return

    // check if user has avatar
    if (currentUser.avatar === undefined) {
        await updateAvatar(data.avatar)
        return
    }

    // get avatar as base64 from server
    const response = await axiosInstance.get(
        url + "/files/avatars/" + currentUser.avatar + "/download"
    )
    const currentAvatar = response.data

    // convert new avatar to base64
    let newAvatar
    const reader = new FileReader()
    reader.onloadend = () => {
        const base64String = reader.result as string
        newAvatar = base64String.split
    }
    reader.readAsDataURL(data.avatar)

    // compare new avatar with current avatar
    if (newAvatar !== currentAvatar) {
        await updateAvatar(data.avatar)
    }
}

// eslint-disable-next-line
function isNewData(data: z.infer<typeof BasicSchema>, currentUser: any) {
    return (
        data.name !== currentUser.name ||
        data.email !== currentUser.email ||
        data.phone !== currentUser.phone
    )
}

export async function updateBasicProfile(data: z.infer<typeof BasicSchema>) {
    const currentUser = await getCurrentUser()

    await checkUpdateAvatar(data, currentUser)

    if (!isNewData(data, currentUser)) {
        return
    }

    const response = await axiosInstance.patch("/users/profile", data)
    return response.data
}

export async function updateBackground(background: string) {
    const formData = new FormData()
    formData.append("background", background)
    await axiosInstance.patch("/users/profile", formData, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

function getFormFieldName(field: string) {
    if (field.endsWith("s")) {
        return field.slice(0, -1)
    }
    return field
}

// add list of strings data for Positions, Skills, Interests
export async function addStringData(field: string, data: string) {
    const formField = getFormFieldName(field)
    const formData = new FormData()
    formData.append(formField, data)

    await axiosInstance.post("/users/" + field, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

// delete list of strings data for Positions, Skills, Interests
async function deleteStringData(field: string, data: string) {
    const formField = getFormFieldName(field)
    const formData = new FormData()
    formData.append(formField, data)

    const config = {
        data: formData,
        headers: {
            "Content-Type": "application/json",
        },
    }

    await axiosInstance.delete(url + "/users/" + field, config)
}

// add list of objects data for Education, Experience
export async function addFieldData(field: string, data: object) {
    console.log("data", data)
    await axiosInstance.post("/users/" + field, data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
}

// delete list of objects data for Education, Experience
// eslint-disable-next-line
async function deleteFieldData(field: string, data: any) {
    const formField = getFormFieldName(field)
    const formData = new FormData()
    formData.append(formField + "Id", data["_id"])

    const config = {
        data: formData,
        headers: {
            "Content-Type": "application/json",
        },
    }

    await axiosInstance.delete(url + "/users/" + field, config)
}

interface updateFieldProps {
    field: string
    data: string[] | Education[] | Experience[]
    currentUser: string[] | Education[] | Experience[]
}

async function updateField({ field, data, currentUser }: updateFieldProps) {
    if (data === undefined || currentUser === undefined) {
        return
    }

    // all keys in currentUser are removed from data
    // eslint-disable-next-line
    const addFields = data.filter((n: any) => !currentUser.includes(n))
    if (addFields.length > 0) {
        for (const _field of addFields) {
            if (typeof _field === "string") {
                await addStringData(field, _field)
            } else if (typeof _field == "object") {
                await addFieldData(field, _field)
            }
        }
    }

    // all keys in data are removed from currentUser
    // eslint-disable-next-line
    const removeFields = currentUser.filter((n: any) => !data.includes(n))
    if (removeFields.length > 0) {
        for (const _field of removeFields) {
            if (typeof _field === "string") {
                await deleteStringData(field, _field)
            } else if (typeof _field == "object") {
                await deleteFieldData(field, _field)
            }
        }
    }
}

export function uploadResume(resume: File, isUpdateProfile: boolean = false) {
    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("isUpdateProfile", isUpdateProfile.toString())
    return axiosInstance.post("/files/resumes", formData)
}

export async function updateProfile(data: z.infer<typeof ProfileSchema>) {
    if (data.resume) {
        await uploadResume(data.resume)
        return
    }

    const currentUser = await getCurrentUser()

    for (const [key, value] of Object.entries(data)) {
        if (value !== currentUser[key]) {
            if (key != "resume" && key != "background") {
                await updateField({
                    field: key,
                    data: value as string[] | Education[] | Experience[],
                    currentUser: currentUser[key],
                })
            } else if (key === "background") {
                await updateBackground(value as string)
            }
        }
    }
}

export const addSkill = async (skill: string) => {
    await axiosInstance.post("/users/skills", { skill: skill })
}
