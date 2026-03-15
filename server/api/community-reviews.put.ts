import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
  const payload = {
    title: body.title ?? 'What our community says',
    subtitle: body.subtitle ?? 'Real experiences from freelancers, students, and visitors',
    reviews: Array.isArray(body.reviews) ? body.reviews : [], // preserve each review's status and fields
  }
  try {
    const path = join(process.cwd(), 'data', 'community-reviews.json')
    await writeFile(path, JSON.stringify(payload, null, 2), 'utf-8')
    return payload
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save community reviews' })
  }
})
