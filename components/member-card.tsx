import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, MoreHorizontal, Phone, Shield } from "lucide-react"

interface MemberCardProps {
  member: {
    id: string
    name: string
    role: string
    email: string
    isOnCall: boolean
    badges: string[]
  }
  teamId: string
}

export function MemberCard({ member, teamId }: MemberCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-medium">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/teams/${teamId}/members/${member.id}/edit`} className="flex w-full">
                  Edit Member
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Change Role</DropdownMenuItem>
              <DropdownMenuItem>Set On-Call Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Remove from Team</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Role: {member.role}</span>
          </div>
          {member.isOnCall && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              On-Call
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Badges:</p>
          <div className="flex flex-wrap gap-2">
            {member.badges.map((badge, index) => (
              <Badge key={index} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-2">
        <div className="flex w-full justify-between">
          <Button variant="ghost" size="sm" className="text-xs">
            <Mail className="mr-1 h-3 w-3" />
            Message
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            <Phone className="mr-1 h-3 w-3" />
            Call
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

