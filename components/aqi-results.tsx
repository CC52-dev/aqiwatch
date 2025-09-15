"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wind, ArrowLeft, MapPin, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { AQIGauge } from "@/components/aqi-gauge"
import { CombinedAQIChart } from "@/components/combined-aqi-chart"
import { PollutantBreakdown } from "@/components/pollutant-breakdown"
import { TrendAnalysisComponent } from "@/components/trend-analysis"
import { HealthImpactComponent } from "@/components/health-impact"
import { AQIAlertsComponent } from "@/components/aqi-alerts"
import { useAQI } from "@/contexts/AQIContext"
import { AQIOverviewResponse } from "@/lib/aqi-api"

interface Location {
  lat: number
  lng: number
  name: string
}

interface AQIResultsProps {
  location: Location
  onBack: () => void
}

export function AQIResults({ location, onBack }: AQIResultsProps) {
  const { aqiData, isLoading, error, isApiHealthy } = useAQI()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading air quality data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Button>
                <div className="flex items-center gap-2">
                  <Wind className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold text-foreground">AqiWatch</h1>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button onClick={onBack} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!aqiData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Button>
                <div className="flex items-center gap-2">
                  <Wind className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-semibold text-foreground">AqiWatch</h1>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">No air quality data available</p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
              <div className="flex items-center gap-2">
                <Wind className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">AqiWatch</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{aqiData.location.city}</span>
              <div className="flex items-center gap-1">
                {isApiHealthy ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs">
                  {aqiData.data_source === 'real_api' ? 'Live Data' : 'Demo Data'}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Current AQI and Key Metrics */}
          <div className="grid gap-6 lg:grid-cols-3">
            <AQIGauge value={aqiData.current_aqi.value} />

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Current Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{aqiData.current_aqi.category}</div>
                    <p className="text-sm text-muted-foreground">{aqiData.current_aqi.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(aqiData.timestamp).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trend Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">{aqiData.trend_analysis.overall_trend}</div>
                  <p className="text-sm text-muted-foreground">{aqiData.trend_analysis.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {aqiData.trend_analysis.confidence}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <CombinedAQIChart 
            historicalData={aqiData.historical_data}
            predictedData={aqiData.predicted_data}
            currentAQI={aqiData.current_aqi.value}
          />

          {/* Detailed Analysis Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PollutantBreakdown pollutantBreakdown={aqiData.pollutant_breakdown} />
            <TrendAnalysisComponent trendAnalysis={aqiData.trend_analysis} />
          </div>

          {/* Health Impact and Alerts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <HealthImpactComponent healthImpact={aqiData.health_impact} />
            <AQIAlertsComponent 
              alerts={aqiData.air_quality_alerts}
              seasonalRecommendations={aqiData.seasonal_recommendations}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
