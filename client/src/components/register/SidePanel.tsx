import Threejs from "@/components/threejs"

export default function SidePanel() {
    return (
        <div className="relative overflow-hidden col-span-1 flex flex-col bg-muted text-white dark:border-r inset-0 bg-zinc-900">
            <div className="relative z-10 p-10 flex flex-col justify-between h-full">
                <div className="flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    MatchWorks
                </div>
                <div className="mt-auto text-start">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This platform has saved me countless hours
                            and helped me find great jobs faster than ever
                            before.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="absolute z-0 h-full w-full">
                <Threejs />
            </div>
        </div>
    )
}
