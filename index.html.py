<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aqua Guard Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <h1>Aqua Guard Monitoring</h1>
  
  <div class="dashboard">
    <div class="card">
      <h2>pH Levels</h2>
      <div class="chart-container">
        <canvas id="phChart"></canvas>
      </div>
    </div>
    
    <div class="card">
      <h2>TDS Values</h2>
      <div class="chart-container">
        <canvas id="tdsChart"></canvas>
      </div>
    </div>
    
    <div class="card">
      <h2>Latest Readings</h2>
      <div id="latestData"></div>
    </div>
    
    <div class="card">
      <h2>All Data</h2>
      <div style="overflow-x: auto;">
        <table id="dataTable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>pH</th>
              <th>TDS</th>
              <th>Turbidity</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    // ฟังก์ชันดึงข้อมูล
    async function fetchData() {
      try {
        // ใช้วิธีที่ 1 หรือ 2 ที่กล่าวมา
        const response = await fetch('YOUR_API_ENDPOINT');
        const data = await response.json();
        return data.values || data;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

    // ฟังก์ชันแสดงข้อมูล
    function displayData(data) {
      if (!data || data.length === 0) return;
      
      // เรียงข้อมูลตามเวลา (หากคอลัมน์แรกเป็น timestamp)
      const sortedData = [...data].sort((a, b) => new Date(a[0]) - new Date(b[0]));
      
      // แสดงข้อมูลล่าสุด
      const latest = sortedData[sortedData.length - 1];
      document.getElementById('latestData').innerHTML = `
        <p><strong>Last Update:</strong> ${latest[0]}</p>
        <p><strong>pH:</strong> ${latest[1]}</p>
        <p><strong>TDS:</strong> ${latest[2]} ppm</p>
        <p><strong>Turbidity:</strong> ${latest[3]} NTU</p>
      `;
      
      // แสดงตารางข้อมูล
      const tableBody = document.querySelector('#dataTable tbody');
      tableBody.innerHTML = '';
      sortedData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
      
      // สร้างกราฟ
      createCharts(sortedData);
    }
    
    // ฟังก์ชันสร้างกราฟ
    function createCharts(data) {
      const labels = data.map(row => row[0]);
      const phData = data.map(row => row[1]);
      const tdsData = data.map(row => row[2]);
      
      // pH Chart
      new Chart(document.getElementById('phChart'), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'pH Level',
            data: phData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        }
      });
      
      // TDS Chart
      new Chart(document.getElementById('tdsChart'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'TDS (ppm)',
            data: tdsData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
          }]
        }
      });
    }
    
    // เรียกใช้เมื่อโหลดหน้าเว็บ
    document.addEventListener('DOMContentLoaded', async () => {
      const data = await fetchData();
      if (data) {
        displayData(data);
      } else {
        document.getElementById('latestData').innerHTML = 
          '<p>Unable to load data. Please try again later.</p>';
      }
    });
  </script>
</body>
</html>
