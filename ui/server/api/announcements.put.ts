import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || !('title' in body) || !('items' in body)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body: expected { title, items }' })
  }
  try {
    const path = join(process.cwd(), 'data', 'announcements.json')
    await writeFile(path, JSON.stringify({ title: body.title, items: body.items }, null, 2), 'utf-8')
    return body
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to save announcements' })
  }
})
