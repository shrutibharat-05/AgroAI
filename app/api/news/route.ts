import { NextResponse } from "next/server"

export async function GET() {
  try {
    const url = "https://oevortex-webscout.hf.space/api/news"
    const params = new URLSearchParams({
      q: "Agriculture farming climate crops",
      max_results: "15",
      safesearch: "moderate",
      region: "wt-wt",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        accept: "application/json",
        "User-Agent": "AgriSmart/1.0",
      },
      timeout: 10000, // 10 second timeout
    })

    if (!response.ok) {
      console.error("News API response not ok:", response.status)
      // Return fallback news data
      return NextResponse.json({ news: getFallbackNews() })
    }

    const data = await response.json()

    // Format the news data
    const formattedNews =
      data.results?.map((item: any) => ({
        title: item.title || "Agricultural News Update",
        url: item.url || "#",
        date: item.date || new Date().toISOString(),
        snippet:
          item.snippet ||
          item.description ||
          "Stay updated with the latest agricultural developments and farming techniques.",
      })) || []

    // If no news found, return fallback
    if (formattedNews.length === 0) {
      return NextResponse.json({ news: getFallbackNews() })
    }

    return NextResponse.json({ news: formattedNews })
  } catch (error) {
    console.error("News API error:", error)
    // Return fallback news data when API fails
    return NextResponse.json({ news: getFallbackNews() })
  }
}

function getFallbackNews() {
  return [
    {
      title: "Sustainable Farming Practices Gain Momentum Worldwide",
      url: "#",
      date: new Date().toISOString(),
      snippet:
        "Farmers around the globe are increasingly adopting sustainable farming practices to improve soil health and reduce environmental impact. These methods include crop rotation, cover cropping, and integrated pest management.",
    },
    {
      title: "Climate Change Adaptation Strategies for Modern Agriculture",
      url: "#",
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      snippet:
        "Agricultural experts discuss innovative strategies to help farmers adapt to changing climate conditions, including drought-resistant crops and improved water management systems.",
    },
    {
      title: "Technology Revolution in Precision Agriculture",
      url: "#",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      snippet:
        "The integration of IoT sensors, drones, and AI-powered analytics is transforming how farmers monitor crops, optimize irrigation, and predict harvest yields.",
    },
    {
      title: "Organic Farming Market Shows Strong Growth",
      url: "#",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      snippet:
        "The global organic farming market continues to expand as consumers increasingly demand sustainably produced food products, creating new opportunities for farmers.",
    },
    {
      title: "Water Conservation Techniques for Drought-Prone Regions",
      url: "#",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      snippet:
        "Innovative water conservation methods, including drip irrigation and rainwater harvesting, are helping farmers in arid regions maintain productive agricultural operations.",
    },
  ]
}
