import {
    ChevronDown,
    // BicepsFlexed,
    // ThumbsDown,
    // MessageCircleQuestion,
    ScrollText,
    FilePlus,
    History,
} from "lucide-react"
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
import { useResumeAnalysis } from "@/hooks/ResumeHook"
import { useParams } from "react-router-dom"
import { LoadingIcon } from "@/components/loading-icon"

export default function ResumeSideBar() {
    const location = useLocation()
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

    const handleScroll = (
        event: React.MouseEvent<HTMLAnchorElement>,
        url: string
    ) => {
        event.preventDefault()
        const element = document.getElementById(url.substring(1)) // Remove the '#' from the URL
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            window.scrollBy(0, -60)
        }

        // open the accordion item
        // const accordionItem = document.getElementById(url.split("#")[1])
        // if (accordionItem) {
        //     accordionItem.click()
        // }
    }

    useEffect(() => {
        setIsAnalysisOpen(
            location.pathname.includes("/resume-builder/analysis/")
        )
    }, [location.pathname])

    return (
        <Sidebar>
            <SidebarContent className="mt-20 gap-0">
                <SidebarGroup>
                    <SidebarGroupLabel className="hidden">
                        New Analysis
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="text-foreground"
                                    asChild
                                >
                                    <Link to="/resume-builder">
                                        <FilePlus />
                                        <span>New Analysis</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <Collapsible
                    open={isAnalysisOpen}
                    className="group/collapsible"
                >
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger
                                className="bg-transparent"
                                disabled={!isAnalysisOpen}
                            >
                                Analysis
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent className="ml-2">
                                {isAnalysisOpen && (
                                    <ListAspects handleScroll={handleScroll} />
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
                                    <Link to="/resume-builder/history">
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

// eslint-disable-next-line
function ListAspects({ handleScroll }: any) {
    const { resumeId } = useParams()
    const { analysis, isPendingAnalysis } = useResumeAnalysis(resumeId!)

    return (
        <>
            {!isPendingAnalysis ? (
                <SidebarMenu>
                    {/* eslint-disable-next-line */}
                    {analysis.feedback.map((item: any, index: number) => (
                        <div key={item.aspect}>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="text-foreground"
                                    asChild
                                >
                                    <Link
                                        to={"#aspect" + index}
                                        onClick={(e) =>
                                            handleScroll(e, "#aspect" + index)
                                        }
                                    >
                                        <ScrollText />
                                        <span>{item.aspect}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* <ListSubAspect
                                index={index}
                                handleScroll={handleScroll}
                            /> */}
                        </div>
                    ))}
                </SidebarMenu>
            ) : (
                <div className="flex items-center justify-center">
                    <LoadingIcon size={"size-8"} />
                </div>
            )}
        </>
    )
}

// function ListSubAspect({ handleScroll }: any) {
//     const fields = [
//         {
//             title: "Strengths",
//             url: "#strengths",
//             icon: BicepsFlexed,
//         },
//         {
//             title: "Weaknesses",
//             url: "#weaknesses",
//             icon: ThumbsDown,
//         },
//         {
//             title: "Suggestions",
//             url: "#suggestions",
//             icon: MessageCircleQuestion,
//         },
//     ]

//     return (
//         <div className="ml-2">
//             {/* eslint-disable-next-line */}
//             {fields.map((item: any) => (
//                 <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton className="text-foreground" asChild>
//                         <Link
//                             to={item.url}
//                             onClick={(e) => handleScroll(e, item.url)}
//                         >
//                             <item.icon />
//                             <span>{item.title}</span>
//                         </Link>
//                     </SidebarMenuButton>
//                 </SidebarMenuItem>
//             ))}
//         </div>
//     )
// }
