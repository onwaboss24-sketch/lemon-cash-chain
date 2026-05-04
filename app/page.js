'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [connected, setConnected] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  const [network, setNetwork] = useState('')
  
  const TREASURY = 'TGx37hY4EPmQ8B8zhG1UnpnvL1Qp6YJ3TW'
  const ENTRY_FEE = 7000000 // 7 USDT in SUN, 6 decimals
  const USDT_CONTRACT_NILE = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj' // NILE TESTNET USDT

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      const net = window.tronWeb.fullNode.host
      setNetwork(net)
      
      if (!net.includes('nile')) {
        alert('Please switch TronLink to NILE TESTNET for testing')
        return
      }
      
      setAddress(window.tronWeb.defaultAddress.base58)
      setConnected(true)
    } else {
      alert('Please install TronLink and login')
    }
  }

  const activateCampaign = async () => {
    if (!connected) return alert('Connect wallet first')
    
    if (!window.tronWeb.fullNode.host.includes('nile')) {
      return alert('Switch to Nile Testnet in TronLink')
    }
    
    setTxStatus('Sending 7 TEST USDT to Treasury...')
    try {
      const contract = await window.tronWeb.contract().at(USDT_CONTRACT_NILE)
      const tx = await contract.transfer(TREASURY, ENTRY_FEE).send()
      setTxStatus(`Success! TX: ${tx} | Check Tronscan Nile`)
    } catch (error) {
      setTxStatus('Failed: ' + error.message)
      console.log(error)
    }
  }

  return (
    <main style={{padding: '40px 20px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '700px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', color: '#10b981'}}>🍋 LEMON CHAIN - TESTNET</h1>
      <h2>MLM Campaign System</h2>
      <p style={{background: '#fef3c7', padding: '10px', borderRadius: '6px'}}>
        <strong>NILE TESTNET MODE</strong> - Using test USDT. No real money.
      </p>
      
      <div style={{background: '#fef2f2', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #fecaca'}}>
        <strong>TEST RULE:</strong> Send EXACTLY 7.000000 TEST USDT.  
        You need Nile TRX for gas. Get from TronLink faucet.
      </div>

      {!connected ? (
        <button onClick={connectWallet} style={{
          background: '#10b981', color: 'white', padding: '15px 30px', 
          fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>Connect TronLink - Nile</button>
      ) : (
        <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px'}}>
          <p><strong>Network:</strong> {network.includes('nile') ? 'Nile Testnet ✅' : 'Wrong Network ❌'}</p>
          <p><strong>Your Wallet:</strong> {address.slice(0,6)}...{address.slice(-4)}</p>
          <p><strong>Treasury:</strong> {TREASURY.slice(0,6)}...{TREASURY.slice(-4)}</p>
          
          <button onClick={activateCampaign} style={{
            background: '#dc2626', color: 'white', padding: '15px 30px', 
            fontSize: '18px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '15px'
          }}>
            Pay 7 TEST USDT to Activate
          </button>
          
          {txStatus && <p style={{marginTop: '15px', color: '#059669', wordBreak: 'break-all'}}>{txStatus}</p>}
        </div>
      )}
      
      <p style={{marginTop: '40px', color: '#666', fontSize: '14px'}}>
        Testing Mode: After this works, we switch back to Mainnet + add database for tree tracking.
      </p>
    </main>
  )
}