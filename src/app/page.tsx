import type { ReactNode } from "react"
import Link from "next/link"
import { BarChart3, CalendarDays, FileText, Landmark, LockKeyhole, TrendingDown, TrendingUp, Wallet } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CashflowChart } from "@/components/cashflow-chart"
import { DownloadDropdown } from "@/components/download-dropdown"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getMonthlyReport } from "@/lib/data"
import { formatCurrency, formatDate, formatMonth, parseMonthParams } from "@/lib/format"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = parseMonthParams(await searchParams)
  const report = await getMonthlyReport(params.year, params.month)
  const query = `year=${params.year}&month=${params.month}`
  const maxBar = Math.max(...report.cashflow.map((item) => Math.abs(item.net)), 1)

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ]
  const monthName = MONTH_NAMES[params.month - 1]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ─── Top navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-[#f0e8e8] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#820000] shadow-lg shadow-[#820000]/20">
              <Landmark className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[#1a1a1a]">DKM Al-Aena</p>
              <p className="text-[11px] text-[#999]">Portal Transparansi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="h-9 gap-2 rounded-xl border-[#e8e0e0] text-xs font-medium text-[#555] hover:border-[#820000]/30 hover:text-[#820000]">
              <Link href="/login">
                <LockKeyhole className="size-3.5" />
                Login Pengurus
              </Link>
            </Button>
            <DownloadDropdown defaultMonth={params.month} defaultYear={params.year} />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Hero header ─── */}
        <header className="animate-fade-in-up mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#820000] via-[#6b0000] to-[#4a0000] p-8 md:p-10">
            {/* Decorative elements */}
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-white/5" />
            <div className="absolute right-20 top-12 size-20 rounded-full bg-white/5" />

            <div className="relative z-10">
              <Badge className="mb-4 bg-white/15 text-white/90 hover:bg-white/20 border-0 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full">
                ✦ Portal transparansi publik
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                Laporan Keuangan
              </h1>
              <p className="mt-1 text-lg font-semibold text-white/80 sm:text-xl">
                DKM Masjid Al-Aena
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                Ringkasan kas masjid, riwayat pemasukan, dan pengeluaran untuk{" "}
                <span className="font-semibold text-white/90">{formatMonth(params.year, params.month)}</span>.
              </p>
            </div>
          </div>
        </header>

        {/* ─── Inline filter bar ─── */}
        <section className="animate-fade-in-up stagger-1 mb-6">
          <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e8e0e0] bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#820000]">
              <CalendarDays className="size-4" />
              <span className="hidden sm:inline">Periode</span>
            </div>
            <select
              name="month"
              defaultValue={params.month}
              className="h-9 rounded-lg border border-[#e8e0e0] bg-[#fafafa] px-3 text-sm font-medium outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
            >
              <option value="1">Januari</option>
              <option value="2">Februari</option>
              <option value="3">Maret</option>
              <option value="4">April</option>
              <option value="5">Mei</option>
              <option value="6">Juni</option>
              <option value="7">Juli</option>
              <option value="8">Agustus</option>
              <option value="9">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            <Input name="year" type="number" min="2020" max="2100" defaultValue={params.year} className="h-9 w-24 rounded-lg border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white" />
            <Button type="submit" className="h-9 rounded-lg bg-[#820000] px-5 text-xs font-semibold shadow-md shadow-[#820000]/20 hover:bg-[#6b0000] transition-all duration-200">
              Tampilkan
            </Button>
          </form>
        </section>

        {/* ─── Summary cards ─── */}
        <section className="animate-fade-in-up stagger-2 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Saldo saat ini"
            value={formatCurrency(report.balance)}
            icon={<Wallet className="size-5" />}
            color="primary"
          />
          <SummaryCard
            title={`Pemasukan Bulan ${monthName}`}
            value={formatCurrency(report.monthDebit)}
            icon={<TrendingUp className="size-5" />}
            color="green"
          />
          <SummaryCard
            title={`Pengeluaran Bulan ${monthName}`}
            value={formatCurrency(report.monthCredit)}
            icon={<TrendingDown className="size-5" />}
            color="orange"
          />
          <SummaryCard
            title={`Perubahan Bersih ${monthName}`}
            value={formatCurrency(report.netChange)}
            icon={<BarChart3 className="size-5" />}
            color={report.netChange >= 0 ? "green" : "red"}
          />
        </section>

        {/* ─── Daily cashflow (full-width) ─── */}
        <section className="animate-fade-in-up stagger-3 mb-8">
          <Card className="overflow-hidden border-[#e8e0e0] shadow-sm">
            <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#820000]/10">
                  <BarChart3 className="size-4 text-[#820000]" />
                </div>
                <CardTitle className="text-base font-bold">Arus Kas Harian</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {report.cashflow.length ? (
                <CashflowChart data={report.cashflow} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f5f0f0]">
                    <BarChart3 className="size-5 text-[#ccc]" />
                  </div>
                  <p className="text-sm font-medium text-[#999]">Belum ada transaksi pada periode ini.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ─── Transaction table ─── */}
        <section className="animate-fade-in-up stagger-3">
          <Card className="overflow-hidden border-[#e8e0e0] shadow-sm">
            <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#820000]/10">
                  <FileText className="size-4 text-[#820000]" />
                </div>
                <CardTitle className="text-base font-bold">Riwayat Transaksi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TransactionTable rows={report.transactions} />
            </CardContent>
          </Card>
        </section>

        {/* ─── Footer ─── */}
        <footer className="mt-12 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#bbb]">
            <div className="flex size-5 items-center justify-center rounded-md bg-[#820000]/10">
              <Landmark className="size-3 text-[#820000]/60" />
            </div>
            <span>DKM Masjid Al-Aena — Portal Transparansi Keuangan</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  color = "primary",
}: {
  title: string
  value: string
  icon: ReactNode
  color?: "primary" | "green" | "orange" | "red"
}) {
  const colorMap = {
    primary: { bg: "bg-[#820000]/8", text: "text-[#820000]", border: "border-[#820000]/10" },
    green: { bg: "bg-emerald-500/8", text: "text-emerald-600", border: "border-emerald-500/10" },
    orange: { bg: "bg-amber-500/8", text: "text-amber-600", border: "border-amber-500/10" },
    red: { bg: "bg-red-500/8", text: "text-red-600", border: "border-red-500/10" },
  }
  const c = colorMap[color]

  return (
    <Card className={`group relative overflow-hidden border-[#e8e0e0] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">{title}</p>
          <p className="text-xl font-extrabold tracking-tight text-[#1a1a1a] sm:text-2xl">{value}</p>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${c.bg} ${c.text} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </CardContent>
      {/* Bottom accent bar */}
      <div className={`h-0.5 w-full ${c.bg.replace('/8', '/30')}`} />
    </Card>
  )
}

function TransactionTable({
  rows,
}: {
  rows: Awaited<ReturnType<typeof getMonthlyReport>>["transactions"]
}) {
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f5f0f0]">
          <FileText className="size-5 text-[#ccc]" />
        </div>
        <p className="text-sm font-medium text-[#999]">Tidak ada transaksi untuk ditampilkan.</p>
        <p className="mt-1 text-xs text-[#ccc]">Pilih bulan dan tahun lain untuk melihat data.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#f0e8e8] bg-[#fdfafa] hover:bg-[#fdfafa]">
            <TableHead className="text-xs font-bold uppercase tracking-wider text-[#999]">Tanggal</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-[#999]">Deskripsi</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-[#999]">Jenis</TableHead>
            <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-[#999]">Nominal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((transaction, i) => (
            <TableRow
              key={transaction.id}
              className="border-b border-[#f5f0f0] transition-colors hover:bg-[#fdf9f9]"
            >
              <TableCell className="py-3.5 text-sm text-[#666]">{formatDate(transaction.transactionDate)}</TableCell>
              <TableCell className="py-3.5 text-sm font-medium text-[#333]">{transaction.description}</TableCell>
              <TableCell className="py-3.5">
                <Badge
                  variant={transaction.type === "DEBIT" ? "default" : "secondary"}
                  className={
                    transaction.type === "DEBIT"
                      ? "rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-none font-semibold text-xs"
                      : "rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-none font-semibold text-xs"
                  }
                >
                  {transaction.type === "DEBIT" ? "↑ Pemasukan" : "↓ Pengeluaran"}
                </Badge>
              </TableCell>
              <TableCell className="py-3.5 text-right font-mono text-sm font-semibold text-[#333]">
                {formatCurrency(transaction.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
