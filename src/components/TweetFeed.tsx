import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Tweet, Profile } from '../lib/supabase'

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'たった今'
  if (mins < 60) return `${mins}分前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}時間前`
  return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
}

type Props = {
  currentProfile: Profile
  refreshKey: number
}

export function TweetFeed({ currentProfile, refreshKey }: Props) {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('tweets')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false })
        .limit(100)
      setTweets((data as Tweet[]) ?? [])
      setLoading(false)
    }
    load()
  }, [refreshKey])

  async function handleDelete(id: string) {
    await supabase.from('tweets').delete().eq('id', id)
    setTweets(prev => prev.filter(t => t.id !== id))
  }

  if (loading) return <div className="loading">読み込み中...</div>

  if (tweets.length === 0)
    return (
      <div className="empty">
        <strong>まだポストがありません</strong>
        <p>最初のポストをしてみましょう！</p>
      </div>
    )

  return (
    <div>
      {tweets.map(tweet => {
        const p = tweet.profiles!
        const initial = (p.display_name || p.username).charAt(0).toUpperCase()
        const isOwn = tweet.user_id === currentProfile.id
        return (
          <div key={tweet.id} className="tweet-card">
            <div className="avatar">{initial}</div>
            <div className="tweet-body">
              <div className="tweet-meta">
                <span className="tweet-display-name">{p.display_name || p.username}</span>
                <span className="tweet-username">@{p.username}</span>
                <span className="tweet-time">· {formatTime(tweet.created_at)}</span>
              </div>
              <div className="tweet-content">{tweet.content}</div>
              {isOwn && (
                <div className="tweet-actions">
                  <button className="btn-ghost" onClick={() => handleDelete(tweet.id)}>
                    削除
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
