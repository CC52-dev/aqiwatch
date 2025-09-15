"""
Accurate AQI Predictor
Contains the latest and most accurate AQI prediction model
"""
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import warnings
warnings.filterwarnings('ignore')

class AQIPredictor:
    def __init__(self):
        self.model = None
        self.scaler = MinMaxScaler()
        self.sequence_length = 7
        self.prediction_length = 7
        
    def create_enhanced_features(self, aqi_data):
        """
        Create enhanced features that better represent AQI patterns
        """
        features = []
        
        for i in range(len(aqi_data)):
            feature_set = []
            
            # 1. Current AQI (normalized to 0-1)
            normalized_aqi = aqi_data[i] / 500.0
            feature_set.append(normalized_aqi)
            
            # 2. Recent trend (3-day change)
            if i >= 3:
                trend_3d = (aqi_data[i] - aqi_data[i-3]) / max(aqi_data[i-3], 1)
            else:
                trend_3d = 0
            feature_set.append(trend_3d)
            
            # 3. Short-term trend (1-day change)
            if i >= 1:
                trend_1d = (aqi_data[i] - aqi_data[i-1]) / max(aqi_data[i-1], 1)
            else:
                trend_1d = 0
            feature_set.append(trend_1d)
            
            # 4. Moving average ratios
            if i >= 6:
                ma_7d = np.mean(aqi_data[i-6:i+1])
                ma_ratio = aqi_data[i] / max(ma_7d, 1)
            else:
                ma_ratio = 1
            feature_set.append(ma_ratio)
            
            # 5. Volatility (5-day standard deviation)
            if i >= 4:
                volatility = np.std(aqi_data[i-4:i+1]) / max(np.mean(aqi_data[i-4:i+1]), 1)
            else:
                volatility = 0
            feature_set.append(volatility)
            
            # 6. AQI category encoding (one-hot style)
            if aqi_data[i] <= 50:
                category_good = 1
                category_moderate = 0
                category_unhealthy = 0
            elif aqi_data[i] <= 100:
                category_good = 0
                category_moderate = 1
                category_unhealthy = 0
            else:
                category_good = 0
                category_moderate = 0
                category_unhealthy = 1
            
            feature_set.extend([category_good, category_moderate, category_unhealthy])
            
            # 7. Day of week (cyclical encoding)
            day_of_week = i % 7
            day_sin = np.sin(2 * np.pi * day_of_week / 7)
            day_cos = np.cos(2 * np.pi * day_of_week / 7)
            feature_set.extend([day_sin, day_cos])
            
            features.append(feature_set)
        
        return np.array(features)
    
    def predict_next_7_days(self, last_7_days_aqi):
        """Predict next 7 days of AQI given the last 7 days"""
        if self.model is None:
            raise ValueError("Model not loaded yet. Please load the model first.")
        
        # Create features for the input data
        features = self.create_enhanced_features(last_7_days_aqi)
        
        # Take the last 7 days of features
        input_features = features[-7:].reshape(1, 7, -1)
        
        # Make prediction
        prediction = self.model.predict(input_features, verbose=0)
        
        return prediction.flatten()
    
    def load_model(self, model_path='improved_aqi_model.h5'):
        """Load the trained model"""
        try:
            self.model = tf.keras.models.load_model(model_path)
            print(f"✅ Model loaded successfully from {model_path}")
        except Exception as e:
            raise ValueError(f"Failed to load model from {model_path}: {e}")
