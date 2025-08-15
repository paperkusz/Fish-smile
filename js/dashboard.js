/**
 * Fish-Smile Dashboard Base Class
 * Main dashboard functionality that can be extended for specific pond types
 */

class FishSmileDashboard {
    constructor(config) {
        this.config = {
            pondId: config.pondId,
            pondName: config.pondName,
            sampleData: config.sampleData || [],
            precision: {
                pH: 2,
                tds: 1,
                turbidity: 2,
                ...config.precision
            },
            forecastConfig: config.forecastConfig || {},
            analysisConfig: config.analysisConfig || {},
            notificationColor: config.notificationColor || '#e74c3c'
        };
        
        this.charts = {};
        this.refreshTimer = null;
        
        this.init();
    }

    init() {
        // Initialize dashboard on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadData());
        } else {
            this.loadData();
        }
        
        // Set up auto-refresh
        this.startAutoRefresh();
    }

    async loadData() {
        // Show skeleton loading
        SkeletonUtils.showSkeleton();
        
        try {
            // Attempt to fetch real data from API
            const data = await this.fetchFromAPI();
            
            if (!data || data.length === 0) {
                console.warn('No data available for pond:', this.config.pondId);
                // Fall back to sample data if no API data
                return this.loadSampleData();
            }

            // Hide skeleton and restore original structure
            SkeletonUtils.hideSkeleton();
            this.restoreOriginalStructure();

            // Wait for DOM to be ready after structure restoration
            await new Promise(resolve => setTimeout(resolve, 100));

            // Sort data newest first
            const sortedData = DataUtils.sortByTimestamp(data);

            // Update display values
            DataUtils.updateDisplayValues(sortedData[0], this.config);
            
            // Update status indicators
            this.updateStatusIndicators(sortedData[0]);
            
            // Update charts - with DOM ready check
            await this.createChartsWithDelay(sortedData);
            
            // Create forecast chart - with DOM ready check
            await this.createForecastChartWithDelay(sortedData);
            
            // Update data table
            this.updateDataTable(sortedData);
            
            // Show notifications if needed
            this.checkAndShowNotifications(sortedData[0]);
            
        } catch (error) {
            console.error('Error loading data:', error);
            
            // Hide skeleton and fall back to sample data
            SkeletonUtils.hideSkeleton();
            this.restoreOriginalStructure();
            
            // Wait before loading sample data
            setTimeout(() => {
                this.loadSampleData();
            }, 100);
            
            // Show error notification
            this.handleError(error);
        }
    }

    async loadSampleData() {
        console.log('Loading sample data for pond:', this.config.pondId);
        
        const sortedData = DataUtils.sortByTimestamp(this.config.sampleData);
        
        if (sortedData.length === 0) {
            console.warn('No sample data available for pond:', this.config.pondId);
            return;
        }

        // Wait for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Update display values
        DataUtils.updateDisplayValues(sortedData[0], this.config);
        
        // Update status indicators
        this.updateStatusIndicators(sortedData[0]);
        
        // Update charts with delay
        await this.createChartsWithDelay(sortedData);
        
        // Create forecast chart with delay
        await this.createForecastChartWithDelay(sortedData);
        
        // Update data table
        this.updateDataTable(sortedData);
        
        // Show notifications if needed
        this.checkAndShowNotifications(sortedData[0]);
    }

    restoreOriginalStructure() {
        console.log('🔧 Restoring original dashboard structure...');
        
        // Restore dashboard cards structure
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.innerHTML = `
                <div class="card">
                    <h2><i class="fas fa-tint"></i> ค่า pH</h2>
                    <div class="value" id="phValue">-- <span class="unit">pH</span></div>
                    <div class="status">
                        <div class="status-indicator good"></div>
                        <span>กำลังโหลด...</span>
                    </div>
                    <div class="chart-container" id="phChart"></div>
                </div>
                
                <div class="card">
                    <h2><i class="fas fa-water"></i> ค่า TDS</h2>
                    <div class="value" id="tdsValue">-- <span class="unit">ppm</span></div>
                    <div class="status">
                        <div class="status-indicator good"></div>
                        <span>กำลังโหลด...</span>
                    </div>
                    <div class="chart-container" id="tdsChart"></div>
                </div>
                
                <div class="card">
                    <h2><i class="fas fa-cloud"></i> ความขุ่น</h2>
                    <div class="value" id="turbidityValue">-- <span class="unit">NTU</span></div>
                    <div class="status">
                        <div class="status-indicator good"></div>
                        <span>กำลังโหลด...</span>
                    </div>
                    <div class="chart-container" id="turbidityChart"></div>
                </div>
            `;
        }

        // Restore data table structure
        const tableContainer = document.querySelector('.data-table-container');
        if (tableContainer) {
            const existingTitle = tableContainer.querySelector('h2');
            const titleHTML = existingTitle ? existingTitle.outerHTML : '<h2><i class="fas fa-history"></i> ข้อมูลย้อนหลัง</h2>';
            
            tableContainer.innerHTML = `
                ${titleHTML}
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>วันที่/เวลา</th>
                            <th>ค่า pH</th>
                            <th>ค่า TDS</th>
                            <th>ความขุ่น</th>
                            <th>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody id="dataTableBody">
                        <!-- Data will be populated here -->
                    </tbody>
                </table>
                <button class="refresh-btn" onclick="refreshDashboard()">
                    <i class="fas fa-sync-alt"></i> โหลดข้อมูลใหม่
                </button>
            `;
        }

        // Restore forecast chart container - find the correct parent container
        const existingForecastChart = document.getElementById('forecastChart');
        if (existingForecastChart) {
            // Get the parent container which should have class 'forecast-chart-container'
            const forecastContainer = existingForecastChart.closest('.forecast-chart-container') || 
                                    existingForecastChart.parentElement;
            
            if (forecastContainer) {
                forecastContainer.innerHTML = '<canvas id="forecastChart"></canvas>';
            }
        } else {
            // Try to find forecast container by class if canvas doesn't exist
            const forecastContainer = document.querySelector('.forecast-chart-container');
            if (forecastContainer) {
                forecastContainer.innerHTML = '<canvas id="forecastChart"></canvas>';
            }
        }
        
        console.log('✅ Dashboard structure restored');
    }

    updateStatusIndicators(data) {
        const indicators = {
            pH: { element: document.querySelector('#phValue').parentElement.querySelector('.status'), value: data.pH },
            tds: { element: document.querySelector('#tdsValue').parentElement.querySelector('.status'), value: data.tds },
            turbidity: { element: document.querySelector('#turbidityValue').parentElement.querySelector('.status'), value: data.turbidity }
        };

        Object.keys(indicators).forEach(key => {
            const { element, value } = indicators[key];
            if (element && value !== undefined) {
                const statusClass = StatusUtils.getStatusClass(value, key);
                const statusText = StatusUtils.getStatusText(value, key);
                element.innerHTML = `<div class="status-indicator ${statusClass}"></div><span>${statusText}</span>`;
            }
        });
    }

    createCharts(data) {
        const recentData = DataUtils.getRecentData(data);
        
        // Create individual parameter charts
        ChartUtils.createSimpleChart('phChart', recentData.map(d => d.pH), 'pH', this.config.sampleData);
        ChartUtils.createSimpleChart('tdsChart', recentData.map(d => d.tds), 'TDS (ppm)', this.config.sampleData);
        ChartUtils.createSimpleChart('turbidityChart', recentData.map(d => d.turbidity), 'ความขุ่น (NTU)', this.config.sampleData);
    }

    async createChartsWithDelay(data) {
        // Ensure chart containers exist in DOM
        const chartContainers = ['phChart', 'tdsChart', 'turbidityChart'];
        
        for (const containerId of chartContainers) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn(`Chart container ${containerId} not found, waiting...`);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        console.log('📊 Creating charts with API data...');
        this.createCharts(data);
    }

    async createForecastChartWithDelay(data) {
        // Ensure forecast chart container exists
        let attempts = 0;
        while (attempts < 10) {
            const ctx = document.getElementById('forecastChart');
            if (ctx) {
                console.log('📈 Creating forecast chart with API data...');
                this.createForecastChart(data);
                return;
            }
            
            console.warn(`Forecast chart container not found, attempt ${attempts + 1}/10`);
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
        
        console.error('Failed to find forecast chart container after 10 attempts');
    }

    createForecastChart(data) {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;
        
        const context = ctx.getContext('2d');
        const config = this.config.forecastConfig;
        
        if (!config.dataExtractor || !config.forecastGenerator) {
            console.warn('Forecast configuration incomplete for pond:', this.config.pondId);
            return;
        }

        // Destroy existing chart if it exists
        if (this.charts.forecast) {
            this.charts.forecast.destroy();
        }

        this.charts.forecast = ChartUtils.createForecastChart(context, data, config);
    }

    updateDataTable(data) {
        const tableBody = document.getElementById('dataTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        const recentData = data.slice(0, CONFIG.maxDataPoints);
        
        recentData.forEach(item => {
            const row = this.createTableRow(item);
            tableBody.appendChild(row);
        });
    }

    createTableRow(item) {
        const row = document.createElement('tr');
        const status = this.getOverallStatus(item);
        
        row.innerHTML = `
            <td>${item.timestamp}</td>
            <td>${item.pH.toFixed(this.config.precision.pH)}</td>
            <td>${item.tds.toFixed(this.config.precision.tds)}</td>
            <td>${item.turbidity.toFixed(this.config.precision.turbidity)}</td>
            <td><div class="status-indicator ${status.class}"></div> ${status.text}</td>
        `;
        
        return row;
    }

    getOverallStatus(data) {
        // Check for critical issues first
        const phStatus = StatusUtils.getStatusClass(data.pH, 'pH');
        const tdsStatus = StatusUtils.getStatusClass(data.tds, 'tds');
        const turbidityStatus = StatusUtils.getStatusClass(data.turbidity, 'turbidity');
        
        if (phStatus === 'danger' || tdsStatus === 'danger') {
            return { class: 'danger', text: 'วิกฤต! ค่า pH และความขุ่นสูง' };
        }
        
        if (turbidityStatus === 'warning') {
            return { class: 'warning', text: 'ความขุ่นสูง' };
        }
        
        return { class: 'good', text: 'ปกติ' };
    }

    checkAndShowNotifications(data) {
        let alertCount = 0;
        
        // Count alerts based on thresholds
        if (StatusUtils.getStatusClass(data.pH, 'pH') === 'danger') alertCount++;
        if (StatusUtils.getStatusClass(data.tds, 'tds') === 'danger') alertCount++;
        if (StatusUtils.getStatusClass(data.turbidity, 'turbidity') === 'warning') alertCount++;
        
        if (alertCount > 0) {
            NotificationUtils.show(alertCount, this.config.notificationColor);
        }
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            this.loadData();
        }, CONFIG.refreshInterval);
    }

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    handleError(error) {
        console.error('Dashboard error:', error);
        // Could show user-friendly error message
        // Could fall back to cached data
        // Could retry with exponential backoff
    }

    destroy() {
        this.stopAutoRefresh();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        
        this.charts = {};
    }

    // API integration point - now using APIUtils
    async fetchFromAPI() {
        try {
            // Get current sensor data
            const currentData = await APIUtils.getSensorData(this.config.pondId);
            
            // Get historical data for charts
            const historicalData = await APIUtils.getHistoricalData(this.config.pondId, 50);
            
            // Combine current reading with historical data
            const allData = [currentData, ...historicalData];
            
            // Remove duplicates based on timestamp
            const uniqueData = allData.filter((item, index, arr) => 
                arr.findIndex(t => t.timestamp === item.timestamp) === index
            );
            
            return uniqueData;
            
        } catch (error) {
            console.warn(`API fetch failed for pond ${this.config.pondId}:`, error.message);
            throw error;
        }
    }
}

// Make refresh function globally available for button onclick
window.refreshDashboard = function() {
    if (window.dashboardInstance) {
        window.dashboardInstance.loadData();
    }
};