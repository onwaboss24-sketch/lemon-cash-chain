'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LemonChain() {
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (!u) router.push('/')
    else setUser(JSON.parse(u))
  }, [])

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      setWallet(window.tronWeb.defaultAddress.base58)
      setMsg('Wallet connected: ' + window.tronWeb.defaultAddress.base58.slice(0,6) + '...')
    } else {
      setMsg('Please install TronLink and login')
    }
  }

  const pay7USDT = async () => {
    if (!wallet) return setMsg('Connect wallet first')
    setLoading(true)
    setMsg('Sending $7 USDT...')
    
    try {
      const tx = await window.tronWeb.trx.sendTransaction(
        'TGx37hY4EPmQ8B8zhG1UnpnvL1Qp6YJ3TW', // ← Replace with your receiving wallet
        7000000 // $7 in USDT TRC-20 = 7,000,000 sun
      )
      
      // Save to Neon
      const res = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          walletAddress: wallet, 
          txHash: tx.txid 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        setMsg('✅ Campaign activated! TX: ' + tx.txid.slice(0,10) + '...')
      } else {
        setMsg('Payment sent but save failed: ' + data.error)
      }
    } catch (e) {
      setMsg('Payment failed: ' + e.message)
    }
    setLoading(false)
  }

  if (!user) return <div>Loading...</div>

  return (
    <main style={{padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial'}}>
      <button onClick={() => router.push('/dashboard')} style={{marginBottom: '20px'}}>← Back to Dashboard</button>
      <h1 style={{color: '#10b981'}}>🍋 LEMON CHAIN Campaign</h1>
      <p>Logged in as: <strong>{user.email}</strong></p>
      
      <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px'}}>
        <h3>Step 1: Connect TRC-20 Wallet</h3>
        <button onClick={connectWallet} style={{background: '#f59e0b', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
          {wallet ? 'Wallet Connected' : 'Connect TronLink'}
        </button>
        {wallet && <p style={{fontSize: '12px', wordBreak: 'break-all'}}>Wallet: {wallet}</p>}
      </div>

      <div style={{border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginTop: '20px'}}>
        <h3>Step 2: Activate Campaign - $7 USDT</h3>
        <button onClick={pay7USDT} disabled={loading || !wallet} style={{
          background: wallet ? '#10b981' : '#ccc', color: 'white', 
          padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: wallet ? 'pointer' : 'not-allowed'
        }}>
          {loading ? 'Processing...' : 'Pay $7 & Start Campaign'}
        </button>
      </div>
      
      {msg && <p style={{marginTop: '20px', padding: '12px', background: '#f3f4f6', borderRadius: '6px'}}>{msg}</p>}
    </main>
  )
}