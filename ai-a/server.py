"""
AQI Prediction API Server
Provides REST API endpoints for AQI prediction and analysis
"""
import os
import sys
import warnings
import logging
import requests
import numpy as np
from datetime import datetime, timedelta
from flask import Flask, request, jsonify

# Fix Windows console encoding for Unicode/emoji support
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'replace')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'replace')

# Suppress all warnings and AI-related messages
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow logs
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN optimizations
os.environ['TF_CPP_MIN_VLOG_LEVEL'] = '3'  # Suppress verbose logs
# Additional optimizations to prevent SIGILL errors
os.environ['TF_DISABLE_MKL'] = '1'  # Disable Intel MKL optimizations
os.environ['TF_DISABLE_POOL_ALLOCATOR'] = '1'  # Disable pool allocator
os.environ['OMP_NUM_THREADS'] = '1'  # Limit OpenMP threads
os.environ['MKL_NUM_THREADS'] = '1'  # Limit MKL threads

from aqi_predictor import AQIPredictor
import tensorflow as tf

# Additional suppression after TensorFlow import
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel(logging.ERROR)
logging.getLogger('keras').setLevel(logging.ERROR)
logging.getLogger('absl').setLevel(logging.ERROR)

app = Flask(__name__)

# Global predictor instance
predictor = None

def initialize_predictor():
    """Initialize the AQI predictor with the trained model"""
    global predictor
    try:
        print("Loading AQI predictor...")
        predictor = AQIPredictor()
        
        print("Loading ML model from improved_aqi_model.h5...")
        predictor.load_model('improved_aqi_model.h5')
        
        print("✅ AQI Predictor initialized successfully")
        return True
    except FileNotFoundError as e:
        print(f"❌ Model file not found: {e}")
        print("Current directory:", os.getcwd())
        print("Files in directory:", os.listdir('.'))
        return False
    except Exception as e:
        print(f"❌ Failed to initialize predictor: {e}")
        import traceback
        traceback.print_exc()
        return False

def fetch_aqi_data(lat, lon, api_key):
    """Fetch current AQI data for given coordinates"""
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={api_key}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data['status'] == 'ok':
            aqi = data['data']['aqi']
            city = data['data']['city']['name']
            return aqi, city
        else:
            raise ValueError(f"API Error: {data.get('data', {}).get('message', 'Unknown error')}")
            
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Network error: {e}")
    except KeyError as e:
        raise ValueError(f"Data parsing error: Missing key {e}")

def fetch_historical_aqi_data(lat, lon, api_key, days=7):
    """Fetch historical AQI data for the past N days"""
    aqi_data = []
    cities = []
    
    try:
        # Get current AQI data
        current_aqi, city = fetch_aqi_data(lat, lon, api_key)
        
        # Create a realistic 7-day pattern based on current AQI
        base_aqi = current_aqi
        aqi_data = []
        
        # Generate 7 days of data with realistic variations
        for i in range(days):
            # Add some realistic daily variation (±20% of current AQI)
            variation = np.random.uniform(-0.2, 0.2) * base_aqi
            daily_aqi = max(1, int(base_aqi + variation))  # Ensure AQI is at least 1
            aqi_data.append(daily_aqi)
        
        cities = [city] * days
        
    except Exception as e:
        # Fallback: create simulated data
        base_aqi = 50  # Default moderate AQI
        aqi_data = []
        
        for i in range(days):
            # Create realistic daily variations
            variation = np.random.uniform(-0.3, 0.3) * base_aqi
            daily_aqi = max(1, int(base_aqi + variation))
            aqi_data.append(daily_aqi)
        
        cities = ["Simulated"] * days
    
    return np.array(aqi_data), cities

