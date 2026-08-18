export const useDashboardFilters = () => {
  // Branch filter value is the DisplayBranchId selector sent to the API:
  //   'all'  -> BranchId '020', no DisplayBranchId filter (all branches)
  //   'null' -> BranchId '020', DisplayBranchId IS NULL (Medan / HO)
  //   '025' | '062' | '027' | '029' -> BranchId '020', DisplayBranchId = value
  const selectedBranch = useState<string>('selected-branch', () => 'all')
  const selectedTimeframe = useState<string>('selected-timeframe', () => 'month')
  
  const currentYear = new Date().getFullYear()
  const selectedYear = useState<string>('selected-year', () => currentYear.toString())

  const yearOptions = [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString()
  ]

  const branchOptions = [
    { label: 'All', value: 'all' },
    { label: 'Medan', value: 'null' },
    { label: 'Jakarta', value: '025' },
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
