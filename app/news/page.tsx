"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Leaf, Newspaper } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  /* fetch once on mount */
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/news")
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const data = await res.json()
        setNews(data.news ?? [])
      } catch (err) {
        setError("Could not load news at this time.")
        console.error(err) // dev log
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* nav bar */}
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <Link href="/home" className="flex items-center">
            <ArrowLeft className="h-5 w-5 text-muted-foreground mr-2" />
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold">AgriSmart</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Agricultural News</h1>
          <p className="text-muted-foreground">Stay updated with the latest in agriculture &amp; climate</p>
        </header>

        {/* states */}
        {loading && <p className="text-center text-muted-foreground">Loading latest news…</p>}

        {error && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 text-center">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <section className="space-y-6">
            {news.map((article, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-1 line-clamp-2">{article.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.date)}
                    <Badge variant="secondary" className="ml-2">
                      Agriculture
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">{article.snippet}</CardDescription>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(article.url, "_blank")}
                    className="flex items-center"
                  >
                    Read Full Article <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
