<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fish-Smile Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #1a2980, #26d0ce);
      color: white;
      min-height: 100vh;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    .chart-container {
      position: relative;
      height: 250px;
      width: 100%;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .data-table th, .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .data-table th {
      background-color: rgba(255,255,255,0.1);
    }
    
    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .status-good {
      background-color: #4CAF50;
    }
    
    .status-warning {
      background-color: #FFC107;
    }
    
    .status-danger {
      background-color: #F44336;
    }
    
    .refresh-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 50px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;
      transition: all 0.3s;
    }
    
    .refresh-btn:hover {
      background: rgba(255,255,255,0.3);
    }
    
    @media (max-width: 768px) {
      .dashboard {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Fish-Smile Monitoring</h1>
    <p>Real-time water quality dashboard</p>
  </div>
  
  <div class="dashboard">
    <div class="card">
      <h2>pH Levels</h2>
      <div class="chart-container">
        <canvas id="phChart"></canvas>
      </div>
      <div id="phStatus" style="margin-top: 15px;"></div>
    </div>
    
    <div class="card">
      <h2>TDS Values</h2>
      <div class="chart-container">
        <canvas id="tdsChart"></canvas>
      </div>
      <div id="tdsStatus" style="margin-top: 15px;"></div>
    </div>
    
    <div class="card">
      <h2>Turbidity</h2>
      <div class="chart-container">
        <canvas id="turbidityChart"></canvas>
      </div>
      <div id="turbidityStatus" style="margin-top: 15px;"></div>
    </div>
    
    <div class="card">
      <h2>Latest Readings</h2>
      <div id="latestData" style="font-size: 1.1rem;"></div>
      <button class="refresh-btn" onclick="loadData()">Refresh Data</button>
    </div>
    
    <div class="card" style="grid-column: 1 / -1;">
      <h2>Historical Data</h2>
      <div style="overflow-x: auto;">
        <table class="data-table" id="dataTable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>pH</th>
              <th>TDS (ppm)</th>
              <th>Turbidity (NTU)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
