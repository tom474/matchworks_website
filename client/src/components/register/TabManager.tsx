import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    TabsContent
} from "@/components/ui/tabs"
import ResumeCardHeader from "@/components/register/ResumeCardHeader"
import React from "react"

interface TabManagerProps {
    value: string
    title: string
    description: string
    input: React.ReactElement
    footer: React.ReactElement
}

export default function TabManager({ value, title, description, input, footer }: TabManagerProps) {
    return (
        <TabsContent value={value}>
            <Card>
                <ResumeCardHeader title={title} description={description} />
                <CardContent className="flex flex-col gap-2">
                    {input}
                </CardContent>
                {footer}
            </Card>
        </TabsContent>
    )
}