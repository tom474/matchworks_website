import { z } from "zod"

export const LoginFormSchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(255),
})

export const LoginFormSchemaDefaultValues = {
    email: "",
    password: "",
}

export const RegisterBasicFormSchema = z.object({
    name: z.string().min(1).max(255),
    phone: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(255),
    confirmpassword: z.string().min(1).max(255),
    avatar: z.instanceof(File).optional(),
})

export const RegisterBasicFormSchemaDefaultValues = {
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmpassword: "",
    avatar: undefined,
}
