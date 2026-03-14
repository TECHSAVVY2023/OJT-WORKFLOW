import { readFile } from 'fs/promises'
import { join } from 'path'

const defaultAnnouncements = {
  title: 'Announcements',
  items: [] as Array<{ id: string; title?: string; description?: string; image?: string; images?: string[]; links?: Array<{ text: string; url: string }>; date?: string }>,
}

export default defineEventHandler(async () => {
  try {
    const path = join(process.cwd(), 'data', 'announcements.json')
    const raw = await readFile(path, 'utf-8')
    const data = JSON.parse(raw)
    return { title: data.title ?? defaultAnnouncements.title, items: data.items ?? defaultAnnouncements.items }
  } catch {
    return defaultAnnouncements
  }
})
