import Link from "next/link"
import { BarChart3, CalendarDays, FileText, Globe, Landmark, LogOut, Pencil, PlusCircle, Trash2 } from "lucide-react"

import { createTransactionAction, deleteTransactionAction, logoutAction } from "@/app/actions"
import { CurrencyInput } from "@/components/currency-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { requireUser } from "@/lib/auth"
import { getMonthlyReport } from "@/lib/data"
import { currentMonthParams, formatCurrency, formatDate, parseMonthParams } from "@/lib/format"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireUser()
  const params = await searchParams
  const monthParams = parseMonthParams(params)
  const report = await getMonthlyReport(monthParams.year, monthParams.month)
  const current = currentMonthParams()
  const canManage = user.role === "BENDAHARA"

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
              <p className="text-[11px] text-[#999]">Ruang Pengurus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#fdfafa] border border-[#f0e8e8] px-3 py-1.5">
              <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-[#666]">{user.username}</span>
              <Badge className="rounded-full bg-[#820000]/10 text-[#820000] border-0 text-[10px] font-bold hover:bg-[#820000]/10">
                {user.role === "BENDAHARA" ? "Bendahara" : "Ketua"}
              </Badge>
            </div>
            <Button asChild variant="outline" className="h-9 gap-2 rounded-xl border-[#e8e0e0] text-xs font-medium text-[#555] hover:border-[#820000]/30 hover:text-[#820000]">
              <Link href="/">
                <Globe className="size-3.5" />
                Portal Publik
              </Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" className="h-9 gap-2 rounded-xl border-[#e8e0e0] text-xs font-medium text-[#555] hover:border-red-300 hover:text-red-600">
                <LogOut className="size-3.5" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <header className="animate-fade-in-up mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#820000] via-[#6b0000] to-[#4a0000] p-8 md:p-10">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-white/5" />
            <div className="relative z-10">
              <Badge className="mb-4 bg-white/15 text-white/90 hover:bg-white/20 border-0 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full">
                {user.role === "BENDAHARA" ? "◆ Bendahara" : "◆ Ketua"}
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ruang Pengurus
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Masuk sebagai <span className="font-semibold text-white/90">{user.username}</span> — Data bendahara tampil langsung ke portal publik.
              </p>
            </div>

            {/* Quick stats in header */}
            <div className="relative z-10 mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Saldo</p>
                <p className="mt-1 text-lg font-extrabold text-white">{formatCurrency(report.balance)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Pemasukan</p>
                <p className="mt-1 text-lg font-extrabold text-white">{formatCurrency(report.monthDebit)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/50">Pengeluaran</p>
                <p className="mt-1 text-lg font-extrabold text-white">{formatCurrency(report.monthCredit)}</p>
              </div>
            </div>
          </div>
        </header>

        {params.error ? (
          <Alert variant="destructive" className="mb-6 rounded-xl border-red-200 bg-red-50 text-red-800 animate-fade-in">
            <AlertTitle className="text-sm font-bold">Aksi tidak dapat diproses</AlertTitle>
            <AlertDescription className="text-xs">Periksa peran akun, isian form, atau konfigurasi database.</AlertDescription>
          </Alert>
        ) : null}

        {/* ─── Main content ─── */}
        <section className="animate-fade-in-up stagger-1 grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Add transaction form */}
          <Card className="overflow-hidden border-[#e8e0e0] shadow-sm">
            <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#820000]/10">
                  <PlusCircle className="size-4 text-[#820000]" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Tambah Transaksi</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {canManage ? "Input pemasukan atau pengeluaran baru." : "Hanya Bendahara yang dapat menambah data."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {canManage ? (
                <form action={createTransactionAction} className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="type" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Jenis</Label>
                    <select
                      id="type"
                      name="type"
                      className="h-11 rounded-xl border border-[#e8e0e0] bg-[#fafafa] px-3.5 text-sm font-medium shadow-xs outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
                      required
                    >
                      <option value="DEBIT">↑ Pemasukan</option>
                      <option value="KREDIT">↓ Pengeluaran</option>
                    </select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Nominal</Label>
                    <CurrencyInput name="amount" required className="h-11 w-full rounded-xl border border-[#e8e0e0] bg-[#fafafa] text-sm font-medium outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="transactionDate" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Tanggal</Label>
                    <Input
                      id="transactionDate"
                      name="transactionDate"
                      type="date"
                      defaultValue={`${current.year}-${String(current.month).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`}
                      required
                      className="h-11 rounded-xl border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Deskripsi</Label>
                    <Textarea id="description" name="description" placeholder="Kotak Amal Jumat" required className="min-h-[80px] rounded-xl border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white resize-none" />
                  </div>
                  <Button type="submit" className="h-11 rounded-xl bg-[#820000] font-bold shadow-lg shadow-[#820000]/20 hover:bg-[#6b0000] transition-all duration-200">
                    Simpan Transaksi
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f5f0f0]">
                    <PlusCircle className="size-5 text-[#ccc]" />
                  </div>
                  <p className="text-sm font-medium text-[#999]">
                    Akun Ketua memiliki akses pemantauan saja.
                  </p>
                  <p className="mt-1 text-xs text-[#ccc]">Gunakan akun Bendahara untuk input data.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction list */}
          <Card className="overflow-hidden border-[#e8e0e0] shadow-sm">
            <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#820000]/10">
                    <BarChart3 className="size-4 text-[#820000]" />
                  </div>
                  <CardTitle className="text-base font-bold">Ringkasan Bulan Berjalan</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {/* Filter bar */}
              <form className="mb-5 flex flex-wrap items-end gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-[#bbb]">Bulan</Label>
                  <select
                    name="month"
                    defaultValue={monthParams.month}
                    className="h-10 rounded-xl border border-[#e8e0e0] bg-[#fafafa] px-3 text-sm font-medium shadow-xs outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
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
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-[#bbb]">Tahun</Label>
                  <Input name="year" type="number" min="2020" max="2100" defaultValue={monthParams.year} className="h-10 w-24 rounded-xl border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white" />
                </div>
                <Button type="submit" variant="outline" className="h-10 gap-2 rounded-xl border-[#e8e0e0] text-xs font-semibold hover:border-[#820000]/30 hover:text-[#820000]">
                  <CalendarDays className="size-3.5" />
                  Filter
                </Button>
              </form>

              {/* Transaction table */}
              {report.transactions.length ? (
                <div className="overflow-x-auto rounded-xl border border-[#f0e8e8]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#f0e8e8] bg-[#fdfafa] hover:bg-[#fdfafa]">
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-[#999]">Tanggal</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-[#999]">Deskripsi</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-wider text-[#999]">Jenis</TableHead>
                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-[#999]">Nominal</TableHead>
                        {canManage ? <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-[#999]">Aksi</TableHead> : null}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-b border-[#f5f0f0] transition-colors hover:bg-[#fdf9f9]">
                          <TableCell className="py-3 text-sm text-[#666]">{formatDate(transaction.transactionDate)}</TableCell>
                          <TableCell className="py-3 text-sm font-medium text-[#333]">{transaction.description}</TableCell>
                          <TableCell className="py-3">
                            <Badge
                              variant={transaction.type === "DEBIT" ? "default" : "secondary"}
                              className={
                                transaction.type === "DEBIT"
                                  ? "rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-none font-semibold text-[10px]"
                                  : "rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 shadow-none font-semibold text-[10px]"
                              }
                            >
                              {transaction.type === "DEBIT" ? "↑ Pemasukan" : "↓ Pengeluaran"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 text-right font-mono text-sm font-semibold text-[#333]">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          {canManage ? (
                            <TableCell className="py-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <Button asChild size="icon-sm" variant="outline" className="size-8 rounded-lg border-[#e8e0e0] hover:border-[#820000]/30 hover:text-[#820000]">
                                  <Link href={`/admin/transactions/${transaction.id}/edit`}>
                                    <Pencil className="size-3.5" />
                                    <span className="sr-only">Edit</span>
                                  </Link>
                                </Button>
                                <form action={deleteTransactionAction}>
                                  <input type="hidden" name="id" value={transaction.id} />
                                  <Button type="submit" size="icon-sm" variant="outline" className="size-8 rounded-lg border-[#e8e0e0] text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600">
                                    <Trash2 className="size-3.5" />
                                    <span className="sr-only">Hapus</span>
                                  </Button>
                                </form>
                              </div>
                            </TableCell>
                          ) : null}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#f5f0f0]">
                    <FileText className="size-5 text-[#ccc]" />
                  </div>
                  <p className="text-sm font-medium text-[#999]">Belum ada transaksi pada periode ini.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
