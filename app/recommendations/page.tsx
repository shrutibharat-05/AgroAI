"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Leaf, TrendingUp, Lightbulb } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RecommendationsPage() {
  const [formData, setFormData] = useState({
    crop: "",
    weather: "",
  })
  const [recommendation, setRecommendation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const crops = [
    "Wheat",
    "Rice",
    "Corn",
    "Tomatoes",
    "Potatoes",
    "Soybeans",
    "Cotton",
    "Barley",
    "Oats",
    "Lettuce",
    "Carrots",
    "Onions",
  ]

  const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Stormy", "Hot", "Cold", "Humid", "Dry", "Windy", "Foggy"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.crop || !formData.weather) {
      setError("Please select both crop and weather condition")
      return
    }

    setLoading(true)
    setError("")
    setRecommendation("")

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setRecommendation(data.recommendation)
      } else {
        setError(data.message || "Failed to get recommendation")
      }
    } catch (err) {
      setError("An error occurred while getting recommendation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Recommendations</h1>
          <p className="text-gray-600">Get AI-powered agricultural advice based on your crop and weather conditions</p>
        </div>

        {/* Recommendation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
              Get Personalized Recommendations
            </CardTitle>
            <CardDescription>
              Select your crop and current weather conditions to receive tailored agricultural advice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="crop">Select Crop</Label>
                  <Select value={formData.crop} onValueChange={(value) => setFormData({ ...formData, crop: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop} value={crop.toLowerCase()}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weather">Weather Condition</Label>
                  <Select
                    value={formData.weather}
                    onValueChange={(value) => setFormData({ ...formData, weather: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose weather condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {weatherConditions.map((weather) => (
                        <SelectItem key={weather} value={weather.toLowerCase()}>
                          {weather}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <Alert className="border-red-500 text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Getting Recommendation..." : "Get AI Recommendation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recommendation Result */}
        {recommendation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
                AI Recommendation for {formData.crop} in {formData.weather} Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">General Farming Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Soil Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maintain soil pH between 6.0-7.0 for optimal nutrient absorption. Regular soil testing helps identify
                  deficiencies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Water Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Water early morning or late evening to reduce evaporation. Monitor soil moisture regularly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pest Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Implement integrated pest management. Use beneficial insects and organic methods when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crop Rotation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rotate crops annually to prevent soil depletion and reduce pest buildup. Follow nitrogen-fixing crops
                  with heavy feeders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
