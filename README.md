<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-fish"></i> Fish-Smile Monitoring System</h1>
            <p>ระบบตรวจสอบคุณภาพน้ำในบ่อเลี้ยงปลาแบบเรียลไทม์</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h2><i class="fas fa-tint"></i> ค่า pH</h2>
                <div class="value">7.2 <span class="unit">pH</span></div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>อยู่ในเกณฑ์ปกติ (6.5-8.5)</span>
                </div>
                <div class="chart-container" id="phChart">
                    <!-- กราฟจะถูกเพิ่มโดย JavaScript -->
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: #95a5a6;">
                        <p>กราฟแสดงค่า pH ย้อนหลัง 24 ชั่วโมง</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-water"></i> ค่า TDS</h2>
                <div class="value">320 <span class="unit">ppm</span></div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>อยู่ในเกณฑ์ปกติ (100-500 ppm)</span>
                </div>
                <div class="chart-container" id="tdsChart">
                    <div style="height: 100%; display: flex; justify-content: center; align-items: center; color: #95a5a6;">
                        <p>กราฟแสดงค่า TDS ย้อนหลัง 24 ชั่วโมง</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2><i class="fas fa-cloud"></i> ความขุ่น</h2>
                <div class="value">5.1 <span class="unit">NTU</span></div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>อยู่ในเกณฑ์ปกติ (0-10 NTU)</span>
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
                        <td>${new Date().toLocaleString('th-TH')}</td>
                        <td>7.2</td>
                        <td>320</td>
                        <td>5.1</td>
                        <td><div class="status-indicator good"></div> ปกติ</td>
                    </tr>
                    <tr>
                        <td>${new Date(Date.now() - 3600000).toLocaleString('th-TH')}</td>
                        <td>7.1</td>
                        <td>315</td>
                        <td>5.3</td>
                        <td><div class="status-indicator good"></div> ปกติ</td>
                    </tr>
                    <tr>
                        <td>${new Date(Date.now() - 7200000).toLocaleString('th-TH')}</td>
                        <td>7.0</td>
                        <td>310</td>
                        <td>5.5</td>
                        <td><div class="status-indicator good"></div> ปกติ</td>
                    </tr>
                    <tr>
                        <td>${new Date(Date.now() - 10800000).toLocaleString('th-TH')}</td>
                        <td>6.9</td>
                        <td>305</td>
                        <td>5.8</td>
                        <td><div class="status-indicator good"></div> ปกติ</td>
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
        // ฟังก์ชันสำหรับโหลดข้อมูล
        function loadData() {
            // ในสภาพแวดล้อมจริงควรดึงข้อมูลจาก API
            
            // สุ่มค่าข้อมูลใหม่ (สำหรับตัวอย่าง)
            const newpH = (7.0 + Math.random() * 0.4).toFixed(1);
            const newTDS = Math.floor(300 + Math.random() * 50);
            const newTurbidity = (5.0 + Math.random() * 2).toFixed(1);
            
            // อัพเดทค่า
            document.querySelector('.card:nth-child(1) .value').innerHTML = `${newpH} <span class="unit">pH</span>`;
            document.querySelector('.card:nth-child(2) .value').innerHTML = `${newTDS} <span class="unit">ppm</span>`;
            document.querySelector('.card:nth-child(3) .value').innerHTML = `${newTurbidity} <span class="unit">NTU</span>`;
            
            // เพิ่มข้อมูลใหม่ในตาราง
            const tableBody = document.getElementById('dataTableBody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${new Date().toLocaleString('th-TH')}</td>
                <td>${newpH}</td>
                <td>${newTDS}</td>
                <td>${newTurbidity}</td>
                <td><div class="status-indicator good"></div> ปกติ</td>
            `;
            tableBody.insertBefore(newRow, tableBody.firstChild);
            
            // จำกัดจำนวนแถวในตารางไม่เกิน 10 แถว
            if (tableBody.children.length > 10) {
                tableBody.removeChild(tableBody.lastChild);
            }
            
            // แสดงข้อความแจ้งเตือน
            alert('อัพเดทข้อมูลล่าสุดเรียบร้อยแล้ว');
        }
    </script>
</body>
</html>
