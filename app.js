/* ===================================================
   DOWNLOAD TIME CALCULATOR — APP.JS
   All calculation & rendering logic
   =================================================== */

'use strict';

/* ─── Unit Conversion Maps ─────────────────────────────────────────────── */

// Convert any SIZE unit → bits
const SIZE_TO_BITS = {
  // Base-10 bytes
  'B':    8,
  'KB':   8 * 1e3,
  'MB':   8 * 1e6,
  'GB':   8 * 1e9,
  'TB':   8 * 1e12,
  'PB':   8 * 1e15,
  // Bits
  'bit':  1,
  'Kbit': 1e3,
  'Mbit': 1e6,
  'Gbit': 1e9,
  'Tbit': 1e12,
  // Binary (base-2) bytes
  'KiB':  8 * 1024,
  'MiB':  8 * 1024 ** 2,
  'GiB':  8 * 1024 ** 3,
  'TiB':  8 * 1024 ** 4,
};

// Convert any SPEED unit → bits per second
const SPEED_TO_BPS = {
  'bps':  1,
  'Kbps': 1e3,
  'Mbps': 1e6,
  'Gbps': 1e9,
  'Tbps': 1e12,
  'Bps':  8,
  'KBps': 8e3,
  'MBps': 8e6,
  'GBps': 8e9,
};

/* ─── Human-readable labels for tables ─────────────────────────────────── */

const SIZE_UNITS_TABLE = [
  { unit: 'bit',  label: 'Bit',       type: 'Binary Digit',       factor: 1 },
  { unit: 'B',    label: 'Byte',      type: 'Base-10',            factor: 8 },
  { unit: 'KB',   label: 'Kilobyte',  type: 'Base-10 (1,000 B)',  factor: 8e3 },
  { unit: 'MB',   label: 'Megabyte',  type: 'Base-10 (1,000 KB)', factor: 8e6 },
  { unit: 'GB',   label: 'Gigabyte',  type: 'Base-10 (1,000 MB)', factor: 8e9 },
  { unit: 'TB',   label: 'Terabyte',  type: 'Base-10 (1,000 GB)', factor: 8e12 },
  { unit: 'PB',   label: 'Petabyte',  type: 'Base-10 (1,000 TB)', factor: 8e15 },
  { unit: 'KiB',  label: 'Kibibyte',  type: 'Binary (1,024 B)',   factor: 8 * 1024 },
  { unit: 'MiB',  label: 'Mebibyte',  type: 'Binary (1,024 KiB)', factor: 8 * 1024 ** 2 },
  { unit: 'GiB',  label: 'Gibibyte',  type: 'Binary (1,024 MiB)', factor: 8 * 1024 ** 3 },
  { unit: 'TiB',  label: 'Tebibyte',  type: 'Binary (1,024 GiB)', factor: 8 * 1024 ** 4 },
];

const SPEED_UNITS_TABLE = [
  { unit: 'bps',  label: 'bits/s',       type: 'Network Standard',    factor: 1 },
  { unit: 'Kbps', label: 'Kilobits/s',   type: 'Network Standard',    factor: 1e3 },
  { unit: 'Mbps', label: 'Megabits/s',   type: 'Network Standard',    factor: 1e6 },
  { unit: 'Gbps', label: 'Gigabits/s',   type: 'Network Standard',    factor: 1e9 },
  { unit: 'Tbps', label: 'Terabits/s',   type: 'Network Standard',    factor: 1e12 },
  { unit: 'Bps',  label: 'Bytes/s',      type: 'File Transfer',       factor: 8 },
  { unit: 'KBps', label: 'Kilobytes/s',  type: 'File Transfer (KB/s)',factor: 8e3 },
  { unit: 'MBps', label: 'Megabytes/s',  type: 'File Transfer (MB/s)',factor: 8e6 },
  { unit: 'GBps', label: 'Gigabytes/s',  type: 'File Transfer (GB/s)',factor: 8e9 },
];

/* ─── Quick Presets ─────────────────────────────────────────────────────── */

