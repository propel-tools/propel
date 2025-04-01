"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Copy, Palette, Paintbrush, Moon, Sun, Laptop } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activePreset, setActivePreset] = useState<string | null>(null)

  // Predefined color themes
  const colorPresets = [
    {
      id: "blue",
      name: "Blue",
      colors: {
        primary: "#3b82f6",
        secondary: "#a855f7",
        accent: "#f97316",
      },
    },
    {
      id: "green",
      name: "Green",
      colors: {
        primary: "#10b981",
        secondary: "#6366f1",
        accent: "#f59e0b",
      },
    },
    {
      id: "purple",
      name: "Purple",
      colors: {
        primary: "#8b5cf6",
        secondary: "#ec4899",
        accent: "#06b6d4",
      },
    },
    {
      id: "red",
      name: "Red",
      colors: {
        primary: "#ef4444",
        secondary: "#8b5cf6",
        accent: "#10b981",
      },
    },
  ]

  const applyTheme = (presetId: string) => {
    setActivePreset(presetId)
    // In a real app, this would update CSS variables or a theme context
    console.log(`Applying theme: ${presetId}`)

    // For demo purposes, we'll just switch between light/dark
    // In a real app, you would apply the custom colors
    if (presetId === "blue" || presetId === "green") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  const [customColors, setCustomColors] = useState({
    primary: "#3b82f6",
    secondary: "#a855f7",
    accent: "#f97316",
  })

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomColors((prev) => ({ ...prev, [name]: value }))
  }

  const applyCustomTheme = () => {
    // In a real app, this would update CSS variables or a theme context
    console.log("Applying custom theme:", customColors)

    // For demo purposes, we'll just switch to light theme
    // In a real app, you would apply the custom colors
    setTheme("light")
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

      <div className="container max-w-4xl mx-auto py-6 flex-1">
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
            <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
            <p className="text-muted-foreground">Customize the appearance of your team management platform</p>
          </div>
        </div>

        <Tabs defaultValue="presets">
          <TabsList className="mb-6">
            <TabsTrigger value="presets">
              <Palette className="mr-2 h-4 w-4" />
              Theme Presets
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Paintbrush className="mr-2 h-4 w-4" />
              Custom Theme
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Sun className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets">
            <Card>
              <CardHeader>
                <CardTitle>Theme Presets</CardTitle>
                <CardDescription>Choose from predefined color themes for your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colorPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${activePreset === preset.id ? "border-primary ring-2 ring-primary/20" : ""}`}
                      onClick={() => applyTheme(preset.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{preset.name}</h3>
                        {activePreset === preset.id && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: preset.colors.secondary }} />
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Theme</CardTitle>
                <CardDescription>Create your own color theme by selecting custom colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: customColors.primary }} />
                      <Input
                        id="primary"
                        name="primary"
                        type="color"
                        value={customColors.primary}
                        onChange={handleColorChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.primary}
                        onChange={handleColorChange}
                        name="primary"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: customColors.secondary }}
                      />
                      <Input
                        id="secondary"
                        name="secondary"
                        type="color"
                        value={customColors.secondary}
                        onChange={handleColorChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.secondary}
                        onChange={handleColorChange}
                        name="secondary"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: customColors.accent }} />
                      <Input
                        id="accent"
                        name="accent"
                        type="color"
                        value={customColors.accent}
                        onChange={handleColorChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={customColors.accent}
                        onChange={handleColorChange}
                        name="accent"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-24 rounded flex items-center justify-center text-white"
                          style={{ backgroundColor: customColors.primary }}
                        >
                          Primary
                        </div>
                        <div
                          className="h-10 w-24 rounded flex items-center justify-center text-white"
                          style={{ backgroundColor: customColors.secondary }}
                        >
                          Secondary
                        </div>
                        <div
                          className="h-10 w-24 rounded flex items-center justify-center text-white"
                          style={{ backgroundColor: customColors.accent }}
                        >
                          Accent
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="h-10 rounded flex-1 flex items-center justify-center text-white"
                          style={{ backgroundColor: customColors.primary }}
                        >
                          Button
                        </div>
                        <div
                          className="h-10 rounded flex-1 flex items-center justify-center border"
                          style={{ borderColor: customColors.primary, color: customColors.primary }}
                        >
                          Outline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCustomColors({
                      primary: "#3b82f6",
                      secondary: "#a855f7",
                      accent: "#f97316",
                    })
                  }
                >
                  Reset
                </Button>
                <Button onClick={applyCustomTheme}>Apply Custom Theme</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Manage your theme preferences and display settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Theme Mode</h3>
                    <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex gap-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex gap-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex gap-2"
                        onClick={() => setTheme("system")}
                      >
                        <Laptop className="h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">CSS Variables</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy these CSS variables to use in your custom stylesheets
                    </p>
                    <div className="relative mt-2">
                      <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                        {`:root {
  --primary: ${customColors.primary};
  --primary-foreground: #ffffff;
  --secondary: ${customColors.secondary};
  --secondary-foreground: #ffffff;
  --accent: ${customColors.accent};
  --accent-foreground: #ffffff;
}`}
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `:root {
  --primary: ${customColors.primary};
  --primary-foreground: #ffffff;
  --secondary: ${customColors.secondary};
  --secondary-foreground: #ffffff;
  --accent: ${customColors.accent};
  --accent-foreground: #ffffff;
}`,
                          )
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

