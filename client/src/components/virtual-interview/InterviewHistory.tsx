import { useGetCurrentUser } from "@/hooks/UserHook"
import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getInterview, deleteInterview } from "@/api/InterviewApi"
import Interview from "@/model/Interview"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingIcon } from "@/components/loading-icon"
import { AxiosError } from "axios"

export default function InterviewHistory() {
    const { getCurrentUser, user, isPendingGetCurrentUser } =
        useGetCurrentUser()
    // eslint-disable-next-line
    const [history, setHistory] = useState<any[]>([])
    const { toast } = useToast()

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    useEffect(() => {
        const fetchHistory = async () => {
            const interviewIds = user.interviewIds
            const history = await Promise.all(
                interviewIds.map(async (interviewId: string) => {
                    const interview = await getInterview(interviewId)
                    return interview
                })
            )
            setHistory(history)
        }
        fetchHistory()
    }, [user])

    function formatDate(date: Date) {
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
        return new Date(date).toLocaleDateString(undefined, dateOptions)
    }

    async function handleDeleteInterview(id: string) {
        try {
            toast({
                title: "Deleting...",
                description: (
                    <div>
                        <LoadingIcon size={"size-5"} />
                    </div>
                ),
            })
            await deleteInterview(id)
            toast({
                title: "Interview Deleted Successfully",
                description: "Your interview has been deleted.",
            })
            getCurrentUser()
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message
            toast({
                variant: "destructive",
                title: "Interview Deletion Failed",
                description: errorMessage,
            })
        }
    }

    return (
        <>
            {isPendingGetCurrentUser ? (
                <p>Loading...</p>
            ) : (
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
                    <CardContent className="grid grid-cols-3 gap-4 text-start">
                        {history.map((interview: Interview) => (
                            <Card key={interview._id}>
                                <Link
                                    to={`/virtual-interview-practice/interview/${interview._id}`}
                                    key={interview._id}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-foreground">
                                            {interview.jobTitle}
                                        </CardTitle>
                                        <CardDescription className="font-normal">
                                            Level: {interview.jobLevel}
                                        </CardDescription>
                                    </CardHeader>
                                    {interview.strengths.length === 0 ? (
                                        <CardContent className="m-0">
                                            <span className="text-foreground font-normal">
                                                Status:{" "}
                                            </span>
                                            <span className="text-red-500">
                                                Pending
                                            </span>
                                        </CardContent>
                                    ) : (
                                        <CardContent>
                                            <span className="text-foreground font-normal">
                                                Status:{" "}
                                            </span>
                                            <span className="text-green-500">
                                                Completed
                                            </span>
                                        </CardContent>
                                    )}
                                </Link>
                                <CardFooter className="text-sm text-gray-500 font-normal flex flex-row justify-between items-center">
                                    <span>
                                        Updated at{" "}
                                        {formatDate(interview.updatedAt)}
                                    </span>
                                    <Button
                                        variant="destructive"
                                        className="p-2.5"
                                        onClick={() =>
                                            handleDeleteInterview(interview._id)
                                        }
                                    >
                                        <Trash2 />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                    <CardFooter className="hidden"></CardFooter>
                </Card>
            )}
        </>
    )
}
