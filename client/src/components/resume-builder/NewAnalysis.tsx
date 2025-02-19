import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadTab from "@/components/resume-builder/UploadTab"
import SelectTab from "@/components/resume-builder/SelectTab"

// eslint-disable-next-line
export default function NewAnalysis({ user }: any) {
    return (
        <Tabs defaultValue="upload" className="flex flex-col items-center">
            <TabsList className="grid w-96 grid-cols-2">
                <TabsTrigger
                    value="upload"
                    className="bg-transparent data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                    Upload
                </TabsTrigger>
                <TabsTrigger
                    value="select"
                    className="bg-transparent data-[state=active]:bg-foreground data-[state=active]:text-background"
                >
                    Select
                </TabsTrigger>
            </TabsList>
            <TabsContent
                className="mt-5 p-5 pt-0 w-full basic-full"
                value="upload"
            >
                <UploadTab user={user} />
            </TabsContent>
            <TabsContent className="mt-5 p-5 pt-0" value="select">
                <SelectTab user={user} history={false} />
            </TabsContent>
        </Tabs>
    )
}
