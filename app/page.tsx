import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamCard } from "@/components/team-card"
import { PlusCircle, Users } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { MainNav } from "@/components/main-nav"

export default function Dashboard() {
  // Mock data for teams
  const teams = [
    {
      id: "1",
      name: "Engineering",
      description: "Frontend and backend development team",
      memberCount: 12,
      oncallMember: "Alex Johnson",
    },
    {
      id: "2",
      name: "Design",
      description: "UI/UX and graphic design team",
      memberCount: 8,
      oncallMember: "Sarah Miller",
    },
    {
      id: "3",
      name: "Product",
      description: "Product management and strategy",
      memberCount: 5,
      oncallMember: "Michael Chen",
    },
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

      <div className="container mx-auto py-6 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your teams and members</p>
          </div>
          <Link href="/teams/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Quick Stats</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{teams.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">25</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">On-Call Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-center p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Alex Johnson joined Engineering team</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Miller is now on-call for Design team</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New team created: Product</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

