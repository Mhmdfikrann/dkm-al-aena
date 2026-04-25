import Link from "next/link"
import { ArrowLeft, Landmark, LockKeyhole, Phone } from "lucide-react"

import { loginAction } from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const hasError = params.error === "invalid"

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fafafa] p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-[#820000]/[0.03]" />
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full bg-[#820000]/[0.03]" />
        <div className="absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-[#820000]/[0.02]" />
      </div>

      <main className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#820000] shadow-xl shadow-[#820000]/20">
            <Landmark className="size-6 text-white" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#1a1a1a]">DKM Al-Aena</h2>
          <p className="text-xs text-[#999]">Portal Transparansi Keuangan</p>
        </div>

        <Card className="overflow-hidden border-[#e8e0e0] shadow-xl shadow-black/5">
          <CardHeader className="border-b border-[#f5f0f0] bg-[#fdfafa] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#820000]/10">
                <LockKeyhole className="size-5 text-[#820000]" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Login Pengurus</CardTitle>
                <CardDescription className="text-xs">
                  Akses khusus Ketua dan Bendahara DKM.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form action={loginAction} className="grid gap-5">
              {hasError ? (
                <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-800">
                  <AlertTitle className="text-sm font-bold">Login gagal</AlertTitle>
                  <AlertDescription className="text-xs">No. telepon atau password tidak sesuai.</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-1.5">
                <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-[#999]">
                  No. Telepon
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#ccc]" />
                  <Input
                    id="username"
                    name="username"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    required
                    className="h-12 rounded-xl border-[#e8e0e0] bg-[#fafafa] pl-10 text-sm font-medium focus:border-[#820000] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#ccc]" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-12 rounded-xl border-[#e8e0e0] bg-[#fafafa] pl-10 text-sm font-medium focus:border-[#820000] focus:bg-white"
                  />
                </div>
              </div>

              <Button type="submit" className="h-12 rounded-xl bg-[#820000] text-sm font-bold shadow-lg shadow-[#820000]/20 hover:bg-[#6b0000] transition-all duration-200">
                Masuk
              </Button>

              <Button asChild variant="ghost" className="h-10 gap-2 rounded-xl text-sm font-medium text-[#999] hover:text-[#820000]">
                <Link href="/">
                  <ArrowLeft className="size-3.5" />
                  Kembali ke portal publik
                </Link>
              </Button>

              <div className="rounded-xl bg-[#fdfafa] border border-[#f5f0f0] p-3">
                <p className="text-center text-[11px] leading-relaxed text-[#999]">
                  Login memakai nomor telepon pengurus yang sudah didaftarkan oleh administrator.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
