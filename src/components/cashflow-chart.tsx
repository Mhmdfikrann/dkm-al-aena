"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, ReferenceLine } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface CashflowItem {
  label: string
  debit: number
  credit: number
  net: number
}

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#820000",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#f87171",
  },
} satisfies ChartConfig

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatShortRupiah(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
  return String(value)
}

export function CashflowChart({ data }: { data: CashflowItem[] }) {
  const chartData = data.map((item) => ({
    day: `Tgl ${item.label}`,
    pemasukan: item.debit,
    pengeluaran: item.credit,
  }))

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart
        data={chartData}
        margin={{ top: 16, right: 16, left: 8, bottom: 0 }}
        barCategoryGap="20%"
        barGap={4}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0e8e8" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={11}
          stroke="#999"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          fontSize={11}
          stroke="#999"
          width={55}
          tickFormatter={formatShortRupiah}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(130, 0, 0, 0.04)" }}
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground capitalize">{String(name)}</span>
                  <span className="font-mono font-semibold tabular-nums">{formatRupiah(Number(value))}</span>
                </div>
              )}
            />
          }
        />
        <Bar
          dataKey="pemasukan"
          fill="var(--color-pemasukan)"
          radius={[6, 6, 2, 2]}
          minPointSize={4}
        />
        <Bar
          dataKey="pengeluaran"
          fill="var(--color-pengeluaran)"
          radius={[6, 6, 2, 2]}
          minPointSize={4}
        />
      </BarChart>
    </ChartContainer>
  )
}
