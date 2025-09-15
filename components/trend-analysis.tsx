"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Activity, BarChart3, Target } from "lucide-react"
import { TrendAnalysis } from "@/lib/aqi-api"

interface TrendAnalysisProps {
  trendAnalysis: TrendAnalysis
  className?: string
}

export function TrendAnalysisComponent({ trendAnalysis, className }: TrendAnalysisProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Improving":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "Deteriorating":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "Improving":
        return "bg-green-100 text-green-800 border-green-200"
      case "Deteriorating":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case "Consistent":
        return "bg-blue-100 text-blue-800"
      case "Moderately Variable":
        return "bg-yellow-100 text-yellow-800"
      case "Highly Variable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Trend Analysis
        </CardTitle>
        <CardDescription>Comprehensive analysis of air quality trends and patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Trend */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Trend</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(trendAnalysis.overall_trend)}
              <Badge className={getTrendColor(trendAnalysis.overall_trend)}>
                {trendAnalysis.overall_trend}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{trendAnalysis.description}</p>
        </div>

        {/* Trend Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Strength</span>
            </div>
            <Badge variant="outline" className="w-full justify-center">
              {trendAnalysis.trend_strength}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Confidence</span>
            </div>
            <Badge className={`w-full justify-center ${getConfidenceColor(trendAnalysis.confidence)}`}>
              {trendAnalysis.confidence}
            </Badge>
          </div>
        </div>

        {/* Change Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Change Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Historical Change</span>
              <div className={`text-lg font-semibold ${
                trendAnalysis.historical_change > 0 ? 'text-red-600' : 
                trendAnalysis.historical_change < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {trendAnalysis.historical_change > 0 ? '+' : ''}{trendAnalysis.historical_change} pts
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Predicted Change</span>
              <div className={`text-lg font-semibold ${
                trendAnalysis.predicted_change > 0 ? 'text-red-600' : 
                trendAnalysis.predicted_change < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {trendAnalysis.predicted_change > 0 ? '+' : ''}{trendAnalysis.predicted_change} pts
              </div>
            </div>
          </div>
        </div>

        {/* Volatility and Pattern */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Pattern Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Volatility</span>
              <div className="text-lg font-semibold">{trendAnalysis.volatility}</div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Pattern</span>
              <Badge className={getPatternColor(trendAnalysis.pattern)}>
                {trendAnalysis.pattern}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
