import { axiosInstance } from "@/utils/index"
import { z } from "zod"
import { RegisterBasicFormSchema } from "@/model/Authentication"
import { ProfileSchema } from "@/model/User"
import {
    updateAvatar,
    addStringData,
    addFieldData,
    uploadResume,
    updateBackground,
} from "@/api/ProfileApi"

export async function register(data: z.infer<typeof RegisterBasicFormSchema>) {
    const response = await axiosInstance.post("/auth/register", data)

    if (data.avatar) {
        await updateAvatar(data.avatar)
    }

    return response.data
}

function isArrayValue(value: unknown): value is unknown[] {
    return Array.isArray(value)
}

export async function createProfile(data: z.infer<typeof ProfileSchema>) {
    if (data.resume) {
        await uploadResume(data.resume, true)
        return
    }

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
            if (key === "background") {
                await updateBackground(value)
                continue
            }
        } else if (typeof value == "object") {
            if (key === "resume") {
                continue
            }
            if (!isArrayValue(value)) return
            for (const _field of value) {
                if (typeof _field === "string") {
                    await addStringData(key, _field)
                } else if (typeof _field == "object") {
                    await addFieldData(key, _field)
                }
            }
        }
    }
}