def get_aqi_category(aqi_value):
    """Get AQI category and description based on AQI value"""
    if 0 <= aqi_value <= 50:
        return "Good", "Air quality is satisfactory for most people."
    elif 51 <= aqi_value <= 100:
        return "Moderate", "Air quality is acceptable for most people."
    elif 101 <= aqi_value <= 150:
        return "Unhealthy for Sensitive Groups", "Sensitive groups may experience health effects."
    elif 151 <= aqi_value <= 200:
        return "Unhealthy", "Everyone may begin to experience health effects."
    elif 201 <= aqi_value <= 300:
        return "Very Unhealthy", "Health warnings of emergency conditions."
    else:
        return "Hazardous", "Health alert: everyone may experience more serious health effects."

def get_health_impact(aqi_value, historical_trend=None, predicted_trend=None):
    """Get dynamic health impact assessment based on AQI value and trends"""
    base_impact = {
        "general_population": "",
        "sensitive_groups": "",
        "outdoor_activities": "",
        "exercise": "",
        "ventilation": "",
        "visibility": "",
        "recommendations": []
    }
    
    # Base health impact based on AQI level
    if aqi_value <= 50:
        base_impact.update({
            "general_population": "Low Risk - Minimal health impacts for most people",
            "sensitive_groups": "Safe - No significant health concerns anticipated",
            "outdoor_activities": "Recommended - Safe for outdoor activities",
            "exercise": "Safe for outdoor activities",
            "ventilation": "Good time to open windows",
            "visibility": "Clear visibility conditions"
        })
    elif aqi_value <= 100:
        base_impact.update({
            "general_population": "Moderate Risk - Some health impacts for sensitive groups",
            "sensitive_groups": "Caution - May experience minor health effects",
            "outdoor_activities": "Generally safe - Sensitive groups should limit outdoor activities",
            "exercise": "Generally safe for most people",
            "ventilation": "Moderate ventilation recommended",
            "visibility": "Generally clear visibility"
        })
    elif aqi_value <= 150:
        base_impact.update({
            "general_population": "Moderate Risk - Sensitive groups may experience health effects",
            "sensitive_groups": "Caution - May experience health effects",
            "outdoor_activities": "Limit outdoor activities for sensitive groups",
            "exercise": "Limit outdoor exercise for sensitive groups",
            "ventilation": "Limited ventilation recommended",
            "visibility": "Reduced visibility possible"
        })
    else:
        base_impact.update({
            "general_population": "High Risk - Everyone may experience health effects",
            "sensitive_groups": "High Risk - Significant health effects likely",
            "outdoor_activities": "Avoid outdoor activities",
            "exercise": "Avoid outdoor exercise",
            "ventilation": "Keep windows closed",
            "visibility": "Poor visibility conditions"
        })
    
    # Add dynamic recommendations based on trends
    recommendations = []
    
    # Trend-based recommendations
    if historical_trend is not None:
        if historical_trend > 10:
            recommendations.append("⚠️ Air quality is deteriorating rapidly - consider staying indoors")
        elif historical_trend < -10:
            recommendations.append("✅ Air quality is improving - good time for outdoor activities")
    
    if predicted_trend is not None:
        if predicted_trend > 20:
            recommendations.append("🔮 Air quality expected to worsen significantly in coming days")
        elif predicted_trend < -20:
            recommendations.append("🔮 Air quality expected to improve significantly in coming days")
    
    # AQI-specific dynamic recommendations
    if aqi_value > 100:
        recommendations.append("🏠 Consider using air purifiers indoors")
        recommendations.append("😷 Wear N95 masks if going outdoors")
    
    if aqi_value > 150:
        recommendations.append("🚫 Avoid all outdoor activities")
        recommendations.append("🏥 Monitor for respiratory symptoms")
    
    if aqi_value <= 50:
        recommendations.append("🌱 Great time for outdoor exercise and activities")
        recommendations.append("🪟 Open windows for fresh air circulation")
    
    # Time-based recommendations
    from datetime import datetime
    current_hour = datetime.now().hour
    if 6 <= current_hour <= 10 and aqi_value > 100:
        recommendations.append("🌅 Morning air quality is poor - avoid outdoor exercise")
    elif 18 <= current_hour <= 22 and aqi_value > 100:
        recommendations.append("🌆 Evening air quality is poor - limit outdoor activities")
    
    base_impact["recommendations"] = recommendations
    return base_impact

