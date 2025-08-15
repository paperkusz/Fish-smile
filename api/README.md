# Fish-Smile API Server

Flask backend API for the Fish-Smile pond monitoring system.

## 🚀 Quick Start

### Installation

```bash
cd api
pip install -r requirements.txt
```

### Running the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### 1. **Get Current Sensor Data**
```
GET /sensors/{pond_id}/current
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pond_id": "pond1",
    "timestamp": "8/15/2025, 17:30:45",
    "pH": 7.24,
    "tds": 267.8,
    "turbidity": 12.3,
    "temperature": 28.5,
    "dissolved_oxygen": 6.2,
    "status": "warning"
  },
  "pond_info": {
    "id": "pond1",
    "name": "บ่อปลาที่ 1 (ปลาทับทิม)",
    "fish_type": "Ruby Fish"
  }
}
```

### 2. **Get Historical Data**
```
GET /sensors/{pond_id}/history?limit=50&hours=24
```

**Parameters:**
- `limit` (optional): Number of records to return (default: 50)
- `hours` (optional): Hours back to fetch data (default: 24)

### 3. **Water Quality Analysis**
```
POST /analysis/{pond_id}
Content-Type: application/json

{
  "pH": 7.24,
  "tds": 267.8,
  "turbidity": 12.3
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "pond_id": "pond1",
    "overall_status": "warning",
    "water_condition": "ต้องเฝ้าระวัง",
    "issues_found": ["ความขุ่นสูงเกินไป (12.3 NTU)"],
    "recommendations": ["ตรวจสอบระบบกรองและทำความสะอาด"],
    "confidence_score": 0.92
  }
}
```

### 4. **Parameter Forecasting**
```
GET /forecast/{pond_id}?parameter=turbidity&hours=6
```

**Parameters:**
- `parameter` (optional): Parameter to forecast (turbidity, pH, tds)
- `hours` (optional): Hours ahead to forecast (default: 6)

### 5. **List All Ponds**
```
GET /ponds
```

## 🐟 Available Ponds

| Pond ID | Name | Fish Type | Status |
|---------|------|-----------|---------|
| `pond1` | บ่อปลาที่ 1 (ปลาทับทิม) | Ruby Fish | Warning |
| `pond2` | บ่อปลาที่ 2 (ปลานิล) | Tilapia | Critical |
| `pond3` | บ่อปลาที่ 3 (ปลาดุก) | Catfish | Good |
| `pond4` | บ่ออนุบาลลูกปลา | Nursery | Warning |

## 🔧 Configuration

### Pond-Specific Parameters

Each pond has realistic parameter ranges:

**Pond 1 (Ruby Fish) - Warning:**
- pH: 7.1 - 7.3
- TDS: 240 - 280 ppm  
- Turbidity: 11.0 - 13.0 NTU

**Pond 2 (Tilapia) - Critical:**
- pH: 19.0 - 21.0 (critically high)
- TDS: 0 - 120 ppm (critically low)
- Turbidity: 2600 - 3000 NTU (critically high)

**Pond 3 (Catfish) - Good:**
- pH: 7.2 - 7.6
- TDS: 290 - 340 ppm
- Turbidity: 3.5 - 6.0 NTU

**Pond 4 (Nursery) - Warning:**
- pH: 6.5 - 6.7
- TDS: 70 - 95 ppm
- Turbidity: 17.0 - 24.0 NTU

## 🛠️ Development

### Data Generation

The API generates realistic sensor data based on:
- Pond-specific parameter ranges
- Time-based variation
- Realistic measurement precision

### Error Handling

- **404**: Pond not found
- **400**: Invalid request data  
- **500**: Server error

### CORS

CORS is enabled for frontend integration during development.

## 🚀 Production Deployment

For production, consider:

1. **Environment Variables:**
```bash
export FLASK_ENV=production
export API_SECRET_KEY=your-secret-key
```

2. **Using Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **Database Integration:**
   - Replace data generation with real database queries
   - Add data persistence for historical records
   - Implement user authentication

4. **Real Sensor Integration:**
   - Add IoT device communication
   - Implement data validation
   - Add real-time WebSocket support

## 📊 Sample Integration

### JavaScript Frontend Integration

```javascript
// Using the APIUtils from common.js
const data = await APIUtils.getSensorData('pond1');
const history = await APIUtils.getHistoricalData('pond1', 100);
const analysis = await APIUtils.getAnalysis('pond1', sensorData);
const forecast = await APIUtils.getForecast('pond1', 'turbidity');
```

The frontend will automatically fall back to sample data if the API is not available.