'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('user')) router.push('/dashboard')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('Loading...')
    
    const res = await fetch(`/api/${isLogin ? 'login' : 'signup'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    } else {
      setMsg(data.error)
    }
  }

  return (
    <main style={{padding: '40px 20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial'}}>
      <h1 style={{color: '#10b981'}}>🍋 LEMON CHAIN</h1>
      <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          style={{width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc'}}
        />
        <input 
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          style={{width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc'}}
        />
        <button type="submit" style={{
          width: '100%', background: '#10b981', color: 'white', 
          padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>
      
      <p style={{marginTop: '20px', textAlign: 'center'}}>
        {isLogin ? "No account? " : "Have account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{color: '#10b981', cursor: 'pointer', fontWeight: 'bold'}}>
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </p>
      
      {msg && <p style={{color: msg.includes('Loading') ? '#666' : '#dc2626', textAlign: 'center'}}>{msg}</p>}
    </main>
  )
}