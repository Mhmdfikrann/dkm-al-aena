export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function formatMonth(year: number, month: number) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1))
}

export function getMonthRange(year: number, month: number) {
  const start = toDateInputValue(new Date(year, month - 1, 1))
  const end = toDateInputValue(new Date(year, month, 0))

  return { start, end }
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function currentMonthParams() {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

export function parseMonthParams(input: {
  year?: string | string[]
  month?: string | string[]
}) {
  const current = currentMonthParams()
  const rawYear = Array.isArray(input.year) ? input.year[0] : input.year
  const rawMonth = Array.isArray(input.month) ? input.month[0] : input.month
  const year = Number(rawYear ?? current.year)
  const month = Number(rawMonth ?? current.month)

  return {
    year: Number.isInteger(year) && year >= 2020 && year <= 2100 ? year : current.year,
    month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : current.month,
  }
}
