import { queryClient } from "@/utils/index"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCurrentUser, refreshToken } from "@/api/ProfileApi"
import { useState, useEffect } from "react"
import { AxiosError } from "axios"

export const useGetUserData = () => {
    const { data, isPending } = useQuery({
        queryKey: ["user_data"],
        queryFn: getCurrentUser,
    })

    return {
        userData: data,
        isPendingUserData: isPending,
    }
}

export const useGetCurrentUser = () => {
    // eslint-disable-next-line
    const [user, setUser] = useState<any>(null)
    const [isFetchingUser, setIsFetchingUser] = useState(true) // Explicit loading state

    const { mutate, isPending } = useMutation({
        mutationFn: getCurrentUser,
        mutationKey: ["user"],
        onSuccess: (data) => {
            setUser(data)
            queryClient.invalidateQueries({
                queryKey: ["user"],
            })
            setIsFetchingUser(false) // Fetch complete
        },
        onError: async (error) => {
            setIsFetchingUser(false)
            if (
                (error as AxiosError<{ error: string }>).response?.status ===
                401
            ) {
                const re = await refreshToken()
                // eslint-disable-next-line
                if ((re as any).response?.status === 401) {
                    setUser(null)
                } else {
                    mutate() // Retry fetch after refresh
                    window.location.reload()
                }
            }
        },
    })

    useEffect(() => {
        setIsFetchingUser(true) // Mark as fetching
        mutate()
    }, [mutate])

    return {
        getCurrentUser: mutate,
        user,
        isPendingGetCurrentUser: isFetchingUser || isPending, // Combine custom and TanStack loading states
    }
}
