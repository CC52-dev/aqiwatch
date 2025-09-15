"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wind, MapPin } from "lucide-react"

interface Location {
  lat: number
  lng: number
  name: string
}

interface LoadingScreenProps {
  location: Location | null
}

export function LoadingScreen({ location }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-border shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <Wind className="h-16 w-16 text-primary mx-auto animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">Analyzing Air Quality</h3>
              {location && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{location.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Fetching current air quality data...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-300"></div>
                <span>Loading historical trends...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-500"></div>
                <span>Generating predictions...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
