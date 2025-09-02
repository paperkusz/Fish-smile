# Fish-Smile Pond Monitoring System

Fish-Smile provides real-time water quality monitoring for multiple ponds. It includes a static frontend with dashboards and a Flask API that simulates sensor data, analysis, and simple forecasting.

## How It Fits Together
- Frontend (web):
  - `index.html` is the homepage linking to `Fish-Smile01–04.html` dashboards.
  - Frontend JS (in `js/`) renders charts, status chips, and calls the API.
  - In Docker, Nginx serves the frontend and proxies `/api` to the backend for same-origin requests.
- Backend (api):
  - Flask app (`api/app.py`) exposes REST endpoints for current readings, history, analysis, and forecast.
  - Defaults to `PORT=5050` and supports env overrides.

## Project Structure
- `index.html`: Clean homepage with live pond summaries
- `Fish-Smile0[1-4].html`: Dashboards for each pond
- `js/`: Frontend modules (`common.js`, `dashboard.js`, `pond[1-4].js`)
- `api/`: Flask backend (`app.py`, `requirements.txt`, `Dockerfile`)
- `deploy/`: Nginx config and frontend Dockerfile
- `start-dev.sh`: One-command local dev
- `AGENTS.md`: Contributor guidelines

## Run Locally
- One command (API 5050, Web 8000):
  - `./start-dev.sh`
- Manual:
  - API: `cd api && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && PORT=5050 python app.py`
  - Web: `python3 -m http.server 8000`
- Open: `http://localhost:8000/`

Notes (local): The homepage tries `/api/ponds` first and falls back to `http://localhost:5050/api/ponds`, so it works with or without a reverse proxy. Dashboards use `http://localhost:5050/api` by default (see `js/common.js`).

## Docker (Recommended)
- Build and run:
  - `docker compose up --build`
- Open:
  - Web: `http://localhost:8000/`
  - API (direct): `http://localhost:5050/api/ponds`

Services:
- `web`: Nginx serves static files and proxies `/api` to `api:5050`.
- `api`: Gunicorn serves Flask on port 5050 (`ENV PORT=5050`).

## API Overview
- Base URL: `http://localhost:5050/api` (or `/api` when proxied by Nginx)
- Endpoints:
  - `GET /sensors/{pond_id}/current`
  - `GET /sensors/{pond_id}/history?limit=N&hours=H`
  - `POST /analysis/{pond_id}` with JSON `{ pH, tds, turbidity }`
  - `GET /forecast/{pond_id}?parameter=turbidity|pH|tds&hours=H`
  - `GET /ponds`
- Example: `curl http://localhost:5050/api/sensors/pond1/current`

## Configuration
- API env vars: `PORT` (default 5050), `DEBUG` (`true|false`), `GUNICORN_WORKERS` (in Docker)
- Frontend API base: `js/common.js -> APIUtils.baseURL` (defaults to `http://localhost:5050/api`). For same-origin behind Nginx, switch it to `/api` and rebuild the `web` image.

## Troubleshooting
- Port busy: change published port in `docker-compose.yml` (e.g., `5051:5050`).
- Docker daemon: start Docker Desktop; verify with `docker info`.
- Health: `curl http://localhost:5050/` should return status JSON.

## Contributing
See `AGENTS.md` for style, testing, and PR guidelines.
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

### Base URL: `http://localhost:5050/api`

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

### Docker Deployment
For a containerized setup using Nginx + Gunicorn, see DEPLOYMENT.md. Quick run:
```bash
docker compose up --build
# Web: http://localhost:8000/Fish-Smile01.html
# API: http://localhost:5050/api/ponds
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
    baseURL: 'http://localhost:5050/api',
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
