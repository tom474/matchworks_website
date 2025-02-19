import { useGetUserData } from "@/hooks/UserHook"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import HistoryItem from "./HistoryItem"

function RoadmapHistory() {
    const { userData, isPendingUserData } = useGetUserData()

    if (isPendingUserData) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex-1 min-h-[calc(100vh-155px)] h-auto m-20 mt-12">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-xl">Roadmap History</CardTitle>
                </CardHeader>

                <CardContent
                    className={`flex flex-wrap gap-2 ${
                        userData.roadmapIds.length > 3 && "justify-between"
                    }`}
                >
                    {userData.roadmapIds.map((roadmap: string) => (
                        <HistoryItem key={roadmap} roadmapId={roadmap} />
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default RoadmapHistory
