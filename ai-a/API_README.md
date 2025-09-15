# AQI Prediction API Server

A Flask-based REST API server that provides comprehensive Air Quality Index (AQI) predictions and analysis based on geographical coordinates.

## Features

- **Real-time AQI Data**: Fetches current AQI data from the WAQI API
- **7-Day Predictions**: Uses machine learning to predict AQI for the next 7 days
- **Health Impact Analysis**: Provides detailed health recommendations
- **Pollutant Breakdown**: Shows PM2.5, PM10, and O₃ levels
- **Trend Analysis**: Analyzes historical and predicted trends
- **Demo Mode**: Fallback to simulated data when API is unavailable

## Quick Start

### Using Docker (Recommended)

1. **Build the Docker image:**
   ```bash
   docker build -t aqi-api .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 aqi-api
   ```

3. **Test the API:**
   ```bash
   curl "http://https://api.aqi.watch/overview?lat=37.7749&lon=-122.4194"
   ```

### Using Python directly

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python server.py
   ```

## API Endpoints

### GET /overview
Get comprehensive AQI overview for given coordinates.

**Parameters:**
- `lat` (required): Latitude (-90 to 90)
- `lon` (required): Longitude (-180 to 180)
- `use_demo` (optional): Set to `true` to use demo data

**Example:**
```bash
curl "http://https://api.aqi.watch/overview?lat=37.7749&lon=-122.4194"
```

**Response:**
```json
{
  "location": {
    "city": "San Francisco",
    "coordinates": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  },
  "current_aqi": {
    "value": 42,
    "category": "Good",
    "description": "Air quality is satisfactory for most people."
  },
  "health_impact": {
    "general_population": "Low Risk - Minimal health impacts for most people",
    "sensitive_groups": "Safe - No significant health concerns anticipated",
    "outdoor_activities": "Recommended - Safe for outdoor activities",
    "exercise": "Safe for outdoor activities",
    "ventilation": "Good time to open windows",
    "visibility": "Clear visibility conditions"
  },
  "pollutant_breakdown": {
    "PM2.5": {"value": 12.6, "unit": "μg/m³", "category": "Good"},
    "PM10": {"value": 16.8, "unit": "μg/m³", "category": "Good"},
    "O₃": {"value": 63.0, "unit": "μg/m³", "category": "Moderate"}
  },
  "trend_analysis": {
    "trend": "Stable trend",
    "description": "AQI remaining relatively stable"
  },
  "historical_data": [
    {"date": "2024-01-01", "aqi": 45, "category": "Good"},
    // ... more historical data
  ],
  "predicted_data": [
    {"date": "2024-01-08", "aqi": 44.0, "category": "Good"},
    // ... more predicted data
  ],
  "aqi_scale_reference": {
    "0-50": "Good",
    "51-100": "Moderate",
    "101-150": "Unhealthy for Sensitive Groups",
    "151-200": "Unhealthy",
    "201-300": "Very Unhealthy",
    "301+": "Hazardous"
  },
  "timestamp": "2024-01-07T10:30:00.000Z",
  "data_source": "real_api"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "predictor_loaded": true,
  "timestamp": "2024-01-07T10:30:00.000Z"
}
```

### GET /
API information and usage examples.

## Usage Examples

### Using curl

```bash
# Get AQI for San Francisco
curl "http://https://api.aqi.watch/overview?lat=37.7749&lon=-122.4194"

# Get AQI for New York
curl "http://https://api.aqi.watch/overview?lat=40.7128&lon=-74.0060"

# Use demo data
curl "http://https://api.aqi.watch/overview?lat=37.7749&lon=-122.4194&use_demo=true"

# Health check
curl "http://https://api.aqi.watch/health"
```

### Using Python requests

```python
import requests

# Get AQI data
response = requests.get("http://https://api.aqi.watch/overview", params={
    "lat": 37.7749,
    "lon": -122.4194
})

data = response.json()
print(f"Current AQI: {data['current_aqi']['value']}")
print(f"Category: {data['current_aqi']['category']}")
```

### Using JavaScript fetch

```javascript
// Get AQI data
fetch('http://https://api.aqi.watch/overview?lat=37.7749&lon=-122.4194')
  .then(response => response.json())
  .then(data => {
    console.log(`Current AQI: ${data.current_aqi.value}`);
    console.log(`Category: ${data.current_aqi.category}`);
  });
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Missing or invalid parameters
- **503 Service Unavailable**: AQI predictor not initialized
- **500 Internal Server Error**: Server-side errors

## Configuration

The API uses the following configuration:
- **Port**: 5000 (configurable in server.py)
- **API Key**: Uses the WAQI API key (hardcoded in server.py)
- **Model**: Uses the trained model from `improved_aqi_model.h5`

## Development

To modify the API:

1. Edit `server.py` to add new endpoints or modify existing ones
2. Update `requirements.txt` for new dependencies
3. Rebuild the Docker image: `docker build -t aqi-api .`
4. Test your changes: `docker run -p 5000:5000 aqi-api`

## Notes

- The API automatically falls back to demo data if the real API is unavailable
- All TensorFlow warnings and logs are suppressed for clean output
- The server runs on all interfaces (0.0.0.0) to work in Docker containers
- CORS is enabled to allow cross-origin requests from web applications