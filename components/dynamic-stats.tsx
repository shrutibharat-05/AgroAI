"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Activity, Zap } from "lucide-react"

interface StatItem {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  change: number
}

export function DynamicStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Active Users", value: 1250, icon: <Users className="h-5 w-5" />, color: "text-blue-600", change: 12 },
    {
      label: "Weather Checks",
      value: 3420,
      icon: <Activity className="h-5 w-5" />,
      color: "text-green-600",
      change: 8,
    },
    {
      label: "AI Recommendations",
      value: 890,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
      change: 15,
    },
    { label: "System Uptime", value: 99.9, icon: <Zap className="h-5 w-5" />, color: "text-orange-600", change: 0.1 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value:
            stat.label === "System Uptime"
              ? Math.min(100, stat.value + (Math.random() - 0.5) * 0.1)
              : stat.value + Math.floor(Math.random() * 5),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={stat.color}>{stat.icon}</div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {stat.label === "System Uptime" ? `${stat.value.toFixed(1)}%` : stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}% from last hour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
