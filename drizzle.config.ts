import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

config({ path: ".env.local", quiet: true })
config({ quiet: true })

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
})
