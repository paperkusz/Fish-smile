<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>FishSmile Dashboard (Online)</title>
<style>
  body{margin:0;background:linear-gradient(135deg,#1A1A2E,#162447,#0F3460);color:#F8F9FA;font-family:Segoe UI,Arial,sans-serif}
  .wrap{max-width:1100px;margin:0 auto;padding:20px}
  .header{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px;background:rgba(26,26,46,.7);border-radius:16px;border:1px solid rgba(255,255,255,.1)}
  .title h1{margin:0;font-size:22px;background:linear-gradient(135deg,#FF3E8A,#8A2BE2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-top:18px}
  .card{background:rgba(255,255,255,.9);color:#162447;border-radius:16px;padding:18px;border:1px solid rgba(255,255,255,.25)}
  .label{font-size:12px;opacity:.8;text-transform:uppercase;letter-spacing:.06em}
  .val{font-size:30px;margin:4px 0 10px 0}
  .row{display:flex;gap:8px;justify-content:space-between}
  .pill{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid}
  .raw{background:rgba(0,212,255,.18);color:#005c9e;border-color:#00a9e0}
  .ok{background:rgba(0,255,136,.18);color:#00663a;border-color:#00c46a}
  .warn{background:rgba(255,215,0,.23);color:#6a5200;border-color:#ffb700}
  .bad{background:rgba(255,56,96,.18);color:#7a0026;border-color:#ff4d5e}
  .card.history{background:rgba(20,27,45,.95);color:#fff}
  .card.history .label{color:#fff}
  table{width:100%;border-collapse:collapse}
  th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,.12);font-size:13px}
  thead th{position:sticky;top:0;background:rgba(0,0,0,.2)}
  .controls{display:flex;gap:8px;align-items:center}
  .footer{margin-top:16px;padding:14px;background:rgba(26,26,46,.7);border-radius:12px;border:1px solid rgba(255,255,255,.1)}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="title"><h1>Fish-Smile Dashboard (Online)</h1></div>
    <div class="controls">
      แถว:
      <select id="limit">
        <option>10</option><option>20</option><option>30</option><option>40</option><option>50</option>
      </select>
      <button id="refresh">รีเฟรช</button>
      <a id="csv" class="pill raw" href="?export=csv" target="_blank" style="text-decoration:none">ดาวน์โหลด CSV</a>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="label">Soil 1</div>
      <div class="val" id="soil1">—</div>
      <div class="row"><div class="pill raw" id="soil1raw">RAW: —</div><div class="pill ok" id="soil1st">—</div></div>
    </div>

    <div class="card">
      <div class="label">Soil 2</div>
      <div class="val" id="soil2">—</div>
      <div class="row"><div class="pill raw" id="soil2raw">RAW: —</div><div class="pill ok" id="soil2st">—</div></div>
    </div>

    <div class="card">
      <div class="label">Air</div>
      <div class="val" id="humid">—</div>
      <div class="row"><div class="pill raw" id="temp">Temp: —</div><div class="pill ok" id="onl">ONLINE</div></div>
    </div>

    <div class="card">
      <div class="label">Last</div>
      <div class="val" id="time">—</div>
      <div class="row"><div class="pill raw" id="seq">SEQ: —</div><div class="pill raw" id="mac">MAC: —</div></div>
    </div>

    <div class="card history">
      <div class="label">ประวัติล่าสุด</div>
      <div id="msg" style="margin:6px 0 10px 0; font-size:12px; opacity:.85;"></div>
      <div style="max-height:360px;overflow:auto;border:1px solid rgba(255,255,255,.2);border-radius:10px">
        <table><thead id="th"></thead><tbody id="tb"></tbody></table>
      </div>
    </div>
  </div>

  <div class="footer">หน้าเว็บนี้โฮสต์อยู่บน Apps Script — เปิดได้จากทุกที่ที่มีอินเทอร์เน็ต</div>
</div>

<script>
const qs   = new URL(location.href).searchParams;
const base = location.href.split('?')[0]; // base ของสคริปต์นี้เอง

function badge(el, cls, txt){ el.className='pill '+cls; el.textContent=txt; }

async function loadHistory(limit=10){
  const url= base+'?export=json&limit='+encodeURIComponent(limit);
  const r  = await fetch(url,{cache:'no-store'});
  const j  = await r.json();
  const th = document.getElementById('th');
  const tb = document.getElementById('tb');
  const msg= document.getElementById('msg');

  if(!j.ok){ th.innerHTML=''; tb.innerHTML=''; msg.textContent='โหลดผิดพลาด: '+(j.error||''); return; }
  const hs=j.headers, rows=j.rows||[];
  if(!hs || rows.length===0){ th.innerHTML=''; tb.innerHTML=''; msg.textContent='ยังไม่มีข้อมูล'; return; }

  // table header
  let H='<tr>'; hs.forEach(h=>H+='<th>'+h+'</th>'); H+='</tr>'; th.innerHTML=H;

  // latest (ท้ายสุดของ rows) + เติม table
  let T=''; const last = rows[rows.length-1];
  rows.slice().reverse().forEach(row=>{
    T+='<tr>'; hs.forEach(h=>{ let v=row[h]; T+='<td>'+(v==null?'':String(v))+'</td>'; }); T+='</tr>';
  });
  tb.innerHTML=T;

  // fill latest cards
  if(last){
    const v = (k)=> last[k];
    document.getElementById('soil1').textContent = (v('Soil1 %')!=null ? Number(v('Soil1 %')).toFixed(1)+' %' : '—');
    document.getElementById('soil2').textContent = (v('Soil2 %')!=null ? Number(v('Soil2 %')).toFixed(1)+' %' : '—');
    document.getElementById('soil1raw').textContent='RAW: '+(v('Soil1 RAW') ?? '—');
    document.getElementById('soil2raw').textContent='RAW: '+(v('Soil2 RAW') ?? '—');
    const s1=Number(v('Soil1 %')||NaN), s2=Number(v('Soil2 %')||NaN);
    badge(document.getElementById('soil1st'), (!isNaN(s1)? (s1<20?'bad':(s1<40?'warn':'ok')):'ok'), (!isNaN(s1)? (s1<20?'แห้งมาก':(s1<40?'เริ่มแห้ง':'ชุ่มดี')):'—'));
    badge(document.getElementById('soil2st'), (!isNaN(s2)? (s2<20?'bad':(s2<40?'warn':'ok')):'ok'), (!isNaN(s2)? (s2<20?'แห้งมาก':(s2<40?'เริ่มแห้ง':'ชุ่มดี')):'—'));
    document.getElementById('humid').textContent = (v('Humid %')!=null ? Number(v('Humid %')).toFixed(1)+' %RH' : '—');
    document.getElementById('temp').textContent  = 'Temp: '+(v('Temp C')!=null ? Number(v('Temp C')).toFixed(1)+' °C' : '—');
    document.getElementById('time').textContent  = v('Timestamp (Asia/Bangkok)') || '—';
    document.getElementById('seq').textContent   = 'SEQ: '+(v('Seq') ?? '—');
    document.getElementById('mac').textContent   = 'MAC: '+(v('Sender MAC') ?? '—');
    badge(document.getElementById('onl'),'ok','ONLINE');
  }
  msg.textContent = 'แสดง '+rows.length+' แถว • อัปเดตล่าสุด: '+new Date().toLocaleTimeString('th-TH',{hour12:false});
}

document.getElementById('refresh').onclick = ()=> loadHistory(Number(document.getElementById('limit').value)||10);

// โหลดครั้งแรก + อัปเดตทุก 5 วิ
loadHistory(10);
setInterval(()=>loadHistory(Number(document.getElementById('limit').value)||10), 5000);
</script>
</body>
</html>
