export const useDashboardFilters = () => {
  const selectedBranch = useState<string>('selected-branch', () => '020')
  const selectedTimeframe = useState<string>('selected-timeframe', () => 'month')
  
  const currentYear = new Date().getFullYear()
  const selectedYear = useState<string>('selected-year', () => currentYear.toString())

  const yearOptions = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString()
  ]

  const branchOptions = [
    { label: 'Medan (HO)', value: '020' },
    { label: 'Jakarta', value: '003' },
    { label: 'Bali', value: '062' },
    { label: 'Binjai', value: '027' },
    { label: 'Tanjung Morawa', value: '029' }
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
    selectedYear,
    yearOptions,
    branchOptions,
    timeframeOptions
  }
}
