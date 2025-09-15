"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AQIGaugeProps {
  value: number
  className?: string
}

const getAQILevel = (aqi: number) => {
  if (aqi <= 50)
    return {
      level: "Good",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Air quality is satisfactory",
    }
  if (aqi <= 100)
    return {
      level: "Moderate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Air quality is acceptable",
    }
  if (aqi <= 150)
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Sensitive individuals may experience problems",
    }
  if (aqi <= 200)
    return {
      level: "Unhealthy",
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Everyone may experience problems",
    }
  if (aqi <= 300)
    return {
      level: "Very Unhealthy",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Health alert for everyone",
    }
  return { level: "Hazardous", color: "text-red-800", bgColor: "bg-red-200", description: "Emergency conditions" }
}

export function AQIGauge({ value, className }: AQIGaugeProps) {
  const aqiInfo = getAQILevel(value)
  const percentage = Math.min((value / 300) * 100, 100)

  return (
    <Card className={cn("border-border", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Current AQI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(percentage / 100) * 314} 314`}
              className={cn(
                "transition-all duration-1000 ease-out",
                value <= 50
                  ? "text-green-500"
                  : value <= 100
                    ? "text-yellow-500"
                    : value <= 150
                      ? "text-orange-500"
                      : value <= 200
                        ? "text-red-500"
                        : value <= 300
                          ? "text-purple-500"
                          : "text-red-700",
              )}
              strokeLinecap="round"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">AQI</div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              aqiInfo.bgColor,
              aqiInfo.color,
            )}
          >
            {aqiInfo.level}
          </div>
          <p className="text-xs text-muted-foreground">{aqiInfo.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
