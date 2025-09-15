"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Wind, MapPin, Search, Loader2, ArrowLeft, TrendingDown, Shield, Activity, Eye, Info, Target, Users, Globe, Database, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import ElectricBorder from "@/components/ElectricBorder"
import { AQIProvider, useAQI } from "@/contexts/AQIContext"
import { AQIResults } from "@/components/aqi-results"
import { geocodingService, GeocodingResult } from "@/lib/geocoding"

interface Location {
  lat: number
  lng: number
  name: string
}

function HomePageContent() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<GeocodingResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { aqiData, fetchAQIData, isApiHealthy } = useAQI()

  // Add error boundary protection
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Ignore extension-related errors
      if (event.filename?.includes('extensionServiceWorker.js') || 
          event.message?.includes('ton') ||
          event.message?.includes('disconnected port')) {
        event.preventDefault()
        console.warn('Extension error suppressed:', event.message)
        return false
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Ignore extension-related promise rejections
      if (event.reason?.message?.includes('ton') ||
          event.reason?.message?.includes('disconnected port')) {
        event.preventDefault()
        console.warn('Extension promise rejection suppressed:', event.reason)
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const handleLocationSelect = async (location: Location) => {
    setSelectedLocation(location)
    setIsLoading(true)
    try {
      // Fetch AQI data for the selected location
      await fetchAQIData(location.lat, location.lng, !isApiHealthy)
      setShowResults(true)
    } catch (error) {
      console.error('Error fetching AQI data:', error)
    } finally {
    setIsLoading(false)
    }
  }

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get location name using reverse geocoding
            const locationData = await geocodingService.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            )
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: locationData.name,
            }
            handleLocationSelect(location)
          } catch (error) {
            console.warn('Reverse geocoding error:', error)
            // Fallback to generic name if reverse geocoding fails
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              name: "Current Location",
            }
            handleLocationSelect(location)
          }
        },
        (error) => {
          console.warn('Geolocation error:', error)
          const fallback = { lat: 40.7128, lng: -74.006, name: "New York, NY" }
          handleLocationSelect(fallback)
        },
      )
    } else {
      const fallback = { lat: 40.7128, lng: -74.006, name: "New York, NY" }
      handleLocationSelect(fallback)
    }
  }

  const handleSearchInput = async (query: string) => {
    setSearchQuery(query)
    
    if (query.trim().length < 3) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await geocodingService.searchLocation(query)
      setSearchSuggestions(results)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSuggestionSelect = (suggestion: GeocodingResult) => {
    const location = {
      lat: suggestion.lat,
      lng: suggestion.lng,
      name: suggestion.name,
    }
    setSearchQuery(suggestion.name)
    setShowSuggestions(false)
    handleLocationSelect(location)
  }

  const handleSearch = () => {
    if (searchQuery.trim() && searchSuggestions.length > 0) {
      handleSuggestionSelect(searchSuggestions[0])
    }
  }

  const handleBackToSearch = () => {
    setShowResults(false)
    setSelectedLocation(null)
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ElectricBorder
          className="w-full max-w-lg"
          color="#7df9ff"
          speed={1}
          chaos={0.5}
          thickness={1}
          style={{ borderRadius: 16 }}
        >
          <Card className="w-full border-0 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wind className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  Analyzing Air Quality
                </h3>
                <p className="text-muted-foreground text-lg">
                  Gathering comprehensive data for{" "}
                  <span className="font-semibold text-foreground">{selectedLocation?.name}</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full animate-pulse"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">Processing environmental data...</p>
              </div>
            </CardContent>
          </Card>
        </ElectricBorder>
      </div>
    )
  }

  if (showResults && selectedLocation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wind className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  AqiWatch
                </h1>
                <p className="text-muted-foreground">
                  {aqiData?.location?.city || selectedLocation.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                onClick={handleBackToSearch}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout with Real Data */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* AQI Status Card - Top Left */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="h-fit">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="relative">
                    <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center ${
                      (aqiData?.current_aqi?.value ?? 0) <= 50 ? 'bg-green-100 dark:bg-green-900/20' :
                      (aqiData?.current_aqi?.value ?? 0) <= 100 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      (aqiData?.current_aqi?.value ?? 0) <= 150 ? 'bg-orange-100 dark:bg-orange-900/20' :
                      (aqiData?.current_aqi?.value ?? 0) <= 200 ? 'bg-red-100 dark:bg-red-900/20' :
                      'bg-purple-100 dark:bg-purple-900/20'
                    }`}>
                      <div className={`text-4xl font-bold ${
                        (aqiData?.current_aqi?.value ?? 0) <= 50 ? 'text-green-600 dark:text-green-400' :
                        (aqiData?.current_aqi?.value ?? 0) <= 100 ? 'text-yellow-600 dark:text-yellow-400' :
                        (aqiData?.current_aqi?.value ?? 0) <= 150 ? 'text-orange-600 dark:text-orange-400' :
                        (aqiData?.current_aqi?.value ?? 0) <= 200 ? 'text-red-600 dark:text-red-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {aqiData?.current_aqi?.value || '--'}
                      </div>
                    </div>
                    <Badge className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${
                      (aqiData?.current_aqi?.value ?? 0) <= 50 ? 'bg-green-500' :
                      (aqiData?.current_aqi?.value ?? 0) <= 100 ? 'bg-yellow-500' :
                      (aqiData?.current_aqi?.value ?? 0) <= 150 ? 'bg-orange-500' :
                      (aqiData?.current_aqi?.value ?? 0) <= 200 ? 'bg-red-500' :
                      'bg-purple-500'
                    } text-white`}>
                      {aqiData?.current_aqi?.category || 'Loading...'}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Air Quality Index</h3>
                    <p className="text-sm text-muted-foreground">
                      {aqiData?.current_aqi?.description || 'Loading air quality data...'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Conditions Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Trends and Predictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg backdrop-blur-sm shadow-inner">
                    <div className="flex items-center gap-3 text-sm">
                      <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {aqiData?.trend_analysis?.overall_trend || 'Analyzing trends...'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {aqiData?.trend_analysis?.description || 'Analyzing trend patterns...'}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trend Strength:</span>
                      <span className="font-medium">{aqiData?.trend_analysis?.trend_strength || 'Analyzing...'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-medium">{aqiData?.trend_analysis?.confidence || 'Analyzing...'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volatility:</span>
                      <span className="font-medium">{aqiData?.trend_analysis?.volatility ? `${aqiData.trend_analysis.volatility.toFixed(1)}%` : 'Analyzing...'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Card - Top Right */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-xl">7-Day Air Quality Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Historical data and predictions</p>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-end justify-between gap-2 p-4 bg-muted/30 rounded-lg">
                  {aqiData?.historical_data?.concat(aqiData?.predicted_data || [])?.map((dataPoint, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 h-full">
                      <div className="text-xs font-semibold text-foreground mb-1">{dataPoint.aqi}</div>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                            index < (aqiData?.historical_data?.length || 0)
                              ? "bg-primary shadow-lg"
                              : "bg-muted-foreground/30 border-2 border-dashed border-muted-foreground/50"
                          }`}
                          style={{ height: `${(dataPoint.aqi / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground mt-2">
                        {index < (aqiData?.historical_data?.length || 0) ? `${(aqiData?.historical_data?.length || 0) - index}d` : `+${index - (aqiData?.historical_data?.length || 0) + 1}d`}
                      </span>
                    </div>
                  )) || (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="text-center space-y-2">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading chart data...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-6 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded shadow-sm"></div>
                    <span className="font-medium">Historical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted-foreground/30 border-2 border-dashed border-muted-foreground/50 rounded"></div>
                    <span className="font-medium">Predicted</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Impact Card - Bottom Left */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Health Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Main Risk Level - Left Aligned */}
                <div className="text-left">
                  <div className={`text-2xl font-bold ${
                    aqiData?.health_impact?.general_population?.includes('Low Risk') ? 'text-green-600 dark:text-green-400' :
                    aqiData?.health_impact?.general_population?.includes('Moderate Risk') ? 'text-yellow-600 dark:text-yellow-400' :
                    aqiData?.health_impact?.general_population?.includes('High Risk') ? 'text-red-600 dark:text-red-400' :
                    'text-muted-foreground'
                  }`}>
                    {aqiData?.health_impact?.general_population?.includes('Low Risk') ? 'Low Risk' :
                     aqiData?.health_impact?.general_population?.includes('Moderate Risk') ? 'Moderate Risk' :
                     aqiData?.health_impact?.general_population?.includes('High Risk') ? 'High Risk' :
                     'Analyzing...'}
                  </div>
                </div>

                {/* Caution Text Only */}
                <div className="space-y-2">
                  <div className="py-2 px-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {aqiData?.health_impact?.sensitive_groups || 'Loading health data...'}
                    </p>
                  </div>
                  
                  <div className="py-2 px-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {aqiData?.health_impact?.outdoor_activities || 'Loading activity data...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Card - Bottom Right */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Exercise</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{aqiData?.health_impact?.exercise || 'Loading...'}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Wind className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Ventilation</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{aqiData?.health_impact?.ventilation || 'Loading...'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Visibility</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{aqiData?.health_impact?.visibility || 'Loading...'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pollutant Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-foreground">PM2.5</h4>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {aqiData?.pollutant_breakdown?.PM2_5?.value || aqiData?.pollutant_breakdown?.['PM2.5']?.value || '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aqiData?.pollutant_breakdown?.PM2_5?.unit || aqiData?.pollutant_breakdown?.['PM2.5']?.unit || 'μg/m³'} • {aqiData?.pollutant_breakdown?.PM2_5?.category || aqiData?.pollutant_breakdown?.['PM2.5']?.category || 'Loading...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-foreground">PM10</h4>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {aqiData?.pollutant_breakdown?.PM10?.value || '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aqiData?.pollutant_breakdown?.PM10?.unit || 'μg/m³'} • {aqiData?.pollutant_breakdown?.PM10?.category || 'Loading...'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-foreground">O3</h4>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {aqiData?.pollutant_breakdown?.O3?.value || '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aqiData?.pollutant_breakdown?.O3?.unit || 'μg/m³'} • {aqiData?.pollutant_breakdown?.O3?.category || 'Loading...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - 100vh */}
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center space-y-8 mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Wind className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground">
                  AqiWatch
                </h1>
                <p className="text-muted-foreground">Real-time Air Quality Monitoring</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor air quality with real-time data, AI-powered predictions, and comprehensive health insights for your location.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Features */}
          <div className="space-y-6 animate-scale-in">
            <h2 className="text-2xl font-semibold text-foreground">Why Choose AqiWatch?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Get instant air quality updates for your location</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Predictions</h3>
                  <p className="text-sm text-muted-foreground">Advanced forecasting for future air quality trends</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary/20 transition-colors">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Health Insights</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive analysis of air pollutants and their effects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <ElectricBorder
              className="w-full"
   color="#7df9ff"
   speed={1}
   chaos={0.5}
   thickness={1}
   style={{ borderRadius: 16 }}
          >
            <Card className="border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <p className="text-muted-foreground">Select your location to view air quality data</p>
              </CardHeader>
              <CardContent className="space-y-6">
              <Button
                onClick={handleCurrentLocation}
                className="w-full cursor-pointer"
                size="lg"
              >
                <MapPin className="h-5 w-5 mr-3" />
                Use Current Location
              </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">or</span>
                  </div>
                </div>

                <div className="space-y-3 relative">
                  <Input
                    placeholder="Enter city name or address..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{suggestion.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{suggestion.display_name}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Loading indicator for search */}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleSearch} 
                  disabled={!searchQuery.trim()} 
                  variant="outline" 
                  className="w-full cursor-pointer"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Location
                </Button>
              </CardContent>
            </Card>
          </ElectricBorder>
        </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto space-y-12 py-20 px-6">
        {/* About AqiWatch */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground text-balance">About AqiWatch</h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Your trusted companion for real-time air quality monitoring and health-conscious living.
          </p>
        </div>

        {/* About the Developer */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">About the Developer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Wind className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Shiv</h3>
                  <p className="text-muted-foreground">Student in California</p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  A passionate student developer from California who believes in using technology to make a positive impact on people's lives. 
                  Passionate about helping communities stay informed about their environmental health through accessible and user-friendly applications.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Connect with me:</span>
                  <a 
                    href="https://shiv.ac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    shiv.ac
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Real-Time Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Access up-to-date air quality measurements from monitoring stations worldwide, updated every hour for
                accuracy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">7-Day Predictions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Advanced forecasting models provide reliable air quality predictions to help you plan your outdoor
                activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Health Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Personalized recommendations based on current air quality levels and your health profile for safer
                outdoor experiences.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* News Scraping & Real-time Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">News Scraping</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Our system continuously scrapes environmental news and alerts from trusted sources to provide you with 
                the latest air quality updates, pollution warnings, and health advisories in real-time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Live Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                Get instant notifications about air quality changes, emergency alerts, and environmental events 
                happening in your area through our real-time monitoring system.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              AqiWatch was created to make air quality information accessible and actionable for everyone. We believe
              that understanding the air we breathe is fundamental to making informed decisions about our health and
              daily activities.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By combining real-time monitoring data with advanced prediction algorithms and news scraping technology, 
              we provide comprehensive insights that help communities stay informed about their environmental health.
            </p>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We aggregate data from government monitoring stations, satellite imagery, validated sensor
                  networks, and real-time news feeds to ensure accuracy and reliability.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Prediction Models</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our forecasting uses machine learning algorithms that consider weather patterns, seasonal trends,
                  local emission sources, and news events for precise predictions.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-foreground mb-2">News Integration</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Advanced web scraping technology monitors environmental news sources, government alerts, and 
                  health advisories to provide context for air quality data.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Real-time Processing</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our system processes data streams in real-time, combining sensor readings with news updates 
                  to deliver the most current and comprehensive air quality information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AQIProvider>
      <HomePageContent />
    </AQIProvider>
  )
}
