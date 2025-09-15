"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PollutantBreakdown as PollutantBreakdownType } from "@/lib/aqi-api"

interface PollutantBreakdownProps {
  pollutantBreakdown: PollutantBreakdownType
  className?: string
}

export function PollutantBreakdown({ pollutantBreakdown, className }: PollutantBreakdownProps) {
  const getStatusColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "good":
        return { bg: "#10b981", text: "text-green-600" }
      case "moderate":
        return { bg: "#f59e0b", text: "text-yellow-600" }
      case "unhealthy for sensitive groups":
        return { bg: "#f97316", text: "text-orange-600" }
      case "unhealthy":
        return { bg: "#ef4444", text: "text-red-600" }
      case "very unhealthy":
        return { bg: "#8b5cf6", text: "text-purple-600" }
      case "hazardous":
        return { bg: "#dc2626", text: "text-red-800" }
      default:
        return { bg: "#6b7280", text: "text-gray-600" }
    }
  }

  const pollutants = [
    { key: "PM2_5", name: "PM2.5", data: pollutantBreakdown.PM2_5 },
    { key: "PM10", name: "PM10", data: pollutantBreakdown.PM10 },
    { key: "O3", name: "O3", data: pollutantBreakdown.O3 },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pollutant Breakdown</CardTitle>
        <CardDescription>Individual pollutant levels contributing to overall AQI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {pollutants.map((pollutant) => {
            // Add safety check for undefined data
            if (!pollutant.data) {
              return (
                <div key={pollutant.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{pollutant.name}</span>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Loading...
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      - -
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500 ease-out bg-muted"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Loading data...</p>
                </div>
              )
            }
            
            const statusColor = getStatusColor(pollutant.data.category)
            return (
              <div key={pollutant.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pollutant.name}</span>
                    <Badge variant="outline" className={`text-xs ${statusColor.text}`}>
                      {pollutant.data.category}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {pollutant.data.value} {pollutant.data.unit}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min((pollutant.data.value / 100) * 100, 100)}%`,
                      backgroundColor: statusColor.bg,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{pollutant.data.description}</p>
              </div>
            )
          })}
        </div>

        {/* Dominant Pollutant */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dominant Pollutant</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {pollutantBreakdown.dominant_pollutant.name}
            </Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Contributing {pollutantBreakdown.dominant_pollutant.contribution}% to overall AQI
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
