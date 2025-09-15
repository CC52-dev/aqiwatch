# AQI Prediction System

This system uses LSTM (Long Short-Term Memory) neural networks to predict the next 7 days of Air Quality Index (AQI) based on the previous 7 days of data.

## Features

- **AQI Calculation**: Automatically calculates AQI from CO, NO2, and O3 pollutant data
- **LSTM Model**: Uses deep learning to capture temporal patterns in air quality data
- **7-Day Prediction**: Takes 7 days of AQI data as input and predicts the next 7 days
- **Data Preprocessing**: Handles missing values and normalizes data for optimal training
- **Model Evaluation**: Provides comprehensive metrics and visualizations

## Files

- `aqi_predictor.py`: Main script with the AQIPredictor class and training functionality
- `main.py`: Command-line interface for coordinate-based AQI predictions
- `demo_prediction.py`: Demo script with custom AQI examples
- `requirements.txt`: Python dependencies
- `AirQuality.csv`: Air quality dataset
- `README.md`: This documentation

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Training the Model

To train the model on your data:

```bash
python aqi_predictor.py
```

### Making Predictions with Coordinates

To predict AQI for any location using coordinates:

```bash
python main.py <latitude> <longitude>
```

**Examples:**
```bash
# San Francisco, CA
python main.py 37.7749 -122.4194

# New York, NY  
python main.py 40.7128 -74.0060

# London, UK
python main.py 51.5074 -0.1278

# Tokyo, Japan
python main.py 35.6762 139.6503

# Paris, France
python main.py 48.8566 2.3522

# Verbose mode (shows detailed AI/ML logs)
python main.py 37.7749 -122.4194 --verbose
```

**Features:**
- **Clean Output**: By default, AI/ML warnings and logs are suppressed for clean, readable output
- **Verbose Mode**: Use `--verbose` or `-v` flag to see detailed technical information
- **API Key**: Hardcoded in the script for convenience

### Making Custom Predictions

To predict with your own AQI data:

```python
from aqi_predictor import AQIPredictor
import tensorflow as tf

# Load the trained model
predictor = AQIPredictor()
predictor.model = tf.keras.models.load_model('aqi_prediction_model.h5')

# Load and fit scaler
daily_data = predictor.load_and_preprocess_data('AirQuality.csv')
predictor.scaler.fit(predictor.aqi_data.reshape(-1, 1))

# Your 7 days of AQI data
last_7_days_aqi = [45, 52, 38, 41, 48, 44, 39]

# Predict next 7 days
prediction = predictor.predict_next_7_days(last_7_days_aqi)
print(f"Predicted AQI for next 7 days: {prediction}")
```

## Model Architecture

The LSTM model consists of:
- **Input Layer**: 7 days of AQI data
- **LSTM Layer 1**: 100 units with dropout (0.2)
- **LSTM Layer 2**: 50 units with dropout (0.2)
- **Dense Layer**: 25 units
- **Output Layer**: 7 units (next 7 days prediction)

## AQI Calculation

The system calculates AQI based on:
- **CO (Carbon Monoxide)**: 8-hour average
- **NO2 (Nitrogen Dioxide)**: 1-hour average  
- **O3 (Ozone)**: 8-hour average

The final AQI is the maximum value among all pollutants (worst pollutant determines overall AQI).

## Data Requirements

The input CSV file should contain columns:
- `Date`: Date in DD/MM/YYYY format
- `Time`: Time in HH.MM.SS format
- `CO(GT)`: Carbon Monoxide levels
- `NO2(GT)`: Nitrogen Dioxide levels
- `PT08.S5(O3)`: Ozone levels
- Other environmental factors (temperature, humidity, etc.)

## Performance

The model provides:
- **MSE (Mean Squared Error)**: Lower is better
- **MAE (Mean Absolute Error)**: Lower is better
- **R² Score**: Higher is better (closer to 1.0)

## Example Output

```
Last 7 days of AQI data: [45.2, 52.1, 38.7, 41.3, 48.9, 44.6, 39.8]
Predicted next 7 days AQI: [42.1, 46.3, 49.7, 47.2, 44.8, 41.5, 38.9]
```

## Notes

- The model uses daily averaged AQI values for training
- Missing values (-200) are automatically handled
- Data is normalized using MinMaxScaler for optimal training
- The model is saved as `aqi_prediction_model.h5` after training
