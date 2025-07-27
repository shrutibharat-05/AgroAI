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
  ArrowRight,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface Stats {
  activeUsers: number
  weatherChecks: number
  chatSessions: number
  newsReads: number
}

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState<Stats>({
    activeUsers: 1247,
    weatherChecks: 3456,
    chatSessions: 892,
    newsReads: 2134,
  })
  const [loading, setLoading] = useState(true)

  // Add activity function
  const addActivity = (type: string, description: string, status: "completed" | "pending" | "failed" = "completed") => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date().toISOString(),
      status,
    }

    const updatedActivities = [newActivity, ...activities.slice(0, 9)] // Keep only 10 activities
    setActivities(updatedActivities)
    localStorage.setItem("userActivities", JSON.stringify(updatedActivities))
  }

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem("userActivities")
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    } else {
      // Initialize with some default activities
      const defaultActivities: Activity[] = [
        {
          id: "1",
          type: "signup",
          description: "Account created successfully",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: "completed",
        },
        {
          id: "2",
          type: "weather",
          description: "Checked weather for current location",
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: "completed",
        },
      ]
      setActivities(defaultActivities)
      localStorage.setItem("userActivities", JSON.stringify(defaultActivities))
    }
  }, [])

  // Fetch current location weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try to get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
              if (response.ok) {
                const data = await response.json()
                setWeather(data)
                addActivity("weather", `Weather checked for ${data.location}`)
              }
            },
            async () => {
              // Fallback to default city if geolocation fails
              const response = await fetch("/api/weather?city=New York")
              if (response.ok) {
                const data = await response.json()
                setWeather(data)
                addActivity("weather", "Weather checked for default location")
              }
            },
          )
        }
      } catch (error) {
        console.error("Weather fetch error:", error)
        addActivity("weather", "Failed to fetch weather data", "failed")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        weatherChecks: prev.weatherChecks + Math.floor(Math.random() * 10),
        chatSessions: prev.chatSessions + Math.floor(Math.random() * 3),
        newsReads: prev.newsReads + Math.floor(Math.random() * 7),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <Cloud className="h-4 w-4" />
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "recommendation":
        return <TrendingUp className="h-4 w-4" />
      case "signup":
        return <Users className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold">AgroByte</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to AgroByte Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Your comprehensive agricultural management platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weather Checks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.weatherChecks.toLocaleString()}
                  </p>
                </div>
                <Cloud className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+8% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chat Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.chatSessions.toLocaleString()}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+15% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">News Reads</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newsReads.toLocaleString()}</p>
                </div>
                <Newspaper className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-green-600 mt-2">+5% from last hour</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your most used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/weather" onClick={() => addActivity("weather", "Navigated to weather page")}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-950 bg-transparent"
                    >
                      <Cloud className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Weather</span>
                    </Button>
                  </Link>

                  <Link href="/chatbot" onClick={() => addActivity("chat", "Opened AI chatbot")}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 dark:hover:bg-green-950 bg-transparent"
                    >
                      <MessageCircle className="h-6 w-6 text-green-600" />
                      <span className="text-sm">AI Chat</span>
                    </Button>
                  </Link>

                  <Link href="/news" onClick={() => addActivity("news", "Checked agricultural news")}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 dark:hover:bg-purple-950 bg-transparent"
                    >
                      <Newspaper className="h-6 w-6 text-purple-600" />
                      <span className="text-sm">News</span>
                    </Button>
                  </Link>

                  <Link
                    href="/recommendations"
                    onClick={() => addActivity("recommendation", "Viewed crop recommendations")}
                  >
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 dark:hover:bg-orange-950 bg-transparent"
                    >
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                      <span className="text-sm">Recommendations</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="h-5 w-5" />
                  <span>Current Weather</span>
                </CardTitle>
                <CardDescription>Real-time weather for your location</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : weather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{weather.location}</span>
                      </div>
                      <Badge variant="secondary">{weather.description}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-red-500" />
                        <span className="text-2xl font-bold">{weather.temperature}°C</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span>{weather.humidity}% Humidity</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <span>{weather.windSpeed} km/h</span>
                      </div>
                    </div>

                    <Link href="/weather">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Detailed Forecast
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Unable to load weather data</p>
                    <Button variant="outline" className="mt-2 bg-transparent" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                            {getStatusIcon(activity.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Helpful resources and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link
                    href="/weather"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm">Weather Forecast</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/chatbot"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm">Ask AI Assistant</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/news"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm">Latest News</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/recommendations"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm">Crop Advice</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
