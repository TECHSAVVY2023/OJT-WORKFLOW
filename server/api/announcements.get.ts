import { readFile } from 'fs/promises'
import { join } from 'path'

const defaultAnnouncements = {
  title: 'Announcements',
  items: [] as Array<{ id: string; title?: string; description?: string; image?: string; images?: string[]; links?: Array<{ text: string; url: string }>; date?: string }>,
}

export default defineEventHandler(async () => {
  try {
    // Resolve path from project root (works in dev and when cwd differs in production)
    const root = process.cwd()
    const path = join(root, 'data', 'announcements.json')
    const raw = await readFile(path, 'utf-8')
    const data = JSON.parse(raw)
    const items = Array.isArray(data.items) ? data.items : defaultAnnouncements.items
    return { title: data.title ?? defaultAnnouncements.title, items }
  } catch {
    return defaultAnnouncements
  }
})
