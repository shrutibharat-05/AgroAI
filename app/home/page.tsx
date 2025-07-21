"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, MessageCircle, Newspaper, TrendingUp, Leaf, User, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DynamicStats } from "@/components/dynamic-stats"
import { WeatherWidget } from "@/components/weather-widget"
import { ActivityFeed } from "@/components/activity-feed"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              {user && (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back{user ? `, ${user.username}` : ""}!</h1>
          <p className="text-gray-600">Access all your agricultural tools and insights in one place.</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <DynamicStats />
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Cloud className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Weather Monitoring</CardTitle>
              <CardDescription>Get real-time weather data and forecasts for your location</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/weather">
                <Button className="w-full">Check Weather</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Crop Recommendations</CardTitle>
              <CardDescription>Get AI-powered recommendations based on weather and crop conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/recommendations">
                <Button className="w-full">Get Recommendations</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>AI Chatbot</CardTitle>
              <CardDescription>Ask questions and get instant answers about farming and agriculture</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chatbot">
                <Button className="w-full">Start Chat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Newspaper className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Agricultural News</CardTitle>
              <CardDescription>Stay updated with the latest news in agriculture and climate</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/news">
                <Button className="w-full">Read News</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Crop Management</CardTitle>
              <CardDescription>Manage your crops and track their progress throughout the season</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Coming Soon
                <Badge variant="secondary" className="ml-2">
                  Beta
                </Badge>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics and insights about your farming activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Coming Soon
                <Badge variant="secondary" className="ml-2">
                  Beta
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <WeatherWidget />
          <ActivityFeed />
        </div>

        {/* Recent Activity */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cloud className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-900">Weather check for New York</span>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-orange-600 mr-3" />
                    <span className="text-gray-900">Asked about tomato diseases</span>
                  </div>
                  <span className="text-sm text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-900">Got recommendation for wheat</span>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
