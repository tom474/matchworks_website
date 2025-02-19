import { useState, useEffect } from "react"
import { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import { Button } from "@/components/ui/button"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
// icons
import {
    TriangleAlert,
    GraduationCap,
    BriefcaseBusiness,
    Trash2,
    Plus,
    FilePenLine,
} from "lucide-react"
import { Education, Experience } from "@/model/User"

// Define the parse form field interface
interface InputListFieldsProps {
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
}

// Define the parse form field component
const InputListFields: React.FC<InputListFieldsProps> = ({
    control,
    name,
    label,
    placeholder,
    state,
    setState,
    value0,
    value1,
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="grid items-center gap-4">
                    <FormLabel className="text-start flex flex-row items-center gap-2">
                        {label === "Education" && <GraduationCap />}
                        {label === "Experience" && <BriefcaseBusiness />}
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="hidden"
                            value={JSON.stringify(state)}
                        />
                    </FormControl>
                    <FormDialog
                        {...{ state, setState, value0, value1, name, field }}
                    />
                    <FormDescription className="hidden">
                        This is your {name}.
                    </FormDescription>
                    <FormMessage className="hidden" />
                </FormItem>
            )}
        />
    )
}

interface FormDialogProps {
    state: Education[] | Experience[]
    setState: React.Dispatch<React.SetStateAction<any>>
    value0: string
    value1: string
    name: string
    field: any
}

