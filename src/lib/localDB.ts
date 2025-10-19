import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface StoryDB extends DBSchema {
  stories: {
    key: string
    value: {
      id: string
      userId: string
      title: string
      bookData: any
      lastModifiedAt: string
      isDirty: boolean
      templateId?: string        // NEW
      templateData?: any          // NEW
    }
  }
}

let db: IDBPDatabase<StoryDB> | null = null

async function getDB() {
  if (db) return db

  db = await openDB<StoryDB>('storybook-db', 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: 'id' })
      }
    },
  })

  return db
}

export const localDB = {
  async saveStory(story: {
    id: string
    userId: string
    title: string
    bookData: any
    lastModifiedAt?: string
    isDirty?: boolean
    templateId?: string          // NEW
    templateData?: any           // NEW
  }) {
    const db = await getDB()
    await db.put('stories', {
      ...story,
      lastModifiedAt: story.lastModifiedAt || new Date().toISOString(),
      isDirty: story.isDirty !== undefined ? story.isDirty : true,
      templateId: story.templateId || undefined,      // NEW
      templateData: story.templateData || undefined   // NEW
    })
  },

  async getStory(id: string) {
    const db = await getDB()
    return await db.get('stories', id)
  },

  async getAllStories(userId: string) {
    const db = await getDB()
    const allStories = await db.getAll('stories')
    return allStories.filter(story => story.userId === userId)
  },

  async deleteStory(id: string) {
    const db = await getDB()
    await db.delete('stories', id)
  },

  async clearAllStories() {
    const db = await getDB()
    await db.clear('stories')
  },

  async markAsClean(id: string) {
    const db = await getDB()
    const story = await db.get('stories', id)
    if (story) {
      story.isDirty = false
      await db.put('stories', story)
    }
  }
}
