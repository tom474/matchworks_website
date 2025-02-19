import { useParams, useNavigate } from "react-router-dom"
import * as React from "react"
import { Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRef, useEffect } from "react"
import {
    getInterview,
    getQuestions,
    generateFeedback,
} from "@/api/InterviewApi"
import { useState } from "react"
import { LoadingIcon } from "@/components/loading-icon"
import { Message } from "@/model/Interview"

interface InterviewProps {
    messages: Message[]
    // eslint-disable-next-line
    setMessages: any
}

export default function Interview({ messages, setMessages }: InterviewProps) {
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const [questions, setQuestions] = useState<string[] | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
    const [input, setInput] = React.useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputLength = input.trim().length

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (!interviewId) return

        // check if interview is already completed
        const checkInterview = async () => {
            const interview = await getInterview(interviewId)
            if (
                interview.strengths.length > 0 &&
                interview.weaknesses.length > 0 &&
                interview.suggestions.length > 0
            ) {
                navigate(
                    `/virtual-interview-practice/feedback/${interview._id}`
                )
            }
        }
        checkInterview()

        const fetchQuestions = async () => {
            const interview = await getInterview(interviewId)
            const fetchedQuestions = await getQuestions(interview)
            setQuestions(fetchedQuestions)
            setMessages([
                {
                    role: "agent",
                    content: "Welcome to the interview! Let's get started.",
                    id: 0,
                },
                {
                    role: "agent",
                    content: fetchedQuestions[0],
                    id: 1,
                },
            ])
        }
        fetchQuestions()
    }, [interviewId, setQuestions, setMessages, navigate])

    useEffect(() => {
        const getFeedback = async () => {
            if (isGeneratingFeedback) {
                if (!interviewId) return
                const answers = []
                for (let i = 0; i < messages.length; i++) {
                    const message = messages[i]
                    if (message.role === "user") {
                        answers.push(message.content)
                    }
                }
                const response = await generateFeedback(interviewId, answers)
                navigate(
                    `/virtual-interview-practice/feedback/${response.interview._id}`
                )
            }
        }
        getFeedback()
    }, [isGeneratingFeedback, interviewId, messages, navigate])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const stylesheet = `
        #content {
            height: 100%
        }
        body {
            overflow-x: hidden;
        }
    `

    return (
        <>
            <style>{stylesheet}</style>
            <Card className="fixed text-start border-none shadow-none w-max max-w-[50%] h-full max-h-[95%] flex flex-col justify-between overflow-auto custom-scrollbar">
                <div>
                    <CardHeader className="flex flex-row items-center">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage
                                    src="/avatars/01.png"
                                    alt="Image"
                                />
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-md font-medium leading-none">
                                    MatchWorks
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/*  eslint-disable-next-line */}
                            {messages.map((message: any, index: any) => (
                                <div
                                    key={index}
                                    id={"agent" + message.id}
                                    className={cn(
                                        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                        message.role === "user"
                                            ? "ml-auto bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    {message.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </CardContent>
                </div>
                <CardFooter>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            if (inputLength === 0) return
                            if (
                                questions &&
                                currentQuestion === questions.length
                            ) {
                                if (interviewId) {
                                    setMessages([
                                        ...messages,
                                        {
                                            role: "user",
                                            content: input,
                                            id: 0,
                                        },
                                        {
                                            role: "agent",
                                            content: (
                                                <div className="flex flex-row items-center space-x-2">
                                                    <span>
                                                        That is the end of the
                                                        interview. Thank you for
                                                        your time! Generating
                                                        feedback...
                                                    </span>
                                                    <LoadingIcon
                                                        size={"size-5"}
                                                    />
                                                </div>
                                            ),
                                            id: 0,
                                        },
                                    ])
                                    setIsGeneratingFeedback(true)
                                }
                            } else {
                                setMessages([
                                    ...messages,
                                    {
                                        role: "user",
                                        content: input,
                                        id: 0,
                                    },
                                    {
                                        role: "agent",
                                        content: questions
                                            ? questions[currentQuestion]
                                            : "",
                                        id: currentQuestion + 1,
                                    },
                                ])
                            }
                            setCurrentQuestion(currentQuestion + 1)
                            setInput("")
                        }}
                        className="flex w-full items-center space-x-2 pb-5"
                    >
                        <Input
                            id="message"
                            placeholder="Type your message..."
                            className="flex-1"
                            autoComplete="off"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            disabled={
                                currentQuestion ===
                                (questions ? questions.length + 1 : 0)
                            }
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={
                                inputLength === 0 ||
                                currentQuestion ===
                                    (questions ? questions.length + 1 : 0)
                            }
                        >
                            <Send />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </>
    )
}
