import { useQuery } from "@tanstack/react-query"
import { getResumeFeedback } from "@/api/ResumeApi"

export const useResumeAnalysis = (resumeId: string) => {
    const { data, isPending } = useQuery({
        queryKey: ["analysis", resumeId],
        queryFn: () => getResumeFeedback(resumeId),
        enabled: !!resumeId,
    })

    return {
        analysis: data,
        isPendingAnalysis: isPending,
    }
}
