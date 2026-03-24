import { NextResponse } from 'next/server'

// Redirect all callback requests to the client-side handler
// PKCE code verifier is stored in browser cookies and needs
// the browser client to exchange the code
export async function GET(request: Request) {
  const { search, hash, origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/auth/confirm${search}${hash}`)
}
