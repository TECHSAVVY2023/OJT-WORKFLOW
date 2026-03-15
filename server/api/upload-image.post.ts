import { readMultipartFormData } from 'h3'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const EXT_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }
  const parts = await readMultipartFormData(event)
  if (!parts?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }
  const file = parts.find(p => p.name === 'file' && p.data && p.filename)
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file in field "file"' })
  }
  const mime = file.type || 'application/octet-stream'
  if (!ALLOWED_TYPES.includes(mime)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' })
  }
  const ext = EXT_MAP[mime] || (file.filename?.match(/\.[a-z]+$/i)?.[0]) || '.jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
  const dir = join(process.cwd(), 'public', 'images')
  await mkdir(dir, { recursive: true })
  const filePath = join(dir, safeName)
  await writeFile(filePath, file.data)
  const path = `/images/${safeName}`
  return { path }
})
