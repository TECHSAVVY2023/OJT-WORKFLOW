export function useManagerLogsPage() {
  const subtitle = 'Recent actions by admin, staff, and manager.'
  const headerSize = 'default' as const
  const emptyMessage = 'No activity logged yet.'
  return { subtitle, headerSize, emptyMessage }
}
