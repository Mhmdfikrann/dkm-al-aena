import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Landmark, Pencil } from "lucide-react"

import { updateTransactionAction } from "@/app/actions"
import { CurrencyInput } from "@/components/currency-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { requireRole } from "@/lib/auth"
import { getTransactionById } from "@/lib/data"
import { toDateInputValue } from "@/lib/format"

export default async function EditTransactionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await requireRole(["BENDAHARA"])
  const { id } = await params
  const query = await searchParams
  const transaction = await getTransactionById(id)

  if (!transaction) {
    notFound()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fafafa] p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-[#820000]/[0.03]" />
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-[#820000]/[0.03]" />
      </div>

      <main className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        {/* Logo header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#820000] shadow-xl shadow-[#820000]/20">
            <Landmark className="size-5 text-white" />
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-[#1a1a1a]">DKM Al-Aena</h2>
        </div>

        <Card className="overflow-hidden border-[#e8e0e0] shadow-xl shadow-black/5">
          <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#820000]/10">
                <Pencil className="size-5 text-[#820000]" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Edit Transaksi</CardTitle>
                <CardDescription className="text-xs">Perubahan akan langsung muncul di portal publik.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form action={updateTransactionAction} className="grid gap-5">
              {query.error ? (
                <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800">
                  <AlertTitle className="text-sm font-bold">Data tidak valid</AlertTitle>
                  <AlertDescription className="text-xs">Periksa nominal, tanggal, jenis, dan deskripsi transaksi.</AlertDescription>
                </Alert>
              ) : null}
              <input type="hidden" name="id" value={transaction.id} />

              <div className="grid gap-1.5">
                <Label htmlFor="type" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Jenis</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={transaction.type}
                  className="h-11 rounded-xl border border-[#e8e0e0] bg-[#fafafa] px-3.5 text-sm font-medium shadow-xs outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
                  required
                >
                  <option value="DEBIT">↑ Pemasukan</option>
                  <option value="KREDIT">↓ Pengeluaran</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Nominal</Label>
                <CurrencyInput name="amount" defaultValue={transaction.amount} required className="h-11 w-full rounded-xl border border-[#e8e0e0] bg-[#fafafa] text-sm font-medium outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="transactionDate" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Tanggal</Label>
                <Input
                  id="transactionDate"
                  name="transactionDate"
                  type="date"
                  defaultValue={toDateInputValue(transaction.transactionDate)}
                  required
                  className="h-11 rounded-xl border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-[#999]">Deskripsi</Label>
                <Textarea id="description" name="description" defaultValue={transaction.description} required className="min-h-[80px] rounded-xl border-[#e8e0e0] bg-[#fafafa] text-sm font-medium focus:border-[#820000] focus:bg-white resize-none" />
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button type="submit" className="h-11 flex-1 rounded-xl bg-[#820000] font-bold shadow-lg shadow-[#820000]/20 hover:bg-[#6b0000] transition-all duration-200">
                  Simpan Perubahan
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl border-[#e8e0e0] font-semibold hover:border-[#820000]/30 hover:text-[#820000]">
                  <Link href="/admin">
                    <ArrowLeft className="size-3.5 mr-1" />
                    Batal
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
