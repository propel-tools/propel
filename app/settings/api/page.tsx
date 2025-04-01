"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Check, X } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useApi } from "@/providers/api-provider"
import { useToast } from "@/hooks/use-toast"

export default function ApiSettingsPage() {
  const { apiUrl, useMockData, setUseMockData, isConnected } = useApi()
  const { toast } = useToast()
  const [apiUrlInput, setApiUrlInput] = useState(apiUrl)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const testConnection = async () => {
    if (!apiUrlInput) {
      toast({
        title: "Error",
        description: "Please enter an API URL",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(`${apiUrlInput}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Connection successful! API is reachable.",
        })
      } else {
        setTestResult({
          success: false,
          message: `Connection failed with status: ${response.status}`,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Connection failed. API is unreachable.",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const saveSettings = () => {
    // In a real app, you would save these settings to localStorage or a backend
    // For now, we'll just update the context
    localStorage.setItem("apiUrl", apiUrlInput)
    localStorage.setItem("useMockData", useMockData.toString())

    // Reload the page to apply the new settings
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="container max-w-2xl mx-auto py-6 flex-1">
        <div className="flex items-center mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
            <p className="text-muted-foreground">Configure your backend API connection</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure how the application connects to your backend API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API Base URL</Label>
              <div className="flex gap-2">
                <Input
                  id="apiUrl"
                  placeholder="https://api.example.com"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={testConnection} disabled={isTesting}>
                  {isTesting ? "Testing..." : "Test"}
                </Button>
              </div>
              {testResult && (
                <div
                  className={`flex items-center gap-2 text-sm mt-1 ${testResult.success ? "text-green-500" : "text-red-500"}`}
                >
                  {testResult.success ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {testResult.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="mockData">Use Mock Data</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, the application will use mock data instead of making API calls
                </p>
              </div>
              <Switch id="mockData" checked={useMockData} onCheckedChange={setUseMockData} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>Reference for integrating with the Team Management API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">API Endpoints</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The following endpoints are available for integration:
                </p>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div className="mb-1">GET /members - List all members</div>
                  <div className="mb-1">GET /members/:id - Get member details</div>
                  <div className="mb-1">POST /members - Create a new member</div>
                  <div className="mb-1">PUT /members/:id - Update a member</div>
                  <div className="mb-1">DELETE /members/:id - Delete a member</div>
                  <div className="mb-1">GET /teams - List all teams</div>
                  <div className="mb-1">GET /teams/:id - Get team details</div>
                  <div className="mb-1">POST /teams - Create a new team</div>
                  <div className="mb-1">PUT /teams/:id - Update a team</div>
                  <div className="mb-1">DELETE /teams/:id - Delete a team</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  All API requests should include an Authorization header with a Bearer token.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

