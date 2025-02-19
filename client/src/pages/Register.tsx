import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import BasicForm from "@/components/register/BasicForm"
import ProfileForm from "@/components/register/ProfileForm"
import { useNavigate, useLocation } from "react-router-dom"
import { useGetCurrentUser } from "@/hooks/UserHook"
import { useToast } from "@/hooks/use-toast"
import SidePanel from "@/components/register/SidePanel"

// Define the register component
function Register() {
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

        if (user && location.pathname === "/register") {
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

    const tabs = [
        "basic",
        "profile",
        "upload",
        "background",
        "positions",
        "skills",
        "education",
        "experience",
        "interests",
    ]
    const [currentTab, setCurrentTab] = useState("basic")

    // Handle the next tab
    const handleNext = () => {
        setCurrentTab((prevTab) => {
            const currentIndex = tabs.indexOf(prevTab)
            const nextIndex = (currentIndex + 1) % tabs.length
            return tabs[nextIndex]
        })
    }

    // Handle the back tab
    const handleBack = (tab?: string) => {
        if (tab) {
            setCurrentTab(tab)
            return
        }
        setCurrentTab((prevTab) => {
            const currentIndex = tabs.indexOf(prevTab)
            const nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
            return tabs[nextIndex]
        })
    }

    // Handle the set tab
    const handleSetTab = (nextTab: string) => {
        setCurrentTab(nextTab)
    }

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
                        {currentTab === "basic" && (
                            <Button
                                onClick={() => {
                                    window.location.href = "/login"
                                }}
                            >
                                Login
                            </Button>
                        )}
                        <ModeToggle />
                    </div>
                    <div className="h-full flex flex-col justify-center items-center">
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <BasicForm handleNext={() => handleNext()} />
                            <ProfileForm
                                handleNext={() => handleNext()}
                                handleBack={() => handleBack()}
                                handleSetTab={handleSetTab}
                            />
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
