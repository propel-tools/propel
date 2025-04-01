import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Users } from "lucide-react"

interface TeamCardProps {
  team: {
    id: string
    name: string
    description: string
    memberCount: number
    oncallMember: string
  }
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{team.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {team.memberCount} members
          </Badge>
        </div>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="flex -space-x-2 mr-2">
            {[...Array(Math.min(3, team.memberCount))].map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background"
              >
                <Users className="h-4 w-4" />
              </div>
            ))}
            {team.memberCount > 3 && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background">
                <span className="text-xs font-medium">+{team.memberCount - 3}</span>
              </div>
            )}
          </div>
          <div className="ml-2">
            <div className="text-sm font-medium">On-call:</div>
            <div className="flex items-center">
              <Badge variant="secondary" className="rounded-full">
                {team.oncallMember}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-2">
        <div className="flex w-full justify-between">
          <Link href={`/teams/${team.id}`} className="w-full">
            <Button variant="ghost" className="w-full justify-start">
              View Team
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

