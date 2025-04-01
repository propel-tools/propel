"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useToast } from "@/hooks/use-toast"
import { useTeams } from "@/hooks/use-teams"
import { addMember } from "@/services/member-service"

export default function AddMemberPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: teams, isLoading: teamsLoading } = useTeams()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    role: "",
    teamId: "",
    isOnCall: false,
    badges: [] as string[],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMemberData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMemberData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setMemberData((prev) => ({ ...prev, [name]: checked }))
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
      await addMember(memberData)
      toast({
        title: "Success",
        description: "Member has been added successfully.",
      })
      router.push("/members")
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
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
          <CardHeader>
            <CardTitle>Add New Member</CardTitle>
            <CardDescription>Create a new member and assign them to a team</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={memberData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={memberData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange("role", value)} required>
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
                <Select onValueChange={(value) => handleSelectChange("teamId", value)} required>
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
              <Button variant="outline" type="button" onClick={() => router.push("/members")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Member"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

