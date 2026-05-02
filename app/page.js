export default function Home() {
  return (
    <main style={{padding: '60px 20px', textAlign: 'center', fontFamily: 'Arial'}}>
      <h1 style={{fontSize: '3rem', color: '#10b981'}}>🍋 LEMON CASH CHAIN</h1>
      <h2>Earn USDT TRC-20 on TRON</h2>
      <p style={{fontSize: '1.2rem', margin: '20px 0'}}>
        20% Direct Referral + 4% Matrix Bonus
      </p>
      <button style={{
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
      <p style={{marginTop: '40px', color: '#666'}}>Stage 4 Complete. TRON Network Ready.</p>
    </main>
  )
}