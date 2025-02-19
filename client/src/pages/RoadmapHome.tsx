import SidebarRoadmap from "@/components/roadmap/SidebarRoadmap"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { RoadmapProvider } from "@/context/RoadmapContext"
import { Outlet } from "react-router-dom"

function RoadmapHome() {
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
        <>
            <style>{stylesheet}</style>
            <RoadmapProvider>
                <SidebarProvider className="mt-16">
                    <div className="flex gap-2 w-full">
                        <SidebarRoadmap />
                        <div className="relative w-full">
                            <SidebarTrigger className="absolute top-4 left-4 text-white" />
                            <div className="w-full text-start flex justify-center">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </SidebarProvider>
            </RoadmapProvider>
        </>
    )
}

export default RoadmapHome
