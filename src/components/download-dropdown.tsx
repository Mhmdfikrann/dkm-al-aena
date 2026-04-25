"use client"

import { useState, useRef, useEffect } from "react"
import { Download, FileSpreadsheet, ChevronDown } from "lucide-react"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export function DownloadDropdown({
  defaultMonth,
  defaultYear,
}: {
  defaultMonth: number
  defaultYear: number
}) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(defaultMonth)
  const [year, setYear] = useState(defaultYear)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function download(format: "pdf" | "csv") {
    window.location.href = `/api/reports/${format}?year=${year}&month=${month}`
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-2 rounded-xl bg-[#820000] px-4 text-xs font-semibold text-white shadow-lg shadow-[#820000]/20 transition-all hover:bg-[#6b0000] active:scale-[0.97]"
      >
        <Download className="size-3.5" />
        <span>Unduh Laporan</span>
        <ChevronDown className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 animate-fade-in-up rounded-2xl border border-[#e8e0e0] bg-white p-5 shadow-xl shadow-black/10">
          {/* Arrow indicator */}
          <div className="absolute -top-2 right-6 size-4 rotate-45 border-l border-t border-[#e8e0e0] bg-white" />

          <p className="mb-4 text-sm font-bold text-[#1a1a1a]">Unduh Laporan</p>

          {/* Month select */}
          <div className="mb-3 grid gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#999]">Bulan</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-[#e8e0e0] bg-[#fafafa] px-3 text-sm font-medium outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
            >
              {MONTHS.map((name, i) => (
                <option key={i} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>

          {/* Year input */}
          <div className="mb-4 grid gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#999]">Tahun</label>
            <input
              type="number"
              min={2020}
              max={2100}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-[#e8e0e0] bg-[#fafafa] px-3 text-sm font-medium outline-none transition-colors focus:border-[#820000] focus:bg-white focus:ring-2 focus:ring-[#820000]/10"
            />
          </div>

          {/* Download button */}
          <button
            onClick={() => download("csv")}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#820000] text-sm font-bold text-white shadow-lg shadow-[#820000]/20 transition-all hover:bg-[#6b0000] active:scale-[0.97]"
          >
            <FileSpreadsheet className="size-4" />
            Unduh CSV
          </button>

          <p className="mt-3 text-center text-[10px] text-[#bbb]">
            Pilih bulan & tahun, lalu klik unduh
          </p>
        </div>
      )}
    </div>
  )
}
