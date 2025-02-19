import { History, ChevronDown, ScrollText, FilePlus } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Message } from "@/model/Interview"

interface AppSidebarProps {
    messages: Message[]
}

export default function InterviewSideBar({ messages }: AppSidebarProps) {
    const location = useLocation()
    const [isInterviewOpen, setIsInterviewOpen] = useState(false)

    const handleScroll = (
        event: React.MouseEvent<HTMLAnchorElement>,
        url: string
    ) => {
        event.preventDefault()
        const element = document.getElementById(url.substring(1)) // Remove the '#' from the URL
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            window.scrollBy(0, -80)

            const elementPosition = element.getBoundingClientRect().top

            const offsetPosition = elementPosition + window.scrollY - 76

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            })
        }
    }

    useEffect(() => {
        setIsInterviewOpen(
            location.pathname.includes(
                "/virtual-interview-practice/interview/"
            ) ||
                location.pathname.includes(
                    "/virtual-interview-practice/feedback/"
                )
        )
    }, [location.pathname])

    return (
        <Sidebar>
            <SidebarContent className="mt-20 gap-0">
                <SidebarGroup>
                    <SidebarGroupLabel className="hidden">
                        New Interview
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="text-foreground"
                                    asChild
                                >
                                    <Link to="/virtual-interview-practice">
                                        <FilePlus />
                                        <span>New Interview</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Collapsible
                    open={isInterviewOpen}
                    className="group/collapsible"
                >
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger
                                className="bg-transparent"
                                disabled={!isInterviewOpen}
                            >
                                Interview
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent className="ml-2">
                                {isInterviewOpen && (
                                    <ListQuestions
                                        messages={messages}
                                        handleScroll={handleScroll}
                                    />
                                )}
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                <SidebarGroup>
                    <SidebarGroupLabel className="hidden">
                        History
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="text-foreground"
                                    asChild
                                >
                                    <Link to="/virtual-interview-practice/history">
                                        <History />
                                        <span>History</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

interface ListQuestionsProps {
    messages: Message[]
    // eslint-disable-next-line
    handleScroll: any
}

function ListQuestions({ messages, handleScroll }: ListQuestionsProps) {
    return (
        <>
            {messages && (
                <SidebarMenu>
                    {messages.map((message: Message, index: number) => (
                        <div key={index}>
                            {message.id !== 0 && message.role === "agent" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        className="text-foreground"
                                        asChild
                                    >
                                        <Link
                                            to={"#agent" + message.id}
                                            onClick={(e) =>
                                                handleScroll(
                                                    e,
                                                    "#agent" + message.id
                                                )
                                            }
                                        >
                                            <ScrollText />
                                            <span>Question {message.id}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </div>
                    ))}
                </SidebarMenu>
            )}
        </>
    )
}
