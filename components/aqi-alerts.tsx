"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Bell, Calendar, Info, Shield, Wind } from "lucide-react"
import { AirQualityAlert } from "@/lib/aqi-api"

interface AQIAlertsProps {
  alerts: AirQualityAlert[]
  seasonalRecommendations: string[]
  className?: string
}

export function AQIAlertsComponent({ alerts, seasonalRecommendations, className }: AQIAlertsProps) {
  const getAlertIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "moderate":
        return <Info className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "moderate":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes('❄️') || recommendation.includes('Winter')) {
      return '❄️'
    } else if (recommendation.includes('🌸') || recommendation.includes('Spring')) {
      return '🌸'
    } else if (recommendation.includes('☀️') || recommendation.includes('Summer')) {
      return '☀️'
    } else if (recommendation.includes('🍂') || recommendation.includes('Fall')) {
      return '🍂'
    } else if (recommendation.includes('🔥') || recommendation.includes('heating')) {
      return '🔥'
    } else if (recommendation.includes('🌱') || recommendation.includes('outdoor')) {
      return '🌱'
    } else if (recommendation.includes('🌞') || recommendation.includes('morning')) {
      return '🌞'
    } else if (recommendation.includes('🍁') || recommendation.includes('activities')) {
      return '🍁'
    }
    return '💡'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Air Quality Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Air Quality Alerts
            </CardTitle>
            <CardDescription>Important notifications about current air quality conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} className={getAlertColor(alert.level)}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.level)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.message}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm">
                      <strong>Action:</strong> {alert.action}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Seasonal Recommendations */}
      {seasonalRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seasonal Recommendations
            </CardTitle>
            <CardDescription>Time-aware advice based on current season and conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {seasonalRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-lg">{getRecommendationIcon(recommendation)}</span>
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts Message */}
      {alerts.length === 0 && seasonalRecommendations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-sm">No alerts or special recommendations at this time</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
