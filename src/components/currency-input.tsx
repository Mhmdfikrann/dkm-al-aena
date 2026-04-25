"use client"

import { useState } from "react"

function formatWithDots(value: string): string {
  const num = value.replace(/\D/g, "")
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function CurrencyInput({
  name,
  defaultValue,
  placeholder = "500.000",
  required = false,
  className = "",
}: {
  name: string
  defaultValue?: number | string
  placeholder?: string
  required?: boolean
  className?: string
}) {
  const initial = defaultValue ? String(defaultValue) : ""
  const [display, setDisplay] = useState(initial ? formatWithDots(initial) : "")
  const [rawValue, setRawValue] = useState(initial.replace(/\D/g, ""))

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value.replace(/\D/g, "")
    setRawValue(input)
    setDisplay(formatWithDots(input))
  }

  return (
    <>
      <input type="hidden" name={name} value={rawValue} />
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#999]">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`pl-10 ${className}`}
        />
      </div>
    </>
  )
}
