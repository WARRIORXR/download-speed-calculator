'use strict';

/* ══════════════════════════════════════════════════
   DOWNLOAD SPEED CALCULATOR — FEATURE-RICH APP.JS
   ══════════════════════════════════════════════════ */

/* ── Unit conversion maps ─────────────────────────────── */

const SIZE_TO_BITS = {
  'B':    8,      'KB': 8e3,    'MB': 8e6,    'GB': 8e9,    'TB': 8e12,
  'bit':  1,      'Kbit': 1e3,  'Mbit': 1e6,  'Gbit': 1e9,
  'KiB':  8*1024, 'MiB': 8*1024**2, 'GiB': 8*1024**3,
};

const SPEED_TO_BPS = {
  'bps': 1, 'Kbps': 1e3, 'Mbps': 1e6, 'Gbps': 1e9,
  'Bps': 8, 'KBps': 8e3, 'MBps': 8e6, 'GBps': 8e9,
};

/* ── Presets ──────────────────────────────────────────── */

const PRESETS = [
  { name: '🎵 MP3 Song',    size: 5,   sizeUnit: 'MB', speed: 10,  speedUnit: 'Mbps', desc: '5 MB @ 10 Mbps' },
  { name: '📺 HD Movie',    size: 4,   sizeUnit: 'GB', speed: 50,  speedUnit: 'Mbps', desc: '4 GB @ 50 Mbps' },
  { name: '🎮 AAA Game',    size: 80,  sizeUnit: 'GB', speed: 100, speedUnit: 'Mbps', desc: '80 GB @ 100 Mbps' },
  { name: '📁 Office Doc',  size: 50,  sizeUnit: 'MB', speed: 20,  speedUnit: 'Mbps', desc: '50 MB @ 20 Mbps' },
  { name: '🎬 4K Blu-ray',  size: 100, sizeUnit: 'GB', speed: 200, speedUnit: 'Mbps', desc: '100 GB @ 200 Mbps' },
  { name: '☁️ 1 TB Backup', size: 1,   sizeUnit: 'TB', speed: 500, speedUnit: 'Mbps', desc: '1 TB @ 500 Mbps' },
  { name: '⚡ Fiber 1 Gbps',size: 10,  sizeUnit: 'GB', speed: 1,   speedUnit: 'Gbps', desc: '10 GB @ 1 Gbps' },
  { name: '🐢 Slow 3G',     size: 500, sizeUnit: 'MB', speed: 1,   speedUnit: 'Mbps', desc: '500 MB @ 1 Mbps' },
];

/* ── Connection type comparison data ─────────────────── */

const CONNECTIONS = [
  { name: 'Dial-up',    emoji: '☎️',  speed: 56e3,   label: '56 Kbps' },
  { name: '3G Mobile',  emoji: '📱',  speed: 7.2e6,  label: '7.2 Mbps' },
  { name: '4G LTE',     emoji: '📶',  speed: 50e6,   label: '50 Mbps' },
  { name: '5G',         emoji: '🚀',  speed: 300e6,  label: '300 Mbps' },
  { name: 'Cable 100M', emoji: '🔌',  speed: 100e6,  label: '100 Mbps' },
  { name: 'Fiber 1G',   emoji: '⚡',  speed: 1e9,    label: '1 Gbps' },
  { name: 'Fiber 10G',  emoji: '🌐',  speed: 10e9,   label: '10 Gbps' },
];

/* ── Real-world context messages ─────────────────────── */

const CONTEXT_MESSAGES = [
  { maxSec: 5,      msg: s => `That's <strong>faster than blinking</strong> ⚡` },
  { maxSec: 60,     msg: s => `About the time to make a <strong>cup of coffee</strong> ☕` },
  { maxSec: 300,    msg: s => `Enough time to watch a <strong>${Math.round(s/60)}-minute YouTube video</strong> 📺` },
  { maxSec: 1800,   msg: s => `That's like <strong>${Math.round(s/60)} minutes</strong> of Netflix HD streaming 🎬` },
  { maxSec: 3600,   msg: s => `About the length of a <strong>movie</strong> — grab some popcorn 🍿` },
  { maxSec: 86400,  msg: s => `That's roughly <strong>${(s/3600).toFixed(1)} hours</strong> — you could binge a whole TV season 📺` },
  { maxSec: Infinity, msg: s => `That's <strong>${Math.round(s/86400)} days</strong> — consider upgrading your internet plan! 🐢` },
];

