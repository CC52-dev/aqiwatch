// Geocoding service for converting addresses/city names to coordinates

export interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
  type: string;
}

export interface GeocodingError {
  error: string;
  message: string;
}

export class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org';

  async searchLocation(query: string): Promise<GeocodingResult[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: '5',
        addressdetails: '1',
        extratags: '1'
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'User-Agent': 'AqiWatch/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No locations found');
      }

      return data.map((item: any) => ({
        name: this.formatLocationName(item),
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        display_name: item.display_name,
        type: item.type || 'location'
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to search for location'
      );
    }
  }

  private formatLocationName(item: any): string {
    const address = item.address || {};
    
    // Try to create a clean location name
    if (address.city && address.country) {
      return `${address.city}, ${address.country}`;
    } else if (address.town && address.country) {
      return `${address.town}, ${address.country}`;
    } else if (address.village && address.country) {
      return `${address.village}, ${address.country}`;
    } else if (address.state && address.country) {
      return `${address.state}, ${address.country}`;
    } else if (address.country) {
      return address.country;
    } else {
      // Fallback to display name, truncated
      return item.display_name.split(',')[0];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: '1'
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': 'AqiWatch/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.lat || !data.lon) {
        throw new Error('Invalid reverse geocoding response');
      }

      return {
        name: this.formatLocationName(data),
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        display_name: data.display_name,
        type: 'reverse'
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to get location name'
      );
    }
  }
}

export const geocodingService = new GeocodingService();
