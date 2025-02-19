import { createInterview } from "@/api/InterviewApi"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "./use-toast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const useCreateInterview = () => {
    const { toast } = useToast()
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation({
        mutationFn: createInterview,
        onSuccess: (data) => {
            console.log("Interview created:", data)

            toast({
                title: "Interview created!",
                description: "You have successfully created a Interview.",
            })

            navigate(
                `/virtual-interview-practice/interview/${data.interviewId}`
            )
        },
        onError: (error) => {
            console.error("Failed to create interview:", error)

            toast({
                title: "Failed to create interview",
                description: "Please try again later.",
                variant: "destructive",
            })
        },
    })

    return {
        createInterview: mutate,
        isPendingCreate: isPending,
    }
}

interface Message {
    role: "agent" | "user"
    content: string
    id: number
}

export const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([])

    return { messages, setMessages }
}