/* ── Helpers ──────────────────────────────────────────── */

function $(id) { return document.getElementById(id); }

function commas(n) {
  if (!isFinite(n)) return '∞';
  const s = parseFloat(n.toPrecision(6)).toString();
  const [i, d] = s.split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
}

function formatTime(s) {
  if (!isFinite(s) || s <= 0) return '—';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  const parts = [];
  if (d)   parts.push(`${d}d`);
  if (h)   parts.push(`${h}h`);
  if (m)   parts.push(`${m}m`);
  if (sec || !parts.length) parts.push(`${sec}s`);
  if (ms && !d && !h && !m) parts.push(`${ms}ms`);
  return parts.join(' ');
}

function formatSpeedBps(bps) {
  if (bps >= 1e9)  return `${(bps/1e9).toFixed(2)} Gbps`;
  if (bps >= 1e6)  return `${(bps/1e6).toFixed(2)} Mbps`;
  if (bps >= 1e3)  return `${(bps/1e3).toFixed(2)} Kbps`;
  return `${bps.toFixed(0)} bps`;
}

function showToast(msg, duration = 2500) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Tab switching ─────────────────────────────────────── */

function switchTab(name) {
  ['time','speed','batch'].forEach(t => {
    const tab   = $(`tab-${t}`);
    const panel = $(`panel-${t}`);
    const isActive = t === name;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });
}

/* ── Hint updates ─────────────────────────────────────── */

function updateHints() {
  const sv = parseFloat($('file-size-value').value);
  const su = $('file-size-unit').value;
  const pv = parseFloat($('speed-value').value);
  const pu = $('speed-unit').value;
  $('size-hint').textContent  = (!isNaN(sv) && sv > 0) ? `= ${(sv * SIZE_TO_BITS[su]).toExponential(3)} bits` : '';
  $('speed-hint').textContent = (!isNaN(pv) && pv > 0) ? `= ${(pv * SPEED_TO_BPS[pu]).toExponential(3)} bps`  : '';
}

/* ── Gauge animation ──────────────────────────────────── */

function animateGauge(seconds) {
  // Map download time to gauge fill (fast = full, slow = empty)
  // Gauge score: < 10s → 100%, 10s-1min → 80%, 1-10min → 60%, 10-60min → 40%, >1hr → 20%
  let score, label, ratingClass;
  if (seconds <= 10)    { score = 1.0;  label = '⚡ Ultra-Fast'; ratingClass = 'fast'; }
  else if (seconds <= 60)  { score = 0.78; label = '✅ Fast';      ratingClass = 'fast'; }
  else if (seconds <= 600) { score = 0.55; label = '👍 Moderate';  ratingClass = 'medium'; }
  else if (seconds <= 3600){ score = 0.32; label = '🐌 Slow';      ratingClass = 'slow'; }
  else                      { score = 0.1;  label = '🐢 Very Slow'; ratingClass = 'very-slow'; }

  // Arc path: total arc length for our semicircle (radius=80, half-circle ≈ π*80 ≈ 251.2)
  const arcLen = Math.PI * 80;
  const fillLen = arcLen * score;
  $('gauge-fill').style.strokeDashoffset = arcLen - fillLen;

  // Needle: -90deg = fully left, +90deg = fully right
  const angle = -90 + score * 180;
  $('gauge-needle').style.transform = `rotate(${angle}deg)`;

  $('gauge-label').textContent = label;
}

/* ── Context message ──────────────────────────────────── */

function showContextMessage(seconds) {
  const ctxEl = $('context-msg');
  for (const c of CONTEXT_MESSAGES) {
    if (seconds <= c.maxSec) {
      ctxEl.innerHTML = '💡 ' + c.msg(seconds);
      ctxEl.classList.add('visible');
      return;
    }
  }
  ctxEl.classList.remove('visible');
}

/* ── Main Calculate ────────────────────────────────────── */

