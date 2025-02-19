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
    placeholder: string
    type?: "text" | "password"
    inputType?: "text" | "phone"
    // eslint-disable-next-line
    onChange?: any
    // eslint-disable-next-line
    inputRef?: any
    // eslint-disable-next-line
    labelRef?: any
}

// Define the parse form field component
const RegisterBasicFromField: React.FC<BasicFromFieldProps> = ({
    control,
    name,
    label,
    placeholder,
    type = "text",
    inputType = "text",
    inputRef,
    labelRef,
    onChange,
}) => {
    const InputComponent = inputType === "phone" ? PhoneInput : Input

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel
                        className={"text-right pt-2 " + name + "-label"}
                        ref={labelRef}
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        {onChange ? (
                            <InputComponent
                                placeholder={placeholder}
                                {...field}
                                className={"col-span-3 " + name + "-input"}
                                type={type}
                                ref={inputRef}
                                onChange={onChange}
                            />
                        ) : (
                            <InputComponent
                                placeholder={placeholder}
                                {...field}
                                className={"col-span-3 " + name + "-input"}
                                type={type}
                                ref={inputRef}
                            />
                        )}
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

export default RegisterBasicFromField
