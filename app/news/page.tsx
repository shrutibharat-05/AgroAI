"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ExternalLink, Leaf, Newspaper } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NewsItem {
  title: string
  url: string
  date: string
  snippet: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()

      if (response.ok) {
        setNews(data.news)
      } else {
        setError(data.message || "Failed to fetch news")
      }
    } catch (err) {
      setError("An error occurred while fetching news")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural News</h1>
          <p className="text-gray-600">Stay updated with the latest news in agriculture and climate</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading latest news...</p>
          </div>
        )}

        {error && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchNews} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && news.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news articles found.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-6">
            {news.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 line-clamp-2">{article.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(article.date)}
                        <Badge variant="secondary" className="ml-2">
                          Agriculture
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 line-clamp-3">{article.snippet}</CardDescription>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(article.url, "_blank")}
                      className="flex items-center"
                    >
                      Read Full Article
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* News Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">News Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Climate Change</CardTitle>
                <CardDescription>Latest updates on climate impact on agriculture</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Crop Technology</CardTitle>
                <CardDescription>Innovations in farming technology and techniques</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Market Trends</CardTitle>
                <CardDescription>Agricultural market analysis and price trends</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