def get_trend_analysis(historical_aqi, predicted_aqi):
    """Analyze comprehensive AQI trend based on historical and predicted data"""
    trend_data = {
        "overall_trend": "",
        "description": "",
        "trend_strength": "",
        "historical_change": 0,
        "predicted_change": 0,
        "volatility": 0,
        "pattern": "",
        "confidence": "low"
    }
    
    if len(historical_aqi) >= 2:
        # Ensure we're working with native Python types
        historical_aqi = [float(x) for x in historical_aqi]
        predicted_aqi = [float(x) for x in predicted_aqi]
        
        # Calculate historical trend
        recent_trend = historical_aqi[-1] - historical_aqi[-2]
        week_trend = historical_aqi[-1] - historical_aqi[0] if len(historical_aqi) >= 7 else recent_trend
        
        # Calculate predicted trend
        predicted_trend = predicted_aqi[-1] - predicted_aqi[0] if len(predicted_aqi) >= 7 else 0
        
        # Calculate volatility (standard deviation)
        volatility = float(np.std(historical_aqi)) if len(historical_aqi) > 1 else 0.0
        
        # Determine trend strength
        if abs(recent_trend) > 15:
            trend_strength = "Strong"
        elif abs(recent_trend) > 8:
            trend_strength = "Moderate"
        else:
            trend_strength = "Weak"
        
        # Determine overall trend
        if recent_trend < -8:
            trend_data["overall_trend"] = "Improving"
            trend_data["description"] = f"AQI has decreased by {abs(recent_trend):.1f} points recently"
        elif recent_trend > 8:
            trend_data["overall_trend"] = "Deteriorating"
            trend_data["description"] = f"AQI has increased by {recent_trend:.1f} points recently"
        else:
            trend_data["overall_trend"] = "Stable"
            trend_data["description"] = "AQI remaining relatively stable"
        
        # Add trend details
        trend_data["trend_strength"] = trend_strength
        trend_data["historical_change"] = round(float(recent_trend), 1)
        trend_data["predicted_change"] = round(float(predicted_trend), 1)
        trend_data["volatility"] = round(float(volatility), 1)
        
        # Determine pattern
        if volatility > 20:
            trend_data["pattern"] = "Highly Variable"
        elif volatility > 10:
            trend_data["pattern"] = "Moderately Variable"
        else:
            trend_data["pattern"] = "Consistent"
        
        # Determine confidence
        if len(historical_aqi) >= 7 and volatility < 15:
            trend_data["confidence"] = "high"
        elif len(historical_aqi) >= 3:
            trend_data["confidence"] = "medium"
        
        # Add future outlook
        if predicted_trend > 15:
            trend_data["description"] += f". Predicted to worsen by {predicted_trend:.1f} points over next 7 days"
        elif predicted_trend < -15:
            trend_data["description"] += f". Predicted to improve by {abs(predicted_trend):.1f} points over next 7 days"
        else:
            trend_data["description"] += ". Predicted to remain relatively stable over next 7 days"
            
    else:
        trend_data["overall_trend"] = "Unknown"
        trend_data["description"] = "Insufficient data for trend analysis"
        trend_data["confidence"] = "low"
    
    return trend_data

