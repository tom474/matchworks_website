import { axiosInstance } from "@/utils/index"
import { z } from "zod"
import { LoginFormSchema } from "@/model/Authentication"

export async function login(data: z.infer<typeof LoginFormSchema>) {
    const response = await axiosInstance.post("/auth/login", data)
    return response.data
}
