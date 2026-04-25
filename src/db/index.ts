import { drizzle, type MySql2Database } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"

import * as schema from "@/db/schema"

let pool: mysql.Pool | null = null
let db: MySql2Database<typeof schema> | null = null

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL)
}

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured")
  }

  if (!pool) {
    pool = mysql.createPool(databaseUrl)
  }

  if (!db) {
    db = drizzle(pool, { schema, mode: "default" })
  }

  return db!
}

export async function withDbRetry<T>(
  operation: (database: MySql2Database<typeof schema>) => Promise<T>,
) {
  try {
    return await operation(getDb())
  } catch (error) {
    if (!isConnectionReset(error)) {
      throw error
    }

    await resetDbConnection()
    return operation(getDb())
  }
}

async function resetDbConnection() {
  const existingPool = pool

  pool = null
  db = null

  if (existingPool) {
    await existingPool.end().catch(() => undefined)
  }
}

function isConnectionReset(error: unknown) {
  const candidate = error as {
    code?: string
    cause?: { code?: string; fatal?: boolean }
  }

  return candidate.code === "ECONNRESET" || candidate.cause?.code === "ECONNRESET"
}
