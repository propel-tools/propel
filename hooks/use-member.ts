"use client"

import { useState, useEffect, useCallback } from "react"
import type { Member } from "@/types/member"
import { getMember } from "@/services/member-service"
import { useToast } from "@/hooks/use-toast"

export function useMember(id: string) {
  const { toast } = useToast()
  const [data, setData] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMember = useCallback(async () => {
    try {
      setIsLoading(true)
      const member = await getMember(id)
      setData(member)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      toast({
        title: "Error loading member",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    fetchMember()
  }, [fetchMember])

  const refetch = useCallback(() => {
    fetchMember()
  }, [fetchMember])

  return { data, isLoading, error, refetch }
}

