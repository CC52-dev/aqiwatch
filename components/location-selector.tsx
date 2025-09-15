"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Loader2 } from "lucide-react"

interface Location {
  lat: number
  lng: number
  name: string
}

interface LocationSelectorProps {
  onLocationSelect: (location: Location) => void
  selectedLocation: Location | null
}

export function LocationSelector({ onLocationSelect, selectedLocation }: LocationSelectorProps) {
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [geoError, setGeoError] = useState<string | null>(null)

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by this browser")
      return
    }

    setIsLoadingGeo(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Simulate reverse geocoding to get location name
        const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`

        onLocationSelect({
          lat: latitude,
          lng: longitude,
          name: locationName,
        })
        setIsLoadingGeo(false)
      },
      (error) => {
        setGeoError("Unable to retrieve your location. Please try manual selection.")
        setIsLoadingGeo(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const handleManualSearch = () => {
    if (!searchQuery.trim()) return

    // Simulate geocoding - in real app, you'd use a geocoding service
    const mockLocations = [
      { lat: 40.7128, lng: -74.006, name: "New York, NY" },
      { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA" },
      { lat: 41.8781, lng: -87.6298, name: "Chicago, IL" },
      { lat: 29.7604, lng: -95.3698, name: "Houston, TX" },
      { lat: 39.9526, lng: -75.1652, name: "Philadelphia, PA" },
    ]

    const found = mockLocations.find((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))

    if (found) {
      onLocationSelect(found)
      setSearchQuery("")
      setShowManualInput(false)
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Select Your Location
        </CardTitle>
        <CardDescription>Choose your location to get personalized air quality data and forecasts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedLocation && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Selected: {selectedLocation.name}</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Button
            size="lg"
            className="h-16 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleCurrentLocation}
            disabled={isLoadingGeo}
          >
            <div className="flex flex-col items-center gap-1">
              {isLoadingGeo ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
              <span>{isLoadingGeo ? "Getting Location..." : "Use Current Location"}</span>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-16 border-border hover:bg-accent/10 bg-transparent"
            onClick={() => setShowManualInput(!showManualInput)}
          >
            <div className="flex flex-col items-center gap-1">
              <Search className="h-5 w-5" />
              <span>Search Location</span>
            </div>
          </Button>
        </div>

        {geoError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{geoError}</p>
          </div>
        )}

        {showManualInput && (
          <div className="space-y-3 p-4 border border-border rounded-lg bg-card/50">
            <Label htmlFor="location-search" className="text-sm font-medium">
              Search for a city or address
            </Label>
            <div className="flex gap-2">
              <Input
                id="location-search"
                placeholder="e.g., New York, Los Angeles, Chicago..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                className="flex-1"
              />
              <Button onClick={handleManualSearch} disabled={!searchQuery.trim()}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Try: New York, Los Angeles, Chicago, Houston, or Philadelphia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
