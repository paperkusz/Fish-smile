/**
 * Fish-Smile Pond 3 Configuration (ปลาดุก)
 * Specific configuration and data for Pond 3
 */

// Sample data for Pond 3 (ปลาดุก) - Good condition with optimal parameters
const pond3SampleData = [
    { timestamp: '7/8/2025, 20:43:35', pH: 7.35, tds: 305, turbidity: 4.2 },
    { timestamp: '7/8/2025, 20:43:43', pH: 7.28, tds: 295, turbidity: 3.8 },
    { timestamp: '7/8/2025, 20:43:52', pH: 7.32, tds: 300, turbidity: 4.0 },
    { timestamp: '7/8/2025, 20:44:06', pH: 7.40, tds: 315, turbidity: 4.5 },
    { timestamp: '7/8/2025, 20:44:12', pH: 7.48, tds: 330, turbidity: 5.5 },
    { timestamp: '7/8/2025, 20:44:20', pH: 7.52, tds: 335, turbidity: 5.8 },
    { timestamp: '7/8/2025, 20:44:29', pH: 7.40, tds: 310, turbidity: 4.7 },
    { timestamp: '7/8/2025, 20:44:37', pH: 7.45, tds: 325, turbidity: 5.2 },
    { timestamp: '7/8/2025, 20:44:46', pH: 7.38, tds: 315, turbidity: 4.5 },
    { timestamp: '7/8/2025, 20:44:58', pH: 7.42, tds: 320, turbidity: 4.8 },
    { timestamp: '7/8/2025, 20:45:06', pH: 7.40, tds: 315, turbidity: 4.5 },
    { timestamp: '7/8/2025, 20:45:14', pH: 7.32, tds: 300, turbidity: 4.0 },
    { timestamp: '7/8/2025, 20:45:23', pH: 7.28, tds: 295, turbidity: 3.8 },
    { timestamp: '7/8/2025, 20:45:31', pH: 7.35, tds: 305, turbidity: 4.2 },
    { timestamp: '7/8/2025, 20:45:40', pH: 7.48, tds: 330, turbidity: 5.5 },
    { timestamp: '7/8/2025, 20:45:48', pH: 7.52, tds: 335, turbidity: 5.8 },
    { timestamp: '7/8/2025, 20:45:57', pH: 7.40, tds: 310, turbidity: 4.7 },
    { timestamp: '7/8/2025, 20:46:06', pH: 7.45, tds: 325, turbidity: 5.2 },
    { timestamp: '7/8/2025, 20:46:16', pH: 7.38, tds: 315, turbidity: 4.5 },
    { timestamp: '7/8/2025, 20:46:26', pH: 7.42, tds: 320, turbidity: 4.8 }
];

// Pond 3 specific configuration
const pond3Config = {
    pondId: 'pond3',
    pondName: 'บ่อปลาที่ 3 (ปลาดุก)',
    sampleData: pond3SampleData,
    precision: {
        pH: 2,
        tds: 0,
        turbidity: 1
    },
    notificationColor: '#2ecc71', // Green for good status
    forecastConfig: {
        title: 'แนวโน้มค่า pH และพยากรณ์ 2 ชั่วโมงข้างหน้า',
        yAxisLabel: 'ค่า pH',
        yAxis: {
            min: 6,
            max: 9
        },
        dataExtractor: (data) => data.slice(0, 10).map(d => d.pH).reverse(),
        forecastGenerator: (phData) => {
            const lastValue = phData[phData.length - 1];
            return [
                lastValue,
                lastValue + 0.05,
                lastValue + 0.08,
                lastValue + 0.10,
                lastValue + 0.12
            ];
        },
        thresholds: [
            {
                label: 'เกณฑ์ปลอดภัย (สูงสุด)',
                value: 8.5,
                color: '#f39c12'
            },
            {
                label: 'เกณฑ์ปลอดภัย (ต่ำสุด)',
                value: 6.5,
                color: '#f39c12'
            }
        ]
    }
};

// Extend the dashboard for pond-specific behavior
class Pond3Dashboard extends FishSmileDashboard {
    getOverallStatus(data) {
        // Override for pond 3 - generally good condition
        const phStatus = StatusUtils.getStatusClass(data.pH, 'pH');
        const tdsStatus = StatusUtils.getStatusClass(data.tds, 'tds');
        const turbidityStatus = StatusUtils.getStatusClass(data.turbidity, 'turbidity');
        
        if (phStatus === 'danger' || tdsStatus === 'danger') {
            return { class: 'danger', text: 'ต้องระวัง' };
        }
        
        if (turbidityStatus === 'warning') {
            return { class: 'warning', text: 'ปกติ' };
        }
        
        return { class: 'good', text: 'ปกติ' };
    }

    checkAndShowNotifications(data) {
        // Only show notifications if there are actual issues
        let alertCount = 0;
        
        if (StatusUtils.getStatusClass(data.pH, 'pH') === 'danger') alertCount++;
        if (StatusUtils.getStatusClass(data.tds, 'tds') === 'danger') alertCount++;
        if (StatusUtils.getStatusClass(data.turbidity, 'turbidity') === 'warning') alertCount++;
        
        if (alertCount > 0) {
            NotificationUtils.show(alertCount, '#f39c12'); // Orange for warnings
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardInstance = new Pond3Dashboard(pond3Config);
});

// Make loadData available globally for refresh button
window.loadData = function() {
    if (window.dashboardInstance) {
        window.dashboardInstance.loadData();
    }
};