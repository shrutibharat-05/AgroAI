"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, MessageCircle, Cloud, Newspaper } from "lucide-react"

interface Activity {
  id: string
  type: "weather" | "chat" | "recommendation" | "news"
  description: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Simulate real-time activity updates
    const generateActivity = () => {
      const types: Activity["type"][] = ["weather", "chat", "recommendation", "news"]
      const descriptions = {
        weather: ["Weather check for London", "Weather alert received", "Forecast updated"],
        chat: ["Asked about tomato diseases", "Pest control inquiry", "Soil health question"],
        recommendation: ["Got advice for wheat crop", "Irrigation recommendation", "Fertilizer suggestion"],
        news: ["Read climate change article", "Market trends update", "New farming technique"],
      }

      const type = types[Math.floor(Math.random() * types.length)]
      const typeDescriptions = descriptions[type]
      const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]

      return {
        id: Date.now().toString(),
        type,
        description,
        timestamp: new Date(),
        status: Math.random() > 0.1 ? "completed" : ("pending" as Activity["status"]),
      }
    }

    // Initial activities
    const initialActivities = Array.from({ length: 5 }, generateActivity)
    setActivities(initialActivities)

    // Add new activity every 10 seconds
    const interval = setInterval(() => {
      setActivities((prev) => [generateActivity(), ...prev.slice(0, 9)])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "weather":
        return <Cloud className="h-4 w-4 text-blue-600" />
      case "chat":
        return <MessageCircle className="h-4 w-4 text-green-600" />
      case "recommendation":
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      case "news":
        return <Newspaper className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getIcon(activity.type)}
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
