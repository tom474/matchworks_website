// ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
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
import { ModeToggle } from "@/components/mode-toggle"
// hooks
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// api
import {
    LoginFormSchema,
    LoginFormSchemaDefaultValues,
} from "@/model/Authentication"
import { login } from "@/api/LoginApi"
import { AxiosError } from "axios"
import { useGetCurrentUser } from "@/hooks/UserHook"
import SidePanel from "@/components/register/SidePanel"

// Define the login component
function Login() {
    const { getCurrentUser, user, isPendingGetCurrentUser } =
        useGetCurrentUser()
    const navigate = useNavigate()
    const location = useLocation()
    const { toast } = useToast()

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    useEffect(() => {
        if (isPendingGetCurrentUser) {
            return
        }

        if (user && location.pathname === "/login") {
            navigate("/")
            toast({
                title: "Already Logged In",
                description: "You are already logged in.",
            })
        }
    }, [
        getCurrentUser,
        user,
        isPendingGetCurrentUser,
        location.pathname,
        navigate,
        toast,
    ])

    const [LoginDisabled, setLoginDisabled] = useState(true)

    // Create a form instance
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: LoginFormSchemaDefaultValues,
    })

    // Handle form submission
    async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
        try {
            await login(data)
            toast({
                title: "Login Successful",
                description: "Welcome back! 👋",
            })
            navigate("/")
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message

            if (errorMessage === "User not found.") {
                const emailLabel = document.querySelector(
                    ".email-label"
                ) as HTMLLabelElement
                const emailInput = document.querySelector(
                    ".email-input"
                ) as HTMLInputElement
                emailLabel.classList.add("text-red-500")
                emailInput.classList.add("border-red-500")
            } else if (errorMessage === "Wrong password.") {
                const passwordLabel = document.querySelector(
                    ".password-label"
                ) as HTMLLabelElement
                const passwordInput = document.querySelector(
                    ".password-input"
                ) as HTMLInputElement
                passwordLabel.classList.add("text-red-500")
                passwordInput.classList.add("border-red-500")
            }

            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            })
        }
    }

    // Watch the required fields
    const { watch } = form
    const requiredFields = watch(["email", "password"])

    useEffect(() => {
        const checkFields = () => {
            const emailInput = document.querySelector(
                ".email-input"
            ) as HTMLInputElement
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailInput && !emailRegex.test(emailInput.value)) {
                return true
            }

            return requiredFields.some((field) => field.trim() === "")
        }

        setLoginDisabled(checkFields)
    }, [requiredFields])

    const stylesheet = `#root {
        margin: 0;
        padding: 0;
        max-width: 100%;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }`

    // Render the form
    return (
        <>
            <style>{stylesheet}</style>
            <div className="md:hidden">
                <img
                    src="/examples/authentication-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <img
                    src="/examples/authentication-dark.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>
            <div className="grid grid-cols-3 h-full w-full">
                <SidePanel />
                <div className="col-span-2 flex flex-col justify-center items-center">
                    <div className="absolute right-4 top-4 md:right-8 md:top-8 flex flex-row gap-2">
                        <Button
                            onClick={() => {
                                window.location.href = "/register"
                            }}
                        >
                            Register
                        </Button>
                        <ModeToggle />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Card>
                                <CardHeader className="text-start">
                                    <CardTitle>Login</CardTitle>
                                    <CardDescription>
                                        Access your existing account.
                                    </CardDescription>
                                </CardHeader>
                                {ParseCardContent(form, onSubmit)}
                                {ParseCardFooter(form, LoginDisabled, onSubmit)}
                            </Card>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

// eslint-disable-next-line
function ParseCardContent(form: any, onSubmit: any) {
    return (
        <CardContent className="w-96 flex flex-col gap-2">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className="text-right pt-2 email-label">
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Email"
                                {...field}
                                className="col-span-4 email-input"
                                onChange={(e) => {
                                    form.setValue("email", e.target.value)
                                    const emailLabel = document.querySelector(
                                        ".email-label"
                                    ) as HTMLLabelElement
                                    const emailInput = document.querySelector(
                                        ".email-input"
                                    ) as HTMLInputElement
                                    const emailRegex =
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                                    if (emailInput.value != "") {
                                        if (
                                            emailInput &&
                                            emailRegex.test(emailInput.value)
                                        ) {
                                            emailLabel.classList.remove(
                                                "text-red-500"
                                            )
                                            emailInput.classList.remove(
                                                "border-red-500"
                                            )
                                        } else {
                                            emailLabel.classList.add(
                                                "text-red-500"
                                            )
                                            emailInput.classList.add(
                                                "border-red-500"
                                            )
                                        }
                                    } else {
                                        emailLabel.classList.add("text-red-500")
                                        emailInput.classList.add(
                                            "border-red-500"
                                        )
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13 || e.which == 13) {
                                        e.preventDefault()
                                        const passwordInput =
                                            document.querySelector(
                                                ".password-input"
                                            ) as HTMLInputElement
                                        passwordInput.focus()
                                    }
                                }}
                            />
                        </FormControl>
                        <FormDescription className="hidden">
                            This is your email.
                        </FormDescription>
                        <FormMessage className="hidden" />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className="text-right pt-2 password-label">
                            Password
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Password"
                                {...field}
                                className="col-span-4 password-input"
                                type="password"
                                onChange={(e) => {
                                    form.setValue("password", e.target.value)
                                    const passwordLabel =
                                        document.querySelector(
                                            ".password-label"
                                        ) as HTMLLabelElement
                                    const passwordInput =
                                        document.querySelector(
                                            ".password-input"
                                        ) as HTMLInputElement
                                    if (passwordInput.value != "") {
                                        passwordLabel.classList.remove(
                                            "text-red-500"
                                        )
                                        passwordInput.classList.remove(
                                            "border-red-500"
                                        )
                                    } else {
                                        passwordLabel.classList.add(
                                            "text-red-500"
                                        )
                                        passwordInput.classList.add(
                                            "border-red-500"
                                        )
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13 || e.which == 13) {
                                        e.preventDefault()
                                        form.handleSubmit(onSubmit)()
                                    }
                                }}
                            />
                        </FormControl>
                        <FormDescription className="hidden">
                            This is your password.
                        </FormDescription>
                        <FormMessage className="hidden" />
                    </FormItem>
                )}
            />
        </CardContent>
    )
}

