import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
  try {
    const path = join(process.cwd(), 'data', 'site-content.json')
    let current: Record<string, unknown> = {}
    try {
      const raw = await readFile(path, 'utf-8')
      current = JSON.parse(raw)
    } catch {
      // file missing, start fresh
    }
    const merged = { ...current, ...body }
    await writeFile(path, JSON.stringify(merged, null, 2), 'utf-8')
    return merged
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save site content' })
  }
})
