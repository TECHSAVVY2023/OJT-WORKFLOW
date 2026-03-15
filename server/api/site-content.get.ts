import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  try {
    const path = join(process.cwd(), 'data', 'site-content.json')
    const raw = await readFile(path, 'utf-8')
    const data = JSON.parse(raw)
    return data
  } catch (e) {
    throw createError({ statusCode: 404, statusMessage: 'Site content not found' })
  }
})
