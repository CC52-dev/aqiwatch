# AQI Website Integration

This document describes the complete integration of the AQI prediction API into the main website.

## 🚀 **Integration Overview**

The website now provides comprehensive air quality analysis with real-time data from the Python AQI server, including:

- **Real-time AQI data** from the WAQI API
- **7-day predictions** using machine learning
- **Dynamic health recommendations** based on trends and conditions
- **Comprehensive trend analysis** with confidence levels
- **Air quality alerts** and seasonal recommendations
- **Detailed pollutant breakdown** with dominant pollutant analysis

## 📁 **New Files Created**

### **API Integration**
- `lib/aqi-api.ts` - TypeScript API service for communicating with the Python server
- `lib/config.ts` - Configuration settings for the application
- `contexts/AQIContext.tsx` - React context for managing AQI state

### **New Components**
- `components/trend-analysis.tsx` - Comprehensive trend analysis display
- `components/health-impact.tsx` - Dynamic health impact with recommendations
- `components/aqi-alerts.tsx` - Air quality alerts and seasonal recommendations

### **Updated Components**
- `components/aqi-results.tsx` - Updated to use real API data
- `components/pollutant-breakdown.tsx` - Updated to use real pollutant data
- `components/combined-aqi-chart.tsx` - Updated to accept real data
- `app/page.tsx` - Integrated with AQI context and API calls

## 🔧 **Setup Instructions**

### **1. Start the AQI API Server**
```bash
cd ai-a
python server.py
```
The server will run on `http://localhost:5000`

### **2. Start the Next.js Website**
```bash
npm run dev
# or
pnpm dev
```
The website will run on `http://localhost:3000`

### **3. Environment Configuration**
Create a `.env.local` file (optional):
```env
NEXT_PUBLIC_AQI_API_URL=http://localhost:5000
```

## 🎯 **Features Implemented**

### **1. Real-time Data Integration**
- ✅ Fetches live AQI data from WAQI API
- ✅ Falls back to demo data if API is unavailable
- ✅ Shows API health status in the UI

### **2. Comprehensive Analysis**
- ✅ **Current AQI**: Real-time air quality index with category
- ✅ **Trend Analysis**: Historical and predicted trends with confidence levels
- ✅ **Health Impact**: Dynamic recommendations based on conditions
- ✅ **Pollutant Breakdown**: PM2.5, PM10, O₃ with dominant pollutant analysis
- ✅ **Air Quality Alerts**: Real-time warnings and notifications
- ✅ **Seasonal Recommendations**: Time-aware advice

### **3. Interactive Features**
- ✅ **Location Search**: Search for any location worldwide
- ✅ **Current Location**: Use device geolocation
- ✅ **Demo Mode**: Fallback when API is unavailable
- ✅ **Loading States**: Smooth loading indicators
- ✅ **Error Handling**: Graceful error messages

### **4. Data Visualization**
- ✅ **AQI Gauge**: Circular progress indicator
- ✅ **Historical Chart**: 7-day historical data
- ✅ **Prediction Chart**: 7-day ML predictions
- ✅ **Combined Chart**: Historical + predicted data
- ✅ **Pollutant Bars**: Individual pollutant levels

## 📊 **API Endpoints Used**

### **GET /overview**
- **Purpose**: Get comprehensive AQI data for coordinates
- **Parameters**: `lat`, `lon`, `use_demo` (optional)
- **Response**: Complete AQI analysis with all features

### **GET /health**
- **Purpose**: Check API server health
- **Response**: Server status and predictor availability

## 🎨 **UI Components Structure**

```
HomePage
├── AQIProvider (Context)
└── HomePageContent
    ├── Search Interface
    └── AQIResults (when data loaded)
        ├── AQIGauge (Current AQI)
        ├── Current Conditions Card
        ├── Trend Summary Card
        ├── CombinedAQIChart (Historical + Predicted)
        ├── PollutantBreakdown (PM2.5, PM10, O₃)
        ├── TrendAnalysisComponent (Detailed trends)
        ├── HealthImpactComponent (Health recommendations)
        └── AQIAlertsComponent (Alerts + Seasonal advice)
```

## 🔄 **Data Flow**

1. **User searches** for a location or uses current location
2. **Location coordinates** are passed to the AQI API
3. **API fetches** real-time data from WAQI and generates predictions
4. **Response data** is stored in React context
5. **Components render** with real data and dynamic features
6. **User sees** comprehensive air quality analysis

## 🚨 **Error Handling**

- **API Unavailable**: Falls back to demo data with warning
- **Network Errors**: Shows error message with retry option
- **Invalid Coordinates**: Validates coordinate ranges
- **Loading States**: Shows loading indicators during data fetch

## 🎯 **Key Features**

### **Dynamic Health Recommendations**
- Adapts to current AQI levels
- Considers historical and predicted trends
- Provides time-based advice (morning/evening)
- Includes seasonal considerations

### **Comprehensive Trend Analysis**
- Historical change metrics
- Predicted future changes
- Volatility analysis
- Pattern recognition (Consistent/Variable)
- Confidence levels (Low/Medium/High)

### **Real-time Alerts**
- Critical alerts for hazardous conditions
- Trend warnings for deteriorating air quality
- Time-based alerts for specific periods
- Seasonal recommendations

### **Pollutant Analysis**
- Individual pollutant levels (PM2.5, PM10, O₃)
- Dominant pollutant identification
- Health impact descriptions
- Category-based color coding

## 🔧 **Configuration Options**

### **API URL**
Set `NEXT_PUBLIC_AQI_API_URL` environment variable to change the API endpoint.

### **Default Locations**
Modify `lib/config.ts` to change default and fallback locations.

### **Demo Mode**
The system automatically uses demo data when the API is unavailable.

## 🚀 **Usage Examples**

### **Search for Location**
1. Enter city name in search box
2. Click "Search Location"
3. View comprehensive AQI analysis

### **Use Current Location**
1. Click "Use Current Location"
2. Allow geolocation permission
3. View AQI data for your location

### **View Detailed Analysis**
- **Current AQI**: See real-time air quality
- **Trends**: View historical and predicted changes
- **Health**: Get personalized recommendations
- **Pollutants**: See individual pollutant levels
- **Alerts**: Check for important notifications

## 🎉 **Success!**

The AQI website is now fully integrated with the Python API server, providing users with comprehensive, real-time air quality analysis powered by machine learning predictions and dynamic health recommendations!
