"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trash } from "lucide-react"

interface TeamSettingsPageProps {
  params: {
    id: string
  }
}

export default function TeamSettingsPage({ params }: TeamSettingsPageProps) {
  const router = useRouter()
  const teamId = params.id

  // Mock data for team settings
  const [teamData, setTeamData] = useState({
    name: teamId === "1" ? "Engineering" : teamId === "2" ? "Design" : "Product",
    description: "Cross-functional team responsible for product development",
    isPrivate: false,
    allowSelfAssign: true,
    requireApproval: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTeamData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setTeamData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the team settings to your backend
    console.log("Updating team settings:", teamData)

    // Redirect to the team page after settings update
    router.push(`/teams/${teamId}`)
  }

  const handleDeleteTeam = () => {
    // In a real app, you would delete the team from your backend
    console.log("Deleting team:", teamId)

    // Redirect to the dashboard after team deletion
    router.push("/")
  }

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href={`/teams/${teamId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Team
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-6">Team Settings</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Update your team's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input id="name" name="name" value={teamData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={teamData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPrivate">Private Team</Label>
                    <Switch
                      id="isPrivate"
                      checked={teamData.isPrivate}
                      onCheckedChange={(checked) => handleSwitchChange("isPrivate", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Private teams are only visible to team members</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowSelfAssign">Allow Self-Assignment</Label>
                    <Switch
                      id="allowSelfAssign"
                      checked={teamData.allowSelfAssign}
                      onCheckedChange={(checked) => handleSwitchChange("allowSelfAssign", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Allow members to assign themselves to tasks</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Configure team roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Admin</h3>
                      <p className="text-sm text-muted-foreground">Full access to all team settings and members</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Team Lead</h3>
                      <p className="text-sm text-muted-foreground">Can manage team members and assign tasks</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Member</h3>
                      <p className="text-sm text-muted-foreground">Can view and participate in team activities</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Guest</h3>
                      <p className="text-sm text-muted-foreground">Limited access to view team information</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add Custom Role</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
              <CardDescription>Manage badges that can be assigned to team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">MVP</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Most Valuable Player</h3>
                        <p className="text-sm text-muted-foreground">Exceptional contribution to team goals</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">5+</span>
                      </div>
                      <div>
                        <h3 className="font-medium">5+ Years</h3>
                        <p className="text-sm text-muted-foreground">More than 5 years with the team</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">PS</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Problem Solver</h3>
                        <p className="text-sm text-muted-foreground">Consistently resolves complex issues</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add New Badge</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>These actions are irreversible and should be used with caution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-destructive/20 rounded-md p-4">
                  <h3 className="font-medium">Archive Team</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The team will be hidden but data will be preserved
                  </p>
                  <Button variant="outline" className="text-destructive border-destructive/50">
                    Archive Team
                  </Button>
                </div>
                <div className="border border-destructive/20 rounded-md p-4">
                  <h3 className="font-medium">Delete Team</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This action cannot be undone. All team data will be permanently removed.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteTeam}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

