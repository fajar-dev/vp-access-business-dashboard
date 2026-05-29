/**
 * Helper to format a number as Indonesian Rupiah (IDR) currency format.
 * Example: 1000000000 -> "1.000.000.000"
 */
export const formatIDR = (val: number): string => {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val)
}

/**
 * Helper to parse a formatted currency string back to a numeric integer.
 * Example: "Rp. 1.000.000.000" -> 1000000000
 */
export const parseIDR = (val: string): number => {
  return parseInt(val.replace(/\D/g, '')) || 0
}

/**
 * Helper to extract floating point numbers from a formatted string.
 * Example: "Rp 500M" -> 500, "90.3%" -> 90.3, "Rp 50M" -> 50
 */
export const parseNumericValue = (val: string): number => {
  return parseFloat(val.replace(/[^0-9.]/g, '')) || 0
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return value.toLocaleString('id-ID', options)
}


export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'M'
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'jt'
  }
  if (value >= 1_000) {
    return (value / 1_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'rb'
  }
  return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatCurrency(value: number, compact: boolean = true): string {
  if (compact) {
    return 'Rp ' + formatCompact(value)
  }
  return 'Rp ' + formatNumber(value)
}

// Alias for backward compatibility if needed, but it's better to update callers
export const formatRevenue = formatCompact