// AQI API service for fetching data from the Python server

export type AQILocation = {
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export type CurrentAQI = {
  value: number;
  category: string;
  description: string;
}

export type HealthImpact = {
  general_population: string;
  sensitive_groups: string;
  outdoor_activities: string;
  exercise: string;
  ventilation: string;
  visibility: string;
  recommendations: string[];
}

export type PollutantData = {
  value: number;
  unit: string;
  category: string;
  description: string;
}

export type PollutantBreakdown = {
  PM2_5: PollutantData;
  'PM2.5': PollutantData;
  PM10: PollutantData;
  O3: PollutantData;
  dominant_pollutant: {
    name: string;
    value: number;
    contribution: number;
  };
}

export type TrendAnalysis = {
  overall_trend: string;
  description: string;
  trend_strength: string;
  historical_change: number;
  predicted_change: number;
  volatility: number;
  pattern: string;
  confidence: string;
}

export type AirQualityAlert = {
  level: string;
  type: string;
  message: string;
  action: string;
}

export type AQIDataPoint = {
  date: string;
  aqi: number;
  category: string;
}

export type AQIOverviewResponse = {
  location: AQILocation;
  current_aqi: CurrentAQI;
  health_impact: HealthImpact;
  pollutant_breakdown: PollutantBreakdown;
  trend_analysis: TrendAnalysis;
  air_quality_alerts: AirQualityAlert[];
  seasonal_recommendations: string[];
  historical_data: AQIDataPoint[];
  predicted_data: AQIDataPoint[];
  aqi_scale_reference: Record<string, string>;
  timestamp: string;
  data_source: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_AQI_API_URL || '/api/aqi';

export class AQIApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getAQIOverview(lat: number, lon: number, useDemo: boolean = false): Promise<AQIOverviewResponse> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        ...(useDemo && { use_demo: 'true' })
      });

      const response = await fetch(`${this.baseUrl}/overview?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching AQI data:', error);
      throw new Error(`Failed to fetch AQI data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getHealthCheck(): Promise<{ status: string; predictor_loaded: boolean; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw new Error(`Failed to check API health: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a default instance
export const aqiApi = new AQIApiService();
