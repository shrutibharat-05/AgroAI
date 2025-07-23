/**
 * /api/news  – Fetch agricultural news.
 * 1. Try remote service (10 s timeout).
 * 2. If it fails (404, 5xx, network, timeout) return local fallback data.
 * The route itself ALWAYS responds with status 200.
 */

import { type NextRequest, NextResponse } from "next/server"

const REMOTE_URL =
  "https://oevortex-webscout.hf.space/api/news?q=Agriculture%20and%20climate&max_results=15&safesearch=moderate&region=wt-wt"
const TIMEOUT_MS = 10_000

export async function GET(_req: NextRequest) {
  // ── 1 ▸ attempt remote call with timeout
  try {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)

    const res = await fetch(REMOTE_URL, {
      headers: { accept: "application/json", "User-Agent": "AgriSmart/1.0" },
      signal: ac.signal,
    })

    clearTimeout(timer)

    if (res.ok) {
      const json = await res.json()
      const news = formatRemote(json?.results)
      if (news.length) return NextResponse.json({ news }) // success
    } else {
      console.warn("News API responded", res.status) // eslint-disable-line no-console
    }
  } catch (err) {
    console.warn("News API fetch failed:", err) // eslint-disable-line no-console
  }

  // ── 2 ▸ remote failed - return fallback
  return NextResponse.json({ news: FALLBACK_NEWS })
}

/* helper – format upstream data into our shape */
function formatRemote(results: any[] = []) {
  return results.map((r) => ({
    title: r.title ?? "Agricultural Update",
    url: r.url ?? "#",
    date: r.date ?? new Date().toISOString(),
    snippet: r.snippet ?? r.description ?? "Latest information on agriculture and climate.",
  }))
}

/* simple local articles so UI always has content */
const FALLBACK_NEWS = [
  {
    title: "Sustainable Farming Practices Gain Momentum Worldwide",
    url: "#",
    date: new Date().toISOString(),
    snippet:
      "Farmers across the globe are adopting sustainable practices to improve soil health and reduce environmental impact.",
  },
  {
    title: "Climate-Smart Agriculture Strategies for 2025",
    url: "#",
    date: new Date(Date.now() - 86_400_000).toISOString(), // 1 day ago
    snippet: "Experts outline actionable steps to help farmers adapt to changing climate conditions.",
  },
  {
    title: "AI & IoT Revolutionise Precision Farming",
    url: "#",
    date: new Date(Date.now() - 172_800_000).toISOString(), // 2 days ago
    snippet: "Advanced sensors and AI analytics are enabling real-time crop monitoring and yield prediction.",
  },
]
