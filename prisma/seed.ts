import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Clean up existing data
  await prisma.memberBadge.deleteMany({})
  await prisma.member.deleteMany({})
  await prisma.badge.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.syncConfig.deleteMany({})
  await prisma.tenant.deleteMany({})

  console.log("Cleaned up existing data")

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Company",
      domain: "demo-company.com",
      customerId: "DEMO-001",
      apiKey: randomBytes(32).toString("hex"),
    },
  })

  console.log("Created tenant:", tenant.name)

  // Create teams
  const engineeringTeam = await prisma.team.create({
    data: {
      name: "Engineering",
      description: "Frontend and backend development team",
      tenantId: tenant.id,
    },
  })

  const designTeam = await prisma.team.create({
    data: {
      name: "Design",
      description: "UI/UX and graphic design team",
      tenantId: tenant.id,
    },
  })

  const productTeam = await prisma.team.create({
    data: {
      name: "Product",
      description: "Product management and strategy",
      tenantId: tenant.id,
    },
  })

  console.log("Created teams")

  // Create badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: "MVP",
        description: "Most Valuable Player - Exceptional contribution to team goals",
        color: "#FFD700",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Problem Solver",
        description: "Consistently resolves complex issues",
        color: "#4CAF50",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "5+ Years",
        description: "More than 5 years with the team",
        color: "#2196F3",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Mentor",
        description: "Actively mentors other team members",
        color: "#9C27B0",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Documentation",
        description: "Excellence in documentation",
        color: "#607D8B",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Bug Hunter",
        description: "Finds and fixes critical bugs",
        color: "#F44336",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "Automation",
        description: "Creates tools and scripts to automate processes",
        color: "#FF9800",
        tenantId: tenant.id,
      },
    }),
    prisma.badge.create({
      data: {
        name: "New Hire",
        description: "Recently joined the team",
        color: "#03A9F4",
        tenantId: tenant.id,
      },
    }),
  ])

  console.log("Created badges")

  // Create members
  const alexJohnson = await prisma.member.create({
    data: {
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Team Lead",
      teamId: engineeringTeam.id,
      tenantId: tenant.id,
      isOnCall: true,
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    },
  })

  const sarahMiller = await prisma.member.create({
    data: {
      name: "Sarah Miller",
      email: "sarah@example.com",
      role: "Senior Member",
      teamId: designTeam.id,
      tenantId: tenant.id,
      isOnCall: false,
      skills: ["UI Design", "Figma", "User Research"],
    },
  })

  const michaelChen = await prisma.member.create({
    data: {
      name: "Michael Chen",
      email: "michael@example.com",
      role: "Member",
      teamId: engineeringTeam.id,
      tenantId: tenant.id,
      isOnCall: false,
      skills: ["Python", "Django", "AWS"],
    },
  })

  const emilyRodriguez = await prisma.member.create({
    data: {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      role: "Member",
      teamId: productTeam.id,
      tenantId: tenant.id,
      isOnCall: false,
      skills: ["Product Management", "Agile", "JIRA"],
    },
  })

  const davidKim = await prisma.member.create({
    data: {
      name: "David Kim",
      email: "david@example.com",
      role: "Admin",
      teamId: engineeringTeam.id,
      tenantId: tenant.id,
      isOnCall: false,
      skills: ["Architecture", "DevOps", "Kubernetes"],
    },
  })

  console.log("Created members")

  // Assign badges to members
  await prisma.memberBadge.createMany({
    data: [
      { memberId: alexJohnson.id, badgeId: badges[0].id }, // MVP
      { memberId: alexJohnson.id, badgeId: badges[2].id }, // 5+ Years
      { memberId: alexJohnson.id, badgeId: badges[3].id }, // Mentor
      { memberId: sarahMiller.id, badgeId: badges[1].id }, // Problem Solver
      { memberId: sarahMiller.id, badgeId: badges[4].id }, // Documentation
      { memberId: michaelChen.id, badgeId: badges[7].id }, // New Hire
      { memberId: emilyRodriguez.id, badgeId: badges[5].id }, // Bug Hunter
      { memberId: emilyRodriguez.id, badgeId: badges[6].id }, // Automation
      { memberId: davidKim.id, badgeId: badges[0].id }, // MVP
      { memberId: davidKim.id, badgeId: badges[2].id }, // 5+ Years
    ],
  })

  console.log("Assigned badges to members")

  // Create sample sync configs
  await prisma.syncConfig.create({
    data: {
      tenantId: tenant.id,
      provider: "ldap",
      config: {
        url: "ldap://ldap.example.com:389",
        bindDN: "cn=admin,dc=example,dc=com",
        bindCredentials: "password",
        searchBase: "ou=users,dc=example,dc=com",
        searchFilter: "(objectClass=person)",
        attributes: ["uid", "mail", "displayName", "givenName", "sn", "telephoneNumber"],
      },
    },
  })

  await prisma.syncConfig.create({
    data: {
      tenantId: tenant.id,
      provider: "google",
      config: {
        clientId: "your-client-id.apps.googleusercontent.com",
        clientSecret: "your-client-secret",
        redirectUri: "https://your-app.com/auth/google/callback",
        refreshToken: "your-refresh-token",
        domain: "your-domain.com",
      },
    },
  })

  console.log("Created sync configurations")

  console.log("Seed completed successfully")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

