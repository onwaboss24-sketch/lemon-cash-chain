import { NextResponse } from 'next/server'
import { createUser, initDB } from '../../../lib/db'

export async function POST(request) {
  try {
    await initDB()
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' })
    }
    
    const user = await createUser(email, password)
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
    
  } catch (error) {
    if (error.message.includes('duplicate')) {
      return NextResponse.json({ success: false, error: 'Email already exists' })
    }
    return NextResponse.json({ success: false, error: 'Signup failed' })
  }
}