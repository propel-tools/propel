"use client"

import { useState, useEffect, useCallback } from "react"
import type { Member } from "@/types/member"
import { getMembers } from "@/services/member-service"
import { useToast } from "@/hooks/use-toast"

export function useMembers() {
  const { toast } = useToast()
  const [data, setData] = useState<Member[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      const members = await getMembers()
      setData(members)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      toast({
        title: "Error loading members",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const refetch = useCallback(() => {
    fetchMembers()
  }, [fetchMembers])

  return { data, isLoading, error, refetch }
}

