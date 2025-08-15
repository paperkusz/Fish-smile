# Fish-Smile JavaScript Modules Documentation

This directory contains the modular JavaScript codebase for the Fish-Smile pond monitoring system. The code is organized into reusable utilities, a base dashboard class, and pond-specific configurations.

## 📁 File Structure

```
js/
├── common.js          # Shared utilities and configurations
├── dashboard.js       # Base dashboard class
├── pond1.js          # Pond 1 (ปลาทับทิม) configuration
├── pond2.js          # Pond 2 (ปลานิล) configuration  
├── pond3.js          # Pond 3 (ปลาดุก) configuration
├── pond4.js          # Pond 4 (บ่ออนุบาลลูกปลา) configuration
└── README.md         # This documentation file
```

## 🔧 Core Modules

### `common.js` - Shared Utilities

The foundation module containing shared functionality used across all pond dashboards.

#### **CONFIG Object**
Global configuration constants including:
- **Water quality thresholds**: pH (6.5-8.5), TDS (100-500 ppm), Turbidity (0-10 NTU)
- **Refresh interval**: 5 minutes auto-refresh
- **Chart settings**: Height (150px), max data points (10)

#### **StatusUtils**
Status calculation and display utilities:
- `getStatusClass(value, parameter)` - Returns CSS class ('good', 'warning', 'danger')
- `getStatusText(value, parameter)` - Returns Thai language status messages with thresholds

#### **ChartUtils**
Chart creation and management:
- `createSimpleChart(chartId, values, label, sampleData)` - Creates bar charts for real-time data
- `createForecastChart(ctx, data, config)` - Creates Chart.js line charts with forecasting

#### **NotificationUtils**
UI notification management:
- `show(count, color)` - Displays notification badges in header

#### **DataUtils**
Data processing utilities:
- `sortByTimestamp(data)` - Sorts sensor data newest first
- `getRecentData(data, count)` - Extracts recent data points for charts
- `updateDisplayValues(data, pondConfig)` - Updates DOM elements with formatted values

---

### `dashboard.js` - Base Dashboard Class

Core dashboard functionality that can be extended for specific pond types.

#### **FishSmileDashboard Class**

**Constructor Parameters:**
```javascript
{
  pondId: string,           // Unique pond identifier
  pondName: string,         // Display name
  sampleData: Array,        // Sensor data array
  precision: Object,        // Decimal precision settings
  forecastConfig: Object,   // Chart configuration
  notificationColor: string // Notification color
}
```

**Key Methods:**
- `loadData()` - Loads and processes sensor data, updates all dashboard components
- `updateStatusIndicators(data)` - Updates status UI based on current readings
- `createCharts(data)` - Creates bar charts for pH, TDS, and turbidity
- `createForecastChart(data)` - Creates forecast visualization
- `updateDataTable(data)` - Populates historical data table
- `startAutoRefresh()` / `stopAutoRefresh()` - Manages automatic data refresh
- `fetchFromAPI()` - API integration point for production use

**Features:**
- Automatic initialization on DOM ready
- Error handling and logging
- Chart lifecycle management
- Resource cleanup via `destroy()` method

---

## 🐟 Pond-Specific Modules

Each pond module extends the base dashboard with specific configurations and behaviors.

### `pond1.js` - Pond 1 (ปลาทับทิม)

**Characteristics:**
- **Fish Type**: Ruby Fish (ปลาทับทิม)
- **Status**: Warning condition - turbidity slightly elevated
- **Data Range**: pH 7.21-7.27, TDS 238-269 ppm, Turbidity 11.2-12.4 NTU
- **Forecast**: Turbidity trend with safety threshold at 10 NTU
- **Notifications**: 1 alert for turbidity issues

**Configuration:**
```javascript
{
  pondId: 'pond1',
  precision: { pH: 2, tds: 1, turbidity: 1 },
  notificationColor: '#e74c3c',
  forecastConfig: {
    title: 'แนวโน้มความขุ่นและพยากรณ์ 2 ชั่วโมงข้างหน้า',
    dataExtractor: turbidity data,
    forecastGenerator: 2% decline per period
  }
}
```

