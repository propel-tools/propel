"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useToast } from "@/hooks/use-toast"
import { useTeams } from "@/hooks/use-teams"
import { useMember } from "@/hooks/use-member"
import { updateMember } from "@/services/member-service"
import { Skeleton } from "@/components/ui/skeleton"

interface EditMemberPageProps {
  params: {
    id: string
  }
}

export default function EditMemberPage({ params }: EditMemberPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const memberId = params.id
  const { data: member, isLoading: memberLoading, error: memberError } = useMember(memberId)
  const { data: teams, isLoading: teamsLoading } = useTeams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [memberData, setMemberData] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    teamId: "",
    phone: "",
    isOnCall: false,
    skills: [] as string[],
    badges: [] as string[],
  })

  useEffect(() => {
    if (member) {
      setMemberData({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        teamId: member.teamId,
        phone: member.phone || "",
        isOnCall: member.isOnCall,
        skills: member.skills || [],
        badges: member.badges || [],
      })
    }
  }, [member])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMemberData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMemberData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMemberData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
    setMemberData((prev) => ({ ...prev, skills: skillsArray }))
  }

  const handleBadgeToggle = (badge: string) => {
    setMemberData((prev) => {
      const badges = [...prev.badges]
      if (badges.includes(badge)) {
        return { ...prev, badges: badges.filter((b) => b !== badge) }
      } else {
        return { ...prev, badges: [...badges, badge] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!memberData.name || !memberData.email || !memberData.role || !memberData.teamId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateMember(memberData)
      toast({
        title: "Success",
        description: "Member has been updated successfully.",
      })
      router.push(`/members/${memberId}`)
    } catch (error) {
      console.error("Error updating member:", error)
      toast({
        title: "Error",
        description: "Failed to update member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableBadges = [
    "MVP",
    "Problem Solver",
    "5+ Years",
    "Mentor",
    "Documentation",
    "Bug Hunter",
    "Automation",
    "New Hire",
  ]

  if (memberLoading) {
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
            <Link href={`/members/${memberId}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (memberError || !member) {
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
                Error loading member data. The member may not exist or there was a problem with the request.
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

      <div className="container max-w-2xl mx-auto py-6 flex-1">
        <div className="flex items-center mb-6">
          <Link href={`/members/${memberId}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Member</CardTitle>
            <CardDescription>Update {member.name}'s information</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input id="name" name="name" value={memberData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input id="email" name="email" type="email" value={memberData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={memberData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select value={memberData.role} onValueChange={(value) => handleSelectChange("role", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="team_lead">Team Lead</SelectItem>
                    <SelectItem value="senior">Senior Member</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamId">
                  Team <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={memberData.teamId}
                  onValueChange={(value) => handleSelectChange("teamId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamsLoading ? (
                      <SelectItem value="" disabled>
                        Loading teams...
                      </SelectItem>
                    ) : teams && teams.length > 0 ? (
                      teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No teams available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Textarea
                  id="skills"
                  value={memberData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="React, TypeScript, UI Design, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isOnCall"
                  checked={memberData.isOnCall}
                  onCheckedChange={(checked) => handleCheckboxChange("isOnCall", checked as boolean)}
                />
                <Label htmlFor="isOnCall" className="cursor-pointer">
                  Assign as on-call member
                </Label>
              </div>

              <div className="space-y-2 pt-2">
                <Label>Badges</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableBadges.map((badge) => (
                    <div key={badge} className="flex items-center space-x-2">
                      <Checkbox
                        id={`badge-${badge}`}
                        checked={memberData.badges.includes(badge)}
                        onCheckedChange={() => handleBadgeToggle(badge)}
                      />
                      <Label htmlFor={`badge-${badge}`} className="cursor-pointer">
                        {badge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/members/${memberId}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

