"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AQIOverviewResponse, aqiApi } from '@/lib/aqi-api'

interface AQIContextType {
  aqiData: AQIOverviewResponse | null
  isLoading: boolean
  error: string | null
  fetchAQIData: (lat: number, lon: number, useDemo?: boolean) => Promise<void>
  clearData: () => void
  isApiHealthy: boolean
}

const AQIContext = createContext<AQIContextType | undefined>(undefined)

export function AQIProvider({ children }: { children: ReactNode }) {
  const [aqiData, setAqiData] = useState<AQIOverviewResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApiHealthy, setIsApiHealthy] = useState(false)

  // Set API as healthy by default (no health check on mount)
  useEffect(() => {
    setIsApiHealthy(true)
  }, [])

  const fetchAQIData = async (lat: number, lon: number, useDemo: boolean = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await aqiApi.getAQIOverview(lat, lon, useDemo)
      setAqiData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AQI data'
      setError(errorMessage)
      console.error('Error fetching AQI data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearData = () => {
    setAqiData(null)
    setError(null)
  }

  return (
    <AQIContext.Provider
      value={{
        aqiData,
        isLoading,
        error,
        fetchAQIData,
        clearData,
        isApiHealthy,
      }}
    >
      {children}
    </AQIContext.Provider>
  )
}

export function useAQI() {
  const context = useContext(AQIContext)
  if (context === undefined) {
    throw new Error('useAQI must be used within an AQIProvider')
  }
  return context
}
