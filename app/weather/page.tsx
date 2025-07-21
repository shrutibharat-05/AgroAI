"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Cloud, Thermometer, Droplets, Wind, Eye, ArrowLeft, Leaf } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  visibility: number
}

export default function WeatherPage() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError("")
    setWeatherData(null)

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (response.ok) {
        setWeatherData(data)
      } else {
        setError(data.message || "Failed to fetch weather data")
      }
    } catch (err) {
      setError("An error occurred while fetching weather data")
    } finally {
      setLoading(false)
    }
  }

  const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/home" className="flex items-center">
                <ArrowLeft className="h-5 w-5 text-muted-foreground mr-2" />
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold">AgriSmart</span>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Monitoring</h1>
          <p className="text-gray-600">Get real-time weather data for better crop planning</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Check Weather</CardTitle>
            <CardDescription>Enter a city name to get current weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter city name (e.g., New York, London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Get Weather"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-500 text-red-700">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Weather Data */}
        {weatherData && (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-6 w-6 mr-2 text-blue-600" />
                  {weatherData.name}
                </CardTitle>
                <CardDescription>Current Weather Conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {kelvinToCelsius(weatherData.main.temp)}°C
                    </div>
                    <div className="text-xl text-gray-600 capitalize">{weatherData.weather[0].description}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Feels like {kelvinToCelsius(weatherData.main.feels_like)}°C
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-gray-700">Temperature: {kelvinToCelsius(weatherData.main.temp)}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-gray-700">Humidity: {weatherData.main.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-gray-500 mr-3" />
                      <span className="text-gray-700">Wind Speed: {weatherData.wind.speed} m/s</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-purple-500 mr-3" />
                      <span className="text-gray-700">Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-semibold">{kelvinToCelsius(weatherData.main.temp)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Feels like:</span>
                      <span className="font-semibold">{kelvinToCelsius(weatherData.main.feels_like)}°C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atmospheric</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Humidity:</span>
                      <span className="font-semibold">{weatherData.main.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pressure:</span>
                      <span className="font-semibold">{weatherData.main.pressure} hPa</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Wind & Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wind Speed:</span>
                      <span className="font-semibold">{weatherData.wind.speed} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visibility:</span>
                      <span className="font-semibold">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Agricultural Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agricultural Insights</CardTitle>
                <CardDescription>Weather-based farming recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.main.humidity > 80 && (
                    <Alert>
                      <Droplets className="h-4 w-4" />
                      <AlertDescription>
                        High humidity detected. Monitor crops for fungal diseases and ensure proper ventilation.
                      </AlertDescription>
                    </Alert>
                  )}
                  {kelvinToCelsius(weatherData.main.temp) > 30 && (
                    <Alert>
                      <Thermometer className="h-4 w-4" />
                      <AlertDescription>
                        High temperature alert. Ensure adequate irrigation and consider shade protection for sensitive
                        crops.
                      </AlertDescription>
                    </Alert>
                  )}
                  {weatherData.wind.speed > 10 && (
                    <Alert>
                      <Wind className="h-4 w-4" />
                      <AlertDescription>
                        Strong winds detected. Secure tall crops and check for wind damage after the weather passes.
                      </AlertDescription>
                    </Alert>
                  )}
                  {weatherData.main.humidity < 30 && (
                    <Alert>
                      <Droplets className="h-4 w-4" />
                      <AlertDescription>
                        Low humidity levels. Increase irrigation frequency and consider mulching to retain soil
                        moisture.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
