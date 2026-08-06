'use strict';

/* ── Unit conversion maps ─────────────────────────────── */

const SIZE_TO_BITS = {
  'B':    8, 'KB': 8e3, 'MB': 8e6, 'GB': 8e9, 'TB': 8e12,
  'bit':  1, 'Kbit': 1e3, 'Mbit': 1e6, 'Gbit': 1e9,
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
  { name: '☁️ 1TB Backup',  size: 1,   sizeUnit: 'TB', speed: 500, speedUnit: 'Mbps', desc: '1 TB @ 500 Mbps' },
  { name: '⚡ Fiber 1Gbps', size: 10,  sizeUnit: 'GB', speed: 1,   speedUnit: 'Gbps', desc: '10 GB @ 1 Gbps' },
  { name: '🐢 Slow 3G',     size: 500, sizeUnit: 'MB', speed: 1,   speedUnit: 'Mbps', desc: '500 MB @ 1 Mbps' },
];

/* ── Helpers ──────────────────────────────────────────── */

function commas(n) {
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
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (sec || !parts.length) parts.push(`${sec}s`);
  if (ms && !d && !h && !m) parts.push(`${ms}ms`);
  return parts.join(' ');
}

/* ── Hint updates ─────────────────────────────────────── */

function updateHints() {
  const sv = parseFloat($('file-size-value').value);
  const su = $('file-size-unit').value;
  const pv = parseFloat($('speed-value').value);
  const pu = $('speed-unit').value;

  $('size-hint').textContent  = (!isNaN(sv) && sv > 0) ? `${(sv * SIZE_TO_BITS[su]).toExponential(3)} bits` : '';
  $('speed-hint').textContent = (!isNaN(pv) && pv > 0) ? `${(pv * SPEED_TO_BPS[pu]).toExponential(3)} bps`  : '';
}

/* ── Calculate ────────────────────────────────────────── */

function calculate() {
  const sRaw = $('file-size-value').value.trim();
  const sUnit = $('file-size-unit').value;
  const pRaw = $('speed-value').value.trim();
  const pUnit = $('speed-unit').value;

  const sField = $('file-size-value').closest('.field');
  const pField = $('speed-value').closest('.field');

  sField.classList.remove('error');
  pField.classList.remove('error');

  const sVal = parseFloat(sRaw);
  const pVal = parseFloat(pRaw);
  let ok = true;

  if (!sRaw || isNaN(sVal) || sVal <= 0) {
    sField.classList.add('error');
    $('size-hint').textContent = 'Enter a valid size > 0';
    ok = false;
  }
  if (!pRaw || isNaN(pVal) || pVal <= 0) {
    pField.classList.add('error');
    $('speed-hint').textContent = 'Enter a valid speed > 0';
    ok = false;
  }
  if (!ok) return;

  const bits    = sVal * SIZE_TO_BITS[sUnit];
  const bps     = pVal * SPEED_TO_BPS[pUnit];
  const seconds = bits / bps;

  // Result
  const timeEl = $('result-time');
  timeEl.textContent = formatTime(seconds);
  timeEl.className   = 'result-time' + (seconds > 3600 ? ' slow' : '');

  $('result-sub').textContent = isFinite(seconds) && seconds > 0
    ? `${commas(seconds)} seconds total`
    : '';

  $('bd-sec').textContent = commas(seconds);
  $('bd-min').textContent = commas(seconds / 60);
  $('bd-hr').textContent  = commas(seconds / 3600);
  $('bd-day').textContent = commas(seconds / 86400);

  const panel = $('result-panel');
  panel.classList.add('visible');
  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

/* ── Presets ──────────────────────────────────────────── */

function buildPresets() {
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.innerHTML = `<span class="preset-name">${p.name}</span><span class="preset-desc">${p.desc}</span>`;
    btn.addEventListener('click', () => {
      $('file-size-value').value = p.size;
      $('file-size-unit').value  = p.sizeUnit;
      $('speed-value').value     = p.speed;
      $('speed-unit').value      = p.speedUnit;
      updateHints();
      calculate();
    });
    $('presets-grid').appendChild(btn);
  });
}

/* ── Utility ──────────────────────────────────────────── */

function $(id) { return document.getElementById(id); }

/* ── Events ───────────────────────────────────────────── */

document.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });

let timer;
['file-size-value','file-size-unit','speed-value','speed-unit'].forEach(id => {
  $(id).addEventListener('input', () => { updateHints(); clearTimeout(timer); timer = setTimeout(() => { if ($('file-size-value').value && $('speed-value').value) calculate(); }, 350); });
  $(id).addEventListener('change', () => { updateHints(); if ($('file-size-value').value && $('speed-value').value) calculate(); });
});

/* ── Init ─────────────────────────────────────────────── */

buildPresets();
updateHints();
