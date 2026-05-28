export const useDashboardFilters = () => {
  const selectedBranch = useState<string>('selected-branch', () => 'All Branch')
  const selectedTimeframe = useState<string>('selected-timeframe', () => 'This Month')

  const branchOptions = ['All Branch', 'Medan', 'Surabaya', 'Jakarta', 'Bali']
  const timeframeOptions = ['This Month', 'Last Month', 'This Quarter', 'This Year']

  return {
    selectedBranch,
    selectedTimeframe,
    branchOptions,
    timeframeOptions
  }
}
