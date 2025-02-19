import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useGetCurrentUser } from "@/hooks/UserHook"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import ResumeSideBar from "@/components/resume-builder/ResumeSideBar"
import NewAnalysis from "@/components/resume-builder/NewAnalysis"
import Analysis from "@/components/resume-builder/Analysis"
import ResumeHistory from "@/components/resume-builder/ResumeHistory"

export default function ResumeBuilder() {
    const { getCurrentUser, user, isPendingGetCurrentUser } =
        useGetCurrentUser()

    useEffect(() => {
        getCurrentUser()
    }, [getCurrentUser])

    const stylesheet = `
        #root {
            margin: 0;
            padding: 0;
            max-width: 100%;
            width: 100%;
        }
        body {
            display: block;
            place-items: start;
        }
    `

    return (
        <SidebarProvider>
            <style>{stylesheet}</style>
            <Routes>
                <Route path="/" element={<ResumeSideBar />} />
                <Route path="analysis/:resumeId" element={<ResumeSideBar />} />
                <Route path="history" element={<ResumeSideBar />} />
            </Routes>
            {isPendingGetCurrentUser ? (
                <div>Loading...</div>
            ) : (
                <main className="relative mt-20 w-full">
                    <SidebarTrigger className="absolute top-0 left-6 text-white" />
                    <div className="flex flex-row flex-wrap items-center justify-center">
                        <Routes>
                            <Route
                                path="/"
                                element={<NewAnalysis user={user} />}
                            />
                            <Route
                                path="analysis/:resumeId"
                                element={<Analysis />}
                            />
                            <Route
                                path="history"
                                element={<ResumeHistory user={user} />}
                            />
                        </Routes>
                    </div>
                </main>
            )}
        </SidebarProvider>
    )
}