function calculate() {
  const sRaw  = $('file-size-value').value.trim();
  const sUnit = $('file-size-unit').value;
  const pRaw  = $('speed-value').value.trim();
  const pUnit = $('speed-unit').value;

  const sField = $('field-size');
  const pField = $('field-speed');
  sField.classList.remove('error');
  pField.classList.remove('error');

  const sVal = parseFloat(sRaw);
  const pVal = parseFloat(pRaw);
  let ok = true;

  if (!sRaw || isNaN(sVal) || sVal <= 0) {
    sField.classList.add('error');
    $('size-hint').textContent = '⚠ Enter a valid size > 0';
    ok = false;
  }
  if (!pRaw || isNaN(pVal) || pVal <= 0) {
    pField.classList.add('error');
    $('speed-hint').textContent = '⚠ Enter a valid speed > 0';
    ok = false;
  }
  if (!ok) return;

  const bits    = sVal * SIZE_TO_BITS[sUnit];
  const bps     = pVal * SPEED_TO_BPS[pUnit];
  const seconds = bits / bps;

  // Result display
  const timeEl = $('result-time');
  timeEl.textContent = formatTime(seconds);
  timeEl.className   = 'result-time' + (seconds > 3600 ? ' slow' : seconds > 300 ? ' medium' : '');

  $('result-sub').textContent = isFinite(seconds) && seconds > 0
    ? `${commas(seconds)} seconds total`
    : '';

  // Animated breakdown
  animateCounter('bd-sec', seconds);
  animateCounter('bd-min', seconds / 60);
  animateCounter('bd-hr',  seconds / 3600);
  animateCounter('bd-day', seconds / 86400);

  // Gauge
  animateGauge(seconds);

  // Context
  showContextMessage(seconds);

  // Comparison table
  updateComparisonTable(bits);

  // History
  saveToHistory({
    sVal, sUnit, pVal, pUnit,
    result: formatTime(seconds),
    seconds,
    timestamp: Date.now(),
  });

  // Show panel
  const panel = $('result-panel');
  panel.classList.add('visible');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

  // Update URL for sharing
  updateShareURL(sVal, sUnit, pVal, pUnit);
}

/* ── Animated counter ─────────────────────────────────── */

function animateCounter(id, targetValue) {
  const el = $(id);
  const start = parseFloat(el.textContent.replace(/,/g,'')) || 0;
  const end   = targetValue;
  const duration = 600;
  const startTime = performance.now();

  function step(now) {
    const elapsed = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3); // cubic ease-out
    const val = start + (end - start) * eased;
    el.textContent = commas(val);
    if (elapsed < 1) requestAnimationFrame(step);
    else el.textContent = commas(end);
  }
  requestAnimationFrame(step);
}

/* ── Comparison Table ─────────────────────────────────── */

function updateComparisonTable(fileBits) {
  const tbody = $('comparison-tbody');
  tbody.innerHTML = '';

  CONNECTIONS.forEach(conn => {
    const secs = fileBits / conn.speed;
    const tr = document.createElement('tr');

    let ratingClass, ratingText;
    if (secs <= 10)      { ratingClass = 'rating-fast';      ratingText = 'Ultra-Fast'; }
    else if (secs <= 60) { ratingClass = 'rating-fast';      ratingText = 'Fast'; }
    else if (secs <= 600){ ratingClass = 'rating-good';      ratingText = 'Good'; }
    else if (secs <= 3600){ ratingClass = 'rating-slow';     ratingText = 'Slow'; }
    else                 { ratingClass = 'rating-very-slow'; ratingText = 'Very Slow'; }

    tr.innerHTML = `
      <td><span class="conn-name">${conn.emoji} ${conn.name}</span></td>
      <td><span class="conn-speed">${conn.label}</span></td>
      <td style="font-family:var(--mono);font-size:0.84rem;font-weight:600;color:var(--text)">${formatTime(secs)}</td>
      <td><span class="rating-badge ${ratingClass}">${ratingText}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── Copy result ──────────────────────────────────────── */

function copyResult() {
  const time = $('result-time').textContent;
  const sub  = $('result-sub').textContent;
  const size  = `${$('file-size-value').value} ${$('file-size-unit').value}`;
  const speed = `${$('speed-value').value} ${$('speed-unit').value}`;
  const text  = `Download Time: ${time}\n(${sub})\nFile: ${size} @ ${speed}\nCalculated with Download Speed Calculator`;
  navigator.clipboard.writeText(text)
    .then(() => showToast('✅ Result copied to clipboard!'))
    .catch(() => showToast('❌ Copy failed — try again'));
}

/* ── Share via URL ────────────────────────────────────── */

function updateShareURL(sVal, sUnit, pVal, pUnit) {
  const params = new URLSearchParams({ s: sVal, su: sUnit, p: pVal, pu: pUnit });
  history.replaceState(null, '', '?' + params.toString());
}

function shareResult() {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => showToast('🔗 Share link copied to clipboard!'))
    .catch(() => showToast('❌ Could not copy link'));
}

function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('s') && params.get('p')) {
    $('file-size-value').value = params.get('s');
    $('file-size-unit').value  = params.get('su') || 'GB';
    $('speed-value').value     = params.get('p');
    $('speed-unit').value      = params.get('pu') || 'Mbps';
    updateHints();
    calculate();
  }
}

/* ── History (localStorage) ────────────────────────────── */

const HISTORY_KEY = 'dsc_history';
const MAX_HISTORY = 6;

function saveToHistory(entry) {
  let history = getHistory();
  // Avoid duplicate consecutive entries
  if (history.length && history[0].seconds === entry.seconds) return;
  history.unshift(entry);
  history = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch { return []; }
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
  showToast('🗑️ History cleared');
}

function renderHistory() {
  const list = $('history-list');
  const history = getHistory();

  if (!history.length) {
    list.innerHTML = '<div class="history-empty">No calculations yet.</div>';
    return;
  }

  list.innerHTML = '';
  history.forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Restore: ${entry.sVal} ${entry.sUnit} at ${entry.pVal} ${entry.pUnit}`);

    const date = new Date(entry.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    item.innerHTML = `
      <div class="history-item-info">
        <div class="history-item-title">${entry.sVal} ${entry.sUnit} @ ${entry.pVal} ${entry.pUnit}</div>
        <div class="history-item-meta">${timeStr}</div>
      </div>
      <div class="history-item-result">${entry.result}</div>
    `;

    item.addEventListener('click', () => restoreHistory(entry));
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') restoreHistory(entry); });
    list.appendChild(item);
  });
}

