import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "73b48ecfece17f28d57b8f06a4dd9306"
const URL = "https://api.openweathermap.org/data/2.5/weather"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    let requestUrl = ""

    if (lat && lon) {
      // Use coordinates for geolocation
      requestUrl = `${URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    } else if (city) {
      // Use city name
      requestUrl = `${URL}?q=${city}&appid=${API_KEY}`
    } else {
      return NextResponse.json({ message: "City parameter or coordinates are required" }, { status: 400 })
    }

    const response = await fetch(requestUrl)

    if (!response.ok) {
      return NextResponse.json(
        { message: "Location not found or weather service unavailable" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ message: "An error occurred while fetching weather data" }, { status: 500 })
  }
}
