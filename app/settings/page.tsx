import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { BellRing, Globe, Palette, Shield, User, Server } from "lucide-react"

export default function SettingsPage() {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application preferences</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/settings/theme" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <Palette className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the appearance of your workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Choose from predefined themes or create your own custom color scheme
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/account" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <User className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Update your profile information, email, and password</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/notifications" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <BellRing className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Set up email, push, and in-app notification preferences</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/security" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage security settings and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configure two-factor authentication and access controls</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/language" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <Globe className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>Set your preferred language and regional settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Choose language, date format, and time zone preferences</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/api" className="block">
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader>
                <Server className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>API Settings</CardTitle>
                <CardDescription>Configure backend API connection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Set up API endpoints and toggle between real and mock data
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

