"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Wind, Droplets, Sun, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeatherFactor {
  icon: React.ReactNode
  label: string
  value: string
  impact: "positive" | "negative" | "neutral"
  description: string
}

const weatherFactors: WeatherFactor[] = [
  {
    icon: <Wind className="h-4 w-4" />,
    label: "Wind Speed",
    value: "12 mph",
    impact: "positive",
    description: "Good wind disperses pollutants",
  },
  {
    icon: <Droplets className="h-4 w-4" />,
    label: "Humidity",
    value: "65%",
    impact: "neutral",
    description: "Moderate humidity levels",
  },
  {
    icon: <Eye className="h-4 w-4" />,
    label: "Visibility",
    value: "8 miles",
    impact: "positive",
    description: "Clear atmospheric conditions",
  },
  {
    icon: <Sun className="h-4 w-4" />,
    label: "UV Index",
    value: "6 (High)",
    impact: "negative",
    description: "High UV can increase ozone formation",
  },
]

interface WeatherImpactProps {
  className?: string
}

export function WeatherImpact({ className }: WeatherImpactProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Weather Impact
        </CardTitle>
        <CardDescription>Current weather conditions affecting air quality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    factor.impact === "positive" && "bg-green-100 text-green-600",
                    factor.impact === "negative" && "bg-red-100 text-red-600",
                    factor.impact === "neutral" && "bg-gray-100 text-gray-600",
                  )}
                >
                  {factor.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{factor.label}</div>
                  <div className="text-xs text-muted-foreground">{factor.description}</div>
                </div>
              </div>
              <div className="text-sm font-medium">{factor.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Overall Impact: Favorable</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Current weather conditions are helping to maintain good air quality
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
