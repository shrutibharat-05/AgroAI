import { NextResponse } from "next/server"

export async function GET() {
  try {
    const url = "https://oevortex-webscout.hf.space/api/news"
    const params = new URLSearchParams({
      q: "Agriculture and climate",
      max_results: "10",
      safesearch: "moderate",
      region: "wt-wt",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch news" }, { status: response.status })
    }

    const data = await response.json()

    // Format the news data
    const formattedNews =
      data.results?.map((item: any) => ({
        title: item.title,
        url: item.url,
        date: item.date,
        snippet: item.snippet || item.description || "No description available",
      })) || []

    return NextResponse.json({ news: formattedNews })
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while fetching news" }, { status: 500 })
  }
}
