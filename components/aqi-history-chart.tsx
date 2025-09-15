"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Generate historical data for the past 7 days
const generateHistoricalData = () => {
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate realistic AQI values with some variation
    const baseAQI = 45 + Math.random() * 20
    const aqi = Math.round(baseAQI + Math.sin(i * 0.5) * 10)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      aqi: aqi,
      fullDate: date.toISOString().split("T")[0],
    })
  }

  return data
}

interface AQIHistoryChartProps {
  className?: string
}

export function AQIHistoryChart({ className }: AQIHistoryChartProps) {
  const data = generateHistoricalData()
  const maxAqi = Math.max(...data.map((d) => d.aqi))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>7-Day AQI History</CardTitle>
        <CardDescription>Air quality trends for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end justify-between gap-2 p-4 bg-muted/20 rounded-lg">
          {data.map((point, index) => (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="text-xs font-medium text-primary">{point.aqi}</div>
              <div
                className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out"
                style={{
                  height: `${(point.aqi / maxAqi) * 150}px`,
                  backgroundColor: point.aqi > 50 ? "#f59e0b" : "#10b981",
                }}
              />
              <div className="text-xs text-muted-foreground">{point.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
