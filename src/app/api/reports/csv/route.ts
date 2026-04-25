import Papa from "papaparse"

import { getMonthlyReport } from "@/lib/data"
import { formatDate, parseMonthParams } from "@/lib/format"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = parseMonthParams({
    year: url.searchParams.get("year") ?? undefined,
    month: url.searchParams.get("month") ?? undefined,
  })
  const report = await getMonthlyReport(params.year, params.month)

  const csv = Papa.unparse(
    report.transactions.map((transaction) => ({
      tanggal: formatDate(transaction.transactionDate),
      jenis: transaction.type === "DEBIT" ? "Pemasukan" : "Pengeluaran",
      nominal: transaction.amount,
      deskripsi: transaction.description,
    })),
  )

  const bom = "\uFEFF"
  const filename = `laporan-dkm-al-aena-${params.year}-${String(params.month).padStart(2, "0")}.csv`

  return new Response(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
