/**
 * Fish-Smile Common Utilities
 * Shared functions and configurations used across all pond dashboards
 */

// Configuration constants
const CONFIG = {
    thresholds: {
        pH: { min: 6.5, max: 8.5 },
        tds: { min: 100, max: 500 },
        turbidity: { min: 0, max: 10 }
    },
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    chartHeight: 150,
    maxDataPoints: 10
};

// Status indicator utilities
const StatusUtils = {
    getStatusClass(value, parameter) {
        const thresholds = CONFIG.thresholds[parameter];
        if (!thresholds) return 'good';
        
        if (parameter === 'turbidity') {
            return value > thresholds.max ? 'warning' : 'good';
        }
        
        if (value < thresholds.min || value > thresholds.max) {
            return 'danger';
        }
        
        if (parameter === 'tds' && value < thresholds.min) {
            return 'warning';
        }
        
        return 'good';
    },

    getStatusText(value, parameter) {
        const thresholds = CONFIG.thresholds[parameter];
        const statusClass = this.getStatusClass(value, parameter);
        
        const messages = {
            pH: {
                good: `อยู่ในเกณฑ์ปกติ (${thresholds.min}-${thresholds.max})`,
                danger: `อันตราย! (เกินเกณฑ์ปกติ ${thresholds.min}-${thresholds.max})`
            },
            tds: {
                good: `อยู่ในเกณฑ์ปกติ (${thresholds.min}-${thresholds.max} ppm)`,
                warning: `ต่ำกว่าเกณฑ์ปกติเล็กน้อย (${thresholds.min}-${thresholds.max} ppm)`,
                danger: `สูงกว่าเกณฑ์ปกติ (${thresholds.min}-${thresholds.max} ppm)`
            },
            turbidity: {
                good: `อยู่ในเกณฑ์ปกติ (${thresholds.min}-${thresholds.max} NTU)`,
                warning: `สูงกว่าเกณฑ์เล็กน้อย (${thresholds.min}-${thresholds.max} NTU)`
            }
        };
        
        return messages[parameter][statusClass] || 'Unknown status';
    }
};

// Chart utilities
const ChartUtils = {
    createSimpleChart(chartId, values, label, sampleData) {
        const container = document.getElementById(chartId);
        if (!container) {
            console.warn(`📊 Chart container '${chartId}' not found`);
            return;
        }
        
        console.log(`📊 Creating chart for '${chartId}' with ${values.length} data points`);
        
        container.innerHTML = '';
        
        const maxValue = Math.max(...values, 10);
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'simple-chart';
        
        // Create chart bars
        values.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = (value / maxValue) * CONFIG.chartHeight;
            bar.style.height = `${height}px`;
            bar.title = `${value}`;
            chartWrapper.appendChild(bar);
        });
        
        container.appendChild(chartWrapper);
        
        // Create labels
        const labels = document.createElement('div');
        labels.className = 'chart-labels';
        
        if (sampleData && sampleData.length >= 10) {
            const startTime = new Date(sampleData[sampleData.length-10].timestamp)
                .toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'});
            const endTime = new Date(sampleData[0].timestamp)
                .toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'});
            
            labels.innerHTML = `
                <span>${startTime}</span>
                <span>${label}</span>
                <span>${endTime}</span>
            `;
        } else {
            labels.innerHTML = `<span>${label}</span>`;
        }
        
        container.appendChild(labels);
    },

    createForecastChart(ctx, data, config) {
        const chartData = config.dataExtractor(data);
        const timestamps = data.slice(0, 10).map(d => 
            new Date(d.timestamp).toLocaleTimeString('th-TH', {hour: '2-digit', minute: '2-digit'})
        ).reverse();
        
        const forecastData = config.forecastGenerator(chartData);
        const forecastTimestamps = [
            'ปัจจุบัน', '+30 นาที', '+1 ชั่วโมง', '+1.5 ชั่วโมง', '+2 ชั่วโมง'
        ];
        
        const datasets = [
            {
                label: 'ข้อมูลจริง',
                data: [...chartData, ...Array(forecastData.length-1).fill(null)],
                borderColor: '#1e88e5',
                backgroundColor: 'rgba(30, 136, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'การพยากรณ์',
                data: [...Array(chartData.length).fill(null), ...forecastData],
                borderColor: '#e53935',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: true,
                tension: 0.4
            }
        ];
        
        // Add threshold lines if provided
        if (config.thresholds) {
            config.thresholds.forEach(threshold => {
                datasets.push({
                    label: threshold.label,
                    data: Array(chartData.length + forecastData.length).fill(threshold.value),
                    borderColor: threshold.color,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderDash: [3, 3]
                });
            });
        }
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...timestamps, ...forecastTimestamps.slice(1)],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: config.title,
                        font: { size: 14 }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ...(config.yAxis || {}),
                        title: {
                            display: true,
                            text: config.yAxisLabel
                        }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
};

