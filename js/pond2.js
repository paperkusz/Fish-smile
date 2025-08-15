/**
 * Fish-Smile Pond 2 Configuration (ปลานิล)
 * Specific configuration and data for Pond 2
 */

// Sample data for Pond 2 (ปลานิล) - Critical condition with high pH and turbidity
const pond2SampleData = [
    { timestamp: '7/8/2025, 20:43:35', pH: 19.45, tds: 85.6, turbidity: 2793.05 },
    { timestamp: '7/8/2025, 20:43:43', pH: 19.21, tds: 106.3, turbidity: 2690.55 },
    { timestamp: '7/8/2025, 20:43:52', pH: 20.32, tds: 12.5, turbidity: 2819.16 },
    { timestamp: '7/8/2025, 20:44:06', pH: 20.1, tds: 25, turbidity: 2882.02 },
    { timestamp: '7/8/2025, 20:44:12', pH: 20.4, tds: 10.3, turbidity: 2825.93 },
    { timestamp: '7/8/2025, 20:44:20', pH: 20.34, tds: 12.5, turbidity: 2813.36 },
    { timestamp: '7/8/2025, 20:44:29', pH: 19.95, tds: 46, turbidity: 2749.54 },
    { timestamp: '7/8/2025, 20:44:37', pH: 20.32, tds: 11.8, turbidity: 2815.3 },
    { timestamp: '7/8/2025, 20:44:46', pH: 19.24, tds: 107.3, turbidity: 2699.25 },
    { timestamp: '7/8/2025, 20:44:58', pH: 20.65, tds: 0, turbidity: 2820.13 },
    { timestamp: '7/8/2025, 20:45:06', pH: 20.46, tds: 5.7, turbidity: 2825.93 },
    { timestamp: '7/8/2025, 20:45:14', pH: 19.25, tds: 102.3, turbidity: 2751.47 },
    { timestamp: '7/8/2025, 20:45:23', pH: 20.89, tds: 0, turbidity: 2952.62 },
    { timestamp: '7/8/2025, 20:45:31', pH: 19.67, tds: 68.5, turbidity: 2720.53 },
    { timestamp: '7/8/2025, 20:45:40', pH: 20, tds: 45.6, turbidity: 2746.64 },
    { timestamp: '7/8/2025, 20:45:48', pH: 20.66, tds: 0, turbidity: 2874.29 },
    { timestamp: '7/8/2025, 20:45:57', pH: 20.37, tds: 11.8, turbidity: 2816.26 },
    { timestamp: '7/8/2025, 20:46:06', pH: 20.66, tds: 0, turbidity: 2851.08 },
    { timestamp: '7/8/2025, 20:46:16', pH: 19.57, tds: 79.5, turbidity: 2718.59 },
    { timestamp: '7/8/2025, 20:46:26', pH: 19.14, tds: 108.4, turbidity: 2730.2 }
];

// Pond 2 specific configuration
const pond2Config = {
    pondId: 'pond2',
    pondName: 'บ่อปลาที่ 2 (ปลานิล)',
    sampleData: pond2SampleData,
    precision: {
        pH: 2,
        tds: 1,
        turbidity: 2
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

// Extend the dashboard for pond-specific behavior
class Pond2Dashboard extends FishSmileDashboard {
    getOverallStatus(data) {
        // Override for pond 2 - always critical due to extreme values
        if (data.pH > 15 || data.turbidity > 1000) {
            return { class: 'danger', text: 'วิกฤต! ค่า pH และความขุ่นสูง' };
        }
        return super.getOverallStatus(data);
    }

    checkAndShowNotifications(data) {
        // Always show critical notification for pond 2
        NotificationUtils.show(3, this.config.notificationColor);
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardInstance = new Pond2Dashboard(pond2Config);
});

// Make loadData available globally for refresh button
window.loadData = function() {
    if (window.dashboardInstance) {
        window.dashboardInstance.loadData();
    }
};