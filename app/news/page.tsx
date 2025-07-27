"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, ArrowLeft, ExternalLink, RefreshCw, Clock, Eye, AlertCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
}

interface NewsResponse {
  articles: NewsArticle[]
  totalResults: number
  status: string
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Add activity tracking
  const addActivity = (description: string) => {
    const newActivity = {
      id: Date.now().toString(),
      type: "news",
      description,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    const existingActivities = JSON.parse(localStorage.getItem("userActivities") || "[]")
    const updatedActivities = [newActivity, ...existingActivities.slice(0, 9)]
    localStorage.setItem("userActivities", JSON.stringify(updatedActivities))
  }

  const fetchNews = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/news")

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data: NewsResponse = await response.json()
      setArticles(data.articles || [])
      setLastUpdated(new Date())
      addActivity(`Checked ${data.articles?.length || 0} news articles`)
    } catch (err) {
      setError("Unable to load news. Please try again.")
      console.error("News fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchNews, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleArticleClick = (article: NewsArticle) => {
    addActivity(`Read article: "${article.title.substring(0, 50)}${article.title.length > 50 ? "..." : ""}"`)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return !url.includes("removed.com")
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/home">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold">AgroByte News</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Agricultural News</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest news in agriculture and farming
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <Button onClick={fetchNews} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Live Feed</span>
          </div>
          <Badge variant="secondary">{articles.length} Articles</Badge>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <Button onClick={fetchNews} size="sm" variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && articles.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* News Articles */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">
                      {article.source.name}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {isValidUrl(article.url) ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleArticleClick(article)}
                        className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Read Article
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    ) : (
                      <span className="flex items-center text-gray-400 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Link Unavailable
                      </span>
                    )}
                    <div className="flex items-center text-gray-500 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {Math.floor(Math.random() * 1000) + 100}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles available</h3>
              <p className="text-gray-500 mb-4">We're having trouble loading the latest news. Please try again.</p>
              <Button onClick={fetchNews}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload News
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
