import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession()
  
  if (session?.user?.email) {
    // Register/login the Google user in our backend
    const backendUrl = "http://127.0.0.1:8000"
    
    try {
      // Try to register first
      await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          password: `google_${session.user.email}_secure`
        })
      })
    } catch {}

    // Then login to get token
    const loginRes = await fetch(`${backendUrl}/login`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        password: `google_${session.user.email}_secure`
      })
    })

    const data = await loginRes.json()
    
    return NextResponse.redirect(
      new URL(`/?token=${data.token}&name=${encodeURIComponent(session.user.name || "")}&email=${encodeURIComponent(session.user.email)}`, 
      "http://localhost:3000")
    )
  }

  return NextResponse.redirect(new URL("/login", "http://localhost:3000"))
}