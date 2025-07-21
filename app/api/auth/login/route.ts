import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Import users from register route
const users: Array<{
  id: number
  username: string
  email: string
  password: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user (case insensitive email)
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim())
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutPassword,
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Sync users array (in a real app, this would be a database)
export async function GET() {
  return NextResponse.json({ userCount: users.length })
}