function restoreHistory(entry) {
  $('file-size-value').value = entry.sVal;
  $('file-size-unit').value  = entry.sUnit;
  $('speed-value').value     = entry.pVal;
  $('speed-unit').value      = entry.pUnit;
  switchTab('time');
  updateHints();
  calculate();
  showToast('📋 Calculation restored');
}

/* ── Reverse Calculator ────────────────────────────────── */

const TIME_UNIT_TO_SEC = { s: 1, m: 60, h: 3600 };

function reverseCalculate() {
  const szRaw  = $('rev-size-value').value.trim();
  const szUnit = $('rev-size-unit').value;
  const tmRaw  = $('rev-time-value').value.trim();
  const tmUnit = $('rev-time-unit').value;

  const szField = $('rev-field-size');
  const tmField = $('rev-field-time');
  szField.classList.remove('error');
  tmField.classList.remove('error');

  const szVal = parseFloat(szRaw);
  const tmVal = parseFloat(tmRaw);
  let ok = true;

  if (!szRaw || isNaN(szVal) || szVal <= 0) {
    szField.classList.add('error');
    $('rev-size-hint').textContent = '⚠ Enter a valid size > 0';
    ok = false;
  }
  if (!tmRaw || isNaN(tmVal) || tmVal <= 0) {
    tmField.classList.add('error');
    $('rev-time-hint').textContent = '⚠ Enter a valid time > 0';
    ok = false;
  }
  if (!ok) return;

  const bits    = szVal * SIZE_TO_BITS[szUnit];
  const seconds = tmVal * TIME_UNIT_TO_SEC[tmUnit];
  const bps     = bits / seconds;

  const panel = $('rev-result-panel');
  $('rev-result-speed').textContent = formatSpeedBps(bps);
  $('rev-result-sub').textContent   = `${commas(bps)} bps required`;

  // Equivalent context
  const equiv = [];
  if (bps < 56e3)        equiv.push('slower than <strong>Dial-up</strong>');
  else if (bps < 7.2e6)  equiv.push('similar to <strong>3G Mobile</strong>');
  else if (bps < 50e6)   equiv.push('similar to <strong>4G LTE</strong>');
  else if (bps < 100e6)  equiv.push('similar to <strong>Fast Cable</strong>');
  else if (bps < 1e9)    equiv.push('similar to <strong>Fiber broadband</strong>');
  else                   equiv.push('similar to <strong>Gigabit Fiber</strong>');

  $('rev-equiv').innerHTML = `This is ${equiv[0]}. In more common units:<br>
    <strong>${(bps/1e6).toFixed(2)} Mbps</strong> · 
    <strong>${(bps/8e6).toFixed(2)} MB/s</strong>`;

  panel.classList.add('visible');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

/* ── Batch Calculator ──────────────────────────────────── */

let batchFileCount = 0;

function addBatchFile() {
  const list = $('batch-list');
  const id = ++batchFileCount;
  const row = document.createElement('div');
  row.className = 'batch-file-row';
  row.id = `batch-row-${id}`;
  row.innerHTML = `
    <input type="text" placeholder="File name (optional)" aria-label="File name ${id}" id="batch-name-${id}" />
    <input type="number" placeholder="Size" min="0" step="any" aria-label="File size ${id}" id="batch-size-${id}" />
    <select aria-label="Size unit ${id}" id="batch-unit-${id}">
      <option value="MB">MB</option>
      <option value="GB" selected>GB</option>
      <option value="KB">KB</option>
      <option value="TB">TB</option>
    </select>
    <button class="batch-remove-btn" onclick="removeBatchFile(${id})" aria-label="Remove file ${id}" title="Remove">✕</button>
  `;
  list.appendChild(row);
}

function removeBatchFile(id) {
  const row = $(`batch-row-${id}`);
  if (row) row.remove();
}

function calculateBatch() {
  const spRaw  = $('batch-speed-value').value.trim();
  const spUnit = $('batch-speed-unit').value;
  const spVal  = parseFloat(spRaw);

  if (!spRaw || isNaN(spVal) || spVal <= 0) {
    showToast('⚠ Enter a valid download speed first');
    return;
  }

  const bps = spVal * SPEED_TO_BPS[spUnit];
  const rows = document.querySelectorAll('.batch-file-row');

  if (!rows.length) {
    showToast('⚠ Add at least one file');
    return;
  }

  let totalBits = 0;
  const results = [];
  let hasError = false;

  rows.forEach(row => {
    const id     = row.id.replace('batch-row-', '');
    const name   = $(`batch-name-${id}`).value.trim() || `File ${id}`;
    const sizeRaw= $(`batch-size-${id}`).value.trim();
    const sUnit  = $(`batch-unit-${id}`).value;
    const sVal   = parseFloat(sizeRaw);

    if (!sizeRaw || isNaN(sVal) || sVal <= 0) {
      $(`batch-size-${id}`).style.borderColor = 'var(--danger)';
      hasError = true;
      return;
    }
    $(`batch-size-${id}`).style.borderColor = '';

    const bits = sVal * SIZE_TO_BITS[sUnit];
    totalBits += bits;
    results.push({ name, bits, time: formatTime(bits / bps) });
  });

  if (hasError) {
    showToast('⚠ Fix the highlighted file sizes');
    return;
  }

  const totalTime = formatTime(totalBits / bps);
  const grid = $('batch-result-grid');
  grid.innerHTML = results.map(r => `
    <div class="batch-file-result">
      <span class="batch-file-result-name">${r.name}</span>
      <span class="batch-file-result-time">${r.time}</span>
    </div>
  `).join('');

  $('batch-total-time').textContent = totalTime;

  const panel = $('batch-result-panel');
  panel.classList.add('visible');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

/* ── Presets ──────────────────────────────────────────── */

function buildPresets() {
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.setAttribute('aria-label', `Preset: ${p.name} — ${p.desc}`);
    btn.innerHTML = `<span class="preset-name">${p.name}</span><span class="preset-desc">${p.desc}</span>`;
    btn.addEventListener('click', () => {
      $('file-size-value').value = p.size;
      $('file-size-unit').value  = p.sizeUnit;
      $('speed-value').value     = p.speed;
      $('speed-unit').value      = p.speedUnit;
      updateHints();
      calculate();
      switchTab('time');
    });
    $('presets-grid').appendChild(btn);
  });
}

/* ── Events ───────────────────────────────────────────── */

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    // Determine which panel is active and calculate accordingly
    if ($('panel-time').classList.contains('active'))   calculate();
    if ($('panel-speed').classList.contains('active'))  reverseCalculate();
    if ($('panel-batch').classList.contains('active'))  calculateBatch();
  }
});

let timer;
['file-size-value','file-size-unit','speed-value','speed-unit'].forEach(id => {
  $(id).addEventListener('input',  () => { updateHints(); clearTimeout(timer); timer = setTimeout(() => { if ($('file-size-value').value && $('speed-value').value) calculate(); }, 350); });
  $(id).addEventListener('change', () => { updateHints(); if ($('file-size-value').value && $('speed-value').value) calculate(); });
});

/* ── Init ─────────────────────────────────────────────── */

buildPresets();
updateHints();
renderHistory();

// Initialize batch with 2 default files
addBatchFile();
addBatchFile();

// Load from URL params if present
loadFromURL();
