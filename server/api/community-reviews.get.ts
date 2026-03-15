import { readFile } from 'fs/promises'
import { join } from 'path'

const defaultData = {
  title: 'What our community says',
  subtitle: 'Real experiences from freelancers, students, and visitors',
  reviews: [] as Array<Record<string, unknown>>,
}

type ReviewWithStatus = Record<string, unknown> & { status?: string }

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const scopeAll = query.scope === 'all'

  try {
    const path = join(process.cwd(), 'data', 'community-reviews.json')
    const raw = await readFile(path, 'utf-8')
    const data = JSON.parse(raw)
    let reviews = Array.isArray(data.reviews) ? data.reviews : defaultData.reviews
    reviews = reviews.filter((r: unknown) => r != null && typeof r === 'object')

    if (!scopeAll) {
      reviews = reviews.filter((r: ReviewWithStatus) => {
        const s = r.status as string | undefined
        return s === 'approved' || s === undefined || s === ''
      })
    }

    return {
      title: data.title ?? defaultData.title,
      subtitle: data.subtitle ?? defaultData.subtitle,
      reviews,
    }
  } catch {
    return {
      ...defaultData,
      reviews: scopeAll ? defaultData.reviews : [],
    }
  }
})
