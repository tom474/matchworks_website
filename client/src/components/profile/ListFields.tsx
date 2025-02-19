// components
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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
    GraduationCap,
    BriefcaseBusiness,
} from "lucide-react"
import { Control } from "react-hook-form"
import InputListFields from "@/components/register/InputListFields"
import { Education, Experience } from "@/model/User"

const formatDateString = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date)
}

interface ListFieldsProps {
    title: string
    // eslint-disable-next-line
    control: Control<any>
    name: string
    label: string
    placeholder: string
    state: Education[] | Experience[]
    // eslint-disable-next-line
    setState: React.Dispatch<React.SetStateAction<any>>
    value0: string
    value1: string
    submit?: () => void
}

export default function ListFields({
    title,
    control,
    name,
    label,
    placeholder,
    state,
    setState,
    value0,
    value1,
    submit,
}: ListFieldsProps) {
    return (
        <Card>
            <div className="flex flex-row items-center justify-between">
                <CardHeader>
                    <CardTitle className="flex flex-row gap-2 items-center">
                        {title === "Education" && <GraduationCap />}
                        {title === "Experience" && <BriefcaseBusiness />}
                        <span>{title}</span>
                    </CardTitle>
                    {(!state || state.length === 0) && (
                        <CardDescription>
                            {title === "Education" &&
                                "Share your academic background..."}
                            {title === "Experience" &&
                                "Detail your work experience and achievements..."}
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
                        <DialogContent className="w-max max-h-screen overflow-y-scroll custom-scrollbar">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click
                                    save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <InputListFields
                                control={control}
                                name={name}
                                label={label}
                                placeholder={placeholder}
                                state={state}
                                setState={setState}
                                value0={value0}
                                value1={value1}
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
                <CardContent className="border-t pt-2 flex flex-col gap-4">
                    {Object.keys(state).map((key, index) => (
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            key={index}
                        >
                            <AccordionItem value={"item-" + index}>
                                <AccordionTrigger className="bg-transparent border-none outline-none focus:outline-none">
                                    {/* @ts-expect-error loop key of state */}
                                    {state[key][value0]} at {state[key][value1]}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <AccordionCard
                                        // @ts-expect-error loop key of state
                                        value0={state[key][value0]}
                                        // @ts-expect-error loop key of state
                                        value1={state[key][value1]}
                                        // @ts-expect-error loop key of state
                                        startDate={state[key].startDate}
                                        // @ts-expect-error loop key of state
                                        endDate={state[key].endDate}
                                        // @ts-expect-error loop key of state
                                        description={state[key].description}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </CardContent>
            )}
        </Card>
    )
}

function AccordionCard({
    value0,
    value1,
    startDate,
    endDate,
    description,
}: // eslint-disable-next-line
any) {
    return (
        <Card className="grid grid-cols-8 bg-secondary hover:bg-secondary/80">
            <div className="col-span-7">
                <CardHeader className="pb-2">
                    <CardTitle>{value0}</CardTitle>
                    <CardDescription>{value1}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <strong>Duration:</strong>&nbsp;
                    {formatDateString(startDate)} - {formatDateString(endDate)}
                </CardContent>
                <CardFooter>
                    <strong>Description:</strong> &nbsp;{description}
                </CardFooter>
            </div>
        </Card>
    )
}
