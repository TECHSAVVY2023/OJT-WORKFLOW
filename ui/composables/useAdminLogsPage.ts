export function useAdminLogsPage() {
  return {
    subtitle:
      'Recent actions by admin, staff, and manager. Logs are stored in this browser and shared across user types.',
    headerSize: 'large' as const,
    emptyMessage: 'No activity logged yet. Log in, perform actions, and they will appear here.',
  }
}
