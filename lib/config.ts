// Configuration for the AQI application

export const config = {
  // AQI API Configuration
  aqiApiUrl: process.env.NEXT_PUBLIC_AQI_API_URL || 'https://api.aqi.watch',
  
  // Default coordinates for demo purposes
  defaultLocation: {
    lat: 37.7749,
    lng: -122.4194,
    name: "San Francisco, CA"
  },
  
  // Fallback coordinates if geolocation fails
  fallbackLocation: {
    lat: 40.7128,
    lng: -74.0060,
    name: "New York, NY"
  }
}
