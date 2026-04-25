"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { eq } from "drizzle-orm"

import { withDbRetry } from "@/db"
import { transactions } from "@/db/schema"
import { clearSession, loginUser, requireRole, setSession } from "@/lib/auth"
import { toDateInputValue } from "@/lib/format"

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const transactionSchema = z.object({
  type: z.enum(["DEBIT", "KREDIT"]),
  amount: z.coerce.number().positive(),
  description: z.string().trim().min(3).max(500),
  transactionDate: z.coerce.date(),
})

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    redirect("/login?error=invalid")
  }

  const user = await loginUser(parsed.data.username, parsed.data.password)

  if (!user) {
    redirect("/login?error=invalid")
  }

  await setSession(user)
  redirect("/admin")
}

export async function logoutAction() {
  await clearSession()
  redirect("/")
}

export async function createTransactionAction(formData: FormData) {
  const user = await requireRole(["BENDAHARA"])
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    redirect("/admin?error=invalid-transaction")
  }

  await withDbRetry((db) => {
    return db.insert(transactions).values({
      id: crypto.randomUUID(),
      type: parsed.data.type,
      amount: parsed.data.amount.toFixed(2),
      description: parsed.data.description,
      transactionDate: toDateInputValue(parsed.data.transactionDate),
      createdBy: user.id,
    })
  })

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?status=created")
}

export async function updateTransactionAction(formData: FormData) {
  await requireRole(["BENDAHARA"])

  const id = z.string().min(1).parse(formData.get("id"))
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    redirect(`/admin/transactions/${id}/edit?error=invalid-transaction`)
  }

  await withDbRetry((db) => {
    return db
      .update(transactions)
      .set({
        type: parsed.data.type,
        amount: parsed.data.amount.toFixed(2),
        description: parsed.data.description,
        transactionDate: toDateInputValue(parsed.data.transactionDate),
      })
      .where(eq(transactions.id, id))
  })

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?status=updated")
}

export async function deleteTransactionAction(formData: FormData) {
  await requireRole(["BENDAHARA"])
  const id = z.string().min(1).parse(formData.get("id"))

  await withDbRetry((db) => {
    return db.delete(transactions).where(eq(transactions.id, id))
  })

  revalidatePath("/")
  revalidatePath("/admin")
  redirect("/admin?status=deleted")
}