---

### `pond2.js` - Pond 2 (ปลานิล)

**Characteristics:**
- **Fish Type**: Tilapia (ปลานิล)
- **Status**: Critical condition - extreme pH and turbidity
- **Data Range**: pH 19.14-20.89, TDS 0-108 ppm, Turbidity 2690-2952 NTU
- **Special Behavior**: Always shows critical notifications (3 alerts)
- **Class Extension**: `Pond2Dashboard` extends base class

**Extended Methods:**
```javascript
class Pond2Dashboard extends FishSmileDashboard {
  getOverallStatus(data) {
    // Override: Always critical for extreme values
    if (data.pH > 15 || data.turbidity > 1000) {
      return { class: 'danger', text: 'วิกฤต! ค่า pH และความขุ่นสูง' };
    }
  }
  
  checkAndShowNotifications(data) {
    // Always show critical notification
    NotificationUtils.show(3, this.config.notificationColor);
  }
}
```

---

### `pond3.js` - Pond 3 (ปลาดุก)

**Characteristics:**
- **Fish Type**: Catfish (ปลาดุก)
- **Status**: Good condition - all parameters within normal ranges
- **Data Range**: pH 7.28-7.52, TDS 295-335 ppm, Turbidity 3.8-5.8 NTU
- **Forecast**: pH trend with dual safety thresholds (6.5-8.5)
- **Notifications**: Green status, minimal alerts

**Unique Features:**
- pH-focused forecasting instead of turbidity
- Dual threshold lines on forecast chart
- Generally good water quality status

---

### `pond4.js` - Pond 4 (บ่ออนุบาลลูกปลา)

**Characteristics:**
- **Fish Type**: Nursery pond for juvenile fish
- **Status**: Warning condition - sensitive to turbidity for young fish
- **Data Range**: pH 6.54-6.61, TDS 73-89 ppm, Turbidity 17.8-23.2 NTU
- **Special Logic**: Enhanced sensitivity for nursery conditions
- **Class Extension**: `Pond4Dashboard` with custom status logic

**Enhanced Features:**
```javascript
class Pond4Dashboard extends FishSmileDashboard {
  updateStatusIndicators(data) {
    // Custom status logic with individual parameter handling
    const indicators = [
      { id: 'phValue', customLogic: (value) => ... },
      { id: 'tdsValue', customLogic: (value) => ... },
      { id: 'turbidityValue', customLogic: (value) => ... }
    ];
  }
  
  getOverallStatus(data) {
    // More sensitive to turbidity for nursery conditions
    if (data.turbidity > 10) {
      return { class: 'warning', text: 'ความขุ่นสูง' };
    }
  }
}
```

---

## 🔄 Integration Pattern

### HTML Integration
Each HTML file includes the modules in this order:
```html
<script src="js/common.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/pond[X].js"></script>
```

### Initialization Flow
1. **common.js** loads utilities and configurations
2. **dashboard.js** defines the base `FishSmileDashboard` class
3. **pond[X].js** creates pond-specific configuration and initializes dashboard
4. Dashboard auto-initializes on DOM ready
5. Auto-refresh starts with 5-minute intervals

### Global Functions
- `window.refreshDashboard()` - Manual refresh trigger for UI buttons
- `window.loadData()` - Legacy function for compatibility
- `window.dashboardInstance` - Global reference to active dashboard

---

## 🚀 Extension Guide

### Adding a New Pond

1. **Create pond configuration file** (`pond5.js`):
```javascript
const pond5SampleData = [ /* sensor data */ ];

const pond5Config = {
  pondId: 'pond5',
  pondName: 'New Pond Name',
  sampleData: pond5SampleData,
  precision: { pH: 2, tds: 1, turbidity: 2 },
  forecastConfig: { /* chart config */ }
};

// Optional: Extend dashboard for custom behavior
class Pond5Dashboard extends FishSmileDashboard {
  // Custom methods here
}

document.addEventListener('DOMContentLoaded', function() {
  window.dashboardInstance = new Pond5Dashboard(pond5Config);
});
```

