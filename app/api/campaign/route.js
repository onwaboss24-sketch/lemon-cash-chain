import { NextResponse } from 'next/server'
import { createCampaign, initDB } from '../../../lib/db'

export async function POST(request) {
  try {
    await initDB()
    const { userId, walletAddress, txHash } = await request.json()
    
    if (!userId || !walletAddress || !txHash) {
      return NextResponse.json({ success: false, error: 'Missing data' })
    }
    
    const campaign = await createCampaign(userId, walletAddress, txHash)
    return NextResponse.json({ success: true, campaign })
    
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return NextResponse.json({ success: false, error: 'This transaction already used' })
    }
    return NextResponse.json({ success: false, error: 'Database save failed' })
  }
}