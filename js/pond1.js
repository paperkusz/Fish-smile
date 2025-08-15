/**
 * Fish-Smile Pond 1 Configuration (ปลาทับทิม)
 * Specific configuration and data for Pond 1
 */

// Sample data for Pond 1 (ปลาทับทิม)
const pond1SampleData = [
    { timestamp: '7/8/2025, 19:15:22', pH: 7.24, tds: 253.2, turbidity: 12.3 },
    { timestamp: '7/8/2025, 19:15:23', pH: 7.21, tds: 258, turbidity: 12.3 },
    { timestamp: '7/8/2025, 19:15:40', pH: 7.23, tds: 269.3, turbidity: 11.6 },
    { timestamp: '7/8/2025, 19:15:41', pH: 7.26, tds: 258.1, turbidity: 11.4 },
    { timestamp: '7/8/2025, 19:56:40', pH: 7.24, tds: 256.5, turbidity: 11.8 },
    { timestamp: '7/8/2025, 19:57:02', pH: 7.23, tds: 253.5, turbidity: 11.2 },
    { timestamp: '7/8/2025, 20:03:39', pH: 7.23, tds: 253.2, turbidity: 11.2 },
    { timestamp: '7/8/2025, 20:03:44', pH: 7.24, tds: 260.6, turbidity: 11.4 },
    { timestamp: '7/8/2025, 20:03:49', pH: 7.27, tds: 238.9, turbidity: 11.6 },
    { timestamp: '7/8/2025, 20:03:54', pH: 7.23, tds: 243.2, turbidity: 11.9 },
    { timestamp: '7/8/2025, 20:03:59', pH: 7.21, tds: 252.2, turbidity: 12.3 },
    { timestamp: '7/8/2025, 20:04:03', pH: 7.24, tds: 245.4, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:04:09', pH: 7.23, tds: 256.2, turbidity: 12.3 },
    { timestamp: '7/8/2025, 20:04:14', pH: 7.23, tds: 251.4, turbidity: 12.4 },
    { timestamp: '7/8/2025, 20:04:19', pH: 7.26, tds: 253.3, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:04:23', pH: 7.25, tds: 251.2, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:04:28', pH: 7.24, tds: 249.6, turbidity: 11.8 },
    { timestamp: '7/8/2025, 20:04:32', pH: 7.23, tds: 252.4, turbidity: 11.9 },
    { timestamp: '7/8/2025, 20:04:37', pH: 7.24, tds: 254.9, turbidity: 11.9 },
    { timestamp: '7/8/2025, 20:04:42', pH: 7.24, tds: 247.6, turbidity: 12.1 },
    { timestamp: '7/8/2025, 20:04:47', pH: 7.25, tds: 246.2, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:04:52', pH: 7.27, tds: 248.3, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:04:58', pH: 7.26, tds: 251.6, turbidity: 11.9 },
    { timestamp: '7/8/2025, 20:05:03', pH: 7.24, tds: 253.9, turbidity: 11.2 },
    { timestamp: '7/8/2025, 20:05:12', pH: 7.24, tds: 253.9, turbidity: 11.4 },
    { timestamp: '7/8/2025, 20:05:19', pH: 7.26, tds: 248.5, turbidity: 11.6 },
    { timestamp: '7/8/2025, 20:05:25', pH: 7.23, tds: 251.3, turbidity: 11.5 },
    { timestamp: '7/8/2025, 20:05:32', pH: 7.24, tds: 256.2, turbidity: 11.2 },
    { timestamp: '7/8/2025, 20:05:39', pH: 7.25, tds: 247.7, turbidity: 11.4 },
    { timestamp: '7/8/2025, 20:05:45', pH: 7.23, tds: 251.9, turbidity: 11.8 },
    { timestamp: '7/8/2025, 20:05:52', pH: 7.25, tds: 248.6, turbidity: 11.8 },
    { timestamp: '7/8/2025, 20:05:57', pH: 7.24, tds: 258.1, turbidity: 11.9 },
    { timestamp: '7/8/2025, 20:06:03', pH: 7.26, tds: 254.5, turbidity: 12.4 },
    { timestamp: '7/8/2025, 20:06:10', pH: 7.24, tds: 257.3, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:06:17', pH: 7.22, tds: 265.6, turbidity: 12.2 },
    { timestamp: '7/8/2025, 20:06:23', pH: 7.24, tds: 267.8, turbidity: 12.3 }
];

// Pond 1 specific configuration
const pond1Config = {
    pondId: 'pond1',
    pondName: 'บ่อปลาที่ 1 (ปลาทับทิม)',
    sampleData: pond1SampleData,
    precision: {
        pH: 2,
        tds: 1,
        turbidity: 1
    },
    notificationColor: '#e74c3c',
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

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardInstance = new FishSmileDashboard(pond1Config);
});

// Make loadData available globally for refresh button
window.loadData = function() {
    if (window.dashboardInstance) {
        window.dashboardInstance.loadData();
    }
};