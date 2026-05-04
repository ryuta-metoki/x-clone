import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/supabase'

const MAX = 280

type Props = {
  profile: Profile
  onPosted: () => void
}

export function TweetCompose({ profile, onPosted }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const remaining = MAX - content.length
  const overLimit = remaining < 0
  const nearLimit = remaining <= 20 && !overLimit

  async function handlePost() {
    if (!content.trim() || overLimit) return
    setLoading(true)

    const { error } = await supabase.from('tweets').insert({
      user_id: profile.id,
      content: content.trim(),
    })

    if (!error) {
      setContent('')
      onPosted()
    }
    setLoading(false)
  }

  const initial = (profile.display_name || profile.username).charAt(0).toUpperCase()

  return (
    <div className="compose">
      <div className="avatar">{initial}</div>
      <div className="compose-inner">
        <textarea
          placeholder="いまどうしてる？"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost()
          }}
        />
        <div className="compose-footer">
          <span className={`char-count ${overLimit ? 'over' : nearLimit ? 'warn' : ''}`}>
            {remaining}
          </span>
          <button
            className="btn"
            onClick={handlePost}
            disabled={!content.trim() || overLimit || loading}
          >
            {loading ? '投稿中...' : 'ポスト'}
          </button>
        </div>
      </div>
    </div>
  )
}
