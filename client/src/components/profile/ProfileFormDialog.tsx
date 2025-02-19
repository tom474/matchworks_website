import { useEffect, useState } from "react"
// components
import { Button } from "@/components/ui/button"
import Editor from "@/components/rich-text/editor"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
// icons
import { CirclePlus, Pencil, File } from "lucide-react"
import { LoadingIcon } from "@/components/loading-icon"
// hooks
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// components
import ListString from "@/components/profile/ListString"
import ListFields from "@/components/profile/ListFields"
import {
    Education,
    Experience,
    ProfileSchema,
    ProfileSchemaDefaultValues,
} from "@/model/User"
import { AxiosError } from "axios"
import { updateProfile } from "@/api/ProfileApi"

interface ProfileFormDialogProps {
    // eslint-disable-next-line
    data: any
    getCurrentUser: () => void
}

export default function ProfileFormDialog({
    data,
    getCurrentUser,
}: ProfileFormDialogProps) {
    const userData = data
    const { toast } = useToast()

    const [background, setBackground] = useState(userData.background)
    const [positions, setPositions] = useState<string[]>(userData.positions)
    const [skills, setSkills] = useState<string[]>(userData.skills)
    const [education, setEducation] = useState<Education[]>(userData.education)
    const [experience, setExperience] = useState<Experience[]>(
        userData.experience
    )
    const [interests, setInterests] = useState<string[]>(userData.interests)

    // Create profile form instance
    const profileForm = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: ProfileSchemaDefaultValues,
    })

    useEffect(() => {
        profileForm.setValue("background", userData.background)
        profileForm.setValue("positions", userData.positions)
        profileForm.setValue("skills", userData.skills)
        profileForm.setValue("education", userData.education)
        profileForm.setValue("experience", userData.experience)
        profileForm.setValue("interests", userData.interest)
    }, [userData, profileForm])

    // Handle form submission
    async function onProfileSubmit(data: z.infer<typeof ProfileSchema>) {
        try {
            toast({
                title: "Updating...",
                description: (
                    <div>
                        <LoadingIcon size={"size-5"} />
                    </div>
                ),
            })
            await updateProfile(data)
            toast({
                title: "Update Successful",
                description: "Your profile has been updated successfully.",
            })
            getCurrentUser()
            profileForm.reset()
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: errorMessage,
            })
        }
    }

    const profileSubmit = () => {
        profileForm.handleSubmit(onProfileSubmit)()
    }

    return (
        <Form {...profileForm}>
            <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="flex flex-col gap-5 text-start"
            >
                <Card>
                    <div className="flex flex-row items-center justify-between">
                        <CardHeader>
                            <CardTitle className="flex flex-row gap-2 items-center">
                                <File /> Background
                            </CardTitle>
                            {(!userData.background ||
                                userData.background === "") && (
                                <CardDescription>
                                    Provide a brief overview of yourself...
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardFooter className="p-0 pr-5 flex flex-col justify-center items-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    {!userData.background ||
                                    userData.background === "" ? (
                                        <Button variant="outline" size="icon">
                                            <CirclePlus />
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="icon">
                                            <Pencil />
                                        </Button>
                                    )}
                                </DialogTrigger>
                                <DialogContent className="max-w-screen w-fit">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here.
                                            Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FormField
                                        control={profileForm.control}
                                        name="background"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-4">
                                                <FormLabel className="w-full text-start flex flex-row items-center gap-2">
                                                    <File />
                                                    Background
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Background"
                                                        {...field}
                                                        className="hidden"
                                                        type="text"
                                                        value={background}
                                                    />
                                                </FormControl>
                                                <Editor
                                                    content={background}
                                                    placeholder="Background"
                                                    onChange={(value) => {
                                                        const cleanedValue =
                                                            value
                                                                .replace(
                                                                    "<p>",
                                                                    ""
                                                                )
                                                                .replace(
                                                                    "</p>",
                                                                    ""
                                                                )
                                                        setBackground(
                                                            cleanedValue
                                                        )
                                                        profileForm.setValue(
                                                            "background",
                                                            cleanedValue
                                                        )
                                                    }}
                                                />
                                                <FormDescription className="hidden">
                                                    This is your background.
                                                </FormDescription>
                                                <FormMessage className="hidden" />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                onClick={profileSubmit}
                                            >
                                                Save changes
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </div>
                    {(userData.background || userData.background !== "") && (
                        <CardContent className="border-t pt-5 flex flex-col gap-4">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: userData.background || "",
                                }}
                            />
                        </CardContent>
                    )}
                </Card>

                <ListString
                    title="Positions"
                    control={profileForm.control}
                    name="positions"
                    label="Positions"
                    placeholder="Add your position"
                    state={positions}
                    setState={setPositions}
                    submit={profileSubmit}
                />

                <ListString
                    title="Skills"
                    control={profileForm.control}
                    name="skills"
                    label="Skills"
                    placeholder="Add your skill"
                    state={skills}
                    setState={setSkills}
                    submit={profileSubmit}
                />

                <ListFields
                    title="Education"
                    control={profileForm.control}
                    name="education"
                    label="Education"
                    placeholder="Add your education"
                    state={education}
                    setState={setEducation}
                    value0="degree"
                    value1="institution"
                    submit={profileSubmit}
                />

                <ListFields
                    title="Experience"
                    control={profileForm.control}
                    name="experience"
                    label="Experience"
                    placeholder="Add your experience"
                    state={experience}
                    setState={setExperience}
                    value0="jobTitle"
                    value1="company"
                    submit={profileSubmit}
                />

                <ListString
                    title="Interests"
                    control={profileForm.control}
                    name="interests"
                    label="Interests"
                    placeholder="Add your interest"
                    state={interests}
                    setState={setInterests}
                    submit={profileSubmit}
                />
            </form>
        </Form>
    )
}
