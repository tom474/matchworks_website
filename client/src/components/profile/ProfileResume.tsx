import { useEffect, useState } from "react"
// components
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FileInput, FileUploader } from "@/components/ui/file-upload"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Document, Page } from "react-pdf"
// icons
import {
    FileText,
    Trash2,
    ChevronLeft,
    ChevronRight,
    CloudUpload,
} from "lucide-react"
import { LoadingIcon } from "@/components/loading-icon"
// hooks
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// components
import { pdfDropZoneConfigProfile, pdfOptions } from "@/model/file-upload"
import { url } from "@/utils/index"
import { ProfileSchema, ProfileSchemaDefaultValues } from "@/model/User"
import { axiosInstance } from "@/utils/index"
import { AxiosError } from "axios"
import { updateProfile } from "@/api/ProfileApi"

interface ProfileResumeProps {
    // eslint-disable-next-line
    user: any
    getCurrentUser: () => void
}

export default function ProfileResume({
    user,
    getCurrentUser,
}: ProfileResumeProps) {
    const { toast } = useToast()
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
            await updateProfile(data)
            toast({
                title: "Upload Successful",
                description: "Your resume has been uploaded successfully.",
            })
            getCurrentUser()
            setResumes(null)
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
        <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <ListResumes
                    resumeIds={user.resumeIds}
                    getCurrentUser={getCurrentUser}
                />
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
                                    dropzoneOptions={pdfDropZoneConfigProfile}
                                    className="bg-background rounded-lg p-2"
                                >
                                    <FileInput
                                        id="fileInput"
                                        className="outline-dashed outline-1 outline-slate-500"
                                    >
                                        <div className="flex items-center justify-center flex-col p-3 w-full ">
                                            <CloudUpload className="text-gray-500 w-10 h-10" />
                                            <div className="mb-1 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                <p>Upload new Resume</p>
                                                <p className="font-semibold mt-1">
                                                    Click to upload
                                                </p>
                                                <p>or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PDF, PNG, JPG or JPEG
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
    )
}

// eslint-disable-next-line
function ListResumes({ resumeIds }: any) {
    const [resumeIdsState, setResumeIdsState] = useState<string[]>([])

    useEffect(() => {
        setResumeIdsState(resumeIds)
    }, [resumeIds])

    return (
        <div className="flex flex-col gap-3">
            {resumeIdsState.length > 0 &&
                resumeIdsState.map((resumeId: string) => (
                    <div key={resumeId}>
                        <ResumeDialog
                            resumeId={resumeId}
                            setResumeIdsState={setResumeIdsState}
                        />
                    </div>
                ))}
        </div>
    )
}

// eslint-disable-next-line
function ResumeDialog({ resumeId, setResumeIdsState }: any) {
    const { toast } = useToast()
    const [numPages, setNumPages] = useState<number>(1)
    const [pageNumber, setPageNumber] = useState<number>(1)
    // eslint-disable-next-line
    const [metadata, setMetadata] = useState<any>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages)
    }

    const goToPreviousPage = () =>
        setPageNumber((prevPage) => Math.max(prevPage - 1, 1))
    const goToNextPage = () =>
        setPageNumber((prevPage) => Math.min(prevPage + 1, numPages))

    function formatDate(date: string) {
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
        return new Date(date).toLocaleDateString(undefined, dateOptions)
    }

    async function getResumeMetadata(resumeId: string) {
        const response = await axiosInstance.get(
            "/files/resumes/" + resumeId + "/retrieve"
        )
        return response.data.file
    }

    useEffect(() => {
        const fetchMetadata = async () => {
            if (metadata === null) {
                const medata = await getResumeMetadata(resumeId)
                setMetadata(medata)
            }
        }

        fetchMetadata()
    }, [metadata, resumeId])

    const deleteResume = async (resumeId: string) => {
        try {
            await axiosInstance.delete("/files/resumes/" + resumeId)
            toast({
                title: "Resume Deleted",
                description: "Your resume has been deleted successfully.",
            })
            setResumeIdsState((prev: string[]) =>
                prev.filter((id) => id !== resumeId)
            )
        } catch (error: unknown) {
            const errorMessage =
                (error as AxiosError<{ error: string }>).response?.data
                    ?.error || (error as Error).message
            toast({
                variant: "destructive",
                title: "Delete Failed",
                description: errorMessage,
            })
        }
    }

    return (
        <Card className="flex flex-row items-center justify-between text-start border-slate-400">
            <Dialog>
                <DialogTrigger asChild>
                    <CardHeader className="w-full cursor-pointer">
                        <CardTitle className="text-xl flex flex-row items-center gap-2">
                            <FileText /> {metadata?.filename}
                        </CardTitle>
                        <CardDescription>
                            Uploaded at {formatDate(metadata?.uploadDate)}
                        </CardDescription>
                    </CardHeader>
                </DialogTrigger>
                <DialogContent className="h-full max-w-fit">
                    <DialogHeader>
                        <DialogTitle>{metadata?.filename}</DialogTitle>
                        <DialogDescription>
                            Uploaded at {formatDate(metadata?.uploadDate)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center max-h-screen overflow-y-scroll custom-scrollbar">
                        <Document
                            file={
                                url + "/files/resumes/" + resumeId + "/download"
                            }
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={pdfOptions}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        {numPages > 1 && (
                            <div className="flex flex-row justify-center items-center">
                                <Button
                                    onClick={goToPreviousPage}
                                    disabled={pageNumber <= 1}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span className="pl-3 pr-3">
                                    {pageNumber}/{numPages}
                                </span>
                                <Button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <CardFooter className="p-0 pr-5 flex flex-col justify-center items-center">
                <div className="flex flex-row gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger
                                className="p-0 bg-transparent"
                                asChild
                            >
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => deleteResume(resumeId)}
                                    type="button"
                                >
                                    <Trash2 />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete Resume</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardFooter>
        </Card>
    )
}
