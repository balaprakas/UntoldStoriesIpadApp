# Modifications to Existing Files

---

## Modification 1: `src/main.tsx`

**Find this code:**
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Replace with:**
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```

---

## Modification 2: `src/App.tsx`

**Find the Routes section** (around line 10-15):
```typescript
<Routes>
  <Route path="/" element={<CreateStory />} />
  <Route path="/create-story" element={<CreateStory />} />
</Routes>
```

**Replace with:**
```typescript
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// ... in the Routes section:

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Navigate to="/dashboard" replace />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/create-story"
    element={
      <ProtectedRoute>
        <CreateStory />
      </ProtectedRoute>
    }
  />
</Routes>
```

**Add these imports at the top:**
```typescript
import { Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
```

---

## Modification 3: `src/CreateStory.tsx`

This is a bigger modification. I'll show you what to add.

**Add these imports at the top:**
```typescript
import { useAuth } from './contexts/AuthContext'
import { localDB } from './lib/localDB'
import { supabase } from './lib/supabase'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
```

**Inside the CreateStory component, add these state variables after existing useState declarations:**
```typescript
const { user } = useAuth()
const [searchParams] = useSearchParams()
const navigate = useNavigate()
const [storyId] = useState(() => searchParams.get('id') || `story_${Date.now()}`)
const [storyTitle, setStoryTitle] = useState('My Story')
const [isSaving, setIsSaving] = useState(false)
const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('unsaved')
```

**Add this useEffect to load story (add after other useEffects):**
```typescript
useEffect(() => {
  const loadStory = async () => {
    if (!user) return

    const story = await localDB.getStory(storyId)
    if (story) {
      setBookData(story.bookData)
      setStoryTitle(story.title)
      setSaveStatus(story.isDirty ? 'unsaved' : 'saved')
    }
  }

  loadStory()
}, [storyId, user])
```

**Add this function to save to local IndexedDB (add after other functions):**
```typescript
const saveToLocal = async (newBookData: typeof bookData) => {
  if (!user) return

  await localDB.saveStory({
    id: storyId,
    userId: user.id,
    title: storyTitle,
    bookData: newBookData,
    isDirty: true
  })

  setSaveStatus('unsaved')
}
```

**Modify the useEffect where bookData changes to call saveToLocal:**
```typescript
// Add this useEffect
useEffect(() => {
  if (user) {
    saveToLocal(bookData)
  }
}, [bookData, user])
```

**Add function to save to cloud:**
```typescript
const saveToCloud = async () => {
  if (!user) return
  
  setIsSaving(true)
  setSaveStatus('saving')

  try {
    const { error } = await supabase
      .from('stories')
      .upsert({
        id: storyId,
        user_id: user.id,
        title: storyTitle,
        book_data: bookData,
        last_modified_at: new Date().toISOString()
      })

    if (error) throw error

    await localDB.markAsClean(storyId)
    setSaveStatus('saved')
    alert('Story saved to cloud successfully!')
  } catch (error) {
    console.error('Error saving to cloud:', error)
    alert('Failed to save to cloud. Check console for details.')
    setSaveStatus('unsaved')
  } finally {
    setIsSaving(false)
  }
}
```

**Add "Back to Dashboard" button and save button in the render section.**

**Find the existing "Back to Dashboard" button (around line 436):**
```typescript
<button
  onClick={() => navigate('/dashboard')}
  className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
>
  <ArrowLeft size={20} />
  Back to Dashboard
</button>
```

**Add a "Save to Cloud" button next to it:**
```typescript
<button
  onClick={saveToCloud}
  disabled={isSaving}
  className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:bg-gray-400"
>
  <Save size={20} />
  {isSaving ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : '💾 Save to Cloud'}
</button>
```

**Add Save import:**
Make sure you have this import at the top:
```typescript
import { ArrowLeft, Save } from 'lucide-react'
```

---

## Summary of Changes

**New Files Created:**
1. `src/lib/supabase.ts` - Supabase client
2. `src/lib/localDB.ts` - IndexedDB wrapper
3. `src/contexts/AuthContext.tsx` - Auth context
4. `src/pages/Login.tsx` - Login page
5. `src/pages/Dashboard.tsx` - Story dashboard
6. `src/components/ProtectedRoute.tsx` - Route guard

**Modified Files:**
1. `src/main.tsx` - Wrap with AuthProvider
2. `src/App.tsx` - Add new routes
3. `src/CreateStory.tsx` - Add save functionality

**New .env.local file:**
- Add Supabase credentials

---

## Testing Checklist

1. ✅ Can login with test user
2. ✅ Dashboard shows empty state for new user
3. ✅ Can create new story
4. ✅ Can edit story (changes save locally)
5. ✅ Can save to cloud
6. ✅ Can logout and login again
7. ✅ Stories persist after logout/login
8. ✅ Different users see different stories
9. ✅ Delete story works
10. ✅ All existing editor features work

---

That's it! Follow these steps and you'll have a working multi-user storybook app with local-first storage and cloud sync.
