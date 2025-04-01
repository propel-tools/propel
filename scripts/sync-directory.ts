import { PrismaClient } from "@prisma/client"
import ldap from "ldapjs"
import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"

const prisma = new PrismaClient()

interface LdapConfig {
  url: string
  bindDN: string
  bindCredentials: string
  searchBase: string
  searchFilter: string
  attributes: string[]
  groupSearchBase?: string
  groupSearchFilter?: string
  groupAttributes?: string[]
}

interface GoogleConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken: string
  domain: string
}

async function syncLDAP(tenantId: string, config: LdapConfig) {
  console.log(`Starting LDAP sync for tenant ${tenantId}...`)

  const client = ldap.createClient({
    url: config.url,
  })

  return new Promise<void>((resolve, reject) => {
    client.bind(config.bindDN, config.bindCredentials, async (err) => {
      if (err) {
        client.destroy()
        return reject(new Error(`LDAP bind error: ${err.message}`))
      }

      try {
        // Get all existing members for this tenant
        const existingMembers = await prisma.member.findMany({
          where: { tenantId },
          select: { id: true, externalId: true, email: true },
        })

        const existingMembersByExternalId = new Map(
          existingMembers.filter((m) => m.externalId).map((m) => [m.externalId, m]),
        )

        // Search for users
        const users: any[] = await new Promise((resolve, reject) => {
          const users: any[] = []

          client.search(
            config.searchBase,
            {
              scope: "sub",
              filter: config.searchFilter,
              attributes: config.attributes,
            },
            (err, res) => {
              if (err) return reject(err)

              res.on("searchEntry", (entry) => {
                users.push(entry.object)
              })

              res.on("error", (err) => {
                reject(err)
              })

              res.on("end", () => {
                resolve(users)
              })
            },
          )
        })

        console.log(`Found ${users.length} users in LDAP`)

        // Get default team for new users
        const defaultTeam = await prisma.team.findFirst({
          where: { tenantId },
        })

        if (!defaultTeam) {
          throw new Error("No default team found for tenant")
        }

        // Process each user
        for (const user of users) {
          const externalId = user.objectGUID || user.entryUUID || user.uid
          const email = user.mail || user.email
          const name = user.displayName || `${user.givenName} ${user.sn}`.trim()

          if (!externalId || !email || !name) {
            console.warn(`Skipping user with incomplete data: ${JSON.stringify(user)}`)
            continue
          }

          const existingMember = existingMembersByExternalId.get(externalId)

          if (existingMember) {
            // Update existing member
            await prisma.member.update({
              where: { id: existingMember.id },
              data: {
                name,
                email,
                // Don't update role or team - these are managed in the app
                phone: user.telephoneNumber || user.mobile,
                updatedAt: new Date(),
              },
            })
            console.log(`Updated member: ${name} (${email})`)
          } else {
            // Create new member
            await prisma.member.create({
              data: {
                externalId,
                name,
                email,
                role: "Member", // Default role
                teamId: defaultTeam.id,
                tenantId,
                phone: user.telephoneNumber || user.mobile,
                skills: [],
              },
            })
            console.log(`Created new member: ${name} (${email})`)
          }
        }

        // Update sync timestamp
        await prisma.syncConfig.update({
          where: {
            id: (await prisma.syncConfig.findFirst({
              where: { tenantId, provider: "ldap" },
            }))!.id,
          },
          data: {
            lastSyncedAt: new Date(),
          },
        })

        client.unbind()
        resolve()
      } catch (error) {
        client.unbind()
        reject(error)
      }
    })
  })
}

async function syncGoogle(tenantId: string, config: GoogleConfig) {
  console.log(`Starting Google Workspace sync for tenant ${tenantId}...`)

  try {
    // Set up Google OAuth client
    const oauth2Client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri)

    oauth2Client.setCredentials({
      refresh_token: config.refreshToken,
    })

    const admin = google.admin({
      version: "directory_v1",
      auth: oauth2Client,
    })

    // Get all existing members for this tenant
    const existingMembers = await prisma.member.findMany({
      where: { tenantId },
      select: { id: true, externalId: true, email: true },
    })

    const existingMembersByExternalId = new Map(
      existingMembers.filter((m) => m.externalId).map((m) => [m.externalId, m]),
    )

    // Get default team for new users
    const defaultTeam = await prisma.team.findFirst({
      where: { tenantId },
    })

    if (!defaultTeam) {
      throw new Error("No default team found for tenant")
    }

    // Fetch users from Google Workspace
    let pageToken: string | undefined
    let allUsers: any[] = []

    do {
      const response = await admin.users.list({
        domain: config.domain,
        maxResults: 100,
        pageToken,
      })

      const users = response.data.users || []
      allUsers = allUsers.concat(users)
      pageToken = response.data.nextPageToken
    } while (pageToken)

    console.log(`Found ${allUsers.length} users in Google Workspace`)

    // Process each user
    for (const user of allUsers) {
      if (!user.primaryEmail || user.suspended) {
        continue
      }

      const externalId = user.id
      const email = user.primaryEmail
      const name = user.name.fullName

      const existingMember = existingMembersByExternalId.get(externalId)

      if (existingMember) {
        // Update existing member
        await prisma.member.update({
          where: { id: existingMember.id },
          data: {
            name,
            email,
            // Don't update role or team - these are managed in the app
            phone: user.phones?.[0]?.value,
            updatedAt: new Date(),
          },
        })
        console.log(`Updated member: ${name} (${email})`)
      } else {
        // Create new member
        await prisma.member.create({
          data: {
            externalId,
            name,
            email,
            role: "Member", // Default role
            teamId: defaultTeam.id,
            tenantId,
            phone: user.phones?.[0]?.value,
            skills: [],
          },
        })
        console.log(`Created new member: ${name} (${email})`)
      }
    }

    // Update sync timestamp
    await prisma.syncConfig.update({
      where: {
        id: (await prisma.syncConfig.findFirst({
          where: { tenantId, provider: "google" },
        }))!.id,
      },
      data: {
        lastSyncedAt: new Date(),
      },
    })

    console.log(`Google Workspace sync completed for tenant ${tenantId}`)
  } catch (error) {
    console.error("Error syncing with Google Workspace:", error)
    throw error
  }
}

async function main() {
  try {
    // Get all tenants with sync configs
    const syncConfigs = await prisma.syncConfig.findMany({
      include: {
        tenant: true,
      },
    })

    console.log(`Found ${syncConfigs.length} sync configurations`)

    for (const syncConfig of syncConfigs) {
      try {
        const config = syncConfig.config as any

        if (syncConfig.provider === "ldap") {
          await syncLDAP(syncConfig.tenantId, config as LdapConfig)
        } else if (syncConfig.provider === "google") {
          await syncGoogle(syncConfig.tenantId, config as GoogleConfig)
        } else {
          console.warn(`Unknown provider: ${syncConfig.provider}`)
        }
      } catch (error) {
        console.error(`Error syncing tenant ${syncConfig.tenantId}:`, error)
        // Continue with next tenant
      }
    }

    console.log("Directory synchronization completed")
  } catch (error) {
    console.error("Error in directory sync:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script if executed directly
if (require.main === module) {
  main()
}

// Export for programmatic use
export { syncLDAP, syncGoogle }

