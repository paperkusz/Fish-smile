<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Fish-smile Dashboard</title>
  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f4f6f8;
    }
    h2 {
      color: #2c3e50;
    }
    #curve_chart {
      width: 100%;
      height: 500px;
      margin-top: 20px;
    }
    .threshold-form {
      margin-top: 30px;
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      width: 300px;
    }
    .threshold-form label {
      display: block;
      margin-bottom: 10px;
    }
    .threshold-form input {
      width: 100%;
      padding: 5px;
      margin-top: 5px;
      margin-bottom: 15px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
    .threshold-form button {
      padding: 10px 15px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h2>Fish-smile อุปกรณ์อัจฉริยะตรวจคุณภาพน้ำในการเลี้ยงปลาและแจ้งเตือนเมื่อคุณภาพน้ำเปลี่ยนไป</h2>

  <div id="curve_chart"></div>

  <div class="threshold-form">
    <h3>ตั้งค่าเกณฑ์คุณภาพน้ำ</h3>
    <form onsubmit="event.preventDefault(); saveThresholds()">
      <label>pH ต่ำสุด:
        <input type="number" id="phMin" value="5">
      </label>
      <label>pH สูงสุด:
        <input type="number" id="phMax" value="8">
      </label>
      <label>TDS สูงสุด:
        <input type="number" id="tdsMax" value="500">
      </label>
      <label>ความขุ่นสูงสุด:
        <input type="number" id="ntuMax" value="100">
      </label>
      <button type="submit">บันทึกค่าเกณฑ์</button>
    </form>
  </div>

  <script>
    const SHEET_CSV = 'https://docs.google.com/spreadsheets/d/1ULyiQq2CtC3byzKoUq0Cqx_IJTaDRZl00sbbEu1zQ7g/export?format=csv';

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      fetch(SHEET_CSV)
        .then(res => res.text())
        .then(csv => {
          const lines = csv.trim().split('\n').map(row => row.split(','));
          const header = ['Time', 'pH', 'TDS', 'Turbidity'];
          const dataArr = [header];
          for (let i = 1; i < lines.length; i++) {
            let [dt, ph, tds, turb] = lines[i];
            dataArr.push([new Date(dt), parseFloat(ph), parseFloat(tds), parseFloat(turb)]);
          }
          var data = google.visualization.arrayToDataTable(dataArr);

          var options = {
            title: 'แนวโน้มคุณภาพน้ำ',
            curveType: 'function',
            legend: { position: 'bottom' },
            hAxis: { title: 'เวลา' },
            vAxis: { title: 'ค่าที่วัดได้' }
          };

          var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
          chart.draw(data, options);
        });
    }

    function saveThresholds() {
      const phMin = document.getElementById('phMin').value;
      const phMax = document.getElementById('phMax').value;
      const tdsMax = document.getElementById('tdsMax').value;
      const ntuMax = document.getElementById('ntuMax').value;

      alert(`บันทึกค่าเกณฑ์\n- pH: ${phMin} - ${phMax}\n- TDS <= ${tdsMax}\n- ความขุ่น <= ${ntuMax}`);
      // ในอนาคตสามารถเชื่อม Firebase หรือ Sheets API เพื่อเก็บค่าที่ตั้งไว้
    }
  </script>
</body>
</html>
