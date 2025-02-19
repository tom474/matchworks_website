import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getInterview, getQuestions } from "@/api/InterviewApi"
import Interview, { Question } from "@/model/Interview"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion"
import {
    BicepsFlexed,
    Dot,
    MessageCircleQuestion,
    ThumbsDown,
} from "lucide-react"
import { Separator } from "../ui/separator"

// eslint-disable-next-line
export default function Feedback({ setMessages }: any) {
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const [interview, setInterview] = useState<Interview | null>(null)

    // side bar
    useEffect(() => {
        if (!interviewId) return

        // check if interview is not completed
        const checkInterview = async () => {
            const interview = await getInterview(interviewId)
            if (
                interview.strengths.length === 0 &&
                interview.weaknesses.length === 0 &&
                interview.suggestions.length === 0
            ) {
                navigate(
                    `/virtual-interview-practice/interview/${interview._id}`
                )
            }
        }
        checkInterview()

        const fetchQuestions = async () => {
            const interview = await getInterview(interviewId)
            setInterview(interview)
            const fetchedQuestions = await getQuestions(interview)
            const messagesQuestions = fetchedQuestions.map(
                (question: string, index: number) => {
                    return {
                        role: "agent",
                        content: question,
                        id: index + 1,
                    }
                }
            )
            setMessages(messagesQuestions)
        }
        fetchQuestions()
    }, [interviewId, setMessages, navigate])

    return (
        <div className="w-full mx-7 mt-12">
            <Overall interview={interview} />

            {interview?.questions.map((question: Question, index) => (
                <QuestionFeedback
                    key={question._id}
                    question={question}
                    index={index}
                />
            ))}
        </div>
    )
}

const QuestionFeedback = ({
    question,
    index,
}: {
    question: Question
    index: number
}) => {
    const accordionTitleStyle =
        "bg-transparent text-lg p-0 pb-0 border-none outline-none focus:outline-none"

    const accordionContentStyle = "p-0 pt-2"
    index += 1
    return (
        <Card id={"agent" + index} className="h-fit mt-5 text-start mb-5">
            <Accordion
                type="multiple"
                className="flex flex-col gap-5 text-start p-5 pb-0 pt-0 "
            >
                <AccordionItem
                    value="strengths"
                    className="p-5 pt-0 border-none"
                >
                    <AccordionTrigger className={accordionTitleStyle}>
                        <span className="mt-4">Question {index}</span>
                    </AccordionTrigger>
                    <AccordionContent className={accordionContentStyle}>
                        <CardHeader>
                            <p>{question.question}</p>
                        </CardHeader>
                        <Separator />

                        <CardContent className="mt-3">
                            <span className="font-semibold">Your answer</span>
                            <h3>{question.answer}</h3>
                        </CardContent>

                        <Separator />
                        <CardContent>
                            <p className="font-semibold mt-3">Feedback</p>
                            <p>{question.feedback}</p>
                        </CardContent>
                        <CardFooter className="hidden"></CardFooter>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    )
}

const Overall = ({ interview }: { interview: Interview | null }) => {
    const accordionTitleStyle =
        "bg-transparent text-lg p-0 pb-0 border-none outline-none focus:outline-none"
    const accordionHeaderStyle =
        "flex flex-row items-center justify-center gap-3"
    const accordionContentStyle = "p-0 pt-2"
    return (
        <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">Overall</CardTitle>
            </CardHeader>
            <Accordion
                type="multiple"
                className="flex flex-col gap-5 text-start p-5 pt-0"
                defaultValue={["strengths", "weaknesses", "suggestions"]}
            >
                <AccordionItem value="strengths" className="p-5 pt-0">
                    <AccordionTrigger className={accordionTitleStyle}>
                        <span className={accordionHeaderStyle}>
                            <BicepsFlexed />
                            Strengths
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className={accordionContentStyle}>
                        <ul>
                            {interview?.strengths.map((strength: string) => (
                                <li
                                    key={strength}
                                    className="flex flex-row gap-1 items-center"
                                >
                                    <div className="size-7">
                                        <Dot />
                                    </div>{" "}
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="weaknesses" className="p-5 pt-0">
                    <AccordionTrigger className={accordionTitleStyle}>
                        <span className={accordionHeaderStyle}>
                            <ThumbsDown />
                            Weaknesses
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className={accordionContentStyle}>
                        <ul>
                            {interview?.weaknesses.map((weakness: string) => (
                                <li
                                    key={weakness}
                                    className="flex flex-row gap-1 items-center"
                                >
                                    <div className="size-7">
                                        <Dot />
                                    </div>{" "}
                                    {weakness}
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="suggestions" className="p-5 pt-0">
                    <AccordionTrigger className={accordionTitleStyle}>
                        <span className={accordionHeaderStyle}>
                            <MessageCircleQuestion />
                            Suggestions
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className={accordionContentStyle}>
                        <ul>
                            {interview?.suggestions.map(
                                (suggestion: string) => (
                                    <li
                                        key={suggestion}
                                        className="flex flex-row gap-1 items-center"
                                    >
                                        <div className="size-7">
                                            <Dot />
                                        </div>
                                        {suggestion}
                                    </li>
                                )
                            )}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
