// ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Editor from "@/components/rich-text/editor"
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
import { TabsContent } from "@/components/ui/tabs"
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload"
// icons
import { CloudUpload, Paperclip, File } from "lucide-react"
// hooks
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// components
import InputListString from "@/components/register/InputListString"
import InputListFields from "@/components/register/InputListFields"
import ResumeCardFooter from "@/components/register/ResumeCardFooter"
import TabManager from "@/components/register/TabManager"
// types
import {
    Education,
    Experience,
    ProfileSchema,
    ProfileSchemaDefaultValues,
} from "@/model/User"
import { pdfDropZoneConfig } from "@/model/file-upload"
// api
import { createProfile } from "@/api/RegisterApi"
import { AxiosError } from "axios"

interface ProfileFormProps {
    handleNext: () => void
    handleBack: (tab?: string) => void
    handleSetTab: (tab: string) => void
}

export default function ProfileForm({
    handleNext,
    handleBack,
    handleSetTab,
}: ProfileFormProps) {
    const { toast } = useToast()
    const navigate = useNavigate()

    const [resumes, setResumes] = useState<File[] | null>(null)
    const [background, setBackground] = useState("")
    const [positions, setPositions] = useState<string[]>([])
    const [skills, setSkills] = useState<string[]>([])
    const [education, setEducation] = useState<Education[]>([])
    const [experience, setExperience] = useState<Experience[]>([])
    const [interests, setInterests] = useState<string[]>([])

    // Create profile form instance
    const profileForm = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: ProfileSchemaDefaultValues,
    })

    // Handle form submission
    async function onProfileSubmit(data: z.infer<typeof ProfileSchema>) {
        try {
            const parsedData = ProfileSchema.safeParse(data)
            const isEmpty =
                parsedData.success &&
                Object.values(parsedData.data).every((value) => {
                    if (Array.isArray(value)) {
                        return value.length === 0
                    }
                    return value === ""
                })

            if (!isEmpty) {
                if (resumes && resumes[0]) {
                    toast({
                        title: "Updating Profile",
                        description:
                            "Your profile is being updated with your resume...",
                    })
                }
                await createProfile(data)
                toast({
                    title: "Update Profile Successful",
                    description: "Your profile has been updated.",
                })
            }
            navigate("/profile")
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message
            toast({
                title: "Update Profile Failed",
                description: errorMessage,
            })
        }
    }

    function setFieldResume(files: File[] | null) {
        setResumes(files)
        if (files && files[0]) {
            const file = files[0]
            profileForm.setValue("resume", file)
        } else {
            profileForm.setValue("resume", undefined)
        }
    }

    return (
        <Form {...profileForm}>
            <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="w-[35rem]"
            >
                <TabsContent value="profile">
                    <Card>
                        <CardHeader className="text-start">
                            <CardTitle>Create your Profile</CardTitle>
                            <CardDescription>
                                You can edit this later.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="w-full flex flex-row gap-4">
                            <Button
                                onClick={() => handleSetTab("upload")}
                                variant="secondary"
                                type="button"
                                className="w-full"
                            >
                                Upload your Resume
                            </Button>
                            <Button
                                onClick={() => handleSetTab("background")}
                                type="button"
                                className="w-full"
                            >
                                Create your Profile
                            </Button>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                variant="ghost"
                                className="bg-transparent"
                                type="submit"
                            >
                                Skip
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabManager
                    value="upload"
                    title="Upload your Resume"
                    description="Select or drag and drop a file."
                    input={
                        <FormField
                            control={profileForm.control}
                            name="resume"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select File</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            {...field}
                                            value={resumes}
                                            onValueChange={setFieldResume}
                                            dropzoneOptions={pdfDropZoneConfig}
                                            className="relative bg-background rounded-lg p-2"
                                        >
                                            <FileInput
                                                id="fileInput"
                                                className="outline-dashed outline-1 outline-slate-500"
                                            >
                                                <div className="flex items-center justify-center flex-col p-8 w-full ">
                                                    <CloudUpload className="text-gray-500 w-10 h-10" />
                                                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">
                                                            Click to upload
                                                        </span>
                                                        &nbsp; or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PDF, PNG, JPG or JPEG
                                                    </p>
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {resumes &&
                                                    resumes.length > 0 &&
                                                    resumes.map((file, i) => (
                                                        <FileUploaderItem
                                                            key={i}
                                                            index={i}
                                                        >
                                                            <Paperclip className="h-4 w-4 stroke-current" />
                                                            <span>
                                                                {file.name}
                                                            </span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                    </FormControl>
                                    <FormDescription>
                                        Select a file to upload.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    }
                    footer={
                        <CardFooter className="flex justify-between">
                            <Button
                                onClick={() => handleBack("profile")}
                                variant="secondary"
                                type="button"
                            >
                                Back
                            </Button>
                            <Button type="submit">Submit</Button>
                        </CardFooter>
                    }
                />

                <TabManager
                    value="background"
                    title="Create your Profile"
                    description="First, provide a brief overview of yourself..."
                    input={
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
                                        content=""
                                        placeholder="Background"
                                        onChange={(value) => {
                                            const cleanedValue = value
                                                .replace("<p>", "")
                                                .replace("</p>", "")
                                            setBackground(cleanedValue)
                                            field.onChange(cleanedValue)
                                        }}
                                    />
                                    <FormDescription className="hidden">
                                        This is your background.
                                    </FormDescription>
                                    <FormMessage className="hidden" />
                                </FormItem>
                            )}
                        />
                    }
                    footer={
                        <ResumeCardFooter
                            handleBack={() => handleSetTab("profile")}
                            handleNext={() => handleNext()}
                        />
                    }
                />

                <TabManager
                    value="positions"
                    title="Create your Profile"
                    description="Next, list your current and previous roles..."
                    input={
                        <InputListString
                            control={profileForm.control}
                            name="positions"
                            label="Positions"
                            placeholder="Positions"
                            state={positions}
                            setState={setPositions}
                        />
                    }
                    footer={
                        <ResumeCardFooter
                            handleBack={() => handleBack()}
                            handleNext={() => handleNext()}
                        />
                    }
                />

                <TabManager
                    value="skills"
                    title="Create your Profile"
                    description="Highlight your professional skill set..."
                    input={
                        <InputListString
                            control={profileForm.control}
                            name="skills"
                            label="Skills"
                            placeholder="Skills"
                            state={skills}
                            setState={setSkills}
                        />
                    }
                    footer={
                        <ResumeCardFooter
                            handleBack={() => handleBack()}
                            handleNext={() => handleNext()}
                        />
                    }
                />

                <TabManager
                    value="education"
                    title="Create your Profile"
                    description="Next, share your academic background..."
                    input={
                        <InputListFields
                            control={profileForm.control}
                            name="education"
                            label="Education"
                            placeholder="Education"
                            state={education}
                            setState={setEducation}
                            value0="degree"
                            value1="institution"
                        />
                    }
                    footer={
                        <ResumeCardFooter
                            handleBack={() => handleBack()}
                            handleNext={() => handleNext()}
                        />
                    }
                />

                <TabManager
                    value="experience"
                    title="Create your Profile"
                    description="Detail your work experience and achievements..."
                    input={
                        <InputListFields
                            control={profileForm.control}
                            name="experience"
                            label="Experience"
                            placeholder="Experience"
                            state={experience}
                            setState={setExperience}
                            value0="jobTitle"
                            value1="company"
                        />
                    }
                    footer={
                        <ResumeCardFooter
                            handleBack={() => handleBack()}
                            handleNext={() => handleNext()}
                        />
                    }
                />

                <TabManager
                    value="interests"
                    title="Create your Profile"
                    description="Lastly, mention hobbies or areas of interest..."
                    input={
                        <InputListString
                            control={profileForm.control}
                            name="interests"
                            label="Interests"
                            placeholder="Interests"
                            state={interests}
                            setState={setInterests}
                        />
                    }
                    footer={
                        <CardFooter className="flex justify-between">
                            <Button
                                onClick={() => handleBack()}
                                variant="secondary"
                                type="button"
                            >
                                Back
                            </Button>
                            <Button type="submit">Submit</Button>
                        </CardFooter>
                    }
                />
            </form>
        </Form>
    )
}
