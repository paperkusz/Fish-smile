/**
 * Fish-Smile Pond 4 Configuration (บ่ออนุบาลลูกปลา)
 * Specific configuration and data for Pond 4 (Nursery Pond)
 */

// Sample data for Pond 4 (บ่ออนุบาลลูกปลา) - Warning condition with turbidity issues
const pond4SampleData = [
    { timestamp: '8/8/2025, 18:53:43', pH: 6.59, tds: 88.8, turbidity: 18.96 },
    { timestamp: '8/8/2025, 18:53:48', pH: 6.58, tds: 87.4, turbidity: 18.79 },
    { timestamp: '8/8/2025, 18:53:53', pH: 6.6, tds: 89.1, turbidity: 18.9 },
    { timestamp: '8/8/2025, 18:54:01', pH: 6.54, tds: 78.1, turbidity: 19.15 },
    { timestamp: '8/8/2025, 18:54:06', pH: 6.61, tds: 87.7, turbidity: 19.01 },
    { timestamp: '8/8/2025, 18:54:12', pH: 6.61, tds: 89.1, turbidity: 18.71 },
    { timestamp: '8/8/2025, 18:54:17', pH: 6.61, tds: 87, turbidity: 19.15 },
    { timestamp: '8/8/2025, 18:54:24', pH: 6.59, tds: 88.1, turbidity: 19.01 },
    { timestamp: '8/8/2025, 18:54:31', pH: 6.59, tds: 87.4, turbidity: 19.64 },
    { timestamp: '8/8/2025, 18:54:37', pH: 6.59, tds: 86.6, turbidity: 18.9 },
    { timestamp: '8/8/2025, 18:54:44', pH: 6.59, tds: 86.6, turbidity: 19.5 },
    { timestamp: '8/8/2025, 18:54:50', pH: 6.6, tds: 88.1, turbidity: 19.64 },
    { timestamp: '8/8/2025, 18:54:56', pH: 6.6, tds: 89.1, turbidity: 19.64 },
    { timestamp: '8/8/2025, 18:55:02', pH: 6.6, tds: 87.4, turbidity: 19.39 },
    { timestamp: '8/8/2025, 18:55:07', pH: 6.61, tds: 87.7, turbidity: 19.28 },
    { timestamp: '8/8/2025, 18:55:13', pH: 6.6, tds: 87.7, turbidity: 19.15 },
    { timestamp: '8/8/2025, 18:55:18', pH: 6.61, tds: 74.2, turbidity: 19.56 },
    { timestamp: '8/8/2025, 18:55:24', pH: 6.54, tds: 74.2, turbidity: 17.89 },
    { timestamp: '8/8/2025, 18:55:31', pH: 6.56, tds: 73.8, turbidity: 23.16 }
];

// Pond 4 specific configuration
const pond4Config = {
    pondId: 'pond4',
    pondName: 'บ่ออนุบาลลูกปลา',
    sampleData: pond4SampleData,
    precision: {
        pH: 2,
        tds: 1,
        turbidity: 2
    },
    notificationColor: '#f39c12', // Orange for warning
    forecastConfig: {
        title: 'แนวโน้มความขุ่นและพยากรณ์ 2 ชั่วโมงข้างหน้า',
        yAxisLabel: 'ความขุ่น (NTU)',
        dataExtractor: (data) => data.slice(0, 10).map(d => d.turbidity).reverse(),
        forecastGenerator: (turbidityData) => {
            const lastValue = turbidityData[turbidityData.length - 1];
            return [
                lastValue,
                lastValue * 0.98,
                lastValue * 0.96,
                lastValue * 0.94,
                lastValue * 0.92
            ];
        },
        thresholds: [
            {
                label: 'เกณฑ์ปลอดภัย',
                value: 10,
                color: '#2ecc71'
            }
        ]
    }
};

// Extend the dashboard for pond-specific behavior
class Pond4Dashboard extends FishSmileDashboard {
    updateStatusIndicators(data) {
        // Custom status logic for nursery pond
        const indicators = [
            { 
                id: 'phValue', 
                parameter: 'pH', 
                value: data.pH,
                customLogic: (value) => {
                    if (value < 6.5 || value > 8.5) return 'danger';
                    return 'good';
                }
            },
            { 
                id: 'tdsValue', 
                parameter: 'tds', 
                value: data.tds,
                customLogic: (value) => {
                    if (value < 100) return 'warning';
                    if (value > 500) return 'danger';
                    return 'good';
                }
            },
            { 
                id: 'turbidityValue', 
                parameter: 'turbidity', 
                value: data.turbidity,
                customLogic: (value) => {
                    if (value > 10) return 'warning';
                    return 'good';
                }
            }
        ];

        indicators.forEach(({ id, parameter, value, customLogic }) => {
            const element = document.querySelector(`#${id}`).parentElement.querySelector('.status');
            if (element && value !== undefined) {
                const statusClass = customLogic ? customLogic(value) : StatusUtils.getStatusClass(value, parameter);
                const statusText = StatusUtils.getStatusText(value, parameter);
                element.innerHTML = `<div class="status-indicator ${statusClass}"></div><span>${statusText}</span>`;
            }
        });
    }

    getOverallStatus(data) {
        // Override for nursery pond - more sensitive to turbidity
        if (data.turbidity > 10) {
            return { class: 'warning', text: 'ความขุ่นสูง' };
        }
        
        const phStatus = StatusUtils.getStatusClass(data.pH, 'pH');
        const tdsStatus = StatusUtils.getStatusClass(data.tds, 'tds');
        
        if (phStatus === 'danger' || tdsStatus === 'danger') {
            return { class: 'danger', text: 'ต้องระวัง' };
        }
        
        return { class: 'good', text: 'ปกติ' };
    }

    checkAndShowNotifications(data) {
        // Show warnings for nursery pond
        let alertCount = 0;
        
        if (StatusUtils.getStatusClass(data.pH, 'pH') === 'danger') alertCount++;
        if (StatusUtils.getStatusClass(data.tds, 'tds') === 'warning') alertCount++;
        if (data.turbidity > 10) alertCount++;
        
        if (alertCount > 0) {
            NotificationUtils.show(alertCount, this.config.notificationColor);
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardInstance = new Pond4Dashboard(pond4Config);
});

// Make loadData available globally for refresh button
window.loadData = function() {
    if (window.dashboardInstance) {
        window.dashboardInstance.loadData();
    }
};