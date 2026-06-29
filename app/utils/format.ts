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
    return (value / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + 'M'
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + 'jt'
  }
  if (value >= 1_000) {
    return (value / 1_000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + 'rb'
  }
  return value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function formatCurrency(value: number, compact: boolean = true): string {
  if (compact) {
    return 'Rp ' + formatCompact(value)
  }
  return 'Rp ' + formatNumber(value)
}

// Alias for backward compatibility if needed, but it's better to update callers
export const formatRevenue = formatCompact

export function formatPercentage(value: number): string {
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(Math.abs(value))}%`
}

export const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) + ' - ' + d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }).replace('.', ':')
}

export const formatDateTimeShort = (dateString?: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatDate = (timestamp: string) => {
  if (!timestamp) return '-'

  const ts = Number(timestamp)
  const date = isNaN(ts) ? new Date(timestamp) : new Date(ts)

  if (isNaN(date.getTime())) return timestamp

  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}