'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [connected, setConnected] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  
  const TREASURY = 'TGx37hY4EPmQ8B8zhG1UnpnvL1Qp6YJ3TW'
  const ENTRY_FEE = 7000000 // 7 USDT in SUN, 6 decimals
  const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // Mainnet USDT

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      setAddress(window.tronWeb.defaultAddress.base58)
      setConnected(true)
    } else {
      alert('Please install TronLink and login')
    }
  }

  const activateCampaign = async () => {
    if (!connected) return alert('Connect wallet first')
    
    setTxStatus('Sending 7 USDT to Treasury...')
    try {
      const contract = await window.tronWeb.contract().at(USDT_CONTRACT)
      const tx = await contract.transfer(TREASURY, ENTRY_FEE).send()
      setTxStatus(`Success! TX: ${tx.slice(0,10)}... Campaign activation pending verification.`)
    } catch (error) {
      setTxStatus('Failed: ' + error.message + ' | Ensure you have 7 USDT + TRX for gas')
    }
  }

  return (
    <main style={{padding: '40px 20px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', color: '#10b981'}}>🍋 LEMON CHAIN</h1>
      <h2>MLM Campaign System</h2>
      <p>$7 Entry → 5 Directs = $15 → Level 3 = $150</p>
      
      <div style={{background: '#fef2f2', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #fecaca'}}>
        <strong>IMPORTANT:</strong> You must send EXACTLY 7.000000 USDT.  
        You also need TRX for gas fees. Transaction will fail if you only have 7 USDT total.
      </div>

      {!connected ? (
        <button onClick={connectWallet} style={{
          background: '#10b981', color: 'white', padding: '15px 30px', 
          fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Connect TronLink Wallet</button>
      ) : (
        <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px'}}>
          <p><strong>Your Wallet:</strong> {address.slice(0,6)}...{address.slice(-4)}</p>
          <p><strong>Treasury:</strong> {TREASURY.slice(0,6)}...{TREASURY.slice(-4)}</p>
          
          <button onClick={activateCampaign} style={{
            background: '#dc2626', color: 'white', padding: '15px 30px', 
            fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px'
          }}>
            Pay 7 USDT to Activate Campaign
          </button>
          
          {txStatus && <p style={{marginTop: '15px', color: '#059669'}}>{txStatus}</p>}
        </div>
      )}
      
      <p style={{marginTop: '40px', color: '#666', fontSize: '14px'}}>
        LEMON CHAIN: One wallet per active campaign. Level 1 locks at 5 directs.
      </p>
    </main>
  )
}