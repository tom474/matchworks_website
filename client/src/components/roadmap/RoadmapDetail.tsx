import { useEffect, useRef, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Progress } from "../ui/progress"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { Markdown } from "../Markdown"
import { Button } from "../ui/button"
import { useLocation, useNavigate } from "react-router-dom"
import { useRoadmapContext } from "@/context/RoadmapContext"
import { useGetRoadmapById } from "@/hooks/RoadmapHook"
import ChecklistItem from "./ChecklistItem"

function RoadmapDetail() {
    const { selectedRoadmapId } = useRoadmapContext()
    const { roadmap } = useGetRoadmapById(selectedRoadmapId!)
    const progressRef = useRef<HTMLElement>(null)
    const overviewRef = useRef<HTMLElement>(null)
    const checklistRef = useRef<HTMLElement>(null)
    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedRoadmapId === null) {
            navigate("/roadmap-generator")
        }
    }, [navigate, selectedRoadmapId])

    useEffect(() => {
        const hash = location.hash.replace("#", "")
        const sectionRefMap: { [key: string]: React.RefObject<HTMLElement> } = {
            progress: progressRef,
            overview: overviewRef,
            checklist: checklistRef,
        }

        if (sectionRefMap[hash]?.current) {
            const element = sectionRefMap[hash].current
            const offsetTop = element.offsetTop
            const navbarHeight = 75

            window.scrollTo({
                top: offsetTop - navbarHeight,
                behavior: "smooth",
            })
        }
    }, [location.hash])

    return (
        <div className="w-full flex flex-col gap-3 justify-center m-14">
            <section id="title">
                <h1 className="text-2xl font-semibold ">
                    {roadmap?.title} - {roadmap?.level}
                </h1>
            </section>
            <section id="progress" ref={progressRef}>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Progress</CardTitle>
                            <CardDescription>
                                <p>
                                    Track your progress and stay motivated. Keep
                                    your roadmap up-to-date and see how far
                                    you've come.
                                </p>
                            </CardDescription>
                        </div>
                        <div>
                            <p className="text-4xl font-semibold text-blue-600">
                                {roadmap?.progress}{" "}
                                <span className="text-xl font-semibold text-foreground">
                                    %
                                </span>
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Progress value={roadmap?.progress} />
                    </CardContent>
                </Card>
            </section>
            <section id="overview" ref={overviewRef}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Overview</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <CardDescription>
                            <Card>
                                <CardContent className="mt-5">
                                    <ExpandableCard>
                                        {roadmap?.description}
                                    </ExpandableCard>
                                </CardContent>
                            </Card>
                        </CardDescription>
                    </CardContent>
                </Card>
            </section>
            <section id="checklist" ref={checklistRef}>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-2xl">Checklist</CardTitle>
                        <Button
                            onClick={() => {
                                setIsUpdate((prev) => !prev)
                            }}
                            variant={isUpdate ? "destructive" : "default"}
                        >
                            {!isUpdate ? "Update" : "Cancel"}
                        </Button>
                    </CardHeader>

                    <CardContent>
                        {roadmap?.checklist.map((item, index) => (
                            <ChecklistItem
                                key={index}
                                roadmapId={roadmap._id}
                                index={index}
                                item={item}
                                isUpdate={isUpdate}
                            />
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

function ExpandableCard({ children }: { children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false) // State to toggle expanded content

    return (
        <div>
            <div
                className={`relative overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-full" : "max-h-[10rem]"
                }`}
                style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : 3, // Show 3 lines if collapsed
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                <div className="flex justify-end">
                    <div
                        onClick={() => {
                            setIsExpanded((prev) => !prev)
                        }}
                        className="w-5 h-5 rounded-full border-[1px] border-black flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all duration-300"
                    >
                        {isExpanded ? <ChevronDown /> : <ChevronLeft />}
                    </div>
                </div>
                <Markdown>{children}</Markdown>
            </div>
        </div>
    )
}

export default RoadmapDetail
