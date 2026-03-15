import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || !body.name || !body.quote) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body: name and quote required' })
  }
  const path = join(process.cwd(), 'data', 'community-reviews.json')
  let current: { title?: string; subtitle?: string; reviews?: unknown[] } = {}
  try {
    const raw = await readFile(path, 'utf-8')
    current = JSON.parse(raw)
  } catch {
    current = { title: 'What our community says', subtitle: 'Real experiences from freelancers, students, and visitors', reviews: [] }
  }
  const reviews = Array.isArray(current.reviews) ? current.reviews : []
  const now = new Date()
  const newReview = {
    id: `user-${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
    name: String(body.name).trim(),
    quote: String(body.quote).trim(),
    rating: typeof body.rating === 'number' ? body.rating : 5,
    avatar: body.avatar && typeof body.avatar === 'string' ? body.avatar : undefined,
    images: Array.isArray(body.images) ? body.images.slice(0, 5) : undefined,
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    createdAt: now.toISOString(),
    status: 'pending',
  }
  reviews.unshift(newReview)
  const payload = {
    title: current.title ?? 'What our community says',
    subtitle: current.subtitle ?? 'Real experiences from freelancers, students, and visitors',
    reviews,
  }
  await writeFile(path, JSON.stringify(payload, null, 2), 'utf-8')
  return newReview
})