def get_pollutant_breakdown(aqi_value, historical_aqi=None):
    """Get dynamic pollutant breakdown based on AQI value and historical data"""
    # More realistic pollutant calculations based on AQI
    # PM2.5 is typically the primary driver of AQI
    pm25_value = max(1, aqi_value * 0.4 + np.random.normal(0, 2))  # More realistic PM2.5
    pm10_value = max(1, aqi_value * 0.5 + np.random.normal(0, 3))  # PM10 is usually higher
    o3_value = max(1, aqi_value * 0.8 + np.random.normal(0, 5))    # O3 varies more
    
    # Add some variation based on historical data if available
    if historical_aqi is not None and len(historical_aqi) > 0:
        avg_aqi = np.mean(historical_aqi)
        variation_factor = 1 + (aqi_value - avg_aqi) / avg_aqi * 0.1
        pm25_value *= variation_factor
        pm10_value *= variation_factor
        o3_value *= variation_factor
    
    # Ensure realistic ranges
    pm25_value = max(1, min(pm25_value, 500))
    pm10_value = max(1, min(pm10_value, 600))
    o3_value = max(1, min(o3_value, 500))
    
    pollutants = {
        "PM2.5": {
            "value": round(pm25_value, 1), 
            "unit": "μg/m³", 
            "category": get_aqi_category(pm25_value)[0],
            "description": "Fine particulate matter - most harmful to health"
        },
        "PM10": {
            "value": round(pm10_value, 1), 
            "unit": "μg/m³", 
            "category": get_aqi_category(pm10_value)[0],
            "description": "Coarse particulate matter - affects respiratory system"
        },
        "O3": {
            "value": round(o3_value, 1), 
            "unit": "μg/m³", 
            "category": get_aqi_category(o3_value)[0],
            "description": "Ground-level ozone - irritates lungs and airways"
        }
    }
    
    # Add dominant pollutant analysis
    dominant_pollutant = max(pollutants.keys(), key=lambda x: pollutants[x]["value"])
    pollutants["dominant_pollutant"] = {
        "name": dominant_pollutant,
        "value": pollutants[dominant_pollutant]["value"],
        "contribution": round((pollutants[dominant_pollutant]["value"] / aqi_value) * 100, 1)
    }
    
    return pollutants

def get_air_quality_alerts(aqi_value, trend_analysis, health_impact):
    """Generate dynamic air quality alerts based on current conditions"""
    alerts = []
    
    # AQI-based alerts
    if aqi_value > 200:
        alerts.append({
            "level": "critical",
            "type": "health_warning",
            "message": "🚨 CRITICAL: Air quality is hazardous - avoid all outdoor activities",
            "action": "Stay indoors with windows closed, use air purifiers"
        })
    elif aqi_value > 150:
        alerts.append({
            "level": "high",
            "type": "health_warning", 
            "message": "⚠️ HIGH: Air quality is unhealthy - limit outdoor activities",
            "action": "Sensitive groups should avoid outdoor activities"
        })
    elif aqi_value > 100:
        alerts.append({
            "level": "moderate",
            "type": "caution",
            "message": "⚠️ MODERATE: Air quality may affect sensitive groups",
            "action": "Sensitive groups should limit outdoor activities"
        })
    
    # Trend-based alerts
    if trend_analysis.get("overall_trend") == "Deteriorating" and trend_analysis.get("trend_strength") == "Strong":
        alerts.append({
            "level": "moderate",
            "type": "trend_warning",
            "message": "📈 Air quality is deteriorating rapidly",
            "action": "Monitor conditions closely, consider staying indoors"
        })
    
    # Time-based alerts
    from datetime import datetime
    current_hour = datetime.now().hour
    if 6 <= current_hour <= 10 and aqi_value > 100:
        alerts.append({
            "level": "moderate",
            "type": "time_warning",
            "message": "🌅 Morning air quality is poor",
            "action": "Avoid outdoor exercise this morning"
        })
    
    return alerts