// eslint-disable-next-line
function ParseCardFooter(form: any, LoginDisabled: any, onSubmit: any) {
    return (
        <CardFooter className="flex justify-end">
            <Button
                disabled={LoginDisabled}
                onClick={() => {
                    const emailLabel = document.querySelector(
                        ".email-label"
                    ) as HTMLLabelElement
                    const emailInput = document.querySelector(
                        ".email-input"
                    ) as HTMLInputElement
                    const passwordLabel = document.querySelector(
                        ".password-label"
                    ) as HTMLLabelElement
                    const passwordInput = document.querySelector(
                        ".password-input"
                    ) as HTMLInputElement
                    if (emailInput.value != "" && passwordInput.value != "") {
                        if (emailInput.value != "") {
                            emailLabel.classList.remove("text-red-500")
                            emailInput.classList.remove("border-red-500")
                        }
                        if (passwordInput.value != "") {
                            passwordLabel.classList.remove("text-red-500")
                            passwordInput.classList.remove("border-red-500")
                        }
                        form.handleSubmit(onSubmit)()
                    } else {
                        if (emailInput.value == "") {
                            emailLabel.classList.add("text-red-500")
                            emailInput.classList.add("border-red-500")
                        }
                        if (passwordInput.value == "") {
                            passwordLabel.classList.add("text-red-500")
                            passwordInput.classList.add("border-red-500")
                        }
                    }
                }}
                type="button"
            >
                Login
            </Button>
        </CardFooter>
    )
}

export default Login
