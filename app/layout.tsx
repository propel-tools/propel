import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ApiProvider } from "@/providers/api-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Team Management Platform",
  description: "Manage your teams, members, and roles efficiently",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ApiProvider>
            {children}
            <Toaster />
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'