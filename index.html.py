<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fish-Smile Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f0f8ff;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px 0;
            background-color: #1e88e5;
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            margin-bottom: 10px;
            font-size: 2rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h2 {
            color: #1e88e5;
            margin-bottom: 15px;
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .value {
            font-size: 2.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .unit {
            font-size: 1rem;
            color: #7f8c8d;
        }
        
        .chart-container {
            height: 200px;
            margin-top: 15px;
            position: relative;
        }
        
        .status {
            display: flex;
            align-items: center;
            margin-top: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            background-color: #f8f9fa;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .good {
            background-color: #2ecc71;
        }
        
        .warning {
            background-color: #f39c12;
        }
        
        .danger {
            background-color: #e74c3c;
        }
        
        .data-table-container {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .data-table th {
            background-color: #1e88e5;
            color: white;
            padding: 12px 15px;
            text-align: left;
        }
        
        .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .data-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .refresh-btn {
            background-color: #1e88e5;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.3s;
        }
        
        .refresh-btn:hover {
            background-color: #1565c0;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 1.5rem;
            }
            
            .value {
                font-size: 1.8rem;
            }
        }
        
        /* Loading spinner */
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1e88e5;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
            display: none;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-fish"></i> Fish-Smile Monitoring System</h1>
            <p>อุปกรณ์อัจฉริยะตรวจคุณภาพน้ำสำหรับการเลี้ยงปลาในบ่อปิดและแจ้งเตือนเมื่อคุณภาพน้ำเปลี่ยนไป</p>
        </div>
        
        <div class="loader" id="loader"></div>
        
        <div class="dashboard" id="dashboard">
            <div class="card">
                <h2><i class="fas fa-tint"></i> ค่า pH</h2>
                <div class="value">-- <span class="unit">pH</span></div>
                <div class="status">
                    <div class="status-indicator"></div>
                    <span>กำลังโหลดข้อมูล...</span>
                </div>
                <div class="chart-container" id="phChart">
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: #95a5a6;">
                        <p>กราฟแสดงค่า pH ย้อนหลัง 24 ชั่วโมง</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-water"></i> ค่า TDS</h2>
                <div class="value">-- <span class="unit">ppm</span></div>
                <div class="status">
                    <div class="status-indicator"></div>
                    <span>กำลังโหลดข้อมูล...</span>
                </div>
                <div class="chart-container" id="tdsChart">
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: #95a5a6;">
                        <p>กราฟแสดงค่า TDS ย้อนหลัง 24 ชั่วโมง</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-cloud"></i> ความขุ่น</h2>
                <div class="value">-- <span class="unit">NTU</span></div>
                <div class="status">
                    <div class="status-indicator"></div>
                    <span>กำลังโหลดข้อมูล...</span>
                </div>
                <div class="chart-container" id="turbidityChart">
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: #95a5a6;">
                        <p>กราฟแสดงค่าความขุ่นย้อนหลัง 24 ชั่วโมง</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="data-table-container">
            <h2><i class="fas fa-history"></i> ข้อมูลย้อนหลัง</h2>
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
                    <tr>
                        <td colspan="5" style="text-align: center;">กำลังโหลดข้อมูล...</td>
                    </tr>
                </tbody>
            </table>
            <button class="refresh-btn" onclick="loadData()">
                <i class="fas fa-sync-alt"></i> โหลดข้อมูลใหม่
            </button>
        </div>
        
        <div class="footer">
            <p>ระบบ Fish-Smile Dashboard | พัฒนาโดยทีมงาน AquaTech | © 2023</p>
        </div>
    </div>

    <script>
        // URL ของ Google Apps Script Web App
        const API_URL = "https://script.google.com/macros/s/AKfycbylzCVh6uAy-P6fKzH6T9DiEBNAFcpr8iGhlXpwIzwkr29rZbc2FKRBEQlbN1MiF4P55w/exec";
        
        // ฟังก์ชันสำหรับโหลดข้อมูล
        async function loadData() {
            const loader = document.getElementById('loader');
            const dashboard = document.getElementById('dashboard');
            
            // แสดง loading spinner
            loader.style.display = 'block';
            dashboard.style.opacity = '0.5';
            
            try {
                // ดึงข้อมูลจาก API
                const response = await fetch(API_URL);
                const data = await response.json();
                
                if (data && data.length > 0) {
                    // เรียงข้อมูลจากล่าสุดไปเก่าสุด
                    const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // ข้อมูลล่าสุด
                    const latestData = sortedData[0];
                    
                    // อัพเดทค่าใน Dashboard
                    updateDashboard(latestData);
                    
                    // อัพเดทตารางข้อมูลย้อนหลัง
                    updateDataTable(sortedData);
                    
                    // อัพเดทสถานะ
                    updateStatus(latestData);
                } else {
                    alert('ไม่พบข้อมูลในระบบ');
                }
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูล: ' + error.message);
            } finally {
                // ซ่อน loading spinner
                loader.style.display = 'none';
                dashboard.style.opacity = '1';
            }
        }
        
        // อัพเดท Dashboard ด้วยข้อมูลล่าสุด
        function updateDashboard(data) {
            document.querySelector('.card:nth-child(1) .value').innerHTML = `${data.pH || '--'} <span class="unit">pH</span>`;
            document.querySelector('.card:nth-child(2) .value').innerHTML = `${data.tds || '--'} <span class="unit">ppm</span>`;
            document.querySelector('.card:nth-child(3) .value').innerHTML = `${data.turbidity || '--'} <span class="unit">NTU</span>`;
        }
        
        // อัพเดทตารางข้อมูลย้อนหลัง
        function updateDataTable(data) {
            const tableBody = document.getElementById('dataTableBody');
            tableBody.innerHTML = '';
            
            // จำกัดจำนวนแถวที่แสดง (10 แถวล่าสุด)
            const displayData = data.slice(0, 10);
            
            displayData.forEach(item => {
                const row = document.createElement('tr');
                
                // จัดรูปแบบวันที่
                const date = new Date(item.timestamp);
                const formattedDate = date.toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                // ตรวจสอบสถานะ
                let statusClass = 'good';
                let statusText = 'ปกติ';
                
                // ตัวอย่างเงื่อนไขตรวจสอบสถานะ (ปรับตามความต้องการ)
                if (item.pH < 6.5 || item.pH > 8.5) {
                    statusClass = 'danger';
                    statusText = 'pH ผิดปกติ';
                } else if (item.tds < 100 || item.tds > 500) {
                    statusClass = 'danger';
                    statusText = 'TDS ผิดปกติ';
                } else if (item.turbidity > 10) {
                    statusClass = 'danger';
                    statusText = 'ความขุ่นสูง';
                }
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${item.pH || '--'}</td>
                    <td>${item.tds || '--'}</td>
                    <td>${item.turbidity || '--'}</td>
                    <td><div class="status-indicator ${statusClass}"></div> ${statusText}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        // อัพเดทสถานะ
        function updateStatus(data) {
            // อัพเดทสถานะ pH
            const phStatus = document.querySelector('.card:nth-child(1) .status');
            const phIndicator = document.querySelector('.card:nth-child(1) .status-indicator');
            
            if (data.pH >= 6.5 && data.pH <= 8.5) {
                phIndicator.className = 'status-indicator good';
                phStatus.querySelector('span').textContent = 'อยู่ในเกณฑ์ปกติ (6.5-8.5)';
            } else {
                phIndicator.className = 'status-indicator danger';
                phStatus.querySelector('span').textContent = 'อยู่นอกเกณฑ์ปกติ (6.5-8.5)';
            }
            
            // อัพเดทสถานะ TDS
            const tdsStatus = document.querySelector('.card:nth-child(2) .status');
            const tdsIndicator = document.querySelector('.card:nth-child(2) .status-indicator');
            
            if (data.tds >= 100 && data.tds <= 500) {
                tdsIndicator.className = 'status-indicator good';
                tdsStatus.querySelector('span').textContent = 'อยู่ในเกณฑ์ปกติ (100-500 ppm)';
            } else {
                tdsIndicator.className = 'status-indicator danger';
                tdsStatus.querySelector('span').textContent = 'อยู่นอกเกณฑ์ปกติ (100-500 ppm)';
            }
            
            // อัพเดทสถานะความขุ่น
            const turbidityStatus = document.querySelector('.card:nth-child(3) .status');
            const turbidityIndicator = document.querySelector('.card:nth-child(3) .status-indicator');
            
            if (data.turbidity <= 10) {
                turbidityIndicator.className = 'status-indicator good';
                turbidityStatus.querySelector('span').textContent = 'อยู่ในเกณฑ์ปกติ (0-10 NTU)';
            } else {
                turbidityIndicator.className = 'status-indicator danger';
                turbidityStatus.querySelector('span').textContent = 'อยู่นอกเกณฑ์ปกติ (0-10 NTU)';
            }
        }
        
        // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
        document.addEventListener('DOMContentLoaded', loadData);
    </script>
</body>
</html>
