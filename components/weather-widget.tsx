"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Droplets, Wind } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching weather data for user's location
    const fetchWeather = async () => {
      try {
        // In a real app, you'd get user's location and fetch actual weather
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setWeather({
          location: "New York, NY",
          temperature: 22,
          condition: "Partly Cloudy",
          humidity: 65,
          windSpeed: 12,
        })
      } catch (error) {
        console.error("Weather fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-blue-600" />
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{weather.location}</span>
            <span className="text-2xl font-bold">{weather.temperature}°C</span>
          </div>
          <p className="text-sm">{weather.condition}</p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Droplets className="h-3 w-3 mr-1" />
              {weather.humidity}%
            </div>
            <div className="flex items-center">
              <Wind className="h-3 w-3 mr-1" />
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
