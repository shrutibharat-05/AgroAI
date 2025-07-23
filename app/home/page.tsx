"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Cloud,
  MessageCircle,
  Newspaper,
  TrendingUp,
  Users,
  Activity,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Clock,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface WeatherData {
  name: string
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
}

interface UserActivity {
  id: string
  type: "weather" | "chat" | "news" | "recommendation"
  description: string
  timestamp: string // ISO string instead of Date object
  status: "completed" | "pending" | "failed"
}

export default function HomePage() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<string>("")
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [stats, setStats] = useState({
    activeUsers: 1247,
    weatherChecks: 3456,
    chatSessions: 892,
    newsReads: 567,
  })

  // Get user's current location and weather
  useEffect(() => {
    const getCurrentLocationWeather = async () => {
      try {
        // Get user's geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords

              // Fetch weather data using coordinates
              const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
              const data = await response.json()

              if (response.ok) {
                setCurrentWeather(data)
                setUserLocation(data.name)

                // Add weather check to activities
                addActivity({
                  type: "weather",
                  description: `Checked weather for ${data.name}`,
                  status: "completed",
                })
              }
            },
            (error) => {
              console.error("Geolocation error:", error)
              // Fallback to default city
              fetchWeatherByCity("London")
            },
          )
        } else {
          // Fallback if geolocation is not supported
          fetchWeatherByCity("London")
        }
      } catch (error) {
        console.error("Weather fetch error:", error)
      } finally {
        setWeatherLoading(false)
      }
    }

    getCurrentLocationWeather()
    loadUserActivities()
  }, [])

  const fetchWeatherByCity = async (city: string) => {
    try {
      const response = await fetch(`/api/weather?city=${city}`)
      const data = await response.json()

      if (response.ok) {
        setCurrentWeather(data)
        setUserLocation(data.name)
      }
    } catch (error) {
      console.error("Weather fetch error:", error)
    }
  }

  const addActivity = (activity: Omit<UserActivity, "id" | "timestamp">) => {
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(), // <-- store as string
      ...activity,
    }

    setActivities((prev) => [newActivity, ...prev.slice(0, 9)])

    const stored = JSON.parse(localStorage.getItem("userActivities") || "[]")
    stored.unshift(newActivity)
    localStorage.setItem("userActivities", JSON.stringify(stored.slice(0, 50)))
  }

  const loadUserActivities = () => {
    const stored: UserActivity[] = JSON.parse(localStorage.getItem("userActivities") || "[]")
    setActivities(stored.slice(0, 10))
  }

  const kelvinToCelsius = (kelvin: number) => Math.round(kelvin - 273.15)

  const handleNavigation = (type: UserActivity["type"], description: string) => {
    addActivity({
      type,
      description,
      status: "completed",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold">AgriSmart</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to AgriSmart</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your intelligent agricultural companion for weather monitoring, crop recommendations, and farming insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Cloud className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Weather Checks</p>
                  <p className="text-2xl font-bold">{stats.weatherChecks.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Chat Sessions</p>
                  <p className="text-2xl font-bold">{stats.chatSessions.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Newspaper className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">News Reads</p>
                  <p className="text-2xl font-bold">{stats.newsReads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather Widget */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Current Weather - {userLocation || "Loading..."}
                </CardTitle>
                <CardDescription>Real-time weather conditions for your location</CardDescription>
              </CardHeader>
              <CardContent>
                {weatherLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : currentWeather ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {kelvinToCelsius(currentWeather.main.temp)}°C
                      </div>
                      <p className="text-lg text-muted-foreground capitalize">
                        {currentWeather.weather[0].description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Temperature: {kelvinToCelsius(currentWeather.main.temp)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">Humidity: {currentWeather.main.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">Wind: {currentWeather.wind.speed} m/s</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Unable to load weather data</p>
                )}

                <div className="mt-4">
                  <Link href="/weather">
                    <Button
                      className="w-full"
                      onClick={() => handleNavigation("weather", "Opened detailed weather view")}
                    >
                      View Detailed Weather
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your farming activities and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-2">
                        {activity.type === "weather" && <Cloud className="h-4 w-4 text-blue-600" />}
                        {activity.type === "chat" && <MessageCircle className="h-4 w-4 text-green-600" />}
                        {activity.type === "news" && <Newspaper className="h-4 w-4 text-orange-600" />}
                        {activity.type === "recommendation" && <TrendingUp className="h-4 w-4 text-purple-600" />}
                        <div>
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No activities yet. Start exploring!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
                AI Agricultural Assistant
              </CardTitle>
              <CardDescription>
                Get expert advice on crops, pests, and farming techniques from our AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chatbot">
                <Button className="w-full" onClick={() => handleNavigation("chat", "Started AI chat session")}>
                  Start Chatting
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="h-6 w-6 mr-2 text-orange-600" />
                Agricultural News
              </CardTitle>
              <CardDescription>Stay updated with the latest news and trends in agriculture and climate</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/news">
                <Button className="w-full" onClick={() => handleNavigation("news", "Browsed agricultural news")}>
                  Read News
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-6 w-6 mr-2 text-blue-600" />
                Weather Monitoring
              </CardTitle>
              <CardDescription>
                Monitor weather conditions and get agricultural insights for better farming
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/weather">
                <Button className="w-full" onClick={() => handleNavigation("weather", "Accessed weather monitoring")}>
                  Check Weather
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
