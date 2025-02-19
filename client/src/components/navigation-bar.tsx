import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useToast } from "@/hooks/use-toast"
import { url } from "@/utils/index"
import { axiosInstance } from "@/utils/index"
import { useGetCurrentUser } from "@/hooks/UserHook"
import { User } from "lucide-react"

export default function NavigationBar() {
    const { getCurrentUser, user, isPendingGetCurrentUser } =
        useGetCurrentUser()
    const { toast } = useToast()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    useEffect(() => {
        if (isPendingGetCurrentUser) {
            return
        }

        if (!user) {
            if (
                location.pathname !== "/login" &&
                location.pathname !== "/register"
            ) {
                navigate("/login")
                toast({
                    title: "Unauthorized",
                    description: "You need to login to access this page",
                })
            }
        }
    }, [
        getCurrentUser,
        user,
        isPendingGetCurrentUser,
        location.pathname,
        navigate,
        toast,
    ])

    const logout = async () => {
        await axiosInstance.post("/auth/logout")
        toast({
            title: "Logout Successful",
            description: "Goodbye! 👋",
        })
        navigate("/login")
    }

    return (
        <nav className="fixed inset-x-0 top-0 z-50 shadow-sm border p-1 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-14 items-center">
                    <div className="flex flex-row justify-between items-center gap-8">
                        <Link
                            to="/"
                            className="text-inherit flex flex-row items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1 h-5 w-5"
                            >
                                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                            </svg>
                            <span>MatchWorks</span>
                        </Link>
                        <div className="hidden md:flex gap-4 mt-0.5">
                            <Link
                                to="/resume-builder"
                                className={`text-sm transition-colors text-foreground/80 ${
                                    location.pathname === "/resume-builder"
                                        ? "text-blue-500"
                                        : ""
                                }`}
                            >
                                Resume Builder
                            </Link>
                            <Link
                                to="/virtual-interview-practice"
                                className={`text-sm transition-colors text-foreground/80 ${
                                    location.pathname ===
                                    "/virtual-interview-practice"
                                        ? "text-blue-500"
                                        : ""
                                }`}
                            >
                                Virtual Interview Practice
                            </Link>
                            <Link
                                to="/roadmap-generator"
                                className={`text-sm transition-colors text-foreground/80 roadmap-generator-link ${
                                    location.pathname === "/roadmap-generator"
                                        ? "text-blue-500"
                                        : ""
                                }`}
                            >
                                Roadmap Generator
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            {isPendingGetCurrentUser && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            )}
                            {user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="p-0 rounded-full">
                                        <Avatar className="size-8">
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
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => navigate("/profile")}
                                        >
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => logout()}
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}
