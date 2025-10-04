<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fish-Smile Dashboard (GitHub Pages)</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  :root{
    --primary:#FF3E8A; --secondary:#8A2BE2; --accent:#00D4FF;
    --success:#00FF88; --warning:#FFD700; --danger:#FF3860;
    --bg1:#1A1A2E; --bg2:#162447; --bg3:#0F3460;
    --card:#ffffff; --text:#162447; --muted:#7a8a9a;
  }
  *{box-sizing:border-box} body{margin:0;background:linear-gradient(135deg,var(--bg1),var(--bg2),var(--bg3));
    color:#fff;font-family:system-ui,Segoe UI,Arial,sans-serif;min-height:100vh;padding:20px}
  .wrap{max-width:1100px;margin:0 auto}
  .head{display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap;
    background:rgba(26,26,46,.7);border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:16px 18px}
  .logo{display:flex;gap:12px;align-items:center}
  .logo i{font-size:1.9rem;background:linear-gradient(135deg,var(--primary),var(--secondary));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  h1{font-size:1.5rem;margin:0;background:linear-gradient(135deg,var(--primary),var(--secondary));
    -webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .sub{color:var(--accent)}
  .status{display:flex;gap:10px;align-items:center;background:rgba(0,212,255,.12);padding:8px 14px;border-radius:999px;
    border:1px solid var(--accent)}
  .dot{width:10px;height:10px;border-radius:50%;background:#0f0;box-shadow:0 0 12px #0f0}
  .dot.off{background:#f33;box-shadow:0 0 12px #f33}

  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-top:18px}
  .card{background:rgba(255,255,255,.95);color:var(--text);border-radius:16px;padding:16px;border:1px solid #eef}
  .card h3{margin:0 0 6px 0;font-size:1rem;color:#0f2340;text-transform:uppercase;letter-spacing:.04em}
  .val{font-size:2.2rem;margin:8px 0 6px 0}
  .row{display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap}
  .pill{padding:6px 10px;border-radius:999px;border:1px solid #ccd; font-weight:600; font-size:.88rem}
  .raw{background:rgba(0,212,255,.18);color:#0a5a9e;border-color:#0a9ee6}
  .ok{background:rgba(0,255,136,.18);color:#006c3e;border-color:#00c46a}
  .warn{background:rgba(255,215,0,.25);color:#8a6a00;border-color:#ffb700}
  .bad{background:rgba(255,56,96,.18);color:#8a0031;border-color:#ff4d5e}

  .card.history{background:rgba(20,27,45,.95);color:#fff;border-color:rgba(255,255,255,.18)}
  .card.history h3{color:#fff}
  .controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
  select,button{padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer}
  .table-wrap{overflow:auto;max-height:340px;border:1px solid rgba(255,255,255,.2);border-radius:12px}
  table{border-collapse:collapse;width:100%}
  th,td{padding:8px;border-bottom:1px dashed rgba(255,255,255,.15);font-size:.92rem}
  thead th{position:sticky;top:0;background:rgba(20,27,45,1)}
  tbody tr:nth-child(even){background:rgba(255,255,255,.05)}
  .foot{margin-top:14px;color:#a9bad0;font-size:.9rem}
  a{color:#9fd7ff;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div class="logo">
      <i class="fas fa-fish"></i>
      <div>
        <h1>Fish-Smile Dashboard</h1>
        <div class="sub">โหมด GitHub Pages (อ่านจาก Google Apps Script)</div>
      </div>
    </div>
    <div class="status"><span class="dot" id="dot"></span><span id="stxt">กำลังโหลด…</span></div>
  </div>

  <div class="grid">
    <div class="card">
      <h3>Soil 1</h3>
      <div class="val" id="soil1">—</div>
      <div class="row">
        <span class="pill raw" id="soil1raw">RAW: —</span>
        <span class="pill" id="soil1stat">—</span>
      </div>
    </div>

    <div class="card">
      <h3>Soil 2</h3>
      <div class="val" id="soil2">—</div>
      <div class="row">
        <span class="pill raw" id="soil2raw">RAW: —</span>
        <span class="pill" id="soil2stat">—</span>
      </div>
    </div>

    <div class="card">
      <h3>Air Humidity</h3>
      <div class="val" id="humid">—</div>
      <div class="row">
        <span class="pill raw" id="temp">Temp: —</span>
        <span class="pill" id="online">—</span>
      </div>
    </div>

    <div class="card">
      <h3>Last Update</h3>
      <div class="val" id="uptime">—</div>
      <div class="row">
        <span class="pill raw" id="seq">SEQ: —</span>
        <span class="pill" id="mac">MAC: —</span>
      </div>
    </div>

    <div class="card history">
      <h3>ประวัติ (จาก Google Sheet)</h3>
      <div class="controls">
        แสดงแถว:
        <select id="limit">
          <option>10</option><option>20</option><option>30</option><option>40</option><option>50</option>
        </select>
        <button id="refresh">รีเฟรช</button>
        <label style="display:flex;align-items:center;gap:6px">
          <input type="checkbox" id="auto" checked> Auto-refresh
        </label>
        <button id="dlcsv"><i class="fa fa-download"></i> CSV</button>
      </div>
      <div class="table-wrap">
        <table id="hist"><thead></thead><tbody></tbody></table>
      </div>
      <div class="foot" id="msg"></div>
    </div>
  </div>

  <div class="foot" style="margin-top:14px">
    เว็บนี้อ่านจาก <code>Google Apps Script</code> เท่านั้น (ปลอดภัยบน HTTPS) •
    ต้องให้ ESP32 โพสต์ข้อมูลขึ้นชีตก่อน จึงจะเห็นอัปเดตที่นี่
  </div>
</div>

<script>
/*** ตั้งค่าให้ตรงกับของคุณ ***/
const GAS_URL = 'https://script.google.com/macros/s/PASTE_YOUR_EXEC_URL_HERE/exec'; // << แทนที่
const API_KEY = 'my-secret-key';                                                     // << ให้ตรงกับสคริปต์
const POLL_MS = 2000;                   // รีเฟรชทุก 2 วิ
const ONLINE_MS = 40*60*1000;           // ถือว่า "ONLINE" ถ้าแถวล่าสุดอายุน้อยกว่า 40 นาที

function qs(id){return document.getElementById(id);}
function badge(el, cls, txt){ el.className = 'pill ' + cls; el.textContent = txt; }

async function fetchJSON(url){
  const r = await fetch(url, {cache:'no-store'});
  if(!r.ok) throw new Error('HTTP '+r.status);
  return await r.json();
}
function buildURL(params){
  const q = new URLSearchParams(params);
  return GAS_URL + (GAS_URL.includes('?')?'&':'?') + q.toString();
}
function parseRows(headers, rows){
  return rows.map(arr => {
    const o = {};
    headers.forEach((h,i)=> o[h] = arr[i]);
    return o;
  });
}
function tsToDateStr(val){
  try{
    const d = new Date(val);
    return d.toLocaleString('th-TH', {timeZone:'Asia/Bangkok', hour12:false});
  }catch(e){ return String(val||''); }
}
function updateCards(rec){
  // map ตาม HEADERS ใน Apps Script
  const sMAC = rec['Sender MAC'] ?? '—';
  const seq  = rec['Seq'] ?? '—';
  const up   = rec['Uptime (s)'] ?? '—';
  const s1r  = rec['Soil1 RAW']; const s2r = rec['Soil2 RAW'];
  const s1p  = rec['Soil1 %'];   const s2p = rec['Soil2 %'];
  const tc   = rec['Temp C'];    const hm  = rec['Humid %'];

  qs('soil1').textContent = (s1p!=null && s1p!=='') ? Number(s1p).toFixed(1)+' %' : '—';
  qs('soil2').textContent = (s2p!=null && s2p!=='') ? Number(s2p).toFixed(1)+' %' : '—';
  qs('soil1raw').textContent = 'RAW: ' + (s1r ?? '—');
  qs('soil2raw').textContent = 'RAW: ' + (s2r ?? '—');

  const s1 = Number(s1p); const s2 = Number(s2p);
  badge(qs('soil1stat'), isNaN(s1)?'warn':(s1<20?'bad':(s1<40?'warn':'ok')), isNaN(s1)?'—':(s1<20?'แห้งมาก':(s1<40?'เริ่มแห้ง':'ชุ่มดี')));
  badge(qs('soil2stat'), isNaN(s2)?'warn':(s2<20?'bad':(s2<40?'warn':'ok')), isNaN(s2)?'—':(s2<20?'แห้งมาก':(s2<40?'เริ่มแห้ง':'ชุ่มดี')));

  qs('humid').textContent = (hm!=null && hm!=='') ? Number(hm).toFixed(1)+' %RH' : '—';
  qs('temp').textContent  = 'Temp: ' + ((tc!=null && tc!=='') ? Number(tc).toFixed(1)+' °C' : '—');
  qs('uptime').textContent= (up!=null && up!=='') ? (up + ' s') : '—';
  qs('seq').textContent   = 'SEQ: ' + seq;
  qs('mac').textContent   = 'MAC: ' + sMAC;
}
function updateOnline(tsText){
  const dot = qs('dot'), st = qs('online'), tx = qs('stxt');
  let online = false;
  if (tsText){
    const age = Date.now() - new Date(tsText).getTime();
    online = age >= 0 && age < ONLINE_MS;
  }
  if (online){
    dot.classList.remove('off');
    badge(st,'ok','ONLINE'); tx.textContent = 'อัปเดตจากชีต (HTTPS)';
  }else{
    dot.classList.add('off');
    badge(st,'bad','OFFLINE'); tx.textContent = 'ยังไม่เห็นอัปเดตใหม่ในช่วงเวลาออนไลน์';
  }
}

async function loadLatest(){
  // ดึง 1 แถวล่าสุดจากชีต
  const url = buildURL({export:'json', api_key:API_KEY, limit:1});
  const j = await fetchJSON(url);
  if (!j.ok || !j.headers || !j.rows || j.rows.length===0) throw new Error('ไม่มีข้อมูลในชีต');
  const recs = parseRows(j.headers, j.rows);   // ลำดับเดิม: เก่า->ใหม่
  const last = recs[recs.length-1];            // ใช้แถวล่าสุด
  updateCards(last);
  updateOnline(last['Timestamp (Asia/Bangkok)']);
}

async function loadHistory(limit){
  const url = buildURL({export:'json', api_key:API_KEY, limit:limit});
  const j = await fetchJSON(url);
  const thead = qs('hist').querySelector('thead');
  const tbody = qs('hist').querySelector('tbody');
  if (!j.ok || !j.headers) throw new Error(j.error || 'โหลดไม่สำเร็จ');
  // head
  thead.innerHTML = '<tr>' + j.headers.map(h=>`<th>${h}</th>`).join('') + '</tr>';
  // body (ให้ล่าสุดอยู่บนสุด: reverse)
  const rows = (j.rows||[]).slice().reverse();
  tbody.innerHTML = rows.map(arr=>{
    return '<tr>' + arr.map((v,i)=>{
      const h = j.headers[i];
      if (h==='Timestamp (Asia/Bangkok)') v = tsToDateStr(v);
      return `<td>${v==null?'':v}</td>`;
    }).join('') + '</tr>';
  }).join('');
  qs('msg').textContent = `แถวทั้งหมด: ${j.total ?? rows.length} • แสดง: ${rows.length}`;
}

function initHistoryUI(){
  const sel = qs('limit'), btn = qs('refresh'), ck = qs('auto'), dl = qs('dlcsv');
  async function refresh(force){
    const lim = parseInt(sel.value,10) || 10;
    await loadHistory(lim);
    if (force) await loadLatest();
  }
  sel.onchange = ()=> refresh(true);
  btn.onclick  = ()=> refresh(true);
  dl.onclick   = async ()=>{
    // ดาวน์โหลด CSV ทั้งชีต
    const j = await fetchJSON(buildURL({export:'json', api_key:API_KEY, limit:'all'}));
    if (!j.ok) { alert('โหลดไม่สำเร็จ'); return; }
    const hs = j.headers, rows = (j.rows||[]).slice().reverse();
    const csvEsc = s => {
      let v = (s==null?'':String(s));
      if (v.includes('"')) v = v.replace(/"/g,'""');
      if (/[",\n]/.test(v)) v = `"${v}"`;
      return v;
    };
    const lines = [hs.map(csvEsc).join(',')];
    rows.forEach(r => lines.push(r.map(csvEsc).join(',')));
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'history-all.csv'; document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(url); a.remove();}, 0);
  };

  // auto refresh ประวัติทุก 10 วิ (ไม่หนัก)
  let timer = null;
  const start = ()=>{
    if (timer) clearInterval(timer);
    if (ck.checked) timer = setInterval(()=> loadHistory(parseInt(sel.value,10)||10), 10000);
  };
  ck.onchange = start;
  start();
  refresh(true);
}

async function tick(){
  try{ await loadLatest(); }catch(e){ /* เงียบไว้ */ }
}
setInterval(tick, POLL_MS);
tick();
initHistoryUI();
</script>
</body>
</html>
