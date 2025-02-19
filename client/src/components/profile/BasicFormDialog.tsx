import { useState, useEffect, useRef } from "react"
// components
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload"
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
import { Pencil, User } from "lucide-react"
import { LoadingIcon } from "@/components/loading-icon"
// hooks
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import ProfileBasicFromField from "@/components/profile/ProfileBasicFromField"
import { imageDropZoneConfig } from "@/model/file-upload"
import { url } from "@/utils/index"
import { BasicSchema, BasicSchemaDefaultValues } from "@/model/User"
import { updateBasicProfile } from "@/api/ProfileApi"
import { AxiosError } from "axios"

interface BasicFormDialogProps {
    // eslint-disable-next-line
    data: any
    getCurrentUser: () => void
}

export default function BasicFormDialog({
    data,
    getCurrentUser,
}: BasicFormDialogProps) {
    const userData = data
    const { toast } = useToast()

    const [userName, setUserName] = useState(userData.name)
    const [userPhone, setUserPhone] = useState(userData.phone)
    const [userEmail, setUserEmail] = useState(userData.email)
    const [avatars, setAvatars] = useState<File[] | null>(null)

    const emailInputRef = useRef<HTMLInputElement>(null)
    const emailLabelRef = useRef<HTMLLabelElement>(null)

    // Create basic form instance
    const basicForm = useForm<z.infer<typeof BasicSchema>>({
        resolver: zodResolver(BasicSchema),
        defaultValues: BasicSchemaDefaultValues,
    })

    useEffect(() => {
        basicForm.setValue("name", userData.name)
        basicForm.setValue("email", userData.email)
        basicForm.setValue("phone", userData.phone)
    }, [userData, basicForm])

    // Handle form submission
    async function onBasicSubmit(data: z.infer<typeof BasicSchema>) {
        try {
            toast({
                title: "Updating...",
                description: (
                    <div>
                        <LoadingIcon size={"size-5"} />
                    </div>
                ),
            })
            await updateBasicProfile(data)
            toast({
                title: "Update Successful",
                description: "Your profile has been updated successfully.",
            })
            getCurrentUser()
            basicForm.reset()
            setAvatars(null)
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

    const setUserNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value)
        if (e.target.value) {
            basicForm.setValue("name", e.target.value)
        }
    }

    const setUserEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value)
        if (e.target.value) {
            basicForm.setValue("email", e.target.value)
        }
    }

    const setUserPhoneValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserPhone(e.target.value)
        if (e.target.value) {
            basicForm.setValue("phone", e.target.value)
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

    const basicSubmit = () => {
        basicForm.handleSubmit(onBasicSubmit)()
    }

    return (
        <Form {...basicForm}>
            <form onSubmit={basicForm.handleSubmit(onBasicSubmit)}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[700px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save
                                when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-2 flex flex-col items-center justify-center">
                                <FormField
                                    control={basicForm.control}
                                    name="avatar"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="hidden">
                                                Select avatar
                                            </FormLabel>
                                            <FormControl>
                                                <FileUploader
                                                    {...field}
                                                    value={avatars}
                                                    onValueChange={
                                                        setFieldAvatar
                                                    }
                                                    dropzoneOptions={
                                                        imageDropZoneConfig
                                                    }
                                                    className="bg-background rounded-lg p-2 flex flex-col justify-center items-center"
                                                >
                                                    {field.value ? (
                                                        <FileUploaderContent className="flex flex-row justify-center items-center">
                                                            <FileUploaderItem
                                                                index={0}
                                                                className="h-auto w-32 p-0 hover:bg-transparent mb-1"
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
                                                        <div className="size-24 mb-2">
                                                            <AspectRatio>
                                                                <Avatar className="size-full">
                                                                    <AvatarImage
                                                                        src={
                                                                            url +
                                                                            "/files/avatars/" +
                                                                            userData.avatar +
                                                                            "/download"
                                                                        }
                                                                        alt="@user"
                                                                    />
                                                                    <AvatarFallback>
                                                                        <User />
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </AspectRatio>
                                                        </div>
                                                    )}
                                                    <FileInput
                                                        id="fileInput"
                                                        className="outline-dashed outline-1 outline-slate-500"
                                                    >
                                                        <div className="flex items-center justify-center flex-col p-2 w-full text-center">
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
                                                </FileUploader>
                                            </FormControl>
                                            <FormDescription className="hidden">
                                                Select a file to upload.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <ProfileBasicFromField
                                    control={basicForm.control}
                                    name="name"
                                    label="Full Name"
                                    value={userName}
                                    className="col-span-4"
                                    onChange={setUserNameValue}
                                />

                                <ProfileBasicFromField
                                    control={basicForm.control}
                                    name="email"
                                    label="Email"
                                    value={userEmail}
                                    className="col-span-2"
                                    inputRef={emailInputRef}
                                    labelRef={emailLabelRef}
                                    onChange={setUserEmailValue}
                                />

                                <ProfileBasicFromField
                                    control={basicForm.control}
                                    name="phone"
                                    label="Phone Number"
                                    value={userPhone}
                                    className="col-span-2"
                                    inputType="phone"
                                    onChange={setUserPhoneValue}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    onClick={() => basicSubmit()}
                                    type="button"
                                >
                                    Save changes
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </form>
        </Form>
    )
}
