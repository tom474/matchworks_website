import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Document, Page } from "react-pdf"
import { url } from "@/utils/index"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { axiosInstance } from "@/utils/index"
import { useNavigate } from "react-router-dom"
import { pdfOptions } from "@/model/file-upload"

// eslint-disable-next-line
export default function ResumeDialog({ resumeId }: any) {
    const navigate = useNavigate()
    const [scale, setScale] = useState(1)

    const [numPages, setNumPages] = useState<number>(1)
    const [pageNumber, setPageNumber] = useState<number>(1)
    // eslint-disable-next-line
    const [metadata, setMetadata] = useState<any>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages)
    }

    const goToPreviousPage = () =>
        setPageNumber((prevPage) => Math.max(prevPage - 1, 1))
    const goToNextPage = () =>
        setPageNumber((prevPage) => Math.min(prevPage + 1, numPages))

    function formatDate(date: string) {
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
        return new Date(date).toLocaleDateString(undefined, dateOptions)
    }

    async function getResumeMetadata(resumeId: string) {
        const response = await axiosInstance.get(
            "/files/resumes/" + resumeId + "/retrieve"
        )
        return response.data.file
    }

    useEffect(() => {
        const fetchMetadata = async () => {
            if (metadata === null) {
                const medata = await getResumeMetadata(resumeId)
                setMetadata(medata)
            }
        }

        fetchMetadata()
    }, [metadata, resumeId])

    useEffect(() => {
        const handleResize = () => {
            const parentWidth =
                document.getElementById("parentElementId")?.offsetWidth ||
                window.innerWidth
            const pageWidth = window.innerWidth
            const newScale = parentWidth / pageWidth + 0.2
            setScale(newScale)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <Card className="flex flex-row items-center justify-between text-start border-slate-400">
            <Dialog>
                <DialogTrigger asChild>
                    <CardHeader
                        className="h-full w-full cursor-pointer p-3 justify-between"
                        id="parentElementId"
                    >
                        <div>
                            <CardTitle className="whitespace-nowrap truncate">
                                {metadata?.filename}
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Uploaded at {formatDate(metadata?.uploadDate)}
                            </CardDescription>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="h-fit w-fit">
                                <Document
                                    file={
                                        url +
                                        "/files/resumes/" +
                                        resumeId +
                                        "/download"
                                    }
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    options={pdfOptions}
                                >
                                    <Page
                                        pageNumber={1}
                                        scale={scale}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>
                        </div>
                        <Button
                            onClick={() =>
                                navigate("/resume-builder/analysis/" + resumeId)
                            }
                        >
                            Select
                        </Button>
                    </CardHeader>
                </DialogTrigger>
                <DialogContent className="h-full max-w-fit">
                    <DialogHeader>
                        <DialogTitle>{metadata?.filename}</DialogTitle>
                        <DialogDescription>
                            Uploaded at {formatDate(metadata?.uploadDate)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center max-h-screen overflow-y-scroll custom-scrollbar">
                        <Document
                            file={
                                url + "/files/resumes/" + resumeId + "/download"
                            }
                            onLoadSuccess={onDocumentLoadSuccess}
                            options={pdfOptions}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        {numPages > 1 && (
                            <div className="flex flex-row justify-center items-center">
                                <Button
                                    onClick={goToPreviousPage}
                                    disabled={pageNumber <= 1}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span className="pl-3 pr-3">
                                    {pageNumber}/{numPages}
                                </span>
                                <Button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
