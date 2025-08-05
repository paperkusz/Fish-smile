<!DOCTYPE html>
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
            background-color: #f5f5f5;
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
            border-bottom: 1px solid #ddd;
        }
        
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .card h2 {
            color: #3498db;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .value {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .chart-container {
            height: 200px;
            margin-top: 15px;
        }
        
        .status {
            display: flex;
            align-items: center;
            margin-top: 10px;
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
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .data-table th, .data-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .data-table th {
            background-color: #f2f2f2;
        }
        
        .refresh-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            display: block;
            width: 100%;
        }
        
        .refresh-btn:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Fish-Smile</h1>
            <p>อุปกรณ์อัจฉริยะตรวจคุณภาพน้ำสำหรับการเลี้ยงปลาในบ่อปิดและแจ้งเตือนเมื่อคุณภาพน้ำเปลี่ยนไป</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h2>ค่า pH</h2>
                <div class="value" id="phValue">7.2</div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>ปกติ</span>
                </div>
                <div class="chart-container" id="phChart"></div>
            </div>
            
            <div class="card">
                <h2>ค่า TDS</h2>
                <div class="value" id="tdsValue">320 ppm</div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>ปกติ</span>
                </div>
                <div class="chart-container" id="tdsChart"></div>
            </div>
            
            <div class="card">
                <h2>ความขุ่น</h2>
                <div class="value" id="turbidityValue">5.1 NTU</div>
                <div class="status">
                    <div class="status-indicator good"></div>
                    <span>ปกติ</span>
                </div>
                <div class="chart-container" id="turbidityChart"></div>
            </div>
        </div>
        
        <div class="card" style="margin-top: 30px;">
            <h2>ข้อมูลล่าสุด</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>เวลา</th>
                        <th>ค่า pH</th>
                        <th>ค่า TDS</th>
                        <th>ความขุ่น</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody id="dataTableBody">
                    <!-- ข้อมูลจะถูกเพิ่มโดย JavaScript -->
                </tbody>
            </table>
            <button class="refresh-btn" onclick="loadData()">
                <i class="fas fa-sync-alt"></i> โหลดข้อมูลใหม่
            </button>
        </div>
    </div>

    <script>
        // ฟังก์ชันสำหรับโหลดข้อมูล
        function loadData() {
            // ในที่นี้เป็นข้อมูลตัวอย่าง
            // ในสภาพแวดล้อมจริงควรดึงข้อมูลจาก API
            
            // อัพเดทค่า
            document.getElementById('phValue').textContent = '7.1';
            document.getElementById('tdsValue').textContent = '315 ppm';
            document.getElementById('turbidityValue').textContent = '5.3 NTU';
            
            // อัพเดทตาราง
            const tableBody = document.getElementById('dataTableBody');
            tableBody.innerHTML = `
                <tr>
                    <td>${new Date().toLocaleTimeString()}</td>
                    <td>7.1</td>
                    <td>315</td>
                    <td>5.3</td>
                    <td><span class="status-indicator good"></span> ปกติ</td>
                </tr>
                <tr>
                    <td>${new Date(Date.now() - 3600000).toLocaleTimeString()}</td>
                    <td>7.2</td>
                    <td>320</td>
                    <td>5.1</td>
                    <td><span class="status-indicator good"></span> ปกติ</td>
                </tr>
                <tr>
                    <td>${new Date(Date.now() - 7200000).toLocaleTimeString()}</td>
                    <td>7.0</td>
                    <td>310</td>
                    <td>5.5</td>
                    <td><span class="status-indicator good"></span> ปกติ</td>
                </tr>
            `;
        }
        
        // โหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จ
        window.onload = loadData;
    </script>
</body>
</html>
