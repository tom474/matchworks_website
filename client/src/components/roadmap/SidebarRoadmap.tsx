import {
    FilePlus,
    ChevronDown,
    ChevronUp,
    History,
    Signpost,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "../ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useRoadmapContext } from "@/context/RoadmapContext"
import Cookies from "js-cookie"
import { useSelectedRoadmap } from "@/hooks/SelectedRoadmapHook"

function SidebarRoadmap() {
    const { selectedRoadmapId, setSelectedRoadmap } = useRoadmapContext()
    const navigate = useNavigate()
    useSelectedRoadmap(selectedRoadmapId!)

    // Initialize selectedRoadmapId from cookies
    useEffect(() => {
        const roadmapId = Cookies.get("selectedRoadmapId")
        if (roadmapId && roadmapId !== "null") {
            setSelectedRoadmap(roadmapId)
        }
        Cookies.remove("selectedRoadmapId")
    }, [setSelectedRoadmap])

    // Update Sidebar Items Dynamically
    const [sidebarItems, setSidebarItems] = useState([
        {
            title: "New Roadmap",
            url: "/roadmap-generator/new-roadmap",
            icon: <FilePlus />,
            disabled: false,
        },
        {
            title: "Roadmap",
            url: `/roadmap-generator/${selectedRoadmapId}/roadmap`,
            icon: <Signpost />,
            disabled: true, // Initially disabled until selectedRoadmapId is set
            items: [
                {
                    title: "Progress",
                    url: `/roadmap-generator/${selectedRoadmapId}/roadmap#progress`,
                },
                {
                    title: "Overview",
                    url: `/roadmap-generator/${selectedRoadmapId}/roadmap#overview`,
                },
                {
                    title: "Checklist",
                    url: `/roadmap-generator/${selectedRoadmapId}/roadmap#checklist`,
                },
            ],
        },
        {
            title: "History",
            url: "/roadmap-generator/history",
            icon: <History />,
            disabled: false,
        },
    ])

    useEffect(() => {
        setSidebarItems((prevItems) =>
            prevItems.map((item) => {
                if (item.title === "Roadmap") {
                    return {
                        ...item,
                        url: `/roadmap-generator/${selectedRoadmapId}/roadmap`,
                        items: item.items!.map((subItem) => ({
                            ...subItem,
                            url: `/roadmap-generator/${selectedRoadmapId}/roadmap#${subItem.title.toLowerCase()}`,
                        })),
                        disabled: !selectedRoadmapId, // Disable if no roadmap is selected
                    }
                }
                return item
            })
        )
    }, [selectedRoadmapId])

    // Redirect if URL contains "null"
    useEffect(() => {
        if (selectedRoadmapId && window.location.pathname.includes("null")) {
            navigate(`/roadmap-generator/${selectedRoadmapId}/roadmap`, {
                replace: true,
            })
        }
    }, [selectedRoadmapId, navigate])

    // Submenu handling
    const [openSubmenus, setOpenSubmenus] = useState<{
        [key: number]: boolean
    }>({})
    const location = useLocation()

    useEffect(() => {
        const updatedSubmenus: { [key: number]: boolean } = {}
        sidebarItems.forEach((item, index) => {
            if (item.items) {
                if (
                    location.pathname.startsWith(item.url) ||
                    location.hash.startsWith(item.url)
                ) {
                    updatedSubmenus[index] = true
                } else {
                    updatedSubmenus[index] = false
                }
            }
        })
        setOpenSubmenus(updatedSubmenus)
    }, [location, sidebarItems])

    const toggleSubmenu = (index: number) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    return (
        <div>
            <Sidebar>
                <SidebarContent className="mt-16 ml-2">
                    <SidebarGroup />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map((item, index) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className={
                                        item.disabled
                                            ? "opacity-50 pointer-events-none"
                                            : ""
                                    }
                                >
                                    <SidebarMenuButton asChild>
                                        <Link
                                            className={`text-foreground flex items-center space-x-0.4 ${
                                                item.disabled
                                                    ? "cursor-not-allowed"
                                                    : ""
                                            }`}
                                            to={item.url}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    {item.items && !item.disabled && (
                                        <>
                                            <SidebarMenuAction
                                                className="bg-background border-[1px] border-black"
                                                onClick={() =>
                                                    toggleSubmenu(index)
                                                }
                                            >
                                                {openSubmenus[index] ? (
                                                    <ChevronUp />
                                                ) : (
                                                    <ChevronDown />
                                                )}
                                            </SidebarMenuAction>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                    openSubmenus[index]
                                                        ? "max-h-40 opacity-100"
                                                        : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <SidebarMenuSub className="pl-6">
                                                    {item.items.map(
                                                        (subItem) => (
                                                            <SidebarMenuSubItem
                                                                key={
                                                                    subItem.title
                                                                }
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        to={
                                                                            subItem.url
                                                                        }
                                                                    >
                                                                        {
                                                                            subItem.title
                                                                        }
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </div>
                                        </>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroup />
                </SidebarContent>
            </Sidebar>
        </div>
    )
}

export default SidebarRoadmap
