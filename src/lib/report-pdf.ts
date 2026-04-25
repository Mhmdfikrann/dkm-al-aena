import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"

import type { FinanceTransaction } from "@/lib/data"
import { formatCurrency, formatDate, formatMonth } from "@/lib/format"

const virtualFileSystem = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfFonts

if (pdfMake.addVirtualFileSystem) {
  pdfMake.addVirtualFileSystem(virtualFileSystem)
} else {
  pdfMake.vfs = virtualFileSystem
}

export async function createReportPdf(input: {
  year: number
  month: number
  balance: number
  monthDebit: number
  monthCredit: number
  netChange: number
  transactions: FinanceTransaction[]
}) {
  const body = [
    ["Tanggal", "Deskripsi", "Jenis", "Nominal"],
    ...input.transactions.map((transaction) => [
      formatDate(transaction.transactionDate),
      transaction.description,
      transaction.type === "DEBIT" ? "Pemasukan" : "Pengeluaran",
      formatCurrency(transaction.amount),
    ]),
  ]

  const definition = {
    pageSize: "A4",
    pageMargins: [40, 48, 40, 48],
    content: [
      { text: "Laporan Keuangan DKM Al-Aena", style: "title" },
      { text: formatMonth(input.year, input.month), style: "subtitle" },
      {
        margin: [0, 18, 0, 18],
        columns: [
          summaryBox("Saldo", formatCurrency(input.balance)),
          summaryBox("Pemasukan", formatCurrency(input.monthDebit)),
          summaryBox("Pengeluaran", formatCurrency(input.monthCredit)),
          summaryBox("Bersih", formatCurrency(input.netChange)),
        ],
      },
      {
        table: {
          headerRows: 1,
          widths: [80, "*", 80, 100],
          body,
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
      subtitle: { fontSize: 11, color: "#52635a" },
      metricLabel: { fontSize: 8, color: "#52635a" },
      metricValue: { fontSize: 10, bold: true },
    },
    defaultStyle: {
      fontSize: 9,
    },
  }

  return new Promise<Buffer>((resolve) => {
    pdfMake.createPdf(definition).getBuffer((buffer) => {
      resolve(Buffer.from(buffer))
    })
  })
}

function summaryBox(label: string, value: string) {
  return {
    width: "*",
    stack: [
      { text: label, style: "metricLabel" },
      { text: value, style: "metricValue" },
    ],
    margin: [0, 0, 8, 0],
  }
}
