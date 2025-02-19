import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ResumeScore from "@/components/resume-builder/ResumeScore"
import { getResumeHasFeedback } from "@/api/ResumeApi"

// eslint-disable-next-line
export default function ResumeHistory({ user }: any) {
    // eslint-disable-next-line
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        const fetchHistory = async () => {
            const resumeFeedbacks = await getResumeHasFeedback(user.resumeIds)
            setHistory(resumeFeedbacks)
        }
        fetchHistory()
    }, [user.resumeIds])

    return (
        <Card className="m-20 mt-0">
            {history ? (
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>
                        You can view your previous analysis here.
                    </CardDescription>
                </CardHeader>
            ) : (
                <CardHeader>
                    <CardTitle>Select your uploaded resume</CardTitle>
                    <CardDescription>
                        You can select your uploaded resume here.
                    </CardDescription>
                </CardHeader>
            )}
            <CardContent>
                {user.resumeIds.length !== 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                        {/* eslint-disable-next-line */}
                        {history.map((history: any) => (
                            <ResumeScore
                                key={history.resume._id}
                                resumeId={history.resume._id}
                                score={history.resume.overallScore}
                                updatedAt={history.resume.updatedAt}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No resumes analysis yet.</p>
                )}
            </CardContent>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
