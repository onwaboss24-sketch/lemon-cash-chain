'use client'
import { useState } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [connected, setConnected] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  
  const TREASURY = 'TGx37hY4EPmQ8B8zhG1UnpnvL1Qp6YJ3TW'
  const ENTRY_FEE = 7000000 // 7 USDT = 7 * 10^6 because USDT has 6 decimals
  const USDT_CONTRACT_NILE = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf' // Your actual Nile USDT

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      if (!window.tronWeb.fullNode.host.includes('nile')) {
        return alert('Switch TronLink to NILE TESTNET first')
      }
      setAddress(window.tronWeb.defaultAddress.base58)
      setConnected(true)
      setTxStatus('Wallet connected')
    } else {
      alert('Please install TronLink and login')
    }
  }

  const activateCampaign = async () => {
    if (!connected) return alert('Connect wallet first')
    
    setTxStatus('Checking balance...')
    try {
      const contract = await window.tronWeb.contract().at(USDT_CONTRACT_NILE)
      
      // Check you have at least 7 USDT
      const balance = await contract.balanceOf(address).call()
      if (balance < ENTRY_FEE) {
        return setTxStatus(`Failed: You only have ${balance/1000000} USDT. Need exactly 7 USDT`)
      }
      
      setTxStatus('Sending 7 TEST USDT to Treasury... Approve in TronLink')
      const tx = await contract.transfer(TREASURY, ENTRY_FEE).send({
        feeLimit: 100000000
      })
      setTxStatus(`Success! TX: ${tx}`)
      
    } catch (error) {
      console.log('Error:', error)
      setTxStatus('Failed: ' + error.message)
    }
  }

  return (
    <main style={{padding: '40px 20px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', color: '#10b981'}}>🍋 LEMON CHAIN - TESTNET</h1>
      <h2>MLM Campaign Entry: $7 Exactly</h2>
      
      <div style={{background: '#fef3c7', padding: '12px', borderRadius: '6px', margin: '20px 0'}}>
        <strong>NILE TESTNET MODE</strong> - No real money. Using your USDT: TXYZop...eBf
      </div>

      {!connected ? (
        <button onClick={connectWallet} style={{
          background: '#10b981', color: 'white', padding: '15px 30px', 
          fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Connect TronLink - Nile</button>
      ) : (
        <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px'}}>
          <p><strong>Your Wallet:</strong> {address.slice(0,6)}...{address.slice(-4)}</p>
          <p><strong>Treasury:</strong> {TREASURY.slice(0,6)}...{TREASURY.slice(-4)}</p>
          <p><strong>Amount:</strong> 7.000000 USDT</p>
          
          <button onClick={activateCampaign} style={{
            background: '#dc2626', color: 'white', padding: '15px 30px', 
            fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px'
          }}>
            Pay 7 TEST USDT to Activate
          </button>
        </div>
      )}
      
      {txStatus && (
        <div style={{
          marginTop: '20px', padding: '15px', borderRadius: '8px', 
          background: txStatus.includes('Success') ? '#d1fae5' : '#fee2e2',
          wordBreak: 'break-all'
        }}>
          {txStatus}
        </div>
      )}
      
      <p style={{marginTop: '40px', color: '#666', fontSize: '14px'}}>
        Stage 4 Testing: Once $7 sends correctly, we add database to track 5/25/75 referrals
      </p>
    </main>
  )
}