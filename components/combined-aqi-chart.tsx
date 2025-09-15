"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AQIDataPoint } from "@/lib/aqi-api"

interface CombinedAQIChartProps {
  historicalData?: AQIDataPoint[]
  predictedData?: AQIDataPoint[]
  currentAQI?: number
}

export function CombinedAQIChart({ 
  historicalData = [], 
  predictedData = [], 
  currentAQI = 42 
}: CombinedAQIChartProps) {
  // Combine historical and predicted data
  const combinedData = [
    ...historicalData.map((item, index) => ({
      day: index === historicalData.length - 1 ? "Yesterday" : `${historicalData.length - index} days ago`,
      value: item.aqi,
      type: "historical" as const,
      date: item.date
    })),
    { day: "Today", value: currentAQI, type: "current" as const, date: new Date().toISOString().split('T')[0] },
    ...predictedData.map((item, index) => ({
      day: index === 0 ? "Tomorrow" : `Day +${index + 1}`,
      value: item.aqi,
      type: "prediction" as const,
      date: item.date
    }))
  ]

  const maxValue = Math.max(...combinedData.map((d) => d.value))
  const minValue = Math.min(...combinedData.map((d) => d.value))

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AQI Trends & Predictions</span>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Historical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="53.33" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 53.33 0 L 0 0 0 40"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Chart line */}
              <path
                d={combinedData
                  .map((point, index) => {
                    const x = (index / (combinedData.length - 1)) * 750 + 25
                    const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="drop-shadow-sm"
              />

              {/* Data points */}
              {combinedData.map((point, index) => {
                const x = (index / (combinedData.length - 1)) * 750 + 25
                const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160
                let color = "hsl(var(--primary))"
                if (point.type === "current") color = "hsl(25 95% 53%)" // orange
                if (point.type === "prediction") color = "hsl(217 91% 60%)" // blue

                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="4" fill={color} className="drop-shadow-sm" />
                    <text x={x} y={y - 10} textAnchor="middle" className="text-xs fill-foreground font-medium">
                      {point.value}
                    </text>
                  </g>
                )
              })}

              {/* Divider line between historical and predictions */}
              <line
                x1={(7 / (combinedData.length - 1)) * 750 + 25}
                y1="20"
                x2={(7 / (combinedData.length - 1)) * 750 + 25}
                y2="180"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
            </svg>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground px-6">
            <span>7 days ago</span>
            <span className="font-medium">Today</span>
            <span>+7 days</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">39</div>
              <div className="text-xs text-muted-foreground">7-day avg</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">42</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">44</div>
              <div className="text-xs text-muted-foreground">Predicted avg</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
