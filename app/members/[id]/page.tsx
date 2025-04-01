"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, Edit, Trash, Shield, Calendar } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useMember } from "@/hooks/use-member"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteMember } from "@/services/member-service"

interface MemberProfilePageProps {
  params: {
    id: string
  }
}

export default function MemberProfilePage({ params }: MemberProfilePageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const memberId = params.id
  const { data: member, isLoading, error } = useMember(memberId)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteMember = async () => {
    setIsDeleting(true)
    try {
      await deleteMember(memberId)
      toast({
        title: "Success",
        description: "Member has been deleted successfully.",
      })
      router.push("/members")
    } catch (error) {
      console.error("Error deleting member:", error)
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  if (isLoading) {
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
            <Link href="/members">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Members
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="grid gap-6">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !member) {
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
            <Link href="/members">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Members
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">
                Error loading member profile. The member may not exist or there was a problem with the request.
              </p>
              <Button onClick={() => router.push("/members")}>Return to Members</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          <Link href="/members">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Members
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-medium">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="outline">{member.role}</Badge>
                <span>•</span>
                <span>{member.teamName}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/members/${member.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove {member.name} from the system and remove
                    all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteMember}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{member.phone || "Not provided"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Role: {member.role}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Joined: {member.joinedAt || "Not available"}</span>
                  </div>
                  {member.isOnCall && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Currently On-Call
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.skills && member.skills.length > 0 ? (
                      member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Track member's recent actions and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {member.activities && member.activities.length > 0 ? (
                    member.activities.map((activity, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <activity.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="h-full w-px bg-border" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <p className="text-sm font-medium leading-none">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card>
              <CardHeader>
                <CardTitle>Badges & Achievements</CardTitle>
                <CardDescription>Recognizing contributions and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {member.badges && member.badges.length > 0 ? (
                    member.badges.map((badge, index) => (
                      <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <span className="text-lg font-medium">{badge.substring(0, 2)}</span>
                        </div>
                        <h3 className="font-medium text-center">{badge}</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Awarded on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">No badges earned yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => router.push(`/members/${member.id}/badges/add`)}>
                  Award New Badge
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

