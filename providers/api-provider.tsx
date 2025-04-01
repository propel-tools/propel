"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface ApiContextType {
  apiUrl: string
  useMockData: boolean
  setUseMockData: (value: boolean) => void
  isConnected: boolean
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [apiUrl, setApiUrl] = useState<string>(process.env.NEXT_PUBLIC_API_URL || "")
  const [useMockData, setUseMockData] = useState<boolean>(process.env.NEXT_PUBLIC_USE_MOCK_FALLBACK === "true")
  const [isConnected, setIsConnected] = useState<boolean>(false)

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!apiUrl) {
        setIsConnected(false)
        return
      }

      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const connected = response.ok
        setIsConnected(connected)

        if (!connected && !useMockData) {
          toast({
            title: "API Connection Failed",
            description: "Using mock data as fallback. You can configure API settings in the admin panel.",
            variant: "destructive",
          })
          setUseMockData(true)
        }
      } catch (error) {
        setIsConnected(false)
        if (!useMockData) {
          toast({
            title: "API Connection Failed",
            description: "Using mock data as fallback. You can configure API settings in the admin panel.",
            variant: "destructive",
          })
          setUseMockData(true)
        }
      }
    }

    checkConnection()
  }, [apiUrl, toast, useMockData])

  return (
    <ApiContext.Provider value={{ apiUrl, useMockData, setUseMockData, isConnected }}>{children}</ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
}

