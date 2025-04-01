import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberCard } from "@/components/member-card"
import { ArrowLeft, PlusCircle, Settings } from "lucide-react"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  // Mock data for team details
  const team = {
    id: params.id,
    name: params.id === "1" ? "Engineering" : params.id === "2" ? "Design" : "Product",
    description: "Cross-functional team responsible for product development",
    createdAt: "January 15, 2023",
    members: [
      {
        id: "1",
        name: "Alex Johnson",
        role: "Team Lead",
        email: "alex@example.com",
        isOnCall: true,
        badges: ["MVP", "5+ Years", "Mentor"],
      },
      {
        id: "2",
        name: "Sarah Miller",
        role: "Senior Developer",
        email: "sarah@example.com",
        isOnCall: false,
        badges: ["Problem Solver", "Documentation"],
      },
      {
        id: "3",
        name: "Michael Chen",
        role: "Developer",
        email: "michael@example.com",
        isOnCall: false,
        badges: ["New Hire"],
      },
      {
        id: "4",
        name: "Emily Rodriguez",
        role: "QA Engineer",
        email: "emily@example.com",
        isOnCall: false,
        badges: ["Bug Hunter", "Automation"],
      },
    ],
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/teams/${team.id}/add-member`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </Link>
          <Link href={`/teams/${team.id}/settings`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Team Settings
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="mb-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="oncall">On-Call Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.members.map((member) => (
              <MemberCard key={member.id} member={member} teamId={team.id} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Team Achievements</CardTitle>
              <CardDescription>Recognizing outstanding contributions and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Project Completion: Dashboard Redesign</h3>
                    <p className="text-sm text-muted-foreground">Completed 2 weeks ahead of schedule</p>
                  </div>
                  <Badge>March 2023</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Zero Bugs Milestone</h3>
                    <p className="text-sm text-muted-foreground">Maintained zero critical bugs for 30 days</p>
                  </div>
                  <Badge>February 2023</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Customer Satisfaction Award</h3>
                    <p className="text-sm text-muted-foreground">Highest customer satisfaction rating</p>
                  </div>
                  <Badge>January 2023</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oncall">
          <Card>
            <CardHeader>
              <CardTitle>On-Call Schedule</CardTitle>
              <CardDescription>Current and upcoming on-call rotations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium">AJ</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Alex Johnson</h3>
                      <p className="text-sm text-muted-foreground">Current on-call</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">SM</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Sarah Miller</h3>
                      <p className="text-sm text-muted-foreground">Next on-call</p>
                    </div>
                  </div>
                  <Badge variant="outline">April 15 - April 22</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">MC</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Upcoming on-call</p>
                    </div>
                  </div>
                  <Badge variant="outline">April 22 - April 29</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

