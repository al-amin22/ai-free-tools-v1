import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Invalid email' }, { status: 400 })
    }

    await query(
      `INSERT INTO subscribers (email, source, status)
       VALUES ($1, 'rate_limit', 'active')
       ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase().trim()]
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('registered', 'true', {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    })
    return response
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
