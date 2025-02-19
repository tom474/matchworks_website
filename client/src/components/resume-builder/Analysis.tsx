import { useParams } from "react-router-dom"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    BicepsFlexed,
    ThumbsDown,
    MessageCircleQuestion,
    Dot,
} from "lucide-react"
import ResumePreview from "@/components/resume-builder/ResumePreview"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LoadingIcon } from "@/components/loading-icon"
import { useResumeAnalysis } from "@/hooks/ResumeHook"

export default function Analysis() {
    const { resumeId } = useParams()
    const { analysis, isPendingAnalysis } = useResumeAnalysis(resumeId!)

    return (
        <>
            {isPendingAnalysis ? (
                <div className="h-[20rem] flex flex-col gap-5 items-center justify-center">
                    <LoadingIcon size={"size-20"} />
                    <p>Generating your analysis...</p>
                </div>
            ) : (
                <div className="flex flex-row gap-5 relative p-20 pt-0 grid grid-cols-4">
                    <div className="flex flex-col gap-5 col-span-3">
                        <AnalysisAspects feedbacks={analysis.feedback} />
                    </div>

                    <div className="col-span-1">
                        <ResumePreview
                            key={resumeId}
                            resumeId={resumeId}
                            score={analysis.overallScore}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

// eslint-disable-next-line
function AnalysisAspects({ feedbacks }: any) {
    const accordionTitleStyle =
        "bg-transparent text-lg p-0 pb-0 border-none outline-none focus:outline-none"
    const accordionHeaderStyle =
        "flex flex-row items-center justify-center gap-3"
    const accordionContentStyle = "p-0 pt-2"

    return (
        <>
            {/* eslint-disable-next-line */}
            {feedbacks.map((feedback: any, index: number) => (
                <Card className="h-fit" key={index}>
                    <CardHeader
                        className="flex flex-row items-center justify-between"
                        id={"aspect" + index}
                    >
                        <CardTitle className="text-2xl">
                            Aspect: {feedback.aspect}
                        </CardTitle>
                        <CardDescription className="relative">
                            <span className="text-md text-white font-bold absolute inset-0 flex items-center justify-center z-10">
                                {feedback.score}/100
                            </span>
                            <Progress
                                value={feedback.score}
                                className="w-[15rem] h-[1.2rem]"
                            />
                        </CardDescription>
                    </CardHeader>
                    <Accordion
                        type="multiple"
                        className="flex flex-col gap-5 text-start p-5 pt-0"
                        defaultValue={[
                            "strengths",
                            "weaknesses",
                            "suggestions",
                        ]}
                    >
                        <AccordionItem value="strengths" className="p-5 pt-0">
                            <AccordionTrigger
                                className={accordionTitleStyle}
                                id={"strengths" + index}
                            >
                                <span className={accordionHeaderStyle}>
                                    <BicepsFlexed />
                                    Strengths
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className={accordionContentStyle}>
                                <ul>
                                    {feedback.strengths.map(
                                        (strength: string) => (
                                            <li
                                                key={strength}
                                                className="flex flex-row gap-1 items-center"
                                            >
                                                <div className="size-7">
                                                    <Dot />
                                                </div>{" "}
                                                {strength}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="weaknesses" className="p-5 pt-0">
                            <AccordionTrigger
                                className={accordionTitleStyle}
                                id={"weaknesses" + index}
                            >
                                <span className={accordionHeaderStyle}>
                                    <ThumbsDown />
                                    Weaknesses
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className={accordionContentStyle}>
                                <ul>
                                    {feedback.weaknesses.map(
                                        (weakness: string) => (
                                            <li
                                                key={weakness}
                                                className="flex flex-row gap-1 items-center"
                                            >
                                                <div className="size-7">
                                                    <Dot />
                                                </div>{" "}
                                                {weakness}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="suggestions" className="p-5 pt-0">
                            <AccordionTrigger
                                className={accordionTitleStyle}
                                id={"suggestions" + index}
                            >
                                <span className={accordionHeaderStyle}>
                                    <MessageCircleQuestion />
                                    Suggestions
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className={accordionContentStyle}>
                                <ul>
                                    {feedback.suggestions.map(
                                        (suggestion: string) => (
                                            <li
                                                key={suggestion}
                                                className="flex flex-row gap-1 items-center"
                                            >
                                                <div className="size-7">
                                                    <Dot />{" "}
                                                </div>
                                                <p>{suggestion}</p>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <CardFooter className="hidden"></CardFooter>
                </Card>
            ))}
        </>
    )
}
