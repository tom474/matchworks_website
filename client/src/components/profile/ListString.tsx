// components
import { Button } from "@/components/ui/button"
import { Control } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
// icons
import {
    CirclePlus,
    Pencil,
    Star,
    Lightbulb,
    MessageCircleHeart,
} from "lucide-react"
// components
import InputListString from "@/components/register/InputListString"

interface ListStringProps {
    title: string
    // eslint-disable-next-line
    control: Control<any>
    name: string
    label: string
    placeholder: string
    state: string[]
    setState: React.Dispatch<React.SetStateAction<string[]>>
    submit?: () => void
}

export default function ListString({
    title,
    control,
    name,
    label,
    placeholder,
    state,
    setState,
    submit,
}: ListStringProps) {
    return (
        <Card>
            <div className="flex flex-row items-center justify-between">
                <CardHeader>
                    <CardTitle className="flex flex-row gap-2 items-center">
                        {title === "Positions" && <Star />}
                        {title === "Skills" && <Lightbulb />}
                        {title === "Interests" && <MessageCircleHeart />}
                        <span>{title}</span>
                    </CardTitle>
                    {(!state || state.length === 0) && (
                        <CardDescription>
                            {title === "Positions" &&
                                "List your current and previous roles..."}
                            {title === "Skills" &&
                                "Highlight your professional skill set..."}
                            {title === "Interests" &&
                                "Mention hobbies or areas of interest..."}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardFooter className="p-0 pr-5 flex flex-col justify-center items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            {!state || state.length !== 0 ? (
                                <Button variant="outline" size="icon">
                                    <Pencil />
                                </Button>
                            ) : (
                                <Button variant="outline" size="icon">
                                    <CirclePlus />
                                </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-scroll custom-scrollbar">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <InputListString
                                control={control}
                                name={name}
                                label={label}
                                placeholder={placeholder}
                                state={state}
                                setState={setState}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" onClick={submit}>
                                        Save changes
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </div>
            {(!state || state.length !== 0) && (
                <CardContent className="border-t pt-5 flex flex-wrap flex-row gap-2 w-full">
                    {state.map((value, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="text-sm p-1 pl-2.5 pr-2.5 whitespace-nowrap bg-secondary hover:bg-secondary/80"
                        >
                            {value}
                        </Badge>
                    ))}
                </CardContent>
            )}
        </Card>
    )
}
