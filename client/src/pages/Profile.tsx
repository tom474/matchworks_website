import { useEffect } from "react"
// components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// icons
import { Mail, Phone, HandMetal, FileUser, User } from "lucide-react"
// components
import BasicFormDialog from "@/components/profile/BasicFormDialog"
import ProfileFormDialog from "@/components/profile/ProfileFormDialog"
import ProfileCompletion from "@/components/profile/ProfileCompletion"
import { useGetCurrentUser } from "@/hooks/UserHook"
import ProfileResume from "@/components/profile/ProfileResume"
import { url } from "@/utils/index"

function Profile() {
    const { getCurrentUser, user, isPendingGetCurrentUser } =
        useGetCurrentUser()

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    return (
        <>
            {user && (
                <Tabs defaultValue="profile" className="mt-16 pb-10">
                    <div className="grid grid-cols-5 gap-4">
                        <Card className="col-span-1 h-fit sticky top-20">
                            <CardHeader className="text-start p-4">
                                <CardTitle className="flex flex-row gap-2 items-center font-normal text-lg">
                                    <HandMetal /> Hi
                                </CardTitle>
                                <CardDescription className="text-xl text-inherit font-semibold">
                                    {user.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2">
                                <TabsList className="h-auto flex flex-col bg-transparent p-0 m-0 gap-2">
                                    <TabsTrigger
                                        className="w-full bg-transparent text-lg data-[state=active]:bg-foreground data-[state=active]:text-background justify-start gap-2 p-2 pl-3 text-md"
                                        value="profile"
                                    >
                                        <User /> Profile
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="w-full bg-transparent text-lg data-[state=active]:bg-foreground data-[state=active]:text-background justify-start gap-2 p-2 pl-3 text-md"
                                        value="resume"
                                    >
                                        <FileUser /> Resume
                                    </TabsTrigger>
                                </TabsList>
                            </CardContent>
                        </Card>

                        <Card className="col-span-3 border-transparent shadow-none">
                            <TabsContent value="profile" className="m-0">
                                <Card className="mb-5">
                                    <div className="flex flex-row items-center justify-between text-start">
                                        <CardHeader className="flex flex-row items-center gap-4">
                                            <Avatar>
                                                <AvatarImage
                                                    src={
                                                        url +
                                                        "/files/avatars/" +
                                                        user.avatar +
                                                        "/download"
                                                    }
                                                    alt="@user"
                                                />
                                                <AvatarFallback>
                                                    <User />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className="text-3xl"
                                                style={{ marginTop: "0px" }}
                                            >
                                                {user.name}
                                            </div>
                                        </CardHeader>
                                        <CardFooter className="p-0 pr-5 flex flex-col justify-center items-center">
                                            <BasicFormDialog
                                                data={user}
                                                getCurrentUser={getCurrentUser}
                                            />
                                        </CardFooter>
                                    </div>
                                    <CardContent className="grid grid-cols-2 gap-5">
                                        <p className="flex flex-row gap-2">
                                            <Mail /> {user.email}
                                        </p>
                                        <p className="flex flex-row gap-2">
                                            <Phone /> {user.phone}
                                        </p>
                                    </CardContent>
                                </Card>

                                <ProfileFormDialog
                                    data={user}
                                    getCurrentUser={getCurrentUser}
                                />
                            </TabsContent>

                            <TabsContent
                                value="resume"
                                className="m-0 flex flex-col gap-5"
                            >
                                <ProfileResume
                                    user={user}
                                    getCurrentUser={getCurrentUser}
                                />
                            </TabsContent>
                        </Card>

                        <Card className="col-span-1 h-fit w-[225px] sticky top-20">
                            <CardHeader>
                                <CardTitle>Profile Completion</CardTitle>
                                <CardDescription className="hidden">
                                    Percentage of profile completion
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProfileCompletion data={user} />
                            </CardContent>
                            <CardFooter className="hidden"></CardFooter>
                        </Card>
                    </div>
                </Tabs>
            )}
            {isPendingGetCurrentUser && (
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            )}
        </>
    )
}

export default Profile