2. **Include in HTML**:
```html
<script src="js/pond5.js"></script>
```

### Customizing Behavior

- **Status Logic**: Override `getOverallStatus(data)` method
- **Notifications**: Override `checkAndShowNotifications(data)` method  
- **Status Indicators**: Override `updateStatusIndicators(data)` method
- **Forecast**: Modify `forecastConfig` object

---

## 📊 Data Structure

### Sensor Data Format
```javascript
{
  timestamp: '7/8/2025, 20:06:23',  // String timestamp
  pH: 7.24,                        // Number (0-14 scale)
  tds: 267.8,                      // Number (ppm)
  turbidity: 12.3                  // Number (NTU)
}
```

### Configuration Object
```javascript
{
  pondId: 'pond1',                 // String identifier
  pondName: 'Display Name',        // String for UI
  sampleData: [],                  // Array of sensor data
  precision: {                     // Decimal places for display
    pH: 2,
    tds: 1, 
    turbidity: 2
  },
  forecastConfig: {                // Chart.js configuration
    title: 'Chart Title',
    yAxisLabel: 'Y Axis Label',
    dataExtractor: function(data) { /* extract data */ },
    forecastGenerator: function(values) { /* generate forecast */ },
    thresholds: []                 // Optional threshold lines
  },
  notificationColor: '#e74c3c'     // CSS color value
}
```

---

## 🔗 Dependencies

- **Chart.js** - Required for forecast charts (`createForecastChart`)
- **Font Awesome** - Used for icons in notifications and UI
- **Modern Browser** - ES6+ features (classes, arrow functions, destructuring)

## 🔄 Loading States & API Integration

### **Skeleton Loading**
The system now includes sophisticated skeleton loading screens:

```javascript
// Show skeleton loading
SkeletonUtils.showSkeleton();

// Hide skeleton and restore content  
SkeletonUtils.hideSkeleton();
```

**Features:**
- Animated skeleton cards matching dashboard layout
- Skeleton table with proper row/column structure
- Skeleton forecast chart placeholder
- Pulsing animations for visual feedback
- Automatic CSS injection for styles

### **API Integration**
Real API integration with fallback to sample data:

```javascript
// API calls with retry logic
const data = await APIUtils.getSensorData('pond1');
const history = await APIUtils.getHistoricalData('pond1', 50);
const analysis = await APIUtils.getAnalysis('pond1', sensorData);
const forecast = await APIUtils.getForecast('pond1', 'turbidity');
```

**Features:**
- Automatic retry mechanism (3 attempts)
- Timeout handling (10 seconds)
- Graceful fallback to sample data
- Detailed logging for debugging
- CORS-enabled for development

### **Error Handling Flow**
1. **API Request** → Try real API endpoints
2. **Network Error** → Retry up to 3 times
3. **API Failure** → Fall back to sample data
4. **Success** → Hide skeleton, show real data

## 🚀 **Flask API Server**

### **Quick Start**
```bash
# Start development environment
./start-dev.sh

# Or manually:
cd api
source venv/bin/activate
python app.py
```

### **API Endpoints**
- `GET /api/sensors/{pond_id}/current` - Current readings
- `GET /api/sensors/{pond_id}/history` - Historical data
- `POST /api/analysis/{pond_id}` - Water quality analysis
- `GET /api/forecast/{pond_id}` - Parameter forecasting
- `GET /api/ponds` - List all ponds

### **Development Features**
- Realistic data generation per pond type
- Pond-specific parameter ranges
- AI-powered water quality analysis
- Time-series forecasting simulation
- CORS enabled for frontend integration

## 📝 Notes

- All pond modules follow the same initialization pattern
- StatusUtils provides consistent Thai language messaging
- Charts are destroyed and recreated on each update to prevent memory leaks
- Comprehensive error handling with API fallback
- Skeleton loading provides smooth user experience
- Production-ready API structure with Flask backend