<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <title>Fish-Smile Monitoring System</title>
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
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px 0;
        }
        
        .header h1 {
            color: #1e88e5;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        
        .devices-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .device-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            text-align: center;
            cursor: pointer;
            border: 2px solid transparent;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .device-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(30, 136, 229, 0.2);
            border-color: #1e88e5;
        }
        
        .device-icon {
            font-size: 3.5rem;
            color: #1e88e5;
            margin-bottom: 20px;
        }
        
        .device-name {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        
        .device-location {
            color: #7f8c8d;
            margin-bottom: 20px;
            font-size: 1.1rem;
        }
        
        .device-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 600;
            margin-top: auto;
        }
        
        .status-normal {
            background-color: #e8f5e9;
            color: #2e7d32;
        }
        
        .status-warning {
            background-color: #fff8e1;
            color: #f57f17;
        }
        
        .status-danger {
            background-color: #ffebee;
            color: #c62828;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 25px;
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .devices-container {
                grid-template-columns: 1fr;
                padding: 10px;
            }
            
            .header h1 {
                font-size: 1.5rem;
            }
            
            .device-card {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1><i class="fas fa-fish"></i> Fish-Smile Monitoring System</h1>
        <p>เลือกบ่อปลาที่ต้องการตรวจสอบคุณภาพน้ำ</p>
    </div>
    
    <div class="devices-container">
        <!-- บ่อปลาที่ 1 -->
        <div class="device-card" onclick="window.location.href='https://paperkusz.github.io/Fish-smile/Fish-Smile01.html'">
            <div>
                <div class="device-icon">
                    <i class="fas fa-water"></i>
                </div>
                <h3 class="device-name">บ่อปลาที่ 1 (ปลาทับทิม)</h3>
                <p class="device-location">ตรวจสอบคุณภาพน้ำและสภาพแวดล้อม</p>
            </div>
            <div class="device-status status-normal">
                <i class="fas fa-check-circle"></i> สภาพน้ำปกติ
            </div>
        </div>
        
        <!-- บ่อปลาที่ 2 -->
        <div class="device-card" onclick="window.location.href='https://paperkusz.github.io/Fish-smile/Fish-Smile02.html'">
            <div>
                <div class="device-icon">
                    <i class="fas fa-fish"></i>
                </div>
                <h3 class="device-name">บ่อปลาที่ 2 (ปลานิล)</h3>
                <p class="device-location">ตรวจสอบคุณภาพน้ำและสภาพแวดล้อม</p>
            </div>
            <div class="device-status status-warning">
                <i class="fas fa-exclamation-triangle"></i> ควรตรวจสอบ
            </div>
        </div>
        
        <!-- บ่อปลาที่ 3 -->
        <div class="device-card" onclick="window.location.href='https://paperkusz.github.io/Fish-smile/Fish-Smile03.html'">
            <div>
                <div class="device-icon">
                    <i class="fas fa-tint"></i>
                </div>
                <h3 class="device-name">บ่อปลาที่ 3 (ปลาดุก)</h3>
                <p class="device-location">ตรวจสอบคุณภาพน้ำและสภาพแวดล้อม</p>
            </div>
            <div class="device-status status-normal">
                <i class="fas fa-check-circle"></i> สภาพน้ำปกติ
            </div>
        </div>
        
        <!-- บ่ออนุบาลลูกปลา -->
        <div class="device-card" onclick="window.location.href='https://paperkusz.github.io/Fish-smile/Fish-Smile04.html'">
            <div>
                <div class="device-icon">
                    <i class="fas fa-cloud-rain"></i>
                </div>
                <h3 class="device-name">บ่ออนุบาลลูกปลา</h3>
                <p class="device-location">ตรวจสอบคุณภาพน้ำและสภาพแวดล้อม</p>
            </div>
            <div class="device-status status-danger">
                <i class="fas fa-times-circle"></i> ต้องแก้ไขด่วน
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Protpittayapayat School | © 2025</p>
    </div>

    <script>
        // สามารถเพิ่มการดึงข้อมูลสถานะอุปกรณ์แบบ Real-time ได้ที่นี่
        // เช่นใช้ fetch API เพื่อตรวจสอบสถานะล่าสุดของแต่ละอุปกรณ์
    </script>
</body>
</html>
