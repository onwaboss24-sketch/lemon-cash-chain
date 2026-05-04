import { createCampaign, initDB } from '@/lib/db'

export async function POST(request) {
  try {
    await initDB()
    const { userId, walletAddress, txHash } = await request.json()
    
    if (!userId || !walletAddress || !txHash) {
      return Response.json({ success: false, error: 'Missing data' })
    }
    
    const campaign = await createCampaign(userId, walletAddress, txHash)
    return Response.json({ success: true, campaign })
    
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return Response.json({ success: false, error: 'This transaction already used' })
    }
    return Response.json({ success: false, error: 'Database save failed' })
  }
}