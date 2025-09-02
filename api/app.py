"""
Fish-Smile API Server
Flask backend for pond monitoring system

Run with: python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configuration
API_VERSION = "v1"
# Read runtime config from environment (container- and dev-friendly)
PORT = int(os.getenv("PORT", "5050"))
DEBUG = os.getenv("DEBUG", "true").lower() in ("1", "true", "yes")

# Sample data generators for different pond types
POND_CONFIGS = {
    'pond1': {
        'name': 'บ่อปลาที่ 1 (ปลาทับทิม)',
        'fish_type': 'Ruby Fish',
        'ph_range': (7.1, 7.3),
        'tds_range': (240, 280),
        'turbidity_range': (11.0, 13.0),
        'status': 'warning'
    },
    'pond2': {
        'name': 'บ่อปลาที่ 2 (ปลานิล)',
        'fish_type': 'Tilapia',
        'ph_range': (19.0, 21.0),
        'tds_range': (0, 120),
        'turbidity_range': (2600, 3000),
        'status': 'critical'
    },
    'pond3': {
        'name': 'บ่อปลาที่ 3 (ปลาดุก)',
        'fish_type': 'Catfish',
        'ph_range': (7.2, 7.6),
        'tds_range': (290, 340),
        'turbidity_range': (3.5, 6.0),
        'status': 'good'
    },
    'pond4': {
        'name': 'บ่ออนุบาลลูกปลา',
        'fish_type': 'Nursery',
        'ph_range': (6.5, 6.7),
        'tds_range': (70, 95),
        'turbidity_range': (17.0, 24.0),
        'status': 'warning'
    }
}

def generate_sensor_data(pond_id, timestamp=None):
    """Generate realistic sensor data for a specific pond"""
    if pond_id not in POND_CONFIGS:
        return None
    
    config = POND_CONFIGS[pond_id]
    
    if timestamp is None:
        timestamp = datetime.now()
    
    # Generate values within pond-specific ranges with some variation
    ph_min, ph_max = config['ph_range']
    tds_min, tds_max = config['tds_range']
    turb_min, turb_max = config['turbidity_range']
    
    data = {
        'pond_id': pond_id,
        'timestamp': timestamp.strftime('%m/%d/%Y, %H:%M:%S'),
        'pH': round(random.uniform(ph_min, ph_max), 2),
        'tds': round(random.uniform(tds_min, tds_max), 1),
        'turbidity': round(random.uniform(turb_min, turb_max), 2),
        'temperature': round(random.uniform(25.0, 30.0), 1),  # Water temperature
        'dissolved_oxygen': round(random.uniform(5.0, 8.0), 1),  # DO levels
        'status': config['status']
    }
    
    return data

def generate_historical_data(pond_id, hours_back=24, interval_minutes=5):
    """Generate historical sensor data for charts"""
    historical_data = []
    current_time = datetime.now()
    
    # Generate data points going back in time
    for i in range(0, hours_back * 60 // interval_minutes):
        timestamp = current_time - timedelta(minutes=i * interval_minutes)
        data_point = generate_sensor_data(pond_id, timestamp)
        if data_point:
            historical_data.append(data_point)
    
    # Sort by timestamp (newest first)
    historical_data.sort(key=lambda x: datetime.strptime(x['timestamp'], '%m/%d/%Y, %H:%M:%S'), reverse=True)
    
    return historical_data

@app.route('/')
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Fish-Smile API Server',
        'version': API_VERSION,
        'timestamp': datetime.now().isoformat(),
        'endpoints': [
            '/api/sensors/<pond_id>/current',
            '/api/sensors/<pond_id>/history',
            '/api/analysis/<pond_id>',
            '/api/forecast/<pond_id>',
            '/api/ponds'
        ]
    })

@app.route('/api/sensors/<pond_id>/current', methods=['GET'])
def get_current_sensor_data(pond_id):
    """Get current sensor readings for a specific pond"""
    
    if pond_id not in POND_CONFIGS:
        return jsonify({'error': f'Pond {pond_id} not found'}), 404
    
    try:
        current_data = generate_sensor_data(pond_id)
        
        return jsonify({
            'success': True,
            'data': current_data,
            'pond_info': {
                'id': pond_id,
                'name': POND_CONFIGS[pond_id]['name'],
                'fish_type': POND_CONFIGS[pond_id]['fish_type']
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sensors/<pond_id>/history', methods=['GET'])
def get_historical_sensor_data(pond_id):
    """Get historical sensor data for charts and analysis"""
    
    if pond_id not in POND_CONFIGS:
        return jsonify({'error': f'Pond {pond_id} not found'}), 404
    
    try:
        # Get query parameters
        limit = int(request.args.get('limit', 50))
        hours = int(request.args.get('hours', 24))
        
        # Generate historical data
        historical_data = generate_historical_data(pond_id, hours_back=hours)
        
        # Limit results
        limited_data = historical_data[:limit]
        
        return jsonify({
            'success': True,
            'data': limited_data,
            'count': len(limited_data),
            'pond_info': {
                'id': pond_id,
                'name': POND_CONFIGS[pond_id]['name'],
                'fish_type': POND_CONFIGS[pond_id]['fish_type']
            },
            'parameters': {
                'limit': limit,
                'hours_back': hours
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analysis/<pond_id>', methods=['POST'])
def analyze_water_quality(pond_id):
    """Analyze water quality and provide AI-powered insights"""
    
    if pond_id not in POND_CONFIGS:
        return jsonify({'error': f'Pond {pond_id} not found'}), 404
    
    try:
        # Get sensor data from request
        sensor_data = request.get_json()
        
        if not sensor_data:
            return jsonify({'error': 'No sensor data provided'}), 400
        
        # Simulate AI analysis based on thresholds
        ph = sensor_data.get('pH', 7.0)
        tds = sensor_data.get('tds', 300)
        turbidity = sensor_data.get('turbidity', 5)
        
        # Analysis logic
        issues = []
        recommendations = []
        overall_status = 'good'
        
        # pH Analysis
        if ph < 6.5 or ph > 8.5:
            issues.append(f'ค่า pH ผิดปกติ ({ph})')
            recommendations.append('ปรับค่า pH โดยการเพิ่มหรือลดสารเคมี')
            overall_status = 'danger'
        
        # TDS Analysis
        if tds < 100:
            issues.append(f'ค่า TDS ต่ำเกินไป ({tds} ppm)')
            recommendations.append('เพิ่มแร่ธาตุในน้ำ')
            if overall_status == 'good':
                overall_status = 'warning'
        elif tds > 500:
            issues.append(f'ค่า TDS สูงเกินไป ({tds} ppm)')
            recommendations.append('เปลี่ยนน้ำบางส่วน')
            overall_status = 'danger'
        
        # Turbidity Analysis
        if turbidity > 10:
            issues.append(f'ความขุ่นสูงเกินไป ({turbidity} NTU)')
            recommendations.append('ตรวจสอบระบบกรองและทำความสะอาด')
            if overall_status == 'good':
                overall_status = 'warning'
        
        # Generate analysis response
        analysis = {
            'pond_id': pond_id,
            'overall_status': overall_status,
            'water_condition': {
                'good': 'น้ำมีคุณภาพดี',
                'warning': 'ต้องเฝ้าระวัง',
                'danger': 'วิกฤต! ต้องแก้ไขด่วน'
            }.get(overall_status, 'ไม่ทราบสถานะ'),
            'issues_found': issues,
            'recommendations': recommendations,
            'analysis_timestamp': datetime.now().isoformat(),
            'confidence_score': random.uniform(0.85, 0.98)  # Simulated confidence
        }
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'input_data': sensor_data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/forecast/<pond_id>', methods=['GET'])
def get_forecast(pond_id):
    """Generate forecast for water quality parameters"""
    
    if pond_id not in POND_CONFIGS:
        return jsonify({'error': f'Pond {pond_id} not found'}), 404
    
    try:
        parameter = request.args.get('parameter', 'turbidity')
        hours_ahead = int(request.args.get('hours', 6))
        
        # Get recent data to base forecast on
        historical_data = generate_historical_data(pond_id, hours_back=2)
        
        if not historical_data:
            return jsonify({'error': 'No historical data available'}), 404
        
        # Generate forecast data points
        forecast_points = []
        current_time = datetime.now()
        last_value = historical_data[0].get(parameter, 0)
        
        # Simple trend-based forecasting
        for i in range(1, hours_ahead + 1):
            future_time = current_time + timedelta(hours=i)
            
            # Add some variation and trend
            if parameter == 'turbidity':
                # Assume gradual improvement
                change = random.uniform(-0.1, -0.05) * i
            elif parameter == 'pH':
                # Assume slight fluctuation
                change = random.uniform(-0.02, 0.02) * i
            else:
                # TDS - slight increase over time
                change = random.uniform(0, 0.1) * i
            
            forecast_value = max(0, last_value + change)
            
            forecast_points.append({
                'timestamp': future_time.strftime('%m/%d/%Y, %H:%M:%S'),
                'predicted_value': round(forecast_value, 2),
                'confidence': max(0.5, 0.95 - (i * 0.1))  # Decreasing confidence
            })
        
        return jsonify({
            'success': True,
            'forecast': {
                'pond_id': pond_id,
                'parameter': parameter,
                'hours_ahead': hours_ahead,
                'base_value': last_value,
                'predictions': forecast_points,
                'model_info': {
                    'algorithm': 'trend_analysis',
                    'accuracy': '85%',
                    'last_trained': '2025-01-01T00:00:00Z'
                }
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ponds', methods=['GET'])
def list_ponds():
    """List all available ponds"""
    
    ponds_list = []
    for pond_id, config in POND_CONFIGS.items():
        # Get latest data for each pond
        latest_data = generate_sensor_data(pond_id)
        
        ponds_list.append({
            'id': pond_id,
            'name': config['name'],
            'fish_type': config['fish_type'],
            'status': config['status'],
            'latest_reading': latest_data
        })
    
    return jsonify({
        'success': True,
        'ponds': ponds_list,
        'total_count': len(ponds_list),
        'timestamp': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print(f"🐟 Fish-Smile API Server starting...")
    print(f"📡 Server will be available at: http://0.0.0.0:{PORT}")
    print(f"📚 API Documentation: http://0.0.0.0:{PORT}")
    print(f"🔧 Debug mode: {DEBUG}")
    print(f"🌐 CORS enabled for frontend integration")
    print("=" * 50)
    
    app.run(
        host='0.0.0.0',
        port=PORT,
        debug=DEBUG
    )
