"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

// Generate 7-day forecast data
const generateForecastData = () => {
  const data = []
  const now = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    // Generate realistic forecast with some variation
    const baseAQI = 42 + Math.random() * 15 - 7.5
    const aqi = Math.round(baseAQI + Math.sin(i * 0.8) * 8)
    const confidence = Math.round(95 - i * 3) // Confidence decreases over time

    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      aqi: aqi,
      confidence: confidence,
      day: i === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" }),
    })
  }

  return data
}

interface AQIForecastChartProps {
  className?: string
}

export function AQIForecastChart({ className }: AQIForecastChartProps) {
  const data = generateForecastData()
  const trend = data[6].aqi - data[0].aqi
  const maxAqi = Math.max(...data.map((d) => d.aqi))

  const getTrendIcon = () => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend < -5) return <TrendingDown className="h-4 w-4 text-green-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const getTrendText = () => {
    if (trend > 5) return "Worsening trend"
    if (trend < -5) return "Improving trend"
    return "Stable conditions"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          7-Day AQI Forecast
          <div className="flex items-center gap-1 text-sm font-normal">
            {getTrendIcon()}
            <span className="text-muted-foreground">{getTrendText()}</span>
          </div>
        </CardTitle>
        <CardDescription>Predicted air quality levels with confidence intervals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-1 p-4 bg-muted/20 rounded-lg relative">
          {/* Grid lines */}
          <div className="absolute inset-4 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-px bg-border/30" />
            ))}
          </div>

          {/* Data points and connecting line */}
          <svg
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              points={data
                .map((point, index) => `${(index / (data.length - 1)) * 100},${100 - (point.aqi / maxAqi) * 80}`)
                .join(" ")}
            />
            {data.map((point, index) => (
              <circle
                key={index}
                cx={(index / (data.length - 1)) * 100}
                cy={100 - (point.aqi / maxAqi) * 80}
                r="2"
                fill="hsl(var(--primary))"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          {/* Labels */}
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1 relative z-10">
              <div className="text-xs font-medium text-primary">{point.aqi}</div>
              <div className="text-xs text-muted-foreground mt-auto">{point.day}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-xs">
          {data.map((day, index) => (
            <div key={index} className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium">{day.day}</div>
              <div className="text-primary font-bold">{day.aqi}</div>
              <div className="text-muted-foreground">{day.confidence}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
