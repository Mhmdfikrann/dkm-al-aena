import { getTransactions } from "@/lib/data"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const transactions = await getTransactions()
  const createdAt = new Date().toISOString()

  return Response.json(
    {
      createdAt,
      source: "DKM Al-Aena",
      totalTransactions: transactions.length,
      transactions,
    },
    {
      headers: {
        "content-disposition": `attachment; filename="backup-dkm-al-aena-${createdAt.slice(0, 10)}.json"`,
      },
    },
  )
}
