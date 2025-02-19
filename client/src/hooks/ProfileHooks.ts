import { addSkill } from "@/api/ProfileApi"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "./use-toast"
import { queryClient } from "@/utils"

export const useAddSkill = (jobId: string) => {
    const { toast } = useToast()

    const { mutate, isPending } = useMutation({
        mutationFn: addSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["job", jobId],
            })
            toast({
                title: "Skill added!",
                description: "You have successfully added a new skill.",
            })
        },
        onError: () => {
            toast({
                title: "Failed to add skill",
                description: "An error occurred while adding a new skill.",
                variant: "destructive",
            })
        },
    })

    return { mutateAddSkill: mutate, isPendingAddSkill: isPending }
}