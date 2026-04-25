import { and, asc, desc, eq, gte, lte } from "drizzle-orm"

import { hasDatabaseUrl, withDbRetry } from "@/db"
import { transactions, type Transaction } from "@/db/schema"
import { getMonthRange } from "@/lib/format"

export type FinanceTransaction = {
  id: string
  type: "DEBIT" | "KREDIT"
  amount: number
  description: string
  transactionDate: Date
  createdBy: string
  createdAt: Date
}

const demoTransactions: FinanceTransaction[] = [
  {
    id: "demo-1",
    type: "DEBIT",
    amount: 2750000,
    description: "Kotak amal Jumat",
    transactionDate: new Date(2026, 3, 3),
    createdBy: "demo-bendahara",
    createdAt: new Date(2026, 3, 3),
  },
  {
    id: "demo-2",
    type: "KREDIT",
    amount: 650000,
    description: "Bayar listrik dan air",
    transactionDate: new Date(2026, 3, 8),
    createdBy: "demo-bendahara",
    createdAt: new Date(2026, 3, 8),
  },
  {
    id: "demo-3",
    type: "DEBIT",
    amount: 1200000,
    description: "Infak kajian subuh",
    transactionDate: new Date(2026, 3, 14),
    createdBy: "demo-bendahara",
    createdAt: new Date(2026, 3, 14),
  },
  {
    id: "demo-4",
    type: "KREDIT",
    amount: 850000,
    description: "Perawatan sound system",
    transactionDate: new Date(2026, 3, 20),
    createdBy: "demo-bendahara",
    createdAt: new Date(2026, 3, 20),
  },
]

function mapTransaction(transaction: Transaction): FinanceTransaction {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.description,
    transactionDate: new Date(`${transaction.transactionDate}T00:00:00`),
    createdBy: transaction.createdBy,
    createdAt: transaction.createdAt,
  }
}

export async function getTransactions(params?: { year?: number; month?: number }) {
  if (!hasDatabaseUrl()) {
    return filterTransactions(demoTransactions, params)
  }

  const filters =
    params?.year && params?.month
      ? (() => {
          const { start, end } = getMonthRange(params.year, params.month)
          return and(
            gte(transactions.transactionDate, start),
            lte(transactions.transactionDate, end),
          )
        })()
      : undefined

  const rows = await withDbRetry((db) => {
    return filters
      ? db.select().from(transactions).where(filters).orderBy(desc(transactions.transactionDate))
      : db.select().from(transactions).orderBy(asc(transactions.transactionDate))
  })

  return rows.map(mapTransaction)
}

export async function getTransactionById(id: string) {
  if (!hasDatabaseUrl()) {
    return demoTransactions.find((transaction) => transaction.id === id) ?? null
  }

  const [row] = await withDbRetry((db) => {
    return db.select().from(transactions).where(eq(transactions.id, id)).limit(1)
  })

  return row ? mapTransaction(row) : null
}

export async function getMonthlyReport(year: number, month: number) {
  const allTransactions = await getTransactions()
  const monthTransactions = await getTransactions({ year, month })

  const balance = allTransactions.reduce((total, transaction) => {
    return total + (transaction.type === "DEBIT" ? transaction.amount : -transaction.amount)
  }, 0)

  const monthDebit = sumByType(monthTransactions, "DEBIT")
  const monthCredit = sumByType(monthTransactions, "KREDIT")
  const cashflow = buildCashflow(monthTransactions)

  return {
    balance,
    monthDebit,
    monthCredit,
    netChange: monthDebit - monthCredit,
    transactions: monthTransactions,
    cashflow,
  }
}

function filterTransactions(
  rows: FinanceTransaction[],
  params?: { year?: number; month?: number },
) {
  if (!params?.year || !params.month) {
    return [...rows].sort((a, b) => a.transactionDate.getTime() - b.transactionDate.getTime())
  }

  return rows
    .filter((transaction) => {
      return (
        transaction.transactionDate.getFullYear() === params.year &&
        transaction.transactionDate.getMonth() + 1 === params.month
      )
    })
    .sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime())
}

function sumByType(rows: FinanceTransaction[], type: "DEBIT" | "KREDIT") {
  return rows
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)
}

function buildCashflow(rows: FinanceTransaction[]) {
  const daily = new Map<string, { label: string; debit: number; credit: number }>()

  for (const transaction of rows) {
    const key = transaction.transactionDate.toISOString().slice(0, 10)
    const label = String(transaction.transactionDate.getDate()).padStart(2, "0")
    const current = daily.get(key) ?? { label, debit: 0, credit: 0 }

    if (transaction.type === "DEBIT") {
      current.debit += transaction.amount
    } else {
      current.credit += transaction.amount
    }

    daily.set(key, current)
  }

  return [...daily.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({
      ...value,
      net: value.debit - value.credit,
    }))
}
