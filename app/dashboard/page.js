'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u) router.push('/')
    else setUser(JSON.parse(u))
  }, [])

  if (!user) return <div style={{padding: '40px'}}>Loading...</div>

  return (
    <main style={{padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{color: '#10b981'}}>🍋 LEMON CHAIN Dashboard</h1>
        <button onClick={() => {localStorage.removeItem('user'); router.push('/')}} 
          style={{padding: '8px 16px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer'}}>
          Logout
        </button>
      </div>
      
      <p>Welcome: <strong>{user.email}</strong></p>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px'}}>
        <div style={{border: '2px solid #10b981', borderRadius: '12px', padding: '24px'}}>
          <h3>Project 1: LEMON CHAIN MLM</h3>
          <p>Start campaigns, earn $15 per 5 directs</p>
          <button style={{background: '#10b981', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px'}}>
            Enter LEMON CHAIN
          </button>
        </div>
        
        <div style={{border: '2px solid #ccc', borderRadius: '12px', padding: '24px', opacity: 0.6}}>
          <h3>Project 2: LEMON STAKING POOL</h3>
          <p>Coming soon after MLM launch</p>
          <button disabled style={{background: '#ccc', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', marginTop: '12px'}}>
            Locked
          </button>
        </div>
      </div>
    </main>
  )
}