// Notification utilities
const NotificationUtils = {
    show(count, color = '#e74c3c') {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Remove old notification
        const oldNotification = document.querySelector('.notification-container');
        if (oldNotification) {
            header.removeChild(oldNotification);
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification-container';
        notification.innerHTML = `
            <i class="fas fa-bell" style="font-size: 1.5rem; color: ${color};"></i>
            <div class="notification-badge">${count}</div>
        `;
        header.appendChild(notification);
    }
};

// Data utilities
const DataUtils = {
    sortByTimestamp(data) {
        return [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    getRecentData(data, count = CONFIG.maxDataPoints) {
        return data.slice(0, count).reverse();
    },

    updateDisplayValues(data, pondConfig) {
        const elements = {
            pH: document.getElementById('phValue'),
            tds: document.getElementById('tdsValue'),
            turbidity: document.getElementById('turbidityValue')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key] && data[key] !== undefined) {
                const precision = pondConfig.precision[key] || 2;
                elements[key].textContent = data[key].toFixed(precision);
            }
        });
    }
};

// Skeleton loading utilities
const SkeletonUtils = {
    createSkeletonCard() {
        return `
            <div class="skeleton-card">
                <div class="skeleton-header">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-title"></div>
                </div>
                <div class="skeleton-value"></div>
                <div class="skeleton-status"></div>
                <div class="skeleton-chart">
                    <div class="skeleton-bars">
                        ${Array(10).fill(0).map(() => '<div class="skeleton-bar"></div>').join('')}
                    </div>
                </div>
            </div>
        `;
    },

    createSkeletonTable() {
        return `
            <div class="skeleton-table">
                <div class="skeleton-table-header">
                    ${Array(5).fill(0).map(() => '<div class="skeleton-header-cell"></div>').join('')}
                </div>
                ${Array(8).fill(0).map(() => `
                    <div class="skeleton-table-row">
                        ${Array(5).fill(0).map(() => '<div class="skeleton-cell"></div>').join('')}
                    </div>
                `).join('')}
            </div>
        `;
    },

    createSkeletonForecast() {
        return `
            <div class="skeleton-forecast">
                <div class="skeleton-forecast-title"></div>
                <div class="skeleton-forecast-chart"></div>
            </div>
        `;
    },

    showSkeleton() {
        // Show skeleton for dashboard cards
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            const skeletonCards = Array(3).fill(0).map(() => this.createSkeletonCard()).join('');
            dashboard.innerHTML = skeletonCards;
        }

        // Show skeleton for data table
        const tableContainer = document.querySelector('.data-table-container');
        if (tableContainer) {
            const tableContent = tableContainer.querySelector('.data-table').parentElement;
            tableContent.innerHTML = `
                <h2><i class="fas fa-history"></i> ข้อมูลย้อนหลัง</h2>
                ${this.createSkeletonTable()}
                <button class="refresh-btn" disabled>
                    <i class="fas fa-sync-alt fa-spin"></i> กำลังโหลด...
                </button>
            `;
        }

        // Show skeleton for forecast
        const forecastContainer = document.getElementById('forecastChart');
        if (forecastContainer) {
            forecastContainer.parentElement.innerHTML = this.createSkeletonForecast();
        }

        // Add skeleton CSS if not already present
        this.addSkeletonStyles();
    },

    hideSkeleton() {
        // Remove skeleton classes and restore original structure
        const skeletonElements = document.querySelectorAll('.skeleton-card, .skeleton-table, .skeleton-forecast');
        skeletonElements.forEach(el => el.remove());
        
        // Re-enable refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> โหลดข้อมูลใหม่';
        }
    },

    addSkeletonStyles() {
        if (document.getElementById('skeleton-styles')) return;

        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = `
            /* Skeleton Loading Styles */
            .skeleton-card {
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
            }

            .skeleton-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }

            .skeleton-icon {
                width: 24px;
                height: 24px;
                background: #e0e0e0;
                border-radius: 4px;
            }

            .skeleton-title {
                width: 120px;
                height: 20px;
                background: #e0e0e0;
                border-radius: 4px;
            }

            .skeleton-value {
                width: 150px;
                height: 40px;
                background: #e0e0e0;
                border-radius: 6px;
                margin-bottom: 10px;
            }

            .skeleton-status {
                width: 200px;
                height: 16px;
                background: #e0e0e0;
                border-radius: 12px;
                margin-bottom: 15px;
            }

            .skeleton-chart {
                height: 200px;
                background: #f5f5f5;
                border-radius: 8px;
                padding: 15px;
            }

            .skeleton-bars {
                display: flex;
                align-items: flex-end;
                gap: 2px;
                height: 100%;
            }

            .skeleton-bar {
                flex: 1;
                background: #e0e0e0;
                border-radius: 3px 3px 0 0;
                animation: skeleton-bar-pulse 1.2s ease-in-out infinite alternate;
            }

            .skeleton-bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
            .skeleton-bar:nth-child(2) { height: 80%; animation-delay: 0.2s; }
            .skeleton-bar:nth-child(3) { height: 45%; animation-delay: 0.3s; }
            .skeleton-bar:nth-child(4) { height: 90%; animation-delay: 0.4s; }
            .skeleton-bar:nth-child(5) { height: 70%; animation-delay: 0.5s; }
            .skeleton-bar:nth-child(6) { height: 85%; animation-delay: 0.6s; }
            .skeleton-bar:nth-child(7) { height: 55%; animation-delay: 0.7s; }
            .skeleton-bar:nth-child(8) { height: 75%; animation-delay: 0.8s; }
            .skeleton-bar:nth-child(9) { height: 65%; animation-delay: 0.9s; }
            .skeleton-bar:nth-child(10) { height: 95%; animation-delay: 1.0s; }

            .skeleton-table {
                background: white;
                border-radius: 8px;
                overflow: hidden;
            }

            .skeleton-table-header {
                display: flex;
                background: #f0f0f0;
                padding: 12px 15px;
                gap: 15px;
            }

            .skeleton-header-cell {
                flex: 1;
                height: 16px;
                background: #d0d0d0;
                border-radius: 4px;
            }

            .skeleton-table-row {
                display: flex;
                padding: 12px 15px;
                gap: 15px;
                border-bottom: 1px solid #f0f0f0;
            }

            .skeleton-table-row:nth-child(even) {
                background: #fafafa;
            }

            .skeleton-cell {
                flex: 1;
                height: 14px;
                background: #e0e0e0;
                border-radius: 4px;
            }

            .skeleton-forecast {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-top: 20px;
            }

            .skeleton-forecast-title {
                width: 300px;
                height: 20px;
                background: #e0e0e0;
                border-radius: 4px;
                margin-bottom: 20px;
            }

            .skeleton-forecast-chart {
                width: 100%;
                height: 200px;
                background: #e0e0e0;
                border-radius: 8px;
            }

            @keyframes skeleton-pulse {
                0% { opacity: 1; }
                100% { opacity: 0.6; }
            }

            @keyframes skeleton-bar-pulse {
                0% { opacity: 0.6; }
                100% { opacity: 1; }
            }

            /* Loading state modifications */
            .refresh-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .refresh-btn:disabled:hover {
                background-color: #1e88e5;
            }
        `;
        document.head.appendChild(style);
    }
};

