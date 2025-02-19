import {
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ResumeCardFooterProps {
    handleBack: () => void
    handleNext: () => void
}

export default function ResumeCardFooter({ handleBack, handleNext }: ResumeCardFooterProps) {
    return (
        <CardFooter className="flex justify-between">
            <Button onClick={handleBack} variant="secondary" type="button">Back</Button>
            <Button onClick={handleNext} type="button">Next</Button>
        </CardFooter>
    )
}