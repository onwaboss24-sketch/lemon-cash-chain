'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [usdtBalance, setUsdtBalance] = useState('')
  const [connected, setConnected] = useState(false)

  // USDT TRC-20 Contract Address on Nile Testnet
  const USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'

  const connectWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      try {
        const userAddress = window.tronWeb.defaultAddress.base58
        setAddress(userAddress)
        setConnected(true)
        
        // Get TRX Balance
        const trxBal = await window.tronWeb.trx.getBalance(userAddress)
        setBalance(window.tronWeb.fromSun(trxBal))
        
        // Get USDT TRC-20 Balance
        const contract = await window.tronWeb.contract().at(USDT_CONTRACT)
        const usdtBal = await contract.balanceOf(userAddress).call()
        setUsdtBalance((usdtBal / 1000000).toFixed(2)) // USDT has 6 decimals
        
      } catch (error) {
        alert('Error connecting: ' + error.message)
      }
    } else {
      alert('Please install TronLink and login first!')
    }
  }

  return (
    <main style={{padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial'}}>
      <h1 style={{fontSize: '3rem', color: '#10b981'}}>🍋 LEMON CASH CHAIN</h1>
      <h2>Earn USDT TRC-20 on TRON</h2>
      <p style={{fontSize: '1.2rem', margin: '20px 0'}}>
        20% Direct Referral + 4% Matrix Bonus
      </p>
      
      {!connected ? (
        <button 
          onClick={connectWallet}
          style={{
            background: '#10b981', 
            color: 'white', 
            padding: '15px 30px', 
            fontSize: '18px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
          Connect TronLink Wallet
        </button>
      ) : (
        <div style={{
          background: '#f0fdf4', 
          padding: '20px', 
          borderRadius: '12px',
          maxWidth: '500px',
          margin: '20px auto'
        }}>
          <h3 style={{color: '#10b981'}}>Wallet Connected ✅</h3>
          <p><strong>Address:</strong> {address.slice(0,6)}...{address.slice(-4)}</p>
          <p><strong>TRX Balance:</strong> {balance} TRX</p>
          <p><strong>USDT TRC-20:</strong> {usdtBalance} USDT</p>
        </div>
      )}
      
      <p style={{marginTop: '40px', color: '#666'}}>Stage 5: TRON Web3 Active</p>
    </main>
  )
}