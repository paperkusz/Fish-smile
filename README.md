<!DOCTYPE html>
<html>
<head>
    <title>ระบบแสดงข้อมูลน้ำแบบ Real-time</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Kanit', sans-serif;
            background-color: #f5f9ff;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            text-align: center;
        }
        .data-card {
            background: #fff;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
        }
        .data-value {
            font-size: 24px;
            font-weight: bold;
        }
        .ph { color: #3498db; }
        .tds { color: #e74c3c; }
        .turbidity { color: #2ecc71; }
        #last-updated {
            text-align: right;
            font-style: italic;
            color: #7f8c8d;
        }
        #loading {
            text-align: center;
            padding: 20px;
        }
    </style>
    <!-- ใช้ฟอนต์ Kanit สำหรับภาษาไทย -->
    <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>📊 ระบบติดตามคุณภาพน้ำ</h1>
        
        <div id="loading">กำลังโหลดข้อมูล...</div>
        
        <div id="data-container" style="display:none;">
            <div class="data-card">
                <span>ค่า pH:</span>
                <span class="data-value ph" id="ph-value">--</span>
            </div>
            
            <div class="data-card">
                <span>ค่า TDS (ppm):</span>
                <span class="data-value tds" id="tds-value">--</span>
            </div>
            
            <div class="data-card">
                <span>ค่าความขุ่น (NTU):</span>
                <span class="data-value turbidity" id="turbidity-value">--</span>
            </div>
            
            <div id="last-updated">อัปเดตล่าสุด: <span id="update-time">-</span></div>
        </div>
    </div>

    <script>
        // ใส่ URL Web App ของคุณที่นี่
        const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbylzCVh6uAy-P6fKzH6T9DiEBNAFcpr8iGhlXpwIzwkr29rZbc2FKRBEQlbN1MiF4P55w/exec';
        
        async function fetchWaterData() {
            try {
                document.getElementById('loading').textContent = 'กำลังโหลดข้อมูลล่าสุด...';
                
                // เพิ่ม timestamp เพื่อป้องกันการ cache
                const response = await fetch(`${WEB_APP_URL}?t=${new Date().getTime()}`);
                const data = await response.json();
                
                // แสดงข้อมูล (สมมติว่า Sheet มีโครงสร้าง: [วันที่, pH, TDS, ความขุ่น])
                const latestData = data[data.length - 1]; // เอาข้อมูลล่าสุด
                
                document.getElementById('ph-value').textContent = latestData[1];
                document.getElementById('tds-value').textContent = latestData[2];
                document.getElementById('turbidity-value').textContent = latestData[3];
                
                // แสดงเวลาอัปเดต
                const now = new Date();
                document.getElementById('update-time').textContent = now.toLocaleTimeString('th-TH');
                
                // ซ่อน loading แสดงข้อมูล
                document.getElementById('loading').style.display = 'none';
                document.getElementById('data-container').style.display = 'block';
                
            } catch (error) {
                console.error('เกิดข้อผิดพลาด:', error);
                document.getElementById('loading').textContent = '⚠️ ไม่สามารถโหลดข้อมูลได้ โปรดลองใหม่ภายหลัง';
            }
        }
        
        // โหลดข้อมูลครั้งแรกเมื่อหน้าเว็บโหลดเสร็จ
        document.addEventListener('DOMContentLoaded', fetchWaterData);
        
        // อัปเดตข้อมูลทุก 1 นาที (60000 มิลลิวินาที)
        setInterval(fetchWaterData, 60000);
    </script>
</body>
</html>
