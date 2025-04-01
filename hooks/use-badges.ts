"use client"

import { useState, useEffect, useCallback } from "react"
import type { Badge } from "@/types/badge"
import { getBadges } from "@/services/badge-service"
import { useToast } from "@/hooks/use-toast"

export function useBadges() {
  const { toast } = useToast()
  const [data, setData] = useState<Badge[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true)
      const badges = await getBadges()
      setData(badges)
      setError(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      toast({
        title: "Error loading badges",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBadges()
  }, [fetchBadges])

  const refetch = useCallback(() => {
    fetchBadges()
  }, [fetchBadges])

  return { data, isLoading, error, refetch }
}

