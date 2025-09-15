"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

// Generate 24-hour forecast data
const generateHourlyData = () => {
  const data = []
  const now = new Date()

  for (let i = 0; i < 24; i++) {
    const time = new Date(now)
    time.setHours(time.getHours() + i)

    // Generate realistic hourly variation (higher during day, lower at night)
    const hour = time.getHours()
    const dayFactor = Math.sin(((hour - 6) * Math.PI) / 12) * 0.3 + 0.7
    const baseAQI = 42 * dayFactor + Math.random() * 8 - 4

    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      aqi: Math.round(Math.max(15, baseAQI)),
      hour: hour,
      fullTime: time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    })
  }

  return data
}

interface HourlyForecastProps {
  className?: string
}

export function HourlyForecast({ className }: HourlyForecastProps) {
  const data = generateHourlyData()
  const maxAqi = Math.max(...data.map((d) => d.aqi))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          24-Hour Forecast
        </CardTitle>
        <CardDescription>Hourly AQI predictions for the next day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end gap-1 p-4 bg-muted/20 rounded-lg relative overflow-hidden">
          {/* Area fill effect */}
          <svg
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <polygon
              fill="url(#areaGradient)"
              points={`0,100 ${data
                .map((point, index) => `${(index / (data.length - 1)) * 100},${100 - (point.aqi / maxAqi) * 80}`)
                .join(" ")} 100,100`}
            />
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              points={data
                .map((point, index) => `${(index / (data.length - 1)) * 100},${100 - (point.aqi / maxAqi) * 80}`)
                .join(" ")}
            />
          </svg>

          {/* Hour labels */}
          <div className="absolute bottom-0 left-4 right-4 flex justify-between text-xs text-muted-foreground">
            {data
              .filter((_, i) => i % 4 === 0)
              .map((point, index) => (
                <span key={index}>{point.time}</span>
              ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Peak:</span> {Math.max(...data.map((d) => d.aqi))} AQI
          </div>
          <div>
            <span className="font-medium">Low:</span> {Math.min(...data.map((d) => d.aqi))} AQI
          </div>
          <div>
            <span className="font-medium">Avg:</span>{" "}
            {Math.round(data.reduce((sum, d) => sum + d.aqi, 0) / data.length)} AQI
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
