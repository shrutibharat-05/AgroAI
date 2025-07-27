"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Leaf, Newspaper, RefreshCw, Globe, Clock, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

interface NewsItem {
  title: string
  url: string
  date: string
  snippet: string
  source?: string
  imageUrl?: string
  author?: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchNews = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/news", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }

      const data = await res.json()

      if (data.news && data.news.length > 0) {
        setNews(data.news)
        setLastUpdated(new Date())

        // Track activity
        const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
        activities.unshift({
          id: Date.now(),
          type: "news",
          description: `Loaded ${data.news.length} latest agricultural news articles`,
          timestamp: new Date().toISOString(),
          status: "completed",
        })
        localStorage.setItem("userActivities", JSON.stringify(activities.slice(0, 50)))
      } else {
        setError("No news articles available at the moment.")
      }
    } catch (err) {
      setError("Could not load real-time news. Please check your connection and try again.")
      console.error("News fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh news every 10 minutes
  useEffect(() => {
    fetchNews()

    const interval = setInterval(
      () => {
        fetchNews()
      },
      10 * 60 * 1000,
    ) // 10 minutes

    return () => clearInterval(interval)
  }, [])

  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      if (diffHours < 1) return "Just now"
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`

      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Recent"
    }
  }

  const handleArticleClick = (article: NewsItem) => {
    // Validate URL before opening
    if (!article.url || article.url === "#" || article.url.includes("removed.com")) {
      console.warn("Invalid article URL:", article.url)
      return
    }

    // Track click activity
    const activities = JSON.parse(localStorage.getItem("userActivities") || "[]")
    activities.unshift({
      id: Date.now(),
      type: "news",
      description: `Read article: ${article.title.substring(0, 50)}...`,
      timestamp: new Date().toISOString(),
      status: "completed",
    })
    localStorage.setItem("userActivities", JSON.stringify(activities.slice(0, 50)))

    // Open article in new tab
    try {
      window.open(article.url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error opening article:", error)
    }
  }

  const isValidUrl = (url: string) => {
    return url && url !== "#" && !url.includes("removed.com") && url.startsWith("http")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <Link href="/home" className="flex items-center hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-muted-foreground mr-2" />
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold">AgriSmart</span>
          </Link>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="hidden sm:flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Updated {formatDate(lastUpdated.toISOString())}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Real-Time Agricultural News</h1>
          </div>
          <p className="text-muted-foreground">Live updates from NewsAPI and trusted agricultural sources</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Feed
            </Badge>
            <Badge variant="outline">{news.length} Articles</Badge>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-muted-foreground">Fetching latest news from NewsAPI...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="max-w-lg mx-auto border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6 text-center">
              <Newspaper className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchNews} variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* News Articles */}
        {!loading && !error && news.length > 0 && (
          <section className="space-y-6">
            {news.map((article, i) => (
              <Card
                key={i}
                className={`hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group ${
                  isValidUrl(article.url) ? "cursor-pointer" : "cursor-default opacity-75"
                }`}
                onClick={() => isValidUrl(article.url) && handleArticleClick(article)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {article.source && (
                          <Badge variant="secondary" className="text-xs">
                            {article.source}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Live
                        </Badge>
                        {!isValidUrl(article.url) && (
                          <Badge variant="destructive" className="text-xs">
                            Link Unavailable
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2 flex-wrap gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.date)}
                        </div>
                        {article.author && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                        )}
                        {isValidUrl(article.url) && (
                          <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                    {article.imageUrl && (
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={article.imageUrl || "/placeholder.svg"}
                          alt=""
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4 line-clamp-3 leading-relaxed">
                    {article.snippet}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`flex items-center gap-2 transition-colors pointer-events-none ${
                        isValidUrl(article.url)
                          ? "hover:bg-green-50 hover:border-green-300"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!isValidUrl(article.url)}
                    >
                      {isValidUrl(article.url) ? "Read Full Article" : "Article Unavailable"}
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {isValidUrl(article.url) && (
                      <div className="text-xs text-muted-foreground">Click anywhere to read</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No news articles available at the moment.</p>
              <Button onClick={fetchNews} variant="outline">
                Refresh News
              </Button>
            </CardContent>
          </Card>
        )}

        {/* API Status Info */}
        {!loading && !error && news.length > 0 && (
          <section className="mt-12">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  News Sources
                </CardTitle>
                <CardDescription>
                  Powered by NewsAPI.org with your API key, supplemented by RSS feeds from Agriculture.com, Farm
                  Progress, and other trusted agricultural sources. All articles link to original sources.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}
