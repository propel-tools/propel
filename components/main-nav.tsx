"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold sm:inline-block">Team Management</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/teams"
          className={cn(
            "transition-colors hover:text-primary",
            pathname?.startsWith("/teams") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Teams
        </Link>
        <Link
          href="/members"
          className={cn(
            "transition-colors hover:text-primary",
            pathname?.startsWith("/members") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Members
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-primary",
            pathname?.startsWith("/settings") ? "text-primary" : "text-muted-foreground",
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  )
}

