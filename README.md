# Fish-Smile Pond Monitoring System

A real-time water quality monitoring dashboard for aquaculture ponds with API integration and intelligent analysis.

## Architecture

### Frontend
- **HTML Dashboards**: Individual pond monitoring interfaces
- **Modular JavaScript**: Separated utilities, dashboard logic, and pond-specific configurations
- **Skeleton Loading**: Smooth loading states during data fetching
- **Chart Visualization**: Real-time parameter charts and forecasting

### Backend
- **Flask API Server**: RESTful endpoints for sensor data and analysis
- **Data Generation**: Realistic pond-specific sensor simulations
- **AI Analysis**: Water quality assessment and recommendations
- **Forecasting**: Parameter prediction based on historical trends

### Data Flow
```
to-do
```

## Project Structure

```
Fish-smile/
├── api/                    # Flask backend server
│   ├── app.py             # Main API application
│   ├── requirements.txt   # Python dependencies
│   └── README.md         # API documentation
├── js/                    # Frontend JavaScript modules
│   ├── common.js         # Shared utilities and API integration
│   ├── dashboard.js      # Base dashboard class
│   ├── pond[1-4].js     # Pond-specific configurations
│   └── README.md        # JS modules documentation
├── Fish-Smile0[1-4].html # Individual pond dashboards
├── start-dev.sh         # Development environment launcher
└── test-fix.html        # Development testing page
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sensors/{pond_id}/current` | GET | Current sensor readings |
| `/sensors/{pond_id}/history` | GET | Historical data for charts |
| `/analysis/{pond_id}` | POST | Water quality analysis |
| `/forecast/{pond_id}` | GET | Parameter forecasting |
| `/ponds` | GET | List all available ponds |

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Frontend Components

### Dashboard System
- **Base Class**: `FishSmileDashboard` handles common functionality
- **Pond Classes**: Extend base for specific pond requirements
- **API Integration**: Automatic retry with fallback to sample data
- **Loading States**: Skeleton placeholders during data fetching

### Chart System
- **Parameter Charts**: pH, TDS, turbidity visualization
- **Forecast Charts**: Predictive analysis with confidence intervals
- **Real-time Updates**: Auto-refresh with configurable intervals

### Status Management
- **Threshold-based**: Color-coded status indicators
- **Multi-parameter**: Combined health assessment
- **Notifications**: Alert system for critical conditions

## Pond Configurations

| Pond ID | Fish Type | Status | Key Parameters |
|---------|-----------|--------|----------------|
| pond1 | Ruby Fish (ปลาทับทิม) | Warning | pH: 7.1-7.3, Turbidity: 11-13 NTU |
| pond2 | Tilapia (ปลานิล) | Critical | pH: 19-21, TDS: 0-120 ppm |
| pond3 | Catfish (ปลาดุก) | Good | pH: 7.2-7.6, TDS: 290-340 ppm |
| pond4 | Nursery (อนุบาล) | Warning | pH: 6.5-6.7, Turbidity: 17-24 NTU |

## Development

### Quick Start
```bash
# Start both API and frontend
./start-dev.sh

# Or separately:
cd api && source venv/bin/activate && python app.py
python3 -m http.server 8000
```

### Environment Setup
```bash
# API dependencies
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend (no build required)
python3 -m http.server 8000
```

## Features

### Current Capabilities
- Real-time sensor data visualization
- Multi-pond monitoring interface
- Water quality analysis and recommendations
- Parameter forecasting and trend analysis
- Responsive design for mobile/desktop
- Skeleton loading for improved UX

### Data Sources
- **Development**: Simulated realistic sensor data
- **Production**: Configurable for real IoT sensor integration
- **Fallback**: Sample data ensures functionality without API

### Analysis Engine
- **Threshold Detection**: Automated parameter range checking
- **Status Classification**: Good/Warning/Critical assessment
- **Recommendation System**: Actionable advice based on conditions
- **Confidence Scoring**: Analysis reliability indicators

## Configuration

### Thresholds
```javascript
CONFIG = {
    thresholds: {
        pH: { min: 6.5, max: 8.5 },
        tds: { min: 100, max: 500 },
        turbidity: { min: 0, max: 10 }
    }
}
```

### API Settings
```javascript
APIUtils = {
    baseURL: 'http://localhost:5000/api',
    retryAttempts: 3,
    timeout: 10000
}
```

## Integration Points

### IoT Sensor Integration
- Modify `APIUtils.getSensorData()` for real sensor endpoints
- Update data format in `api/app.py` for actual sensor protocols
- Configure authentication if required

### Database Integration
- Replace data generation with database queries
- Add data persistence for historical records
- Implement user management and access control

### Notification Systems
- Extend `NotificationUtils` for email/SMS alerts
- Add webhook support for external integrations
- Implement escalation rules for critical conditions

## Monitoring & Maintenance

### Health Checks
- API endpoint availability monitoring
- Data freshness validation
- System performance metrics

### Data Management
- Historical data retention policies
- Backup and recovery procedures
- Data export capabilities

### User Management
- Role-based access control
- Activity logging and audit trails
- Custom dashboard configurations

---

**Todo**
-add persistent storage in /api to store sensor readings
-setup docker for an easy cloud deployment
-integrate with the ESP32 hardware and ensure compatibilities