import {
  date,
  decimal,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

export const userRoles = ["BENDAHARA", "KETUA"] as const
export const transactionTypes = ["DEBIT", "KREDIT"] as const

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", userRoles).notNull(),
  otp: varchar("otp", { length: 6 }),
  otpExpiry: timestamp("otp_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const transactions = mysqlTable(
  "transactions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    type: mysqlEnum("type", transactionTypes).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    description: text("description").notNull(),
    transactionDate: date("transaction_date", { mode: "string" }).notNull(),
    createdBy: varchar("created_by", { length: 36 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (table) => [
    index("transactions_date_idx").on(table.transactionDate),
    index("transactions_type_idx").on(table.type),
    index("transactions_created_by_idx").on(table.createdBy),
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
