import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Profile } from './lib/supabase'
import { Auth } from './components/Auth'
import { TweetCompose } from './components/TweetCompose'
import { TweetFeed } from './components/TweetFeed'

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data as Profile)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (!profile) return <Auth />

  return (
    <>
      <header className="header">
        <h1>𝕏</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#71767b', fontSize: 14 }}>@{profile.username}</span>
          <button className="btn btn-outline" onClick={handleSignOut} style={{ padding: '6px 14px', fontSize: 13 }}>
            ログアウト
          </button>
        </div>
      </header>

      <TweetCompose profile={profile} onPosted={() => setRefreshKey(k => k + 1)} />
      <TweetFeed currentProfile={profile} refreshKey={refreshKey} />
    </>
  )
}

export default App
