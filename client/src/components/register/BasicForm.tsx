// ui components
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TabsContent } from "@/components/ui/tabs"
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload"
// icons
import { CloudUpload, User } from "lucide-react"
// hooks
import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// components
import RegisterBasicFromField from "@/components/register/RegisterBasicFromField"
import { imageDropZoneConfig } from "@/model/file-upload"
// api
import {
    RegisterBasicFormSchema,
    RegisterBasicFormSchemaDefaultValues,
} from "@/model/Authentication"
import { register } from "@/api/RegisterApi"
import { AxiosError } from "axios"

interface BasicFormProps {
    handleNext: () => void
}

export default function BasicForm({ handleNext }: BasicFormProps) {
    const { toast } = useToast()
    const [isBasicSubmitDisabled, setBasicSubmitDisabled] = useState(true)

    const emailInputRef = useRef<HTMLInputElement>(null)
    const emailLabelRef = useRef<HTMLLabelElement>(null)
    const passwordInputRef = useRef<HTMLInputElement>(null)
    const passwordLabelRef = useRef<HTMLLabelElement>(null)
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null)
    const confirmPasswordLabelRef = useRef<HTMLLabelElement>(null)

    const [avatars, setAvatars] = useState<File[] | null>(null)

    // Create basic form instance
    const basicForm = useForm<z.infer<typeof RegisterBasicFormSchema>>({
        resolver: zodResolver(RegisterBasicFormSchema),
        defaultValues: RegisterBasicFormSchemaDefaultValues,
    })

    // Handle form submission
    async function onBasicSubmit(
        data: z.infer<typeof RegisterBasicFormSchema>
    ) {
        try {
            await register(data)
            toast({
                title: "Register Successful",
                description: "Welcome to MatchWorks! 👋",
            })
            handleNext()
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message

            if (errorMessage === "User already exists.") {
                const emailInput = emailInputRef.current
                const emailLabel = emailLabelRef.current
                emailInput?.classList.add("border-red-500")
                emailLabel?.classList.add("text-red-500")
            }

            toast({
                title: "Register Failed",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    function setFieldAvatar(files: File[] | null) {
        setAvatars(files)
        if (files && files[0]) {
            const file = files[0]
            basicForm.setValue("avatar", file)
        } else {
            basicForm.setValue("avatar", undefined)
        }
    }

    function validatePassword(password: string): boolean {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        return passwordRegex.test(password)
    }

    function checkPassword() {
        const passwordInput = passwordInputRef.current
        const passwordLabel = passwordLabelRef.current
        const confirmPasswordInput = confirmPasswordInputRef.current
        const confirmPasswordLabel = confirmPasswordLabelRef.current

        if (!validatePassword(passwordInput?.value || "")) {
            passwordInput?.classList.add("border-red-500")
            passwordLabel?.classList.add("text-red-500")
            toast({
                title: "Invalid Password",
                description:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
                variant: "destructive",
            })
        } else {
            passwordInput?.classList.remove("border-red-500")
            passwordLabel?.classList.remove("text-red-500")
        }

        if (passwordInput?.value !== confirmPasswordInput?.value) {
            confirmPasswordInput?.classList.add("border-red-500")
            confirmPasswordLabel?.classList.add("text-red-500")
        } else {
            confirmPasswordInput?.classList.remove("border-red-500")
            confirmPasswordLabel?.classList.remove("text-red-500")
        }
    }

    // Watch the required fields
    const { watch } = basicForm
    const requiredFields = watch([
        "name",
        "phone",
        "email",
        "password",
        "confirmpassword",
    ])

    useEffect(() => {
        const checkFields = () => {
            const emailInput = emailInputRef.current
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailInput && !emailRegex.test(emailInput.value)) {
                return true
            }

            const passwordInput = passwordInputRef.current
            const confirmPasswordInput = confirmPasswordInputRef.current
            if (
                !validatePassword(passwordInput?.value || "") ||
                passwordInput?.value !== confirmPasswordInput?.value
            ) {
                return true
            }

            return requiredFields.some((field) => field.trim() === "")
        }

        setBasicSubmitDisabled(checkFields())
    }, [requiredFields])

    return (
        <Form {...basicForm}>
            <form onSubmit={basicForm.handleSubmit(onBasicSubmit)}>
                <TabsContent value="basic">
                    <Card>
                        <CardHeader className="text-start">
                            <CardTitle>Create an Account</CardTitle>
                            <CardDescription>
                                Enter your basic information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <RegisterBasicFromField
                                control={basicForm.control}
                                name="name"
                                label="Full Name"
                                placeholder="Full Name"
                            />
                            <RegisterBasicFromField
                                control={basicForm.control}
                                name="phone"
                                label="Phone Number"
                                placeholder="Phone Number"
                                inputType="phone"
                            />
                            <RegisterBasicFromField
                                control={basicForm.control}
                                name="email"
                                label="Email"
                                placeholder="Email"
                                inputRef={emailInputRef}
                                labelRef={emailLabelRef}
                                // eslint-disable-next-line
                                onChange={(e: any) => {
                                    basicForm.setValue("email", e.target.value)
                                    const emailInput = emailInputRef.current
                                    const emailLabel = emailLabelRef.current
                                    const emailRegex =
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    if (
                                        emailInput &&
                                        !emailRegex.test(emailInput.value)
                                    ) {
                                        emailInput?.classList.add(
                                            "border-red-500"
                                        )
                                        emailLabel?.classList.add(
                                            "text-red-500"
                                        )
                                    } else {
                                        emailInput?.classList.remove(
                                            "border-red-500"
                                        )
                                        emailLabel?.classList.remove(
                                            "text-red-500"
                                        )
                                    }
                                }}
                            />
                            <RegisterBasicFromField
                                control={basicForm.control}
                                name="password"
                                label="Password"
                                placeholder="Password"
                                type="password"
                                inputRef={passwordInputRef}
                                labelRef={passwordLabelRef}
                                // eslint-disable-next-line
                                onChange={(e: any) => {
                                    basicForm.setValue(
                                        "password",
                                        e.target.value
                                    )
                                    checkPassword()
                                }}
                            />
                            <RegisterBasicFromField
                                control={basicForm.control}
                                name="confirmpassword"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                                inputRef={confirmPasswordInputRef}
                                labelRef={confirmPasswordLabelRef}
                                // eslint-disable-next-line
                                onChange={(e: any) => {
                                    basicForm.setValue(
                                        "confirmpassword",
                                        e.target.value
                                    )
                                    checkPassword()
                                }}
                            />
                            <FormField
                                control={basicForm.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">
                                            Select avatar
                                        </FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                {...field}
                                                value={avatars}
                                                onValueChange={setFieldAvatar}
                                                dropzoneOptions={
                                                    imageDropZoneConfig
                                                }
                                                className="relative bg-background rounded-lg p-2 col-span-3"
                                            >
                                                {field.value ? (
                                                    <FileUploaderContent className="flex justify-center items-center">
                                                        <FileUploaderItem
                                                            index={0}
                                                            className="size-36"
                                                        >
                                                            <AspectRatio>
                                                                <Avatar className="size-full">
                                                                    <AvatarImage
                                                                        src={
                                                                            typeof field.value ===
                                                                                "object" &&
                                                                            field.value !==
                                                                                null
                                                                                ? URL.createObjectURL(
                                                                                      field.value as Blob
                                                                                  )
                                                                                : ""
                                                                        }
                                                                        alt="@user"
                                                                    />
                                                                    <AvatarFallback>
                                                                        <User />
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </AspectRatio>
                                                        </FileUploaderItem>
                                                    </FileUploaderContent>
                                                ) : (
                                                    <FileInput
                                                        id="fileInput"
                                                        className="outline-dashed outline-1 outline-slate-500"
                                                    >
                                                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="font-semibold">
                                                                    Click to
                                                                    upload
                                                                </span>
                                                                &nbsp; or drag
                                                                and drop
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                PNG, JPG or JPEG
                                                            </p>
                                                        </div>
                                                    </FileInput>
                                                )}
                                            </FileUploader>
                                        </FormControl>
                                        <FormDescription className="hidden">
                                            Select a file to upload.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isBasicSubmitDisabled}
                            >
                                Submit
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </form>
        </Form>
    )
}