const PRESETS = [
  { name: '🎵 MP3 Song',       size: 5,    sizeUnit: 'MB',  speed: 10,   speedUnit: 'Mbps', desc: '5 MB @ 10 Mbps' },
  { name: '📺 HD Movie',       size: 4,    sizeUnit: 'GB',  speed: 50,   speedUnit: 'Mbps', desc: '4 GB @ 50 Mbps' },
  { name: '🎮 AAA Game',       size: 80,   sizeUnit: 'GB',  speed: 100,  speedUnit: 'Mbps', desc: '80 GB @ 100 Mbps' },
  { name: '📁 Office File',    size: 50,   sizeUnit: 'MB',  speed: 20,   speedUnit: 'Mbps', desc: '50 MB @ 20 Mbps' },
  { name: '🎬 4K Blu-ray',     size: 100,  sizeUnit: 'GB',  speed: 200,  speedUnit: 'Mbps', desc: '100 GB @ 200 Mbps' },
  { name: '📱 Mobile App',     size: 150,  sizeUnit: 'MB',  speed: 5,    speedUnit: 'Mbps', desc: '150 MB @ 5 Mbps' },
  { name: '☁️ Cloud Backup',   size: 1,    sizeUnit: 'TB',  speed: 500,  speedUnit: 'Mbps', desc: '1 TB @ 500 Mbps' },
  { name: '🔬 ISO Image',      size: 8,    sizeUnit: 'GB',  speed: 25,   speedUnit: 'Mbps', desc: '8 GB @ 25 Mbps' },
  { name: '⚡ Fiber Fast',     size: 10,   sizeUnit: 'GB',  speed: 1,    speedUnit: 'Gbps', desc: '10 GB @ 1 Gbps' },
  { name: '🐢 Slow 3G',       size: 500,  sizeUnit: 'MB',  speed: 1,    speedUnit: 'Mbps', desc: '500 MB @ 1 Mbps' },
  { name: '📡 Dial-up',       size: 10,   sizeUnit: 'MB',  speed: 56,   speedUnit: 'Kbps', desc: '10 MB @ 56 Kbps' },
  { name: '🏢 Server SSD',     size: 1,    sizeUnit: 'TB',  speed: 10,   speedUnit: 'Gbps', desc: '1 TB @ 10 Gbps' },
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function formatNumber(n) {
  if (n === 0) return '0';
  if (n >= 1e15) return (n / 1e15).toFixed(4) + ' quadrillion';
  if (Math.abs(n) < 0.0001) return n.toExponential(4);
  if (n >= 1e12) return commas((n / 1e12).toFixed(6)) + ' T';
  if (n >= 1e9)  return commas((n / 1e9).toFixed(6))  + ' B';
  if (n >= 1e6)  return commas((n / 1e6).toFixed(4))  + ' M';
  return commas(parseFloat(n.toPrecision(8)).toString());
}

function commas(str) {
  const [int, dec] = str.split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (dec ? '.' + dec : '');
}

function formatTimeHuman(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '—';

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  if (ms > 0 && d === 0 && h === 0 && m === 0) parts.push(`${ms}ms`);

  return parts.join(' ');
}

function formatSecondsLabel(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '';
  return `${commas(seconds.toFixed(2))} seconds total`;
}

function getSpeedClass(seconds) {
  if (seconds < 60)    return 'fast';  // under 1 min = green
  if (seconds > 3600)  return 'slow';  // over 1 hour = red
  return '';
}

/* ─── Hint updater — shows the converted value in bits ─────────────────── */

function updateHints() {
  const sizeVal  = parseFloat(document.getElementById('file-size-value').value);
  const sizeUnit = document.getElementById('file-size-unit').value;
  const spdVal   = parseFloat(document.getElementById('speed-value').value);
  const spdUnit  = document.getElementById('speed-unit').value;

  const sizeHint  = document.getElementById('size-hint');
  const speedHint = document.getElementById('speed-hint');

  if (!isNaN(sizeVal) && sizeVal > 0) {
    const bits = sizeVal * SIZE_TO_BITS[sizeUnit];
    sizeHint.textContent = `≈ ${commas(bits.toExponential(3))} bits`;
  } else {
    sizeHint.textContent = '';
  }

  if (!isNaN(spdVal) && spdVal > 0) {
    const bps = spdVal * SPEED_TO_BPS[spdUnit];
    speedHint.textContent = `≈ ${commas(bps.toExponential(3))} bps`;
  } else {
    speedHint.textContent = '';
  }
}

/* ─── Main Calculate Function ───────────────────────────────────────────── */

function calculate() {
  const sizeRaw  = document.getElementById('file-size-value').value.trim();
  const sizeUnit = document.getElementById('file-size-unit').value;
  const spdRaw   = document.getElementById('speed-value').value.trim();
  const spdUnit  = document.getElementById('speed-unit').value;

  const sizeGroup  = document.getElementById('file-size-group');
  const speedGroup = document.getElementById('download-speed-group');
  let valid = true;

  // Validate
  sizeGroup.classList.remove('error');
  speedGroup.classList.remove('error');

  const sizeVal = parseFloat(sizeRaw);
  const spdVal  = parseFloat(spdRaw);

  if (!sizeRaw || isNaN(sizeVal) || sizeVal <= 0) {
    sizeGroup.classList.add('error');
    document.getElementById('size-hint').textContent = 'Please enter a valid size > 0';
    valid = false;
  }

  if (!spdRaw || isNaN(spdVal) || spdVal <= 0) {
    speedGroup.classList.add('error');
    document.getElementById('speed-hint').textContent = 'Please enter a valid speed > 0';
    valid = false;
  }

  if (!valid) return;

  // Convert to base units
  const totalBits = sizeVal * SIZE_TO_BITS[sizeUnit];
  const bps       = spdVal  * SPEED_TO_BPS[spdUnit];
  const seconds   = totalBits / bps;

  // Render results
  renderResult(seconds, totalBits, bps, sizeVal, sizeUnit, spdVal, spdUnit);

  // Show panel
  const panel = document.getElementById('results-panel');
  panel.classList.add('visible');

  // Animate progress bar (visual representation capped at 100%)
  setTimeout(() => {
    const pct = Math.min(100, Math.max(2, (1 - Math.log10(seconds + 1) / 10) * 100));
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = pct.toFixed(1) + '%';
  }, 100);

  // Smooth scroll to results
  setTimeout(() => {
    document.getElementById('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

/* ─── Render Functions ──────────────────────────────────────────────────── */

function renderResult(seconds, totalBits, bps, sizeVal, sizeUnit, spdVal, spdUnit) {
  // Primary time display
  const timeEl = document.getElementById('result-time');
  timeEl.textContent = formatTimeHuman(seconds);
  timeEl.className = 'result-time ' + getSpeedClass(seconds);

  // Seconds sub-label
  document.getElementById('result-seconds').textContent = formatSecondsLabel(seconds);

  // Breakdown cards
  document.getElementById('bc-val-seconds').textContent = commas(seconds.toFixed(2));
  document.getElementById('bc-val-minutes').textContent = commas((seconds / 60).toFixed(4));
  document.getElementById('bc-val-hours').textContent   = commas((seconds / 3600).toFixed(6));
  document.getElementById('bc-val-days').textContent    = commas((seconds / 86400).toFixed(8));

  // Size table
  renderSizeTable(totalBits, sizeUnit);

  // Speed table
  renderSpeedTable(bps, spdUnit);
}

function renderSizeTable(totalBits, activeUnit) {
  const tbody = document.getElementById('size-table-body');
  tbody.innerHTML = '';

  SIZE_UNITS_TABLE.forEach(row => {
    const value = totalBits / row.factor;
    const tr = document.createElement('tr');
    if (row.unit === activeUnit) tr.classList.add('highlighted');

    tr.innerHTML = `
      <td>${row.unit}</td>
      <td>${smartFormat(value)} ${row.unit}</td>
      <td>${row.label} — ${row.type}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSpeedTable(bps, activeUnit) {
  const tbody = document.getElementById('speed-table-body');
  tbody.innerHTML = '';

  SPEED_UNITS_TABLE.forEach(row => {
    const value = bps / row.factor;
    const tr = document.createElement('tr');
    if (row.unit === activeUnit) tr.classList.add('highlighted');

    tr.innerHTML = `
      <td>${row.unit}</td>
      <td>${smartFormat(value)} ${row.unit}</td>
      <td>${row.label} — ${row.type}</td>
    `;
    tbody.appendChild(tr);
  });
}

function smartFormat(n) {
  if (n === 0) return '0';
  if (!isFinite(n)) return '∞';
  if (n < 0.000001) return n.toExponential(4);
  if (n < 0.001)    return n.toFixed(8);
  if (n < 1)        return n.toFixed(6);
  if (n < 1000)     return parseFloat(n.toPrecision(7)).toString();
  if (n < 1e6)      return commas(parseFloat(n.toFixed(4)).toString());
  if (n < 1e12)     return commas(n.toExponential(4));
  return n.toExponential(4);
}

/* ─── Presets ───────────────────────────────────────────────────────────── */

function buildPresets() {
  const grid = document.getElementById('presets-grid');
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.setAttribute('aria-label', `Load preset: ${p.name}`);
    btn.innerHTML = `
      <span class="preset-name">${p.name}</span>
      <span class="preset-desc">${p.desc}</span>
    `;
    btn.addEventListener('click', () => loadPreset(p));
    grid.appendChild(btn);
  });
}

function loadPreset(p) {
  document.getElementById('file-size-value').value = p.size;
  document.getElementById('file-size-unit').value  = p.sizeUnit;
  document.getElementById('speed-value').value     = p.speed;
  document.getElementById('speed-unit').value      = p.speedUnit;
  updateHints();
  calculate();
}

/* ─── Keyboard shortcuts ────────────────────────────────────────────────── */

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calculate();
});

/* ─── Live hint updates ─────────────────────────────────────────────────── */

['file-size-value', 'file-size-unit', 'speed-value', 'speed-unit'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateHints);
  document.getElementById(id).addEventListener('change', updateHints);
});

/* ─── Real-time auto-calculate on input ─────────────────────────────────── */

let debounceTimer;
['file-size-value', 'file-size-unit', 'speed-value', 'speed-unit'].forEach(id => {
  document.getElementById(id).addEventListener('input',  () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const s = document.getElementById('file-size-value').value;
      const p = document.getElementById('speed-value').value;
      if (s && p) calculate();
    }, 400);
  });
  document.getElementById(id).addEventListener('change', () => {
    const s = document.getElementById('file-size-value').value;
    const p = document.getElementById('speed-value').value;
    if (s && p) calculate();
  });
});

/* ─── Init ──────────────────────────────────────────────────────────────── */

buildPresets();
updateHints();
