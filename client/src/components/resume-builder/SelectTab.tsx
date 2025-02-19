import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ResumeDialog from "@/components/resume-builder/ResumeDialog"

// eslint-disable-next-line
export default function SelectTab({ user, history }: any) {
    return (
        <Card>
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
            <CardContent className="">
                {user.resumeIds.length !== 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                        {user.resumeIds.map((resumeId: string) => (
                            <ResumeDialog key={resumeId} resumeId={resumeId} />
                        ))}
                    </div>
                ) : (
                    <p>No resumes uploaded yet.</p>
                )}
            </CardContent>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
