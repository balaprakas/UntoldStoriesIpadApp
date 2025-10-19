# Code Files for Implementation

Copy each file exactly as provided below.

---

## File 1: `src/lib/supabase.ts`

Create this new file:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## File 2: `src/lib/localDB.ts`

Create this new file:

```typescript
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
    }
  }
}

let db: IDBPDatabase<StoryDB> | null = null

async function getDB() {
  if (db) return db
  
  db = await openDB<StoryDB>('storybook-db', 1, {
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
  }) {
    const db = await getDB()
    await db.put('stories', {
      ...story,
      lastModifiedAt: story.lastModifiedAt || new Date().toISOString(),
      isDirty: story.isDirty !== undefined ? story.isDirty : true
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
```

---

## File 3: `src/contexts/AuthContext.tsx`

Create this new file:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## File 4: `src/pages/Login.tsx`

Create this new file:

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#dad7cd] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">📚 Storybook App</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
          <p className="font-semibold mb-2">Test Users:</p>
          <p>user1@test.com / password123</p>
          <p>user2@test.com / password123</p>
          <p>user3@test.com / password123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
```

---

## File 5: `src/pages/Dashboard.tsx`

Create this new file:

```typescript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { localDB } from '../lib/localDB'
import { supabase } from '../lib/supabase'
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react'

interface Story {
  id: string
  title: string
  lastModifiedAt: string
  isDirty: boolean
}

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStories()
  }, [user])

  const loadStories = async () => {
    if (!user) return

    // Load from IndexedDB first (fast!)
    const localStories = await localDB.getAllStories(user.id)
    setStories(localStories.map(s => ({
      id: s.id,
      title: s.title,
      lastModifiedAt: s.lastModifiedAt,
      isDirty: s.isDirty
    })))
    setLoading(false)

    // Then sync from Supabase in background
    const { data, error } = await supabase
      .from('stories')
      .select('id, title, last_modified_at')
      .order('created_at', { ascending: false })

    if (data && !error) {
      // Update local with cloud data if needed
      for (const cloudStory of data) {
        const localStory = await localDB.getStory(cloudStory.id)
        if (!localStory || new Date(cloudStory.last_modified_at) > new Date(localStory.lastModifiedAt)) {
          // Cloud version is newer, fetch full data
          const { data: fullStory } = await supabase
            .from('stories')
            .select('*')
            .eq('id', cloudStory.id)
            .single()

          if (fullStory) {
            await localDB.saveStory({
              id: fullStory.id,
              userId: fullStory.user_id,
              title: fullStory.title,
              bookData: fullStory.book_data,
              lastModifiedAt: fullStory.last_modified_at,
              isDirty: false
            })
          }
        }
      }
      
      // Reload from IndexedDB
      const updatedStories = await localDB.getAllStories(user.id)
      setStories(updatedStories.map(s => ({
        id: s.id,
        title: s.title,
        lastModifiedAt: s.lastModifiedAt,
        isDirty: s.isDirty
      })))
    }
  }

  const handleCreateNew = () => {
    navigate('/create-story')
  }

  const handleEdit = (storyId: string) => {
    navigate(`/create-story?id=${storyId}`)
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return

    // Delete from IndexedDB
    await localDB.deleteStory(storyId)

    // Delete from Supabase
    await supabase.from('stories').delete().eq('id', storyId)

    // Reload stories
    loadStories()
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dad7cd] flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#dad7cd] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.email?.split('@')[0]}!
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
        >
          <Plus size={20} />
          Create New Story
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No stories yet. Create your first story!</p>
            </div>
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Modified: {new Date(story.lastModifiedAt).toLocaleDateString()}
                </p>
                <div className="mb-4">
                  {story.isDirty ? (
                    <span className="text-orange-600 text-sm">⚠ Not saved to cloud</span>
                  ) : (
                    <span className="text-green-600 text-sm">✓ Saved</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

---

## File 6: `src/components/ProtectedRoute.tsx`

Create this new file:

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dad7cd] flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
```

---

Continue to next file for modifications to existing files...
