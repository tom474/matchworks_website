import { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

// Define the parse form field interface
interface BasicFromFieldProps {
    // eslint-disable-next-line
    control: Control<any>
    name: string
    label: string
    value: string
    type?: "text" | "password"
    inputType?: "text" | "phone"
    // eslint-disable-next-line
    onChange?: any
    // eslint-disable-next-line
    inputRef?: any
    // eslint-disable-next-line
    labelRef?: any
    className?: string
}

// Define the parse form field component
const ProfileBasicFromField: React.FC<BasicFromFieldProps> = ({
    control,
    name,
    label,
    value,
    type = "text",
    inputType = "text",
    inputRef,
    labelRef,
    onChange,
    className,
}) => {
    const InputComponent = inputType === "phone" ? PhoneInput : Input

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={"space-y-0 " + className}>
                    <FormLabel
                        className={"text-right " + name + "-label"}
                        ref={labelRef}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <InputComponent
                            {...field}
                            value={value}
                            className={name + "-input"}
                            type={type}
                            ref={inputRef}
                            onChange={onChange}
                        />
                    </FormControl>
                    <FormDescription className="hidden">
                        This is your {name}.
                    </FormDescription>
                    <FormMessage className="hidden" />
                </FormItem>
            )}
        />
    )
}

export default ProfileBasicFromField
