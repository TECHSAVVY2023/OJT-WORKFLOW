/**
 * Manager community-says page: reuses the same editor state as admin.
 * Keeps script separation consistent with contact.vue (page calls one composable).
 */
export function useManagerCommunitySaysPage() {
  return useAdminCommunitySaysPage()
}
