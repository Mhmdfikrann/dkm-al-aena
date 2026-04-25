import { getMonthlyReport } from "@/lib/data"
import { parseMonthParams } from "@/lib/format"
import { createReportPdf } from "@/lib/report-pdf"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = parseMonthParams({
    year: url.searchParams.get("year") ?? undefined,
    month: url.searchParams.get("month") ?? undefined,
  })
  const report = await getMonthlyReport(params.year, params.month)
  const pdf = await createReportPdf({
    year: params.year,
    month: params.month,
    ...report,
  })

  return new Response(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="laporan-dkm-al-aena-${params.year}-${String(params.month).padStart(2, "0")}.pdf"`,
    },
  })
}
