import { hash } from "bcryptjs"
import { config } from "dotenv"

import { getDb } from "@/db"
import { users } from "@/db/schema"

config({ path: ".env.local", quiet: true })
config({ quiet: true })

async function main() {
  const db = getDb()
  const bendaharaPassword = requireEnv("SEED_BENDAHARA_PASSWORD")
  const ketuaPassword = requireEnv("SEED_KETUA_PASSWORD")
  const bendaharaPasswordHash = await hash(bendaharaPassword, 10)
  const ketuaPasswordHash = await hash(ketuaPassword, 10)

  await upsertUser({
    id: "7e127f69-211b-4d5e-a215-94ac58c203f9",
    username: "081363899584",
    passwordHash: bendaharaPasswordHash,
    role: "BENDAHARA",
  })

  await upsertUser({
    id: "ba818240-ee18-46c8-85c0-9fb8d5544984",
    username: "081371432512",
    passwordHash: ketuaPasswordHash,
    role: "KETUA",
  })

  console.log("Seeded users:")
  console.log("Bendahara: 081363899584")
  console.log("Ketua: 081371432512")

  async function upsertUser(user: typeof users.$inferInsert) {
    await db
      .insert(users)
      .values(user)
      .onDuplicateKeyUpdate({
        set: {
          passwordHash: user.passwordHash,
          role: user.role,
        },
      })
  }
}

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is required`)
  }

  return value
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
