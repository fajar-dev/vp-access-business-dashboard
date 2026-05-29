export const useDashboardFilters = () => {
  const selectedBranch = useState<string>('selected-branch', () => '020')
  const selectedTimeframe = useState<string>('selected-timeframe', () => 'month')

  const branchOptions = [
    { label: 'Medan', value: '020' },
    { label: 'Surabaya', value: '021' },
    { label: 'Jakarta', value: '022' },
    { label: 'Bali', value: '023' }
  ]

  const timeframeOptions = [
    { label: 'This Month', value: 'month' },
    { label: 'Last Month', value: 'last' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' }
  ]

  return {
    selectedBranch,
    selectedTimeframe,
    branchOptions,
    timeframeOptions
  }
}
