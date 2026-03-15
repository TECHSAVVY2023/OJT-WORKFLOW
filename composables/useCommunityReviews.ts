const STORAGE_KEY = 'workflow_community_reviews'

export interface CommunityReview {
  id: string
  name: string
  quote: string
  rating?: number
  date?: string
  avatar?: string
  images?: string[]
  /** User-submitted reviews have createdAt for sorting */
  createdAt?: string
}

function getStoredReviews(): CommunityReview[] {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as CommunityReview[]
        if (Array.isArray(data)) return data
      }
    } catch (_) {}
  }
  return []
}

function setStoredReviews(reviews: CommunityReview[]) {
  if (import.meta.client && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  }
}

export function useCommunityReviews() {
  const userReviews = useState<CommunityReview[]>('workflow_user_reviews', () => [])

  if (import.meta.client) {
    onMounted(() => {
      userReviews.value = getStoredReviews()
    })
  }

  function addReview(review: Omit<CommunityReview, 'id' | 'createdAt'>) {
    const id = `user-${Date.now()}`
    const date = new Date()
    const fullDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const newReview: CommunityReview = {
      ...review,
      id,
      date: fullDate,
      rating: review.rating ?? 5,
      createdAt: date.toISOString(),
    }
    userReviews.value = [newReview, ...userReviews.value]
    setStoredReviews(userReviews.value)
    return id
  }

  return {
    userReviews,
    addReview,
  }
}
