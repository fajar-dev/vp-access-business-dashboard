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
