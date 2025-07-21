import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Simulate a database with persistent storage
const users: Array<{
  id: number
  username: string
  email: string
  password: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 })
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ message: "An account with this email address already exists" }, { status: 400 })
    }

    // Check if username already exists
    const existingUsername = users.find((user) => user.username.toLowerCase() === username.toLowerCase())
    if (existingUsername) {
      return NextResponse.json({ message: "This username is already taken" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      id: users.length + 1,
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    return NextResponse.json(
      {
        message: "Account created successfully! You can now log in.",
        success: true,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Export users for login route
export { users }