// API integration utilities
const APIUtils = {
    baseURL: 'http://localhost:5000/api',
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 seconds timeout
            ...options
        };

        let lastError;
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`🔄 API Request (attempt ${attempt}/${this.retryAttempts}): ${endpoint}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);
                
                const response = await fetch(url, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`✅ API Success: ${endpoint}`);
                return data;
                
            } catch (error) {
                lastError = error;
                console.warn(`❌ API Attempt ${attempt} failed for ${endpoint}:`, error.message);
                
                // Don't retry on client errors (4xx)
                if (error.message.includes('HTTP 4')) {
                    break;
                }
                
                // Wait before retrying (except on last attempt)
                if (attempt < this.retryAttempts) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                }
            }
        }
        
        console.error(`🚫 API Failed after ${this.retryAttempts} attempts: ${endpoint}`);
        throw lastError;
    },

    async getSensorData(pondId) {
        const response = await this.request(`/sensors/${pondId}/current`);
        return response.success ? response.data : null;
    },

    async getHistoricalData(pondId, limit = 50) {
        const response = await this.request(`/sensors/${pondId}/history?limit=${limit}`);
        return response.success ? response.data : [];
    },

    async getAnalysis(pondId, sensorData) {
        const response = await this.request(`/analysis/${pondId}`, {
            method: 'POST',
            body: JSON.stringify(sensorData)
        });
        return response.success ? response.analysis : null;
    },

    async getForecast(pondId, parameter = 'turbidity') {
        const response = await this.request(`/forecast/${pondId}?parameter=${parameter}`);
        return response.success ? response.forecast : null;
    },

    async checkServerStatus() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, StatusUtils, ChartUtils, NotificationUtils, DataUtils, SkeletonUtils, APIUtils };
}