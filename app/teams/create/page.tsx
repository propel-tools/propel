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
import { ArrowLeft } from "lucide-react"

import { addTeam } from "@/services/team-service"
import { TeamCreate } from "@/types/team"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"

export default function CreateTeamPage() {
  const router = useRouter()
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTeamData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the team data to your backend
    console.log("Creating team:", teamData)
    const newTeam: TeamCreate = {
      name: teamData.name,
      description: teamData.description
    }
    // Call the createTeam function to create the team
    addTeam(newTeam)
      .then(() => {
        // Handle success (e.g., show a success message)
        console.log("Team created successfully")
        toast({
          title: "Team Created",
          description: "Your team has been created successfully.",
          variant: "default",
        })
      })
      .catch((error) => {
        // Handle error (e.g., show an error message)
        console.error("Error creating team:", error)
        toast({
          title: "Team creation failed",
          description: "Something went wrong while creating the team.",
          variant: "default",
        })
      })
    // Reset the form
    setTeamData({
      name: "",
      description: "",
    })
    // Optionally, you can show a success message or redirect the user
    // For example, you can use a toast notification or a modal
   
    router.push("/")
  }

  return (
    <div className="container max-w-2xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Team</CardTitle>
          <CardDescription>Set up a new team to collaborate with your colleagues</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Engineering, Design, Marketing, etc."
                value={teamData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What does this team do?"
                value={teamData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

