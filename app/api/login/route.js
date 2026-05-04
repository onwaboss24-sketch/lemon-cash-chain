import { getUserByEmail, initDB } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    await initDB()
    const { email, password } = await request.json()
    
    const user = await getUserByEmail(email)
    if (!user) {
      return Response.json({ success: false, error: 'User not found' })
    }
    
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json({ success: false, error: 'Wrong password' })
    }
    
    return Response.json({ success: true, user: { id: user.id, email: user.email } })
    
  } catch (error) {
    return Response.json({ success: false, error: 'Login failed' })
  }
}