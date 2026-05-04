import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (tab === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      if (!username.trim()) {
        setError('ユーザー名を入力してください')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username.trim(), display_name: username.trim() } },
      })
      if (error) setError(error.message)
      else setError('確認メールを送信しました。メールを確認してください。')
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>𝕏</h2>

      <div className="auth-tabs">
        <button
          className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
          onClick={() => { setTab('login'); setError('') }}
        >
          ログイン
        </button>
        <button
          className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
          onClick={() => { setTab('signup'); setError('') }}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-msg">{error}</div>}

        {tab === 'signup' && (
          <div className="form-group">
            <label>ユーザー名</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button className="btn" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? '処理中...' : tab === 'login' ? 'ログイン' : '登録'}
        </button>
      </form>
    </div>
  )
}
