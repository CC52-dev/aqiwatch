"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Users, Activity, Eye, Wind, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { HealthImpact } from "@/lib/aqi-api"

interface HealthImpactProps {
  healthImpact: HealthImpact
  className?: string
}

export function HealthImpactComponent({ healthImpact, className }: HealthImpactProps) {
  const getRiskLevel = (text: string) => {
    if (text.toLowerCase().includes('low risk') || text.toLowerCase().includes('safe')) {
      return { level: 'low', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle }
    } else if (text.toLowerCase().includes('moderate risk') || text.toLowerCase().includes('caution')) {
      return { level: 'moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle }
    } else {
      return { level: 'high', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle }
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes('🌱') || recommendation.includes('Great time')) {
      return '🌱'
    } else if (recommendation.includes('⚠️') || recommendation.includes('deteriorating')) {
      return '⚠️'
    } else if (recommendation.includes('🔮') || recommendation.includes('expected')) {
      return '🔮'
    } else if (recommendation.includes('🏠') || recommendation.includes('purifiers')) {
      return '🏠'
    } else if (recommendation.includes('😷') || recommendation.includes('masks')) {
      return '😷'
    } else if (recommendation.includes('🚫') || recommendation.includes('Avoid')) {
      return '🚫'
    } else if (recommendation.includes('🏥') || recommendation.includes('Monitor')) {
      return '🏥'
    } else if (recommendation.includes('🪟') || recommendation.includes('windows')) {
      return '🪟'
    } else if (recommendation.includes('🌅') || recommendation.includes('Morning')) {
      return '🌅'
    } else if (recommendation.includes('🌆') || recommendation.includes('Evening')) {
      return '🌆'
    }
    return '💡'
  }

  const generalRisk = getRiskLevel(healthImpact.general_population)
  const sensitiveRisk = getRiskLevel(healthImpact.sensitive_groups)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Health Impact Assessment
        </CardTitle>
        <CardDescription>Health recommendations based on current air quality conditions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Levels */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">General Population</span>
            </div>
            <Alert className={`${generalRisk.bgColor} border-0`}>
              <generalRisk.icon className="h-4 w-4" />
              <AlertDescription className={generalRisk.color}>
                {healthImpact.general_population}
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sensitive Groups</span>
            </div>
            <Alert className={`${sensitiveRisk.bgColor} border-0`}>
              <sensitiveRisk.icon className="h-4 w-4" />
              <AlertDescription className={sensitiveRisk.color}>
                {healthImpact.sensitive_groups}
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Activity Guidelines */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Activity Guidelines</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Outdoor Activities</span>
                <p className="text-sm">{healthImpact.outdoor_activities}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Exercise</span>
                <p className="text-sm">{healthImpact.exercise}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wind className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Ventilation</span>
                <p className="text-sm">{healthImpact.ventilation}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Visibility</span>
                <p className="text-sm">{healthImpact.visibility}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Recommendations */}
        {healthImpact.recommendations && healthImpact.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Dynamic Recommendations</h4>
            <div className="space-y-2">
              {healthImpact.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                  <span className="text-sm">{getRecommendationIcon(recommendation)}</span>
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
