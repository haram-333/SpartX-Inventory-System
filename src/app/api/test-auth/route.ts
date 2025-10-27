import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({ 
      success: true, 
      message: "Auth test successful",
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error
      },
      { status: 500 }
    )
  }
}
