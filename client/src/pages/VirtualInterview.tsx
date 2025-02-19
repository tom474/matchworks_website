import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Route, Routes } from "react-router-dom"
import InterviewSideBar from "@/components/virtual-interview/InterviewSideBar"
import NewInterview from "@/components/virtual-interview/NewInterview"
import Interview from "@/components/virtual-interview/Interview"
import InterviewHistory from "@/components/virtual-interview/InterviewHistory"
import Feedback from "@/components/virtual-interview/Feedback"
import { useState } from "react"
import { Message } from "@/model/Interview"

export default function VirturalInterview() {
    const [messages, setMessages] = useState<Message[]>([])

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
                <Route
                    path="/"
                    element={<InterviewSideBar messages={messages} />}
                />
                <Route
                    path="interview/:interviewId"
                    element={<InterviewSideBar messages={messages} />}
                />
                <Route
                    path="feedback/:interviewId"
                    element={<InterviewSideBar messages={messages} />}
                />
                <Route
                    path="history"
                    element={<InterviewSideBar messages={messages} />}
                />
            </Routes>
            <main className="relative mt-20 w-full">
                <SidebarTrigger className="absolute top-0 left-6 text-white" />
                <div
                    className="flex flex-row flex-wrap items-center justify-center"
                    id="content"
                >
                    <Routes>
                        <Route path="/" element={<NewInterview />} />
                        <Route
                            path="interview/:interviewId"
                            element={
                                <Interview
                                    messages={messages}
                                    setMessages={setMessages}
                                />
                            }
                        />
                        <Route
                            path="feedback/:interviewId"
                            element={
                                <Feedback
                                    messages={messages}
                                    setMessages={setMessages}
                                />
                            }
                        />
                        <Route path="history" element={<InterviewHistory />} />
                    </Routes>
                </div>
            </main>
        </SidebarProvider>
    )
}
