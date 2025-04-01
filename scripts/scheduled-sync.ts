import { PrismaClient } from "@prisma/client"
import { syncLDAP, syncGoogle } from "./sync-directory"
import cron from "node-cron"

const prisma = new PrismaClient()

// Function to run sync for all tenants
async function runSync() {
  console.log("Starting scheduled directory sync...")

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
          await syncLDAP(syncConfig.tenantId, config)
        } else if (syncConfig.provider === "google") {
          await syncGoogle(syncConfig.tenantId, config)
        } else {
          console.warn(`Unknown provider: ${syncConfig.provider}`)
        }
      } catch (error) {
        console.error(`Error syncing tenant ${syncConfig.tenant.name} (${syncConfig.tenantId}):`, error)
        // Continue with next tenant
      }
    }

    console.log("Scheduled directory synchronization completed")
  } catch (error) {
    console.error("Error in scheduled directory sync:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Schedule the sync to run daily at 2 AM
cron.schedule("0 2 * * *", runSync)

console.log("Directory sync scheduler started")

// Run once on startup
runSync()

