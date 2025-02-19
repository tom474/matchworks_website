import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FileInput, FileUploader } from "@/components/ui/file-upload"
import { ProfileSchema, ProfileSchemaDefaultValues } from "@/model/User"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { AxiosError } from "axios"
import { LoadingIcon } from "@/components/loading-icon"
import { pdfDropZoneConfig } from "@/model/file-upload"
import { useState } from "react"
import ResumeDialog from "@/components/resume-builder/ResumeDialog"
import { CloudUpload } from "lucide-react"
import { uploadResume } from "@/api/ProfileApi"
import { useNavigate } from "react-router-dom"

// eslint-disable-next-line
export default function UploadTab({ user }: any) {
    const { toast } = useToast()
    const navigate = useNavigate()
    const [resumes, setResumes] = useState<File[] | null>(null)

    // Create profile form instance
    const profileForm = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: ProfileSchemaDefaultValues,
    })

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
            if (data.resume) {
                const response = await uploadResume(data.resume)
                if (response.data.resumeId) {
                    toast({
                        title: "Upload Successful",
                        description:
                            "Your resume has been uploaded successfully.",
                    })
                    profileForm.reset()
                    navigate(
                        `/resume-builder/analysis/${response.data.resumeId}`
                    )
                }
            }
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

    function setFieldResume(files: File[] | null) {
        setResumes(files)
        if (files && files[0]) {
            const file = files[0]
            profileForm.setValue("resume", file)
        } else {
            profileForm.setValue("resume", undefined)
        }
        profileForm.handleSubmit(onProfileSubmit)()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload your resume</CardTitle>
                <CardDescription>
                    You can upload your new resume here for analysis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {resumes ? (
                    <ResumeDialog
                        resumeId={user.resumeIds[user.resumeIds.length - 1]}
                    />
                ) : (
                    <Form {...profileForm}>
                        <form
                            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        >
                            <FormField
                                control={profileForm.control}
                                name="resume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="hidden">
                                            Select resume
                                        </FormLabel>
                                        <FormControl>
                                            <FileUploader
                                                {...field}
                                                value={resumes}
                                                onValueChange={setFieldResume}
                                                dropzoneOptions={
                                                    pdfDropZoneConfig
                                                }
                                                className="bg-background rounded-lg p-2"
                                            >
                                                <FileInput
                                                    id="fileInput"
                                                    className="outline-dashed outline-1 outline-slate-500"
                                                >
                                                    <div className="flex items-center justify-center flex-col p-24 pl-52 pr-52 w-full">
                                                        <CloudUpload className="text-gray-500 w-10 h-10" />
                                                        <div className="mb-1 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                            <p>
                                                                Upload new
                                                                Resume
                                                            </p>
                                                            <p className="font-semibold mt-1">
                                                                Click to upload
                                                            </p>
                                                            <p>
                                                                or drag and drop
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            PDF, PNG, JPG or
                                                            JPEG
                                                        </p>
                                                    </div>
                                                </FileInput>
                                            </FileUploader>
                                        </FormControl>
                                        <FormDescription className="hidden">
                                            Select a file to upload.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
