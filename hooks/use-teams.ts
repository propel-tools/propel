"use client"

import { useState, useEffect, useCallback } from "react"
import type { Team } from "@/types/team"
import { getTeams } from "@/services/team-service"
import { useToast } from "@/hooks/use-toast"

export function useTeams() {
  const { toast } = useToast()
  const [data, setData] = useState<Team[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true)
      const teams = await getTeams()
      setData(teams)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      toast({
        title: "Error loading teams",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  const refetch = useCallback(() => {
    fetchTeams()
  }, [fetchTeams])

  return { data, isLoading, error, refetch }
}

