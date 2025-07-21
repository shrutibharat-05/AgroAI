import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "73b48ecfece17f28d57b8f06a4dd9306"
const URL = "https://api.openweathermap.org/data/2.5/weather"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    if (!city) {
      return NextResponse.json({ message: "City parameter is required" }, { status: 400 })
    }

    const response = await fetch(`${URL}?q=${city}&appid=${API_KEY}`)

    if (!response.ok) {
      return NextResponse.json(
        { message: "City not found or weather service unavailable" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while fetching weather data" }, { status: 500 })
  }
}
