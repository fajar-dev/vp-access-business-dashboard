/**
 * Computes the year-over-year (YoY) growth rate percentage between a current
 * value and a previous value.
 * 
 * Returns the growth rate formatted to one decimal place (e.g. "12.5" or "-3.2"),
 * or null if the previous value is null, undefined, or zero (to avoid division by zero).
 * 
 * Example: calculateGrowthRate(125, 75) -> "66.7"
 *          calculateGrowthRate(1.1, 0.65) -> "69.2"
 */
export const calculateGrowthRate = (
  current: number,
  previous: number | null | undefined
): string | null => {
  if (previous === null || previous === undefined || previous === 0) {
    return null
  }
  return (((current - previous) / previous) * 100).toFixed(1)
}
