import { ChevronLeft, ChevronRight } from "lucide-react"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Document, Page } from "react-pdf"
import { url } from "@/utils/index"
import { axiosInstance } from "@/utils/index"
import { Button } from "@/components/ui/button"
import AnalysisScore from "@/components/resume-builder/AnalysisScore"
import { pdfOptions } from "@/model/file-upload"

// eslint-disable-next-line
export default function ResumePreview({ resumeId, score }: any) {
    const [numPages, setNumPages] = useState<number>(1)
    const [pageNumber, setPageNumber] = useState<number>(1)
    // eslint-disable-next-line
    const [metadata, setMetadata] = useState<any>(null)

    const [scale, setScale] = useState(1)

    useEffect(() => {
        const handleResize = () => {
            const parentWidth =
                document.getElementById("parentElementId")?.offsetWidth ||
                window.innerWidth
            const pageWidth = window.innerWidth
            const newScale = parentWidth / pageWidth + 0.3
            setScale(newScale)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

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
            numberingSystem: "latn",
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

    return (
        <Card className="col-span-1 flex flex-row items-center justify-between text-start h-fit sticky overflow-auto top-20">
            <CardHeader className="w-full h-full flex flex-col items-center justify-center">
                <CardTitle className="text-center">
                    {metadata?.filename}
                </CardTitle>
                <CardDescription>
                    Analysis at {formatDate(metadata?.uploadDate)}
                </CardDescription>
                <div className="size-48">
                    <AnalysisScore score={score} />
                </div>
                <Dialog>
                    <DialogTrigger className="cursor-pointer" asChild>
                        <div id="parentElementId">
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
                                    url +
                                    "/files/resumes/" +
                                    resumeId +
                                    "/download"
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
            </CardHeader>
            <CardFooter className="hidden"></CardFooter>
        </Card>
    )
}
