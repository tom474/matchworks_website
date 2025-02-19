import { useState } from "react"
import { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
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
import { Star, Lightbulb, MessageCircleHeart, Trash2, Plus } from "lucide-react"

// Define the parse form field interface
interface InputListStringProps {
    // eslint-disable-next-line
    control: Control<any>
    name: string
    label: string
    placeholder: string
    state: string[]
    setState: React.Dispatch<React.SetStateAction<string[]>>
}

// Define the parse form field component
const InputListString: React.FC<InputListStringProps> = ({
    control,
    name,
    label,
    placeholder,
    state,
    setState,
}) => {
    const [value, setValue] = useState<string>("")

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="grid items-center gap-4">
                    <FormLabel className="text-start flex flex-row items-center gap-2">
                        {label === "Positions" && <Star />}
                        {label === "Skills" && <Lightbulb />}
                        {label === "Interests" && <MessageCircleHeart />}
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
                    <div>
                        {state.map((value, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 mb-2 rounded-lg border p-2 flex-row justify-between items-center"
                            >
                                <span className="pl-2 pr-2">{value}</span>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        setState(
                                            state.filter((_, i) => i !== index)
                                        )
                                        field.onChange(
                                            state.filter((_, i) => i !== index)
                                        )
                                    }}
                                    className="px-3 py-2 bg-transparent"
                                >
                                    <Trash2 />
                                </Button>
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
                                        Add 1 below.
                                    </DialogDescription>
                                    <div className="pt-4">
                                        <Input
                                            className="value"
                                            value={value}
                                            onChange={(e) =>
                                                setValue(e.target.value)
                                            }
                                        />
                                    </div>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            onClick={() => {
                                                setState([...state, value])
                                                field.onChange([
                                                    ...state,
                                                    value,
                                                ])
                                            }}
                                            type="button"
                                            disabled={value.trim().length === 0}
                                        >
                                            Add
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <FormDescription className="hidden">
                        This is your {name}.
                    </FormDescription>
                    <FormMessage className="hidden" />
                </FormItem>
            )}
        />
    )
}

export default InputListString
