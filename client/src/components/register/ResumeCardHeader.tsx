import {
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ResumeCardHeaderProps {
    title: string
    description: string
}

export default function ResumeCardHeader({ title, description }: ResumeCardHeaderProps) {
    return (
        <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col text-start gap-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </div>
            <Button variant="ghost" className="bg-transparent" type="submit">Skip</Button>
        </CardHeader>
    )
}