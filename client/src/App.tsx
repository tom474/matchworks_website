import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom"
import "./App.css"
import { pdfjs } from "react-pdf"
import NavigationBar from "./components/navigation-bar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import SearchPage from "./pages/Search"
import RoadmapHome from "./pages/RoadmapHome"
import NewRoadmap from "./components/roadmap/NewRoadmap"
import RoadmapDetail from "./components/roadmap/RoadmapDetail"
import RoadmapHistory from "./components/roadmap/RoadmapHistory"
import ResumeBuilder from "./pages/ResumeBuilder"
import VirturalInterview from "./pages/VirtualInterview"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./utils"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import Home from "./pages/Home"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString()

function Main() {
    const location = useLocation()
    const hideNavBar =
        location.pathname === "/login" || location.pathname === "/register"

    return (
        <>
            {!hideNavBar && <NavigationBar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/roadmap-generator" element={<RoadmapHome />}>
                    <Route index element={<NewRoadmap />} />
                    <Route path="new-roadmap" element={<NewRoadmap />} />
                    <Route path=":id/roadmap" element={<RoadmapDetail />} />
                    <Route path="history" element={<RoadmapHistory />} />
                </Route>
                <Route path="/resume-builder/*" element={<ResumeBuilder />} />
                <Route
                    path="/virtual-interview-practice/*"
                    element={<VirturalInterview />}
                />
            </Routes>
        </>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <Router>
                    <Main />
                </Router>
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App