function FormDialog({
    state,
    setState,
    value0,
    value1,
    name,
    field,
}: FormDialogProps) {
    const [_id, setId] = useState<string>("")
    const [value_0, setValue_0] = useState<string>("")
    const [value_1, setValue_1] = useState<string>("")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [description, setDescription] = useState<string>("")

    function checkFields() {
        // check if start date is greater than end date
        if (startDate && endDate) {
            if (startDate > endDate) {
                const alert = document.querySelector(".alert") as HTMLElement
                alert.classList.remove("invisible")
                return true
            } else {
                const alert = document.querySelector(".alert") as HTMLElement
                alert.classList.add("invisible")
            }
        }

        // check if the fields are empty
        return (
            value_0.trim().length === 0 ||
            value_1.trim().length === 0 ||
            !startDate ||
            !endDate ||
            description.trim().length === 0
        )
    }

    // eslint-disable-next-line
    function handleSave(field: any, index?: number) {
        const newState = [
            ...state,
            {
                [value0]: value_0,
                [value1]: value_1,
                startDate: startDate?.toISOString() ?? "",
                endDate: endDate?.toISOString() ?? "",
                description,
            },
        ]
        if (index !== undefined) {
            const updatedState = newState.filter((value) => value._id !== _id)
            setState(updatedState)
            field.onChange(updatedState)
        } else {
            setState(newState)
            field.onChange(newState)
        }
        setId("")
        setValue_0("")
        setValue_1("")
        setStartDate(undefined)
        setEndDate(undefined)
        setDescription("")
    }

    return (
        <div>
            {state.map((value: Education | Experience, index: number) => (
                <div
                    key={index}
                    className="flex items-center gap-2 mb-2 rounded-lg border p-2 flex-row justify-between items-center"
                >
                    <span className="pl-2 pr-2 text-start">
                        {/* @ts-expect-error value0 and value1 is degree or institution of Education or jobTitle or company of Experience */}
                        {value[value0]} <br />
                        <span className="text-gray-500">
                            {/* @ts-expect-error value0 and value1 is degree or institution of Education or jobTitle or company of Experience */}
                            at {value[value1]}
                        </span>
                    </span>
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="px-3 py-2 bg-transparent"
                                >
                                    <FilePenLine />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit your {name}</DialogTitle>
                                    <DialogDescription>
                                        Edit details below.
                                    </DialogDescription>
                                </DialogHeader>
                                <EditDialogContent
                                    value={value}
                                    setId={setId}
                                    setValue_0={setValue_0}
                                    setValue_1={setValue_1}
                                    setStartDate={setStartDate}
                                    setEndDate={setEndDate}
                                    setDescription={setDescription}
                                    value0={value0}
                                    value1={value1}
                                    field={field}
                                />
                                <DialogFooter>
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <p className="alert text-red-500 flex flex-row gap-1 invisible">
                                            <TriangleAlert /> Start date cannot
                                            be greater than end date.
                                        </p>
                                        <DialogClose asChild>
                                            <Button
                                                onClick={() =>
                                                    handleSave(field, index)
                                                }
                                                type="button"
                                            >
                                                Save
                                            </Button>
                                        </DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => {
                                setState(state.filter((_, i) => i !== index))
                                field.onChange(
                                    state.filter((_, i) => i !== index)
                                )
                            }}
                            className="px-3 py-2 bg-transparent"
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
            ))}

            <Dialog>
                <DialogTrigger className="p-0 w-full" asChild>
                    <Button
                        variant="secondary"
                        className="w-full"
                        type="button"
                    >
                        <Plus />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add your {name}</DialogTitle>
                        <DialogDescription>
                            Fill details below.
                        </DialogDescription>
                        <AddDialogContent
                            value0={value0}
                            value1={value1}
                            setValue_0={setValue_0}
                            setValue_1={setValue_1}
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            setDescription={setDescription}
                            field={field}
                        />
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex flex-row justify-between items-center w-full">
                            <p className="alert text-red-500 flex flex-row gap-1 invisible">
                                <TriangleAlert /> Start date cannot be greater
                                than end date.
                            </p>
                            <DialogClose asChild>
                                <Button
                                    onClick={() => handleSave(field)}
                                    type="button"
                                    disabled={checkFields()}
                                >
                                    Add
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

interface AddDialogContentProps {
    value0: string
    value1: string
    setValue_0: React.Dispatch<React.SetStateAction<string>>
    setValue_1: React.Dispatch<React.SetStateAction<string>>
    startDate: Date | undefined
    endDate: Date | undefined
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDescription: React.Dispatch<React.SetStateAction<string>>
    field: any
}

function AddDialogContent({
    value0,
    value1,
    setValue_0,
    setValue_1,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setDescription,
    field,
}: AddDialogContentProps) {
    return (
        <div className="pt-4 flex flex-col gap-4">
            <Input
                placeholder={value0[0].toUpperCase() + value0.substring(1)}
                className={value0}
                type="text"
                onChange={(e) => setValue_0(e.target.value)}
            />
            <Input
                placeholder={value1[0].toUpperCase() + value1.substring(1)}
                className={value1}
                type="text"
                onChange={(e) => setValue_1(e.target.value)}
            />

            <div className="flex flex-row justify-around">
                <div className="flex flex-col">
                    <span>Start Date</span>
                    <Input
                        placeholder="Start Date"
                        className="hidden"
                        type="text"
                        value={startDate?.toISOString()}
                    />
                    <DateTimePicker
                        granularity="day"
                        placeholder="Pick start date"
                        value={startDate}
                        onChange={(date) => {
                            if (date) {
                                setStartDate(date)
                                field.onChange({
                                    ...field.value,
                                    startDate: date.toISOString(),
                                })
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <span>End Date</span>
                    <Input
                        placeholder="End Date"
                        className="hidden"
                        type="text"
                        value={endDate?.toISOString()}
                    />
                    <DateTimePicker
                        granularity="day"
                        placeholder="Pick end date"
                        value={endDate}
                        onChange={(date) => {
                            if (date) {
                                setEndDate(date)
                                field.onChange({
                                    ...field.value,
                                    endDate: date.toISOString(),
                                })
                            }
                        }}
                    />
                </div>
            </div>

            <Input
                placeholder="Description"
                className="description"
                type="text"
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>
    )
}

interface EditDialogContentProps {
    value: Education | Experience
    setId: React.Dispatch<React.SetStateAction<string>>
    setValue_0: React.Dispatch<React.SetStateAction<string>>
    setValue_1: React.Dispatch<React.SetStateAction<string>>
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDescription: React.Dispatch<React.SetStateAction<string>>
    value0: string
    value1: string
    field: any
}

function EditDialogContent({
    value,
    setId,
    setValue_0: setParentValue0, // Rename prop to avoid collision
    setValue_1: setParentValue1, // Rename prop to avoid collision
    setStartDate,
    setEndDate,
    setDescription,
    value0,
    value1,
    field,
}: EditDialogContentProps) {
    setId(value._id)

    // @ts-expect-error Education | Experience
    const [localValue0, setLocalValue0] = useState(value[value0] || "")
    // @ts-expect-error Education | Experience
    const [localValue1, setLocalValue1] = useState(value[value1] || "")
    const [localStartDate, setLocalStartDate] = useState<Date>(
        new Date(value.startDate)
    )
    const [localEndDate, setLocalEndDate] = useState<Date>(
        new Date(value.endDate)
    )
    const [localDescription, setLocalDescription] = useState(
        value.description || ""
    )

    // Update parent state when local state changes
    useEffect(() => {
        setParentValue0(localValue0)
    }, [localValue0])

    useEffect(() => {
        setParentValue1(localValue1)
    }, [localValue1])

    useEffect(() => {
        setStartDate(localStartDate)
    }, [localStartDate])

    useEffect(() => {
        setEndDate(localEndDate)
    }, [localEndDate])

    useEffect(() => {
        setDescription(localDescription)
    }, [localDescription])

    return (
        <div className="pt-4 flex flex-col gap-4">
            <Input
                placeholder={value0[0].toUpperCase() + value0.substring(1)}
                className={value0}
                type="text"
                value={localValue0}
                onChange={(e) =>
                    // @ts-expect-error Education | Experience
                    setLocalValue0(e.target.value || value[value0])
                }
            />
            <Input
                placeholder={value1[0].toUpperCase() + value1.substring(1)}
                className={value1}
                type="text"
                value={localValue1}
                onChange={(e) =>
                    // @ts-expect-error Education | Experience
                    setLocalValue1(e.target.value || value[value1])
                }
            />

            <div className="flex flex-row justify-around">
                <div className="flex flex-col">
                    <span>Start Date</span>
                    <Input
                        placeholder="Start Date"
                        className="hidden"
                        type="text"
                        value={value.startDate}
                    />
                    <DateTimePicker
                        granularity="day"
                        placeholder="Pick start date"
                        value={localStartDate}
                        onChange={(date) => {
                            if (date) {
                                setLocalStartDate(date)
                                field.onChange({
                                    ...field.value,
                                    startDate: date.toISOString(),
                                })
                            }
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <span>End Date</span>
                    <Input
                        placeholder="End Date"
                        className="hidden"
                        type="text"
                        value={value.endDate}
                    />
                    <DateTimePicker
                        granularity="day"
                        placeholder="Pick end date"
                        value={localEndDate}
                        onChange={(date) => {
                            if (date) {
                                setLocalEndDate(date)
                                field.onChange({
                                    ...field.value,
                                    endDate: date.toISOString(),
                                })
                            }
                        }}
                    />
                </div>
            </div>

            <Input
                placeholder="Description"
                className="description"
                type="text"
                value={localDescription}
                onChange={(e) =>
                    setLocalDescription(e.target.value || value.description)
                }
            />
        </div>
    )
}

export default InputListFields