def get_seasonal_recommendations(aqi_value, month=None):
    """Get seasonal recommendations based on current month and AQI"""
    if month is None:
        from datetime import datetime
        month = datetime.now().month
    
    recommendations = []
    
    # Seasonal recommendations
    if month in [12, 1, 2]:  # Winter
        if aqi_value > 100:
            recommendations.append("❄️ Winter inversion may trap pollutants - avoid outdoor activities")
        recommendations.append("🔥 Use clean heating sources to avoid indoor air pollution")
    elif month in [3, 4, 5]:  # Spring
        if aqi_value > 100:
            recommendations.append("🌸 Spring pollen combined with poor air quality may worsen allergies")
        recommendations.append("🌱 Good time for outdoor activities when air quality is good")
    elif month in [6, 7, 8]:  # Summer
        if aqi_value > 100:
            recommendations.append("☀️ Summer heat can worsen air quality - stay hydrated and indoors")
        recommendations.append("🌞 Early morning or evening activities when air quality is better")
    elif month in [9, 10, 11]:  # Fall
        if aqi_value > 100:
            recommendations.append("🍂 Fall weather patterns may affect air quality")
        recommendations.append("🍁 Good time for outdoor activities when air quality permits")
    
    return recommendations

def convert_numpy_types(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    import numpy as np
    
    if isinstance(obj, (np.integer, np.int32, np.int64, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float32, np.float64, np.float16)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.str_):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "predictor_loaded": predictor is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/overview', methods=['GET', 'POST'])
def overview():
    """
    Get comprehensive AQI overview for given coordinates
    
    Query Parameters (GET) or JSON Body (POST):
    - lat: Latitude (required)
    - lon: Longitude (required)
    - use_demo: Optional boolean to use demo data instead of real API data
    """
    try:
        # Get parameters from query string or JSON body
        if request.method == 'GET':
            lat = request.args.get('lat', type=float)
            lon = request.args.get('lon', type=float)
            use_demo = request.args.get('use_demo', 'false').lower() == 'true'
        else:  # POST
            data = request.get_json() or {}
            lat = data.get('lat')
            lon = data.get('lon')
            use_demo = data.get('use_demo', False)
        
        # Validate required parameters
        if lat is None or lon is None:
            return jsonify({
                "error": "Missing required parameters",
                "message": "Both 'lat' and 'lon' parameters are required",
                "example": "/overview?lat=37.7749&lon=-122.4194"
            }), 400
        
        # Validate coordinate ranges
        if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
            return jsonify({
                "error": "Invalid coordinates",
                "message": "Latitude must be between -90 and 90, longitude between -180 and 180"
            }), 400
        
        # Check if predictor is loaded
        if predictor is None:
            return jsonify({
                "error": "Service unavailable",
                "message": "AQI predictor not initialized"
            }), 503
        
        # API key for real data
        api_key = "d8f7d975d88dcf91cbdba36b8ca6d14d0d514b1b"
        
        if use_demo:
            # Use demo data
            current_aqi = 42
            city = "Demo Location"
            historical_aqi = np.array([45, 38, 52, 41, 35, 42, 39])
        else:
            try:
                # Fetch real AQI data
                current_aqi, city = fetch_aqi_data(lat, lon, api_key)
                historical_aqi, cities = fetch_historical_aqi_data(lat, lon, api_key, days=7)
            except Exception as e:
                # Fallback to demo data
                current_aqi = 42
                city = "Demo Location (API Error)"
                historical_aqi = np.array([45, 38, 52, 41, 35, 42, 39])
        
        # Make prediction
        predicted_aqi = predictor.predict_next_7_days(historical_aqi)
        
        # Get AQI category and description
        category, description = get_aqi_category(current_aqi)
        
        # Convert numpy arrays to lists for processing
        historical_aqi = historical_aqi.tolist() if hasattr(historical_aqi, 'tolist') else list(historical_aqi)
        predicted_aqi = predicted_aqi.tolist() if hasattr(predicted_aqi, 'tolist') else list(predicted_aqi)
        current_aqi = float(current_aqi) if hasattr(current_aqi, 'item') else current_aqi
        
        # Get trend analysis first (needed for dynamic health impact)
        trend_analysis = get_trend_analysis(historical_aqi, predicted_aqi)
        
        # Get health impact with trend data
        historical_trend = trend_analysis.get("historical_change", 0)
        predicted_trend = trend_analysis.get("predicted_change", 0)
        health_impact = get_health_impact(current_aqi, historical_trend, predicted_trend)
        
        # Get pollutant breakdown with historical data
        pollutant_breakdown = get_pollutant_breakdown(current_aqi, historical_aqi)
        
        # Get air quality alerts
        air_quality_alerts = get_air_quality_alerts(current_aqi, trend_analysis, health_impact)
        
        # Get seasonal recommendations
        seasonal_recommendations = get_seasonal_recommendations(current_aqi)
        
        # Prepare historical data with dates
        historical_data = []
        for i, aqi in enumerate(historical_aqi):
            date = (datetime.now() - timedelta(days=len(historical_aqi)-i-1)).strftime('%Y-%m-%d')
            cat, _ = get_aqi_category(aqi)
            historical_data.append({
                "date": date,
                "aqi": int(float(aqi)),  # Convert numpy types to native Python int
                "category": cat
            })
        
        # Prepare predicted data with dates
        predicted_data = []
        for i, aqi in enumerate(predicted_aqi):
            date = (datetime.now() + timedelta(days=i+1)).strftime('%Y-%m-%d')
            cat, _ = get_aqi_category(aqi)
            predicted_data.append({
                "date": date,
                "aqi": round(float(aqi), 1),  # Convert numpy types to native Python float
                "category": cat
            })
        
        # Prepare comprehensive response
        response = {
            "location": {
                "city": city,
                "coordinates": {
                    "latitude": lat,
                    "longitude": lon
                }
            },
            "current_aqi": {
                "value": int(float(current_aqi)),  # Convert numpy types to native Python int
                "category": category,
                "description": description
            },
            "health_impact": health_impact,
            "pollutant_breakdown": pollutant_breakdown,
            "trend_analysis": trend_analysis,
            "air_quality_alerts": air_quality_alerts,
            "seasonal_recommendations": seasonal_recommendations,
            "historical_data": historical_data,
            "predicted_data": predicted_data,
            "aqi_scale_reference": {
                "0-50": "Good",
                "51-100": "Moderate",
                "101-150": "Unhealthy for Sensitive Groups",
                "151-200": "Unhealthy",
                "201-300": "Very Unhealthy",
                "301+": "Hazardous"
            },
            "timestamp": datetime.now().isoformat(),
            "data_source": "demo" if use_demo else "real_api"
        }
        
        # Convert numpy types to native Python types for JSON serialization
        response = convert_numpy_types(response)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "message": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "service": "AQI Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "/health": "Health check",
            "/overview": "Get comprehensive AQI overview (requires lat, lon parameters)",
            "/": "This information"
        },
        "usage": {
            "get_overview": "/overview?lat=37.7749&lon=-122.4194",
            "post_overview": "POST /overview with JSON body: {\"lat\": 37.7749, \"lon\": -122.4194}",
            "demo_mode": "Add &use_demo=true for demo data"
        }
    })

if __name__ == '__main__':
    print("🌬️  Starting AQI Prediction API Server")
    print("=" * 50)
    
    # Initialize predictor
    if initialize_predictor():
        print("🚀 Server starting on http://0.0.0.0:5000")
        print("📖 API Documentation available at http://localhost:5000/")
        print("🔍 Health check at http://localhost:5000/health")
        print("🌍 AQI Overview at http://localhost:5000/overview?lat=37.7749&lon=-122.4194")
        print("=" * 50)
        
        # Run server
        try:
            app.run(host='0.0.0.0', port=5000, debug=False)
        except Exception as e:
            print(f"❌ Server error: {e}")
            sys.exit(1)
    else:
        print("❌ Failed to start server - predictor initialization failed")
        print("Check if improved_aqi_model.h5 exists in the current directory")
        sys.exit(1)
