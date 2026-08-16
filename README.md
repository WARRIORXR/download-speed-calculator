# ⚡ Download Speed Calculator

> **Instantly calculate download times. Compare connections. Share results.**  
> No installs. No sign-up. Just open and use.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge)](https://WARRIORXR.github.io/download-speed-calculator)
[![Branch](https://img.shields.io/badge/Branch-feature%2Fenhanced--calculator-blue?style=for-the-badge)](https://github.com/WARRIORXR/download-speed-calculator/tree/feature/enhanced-calculator)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## What It Does

| ⏱ Calculate Time | 🚀 Find Speed Needed | 📦 Batch Files |
|:---:|:---:|:---:|
| File size + speed → exact download time | File size + deadline → minimum speed required | Multiple files → combined total time |

---

## Features

- 📊 **Connection Comparison** — Dial-up, 3G, 4G, 5G, Cable, Fiber, Gigabit side by side
- ⚡ **Visual Speed Gauge** — animated arc shows how fast your connection is
- 🕒 **History** — last 6 calculations saved, click any to restore
- 🔗 **Shareable Links** — results encoded in URL, just paste and share
- 📋 **Copy Result** — one click copies the full summary to clipboard
- 💡 **Real-world Context** — "that's like 2 hours of Netflix HD"
- ⚡ **Quick Presets** — MP3, HD Movie, AAA Game, 4K Blu-ray, 1 TB Backup & more
- 🎨 **Premium Dark UI** — glassmorphism, animated background, smooth transitions

---

## Formula

```
Download Time  =  File Size (bits)  ÷  Speed (bps)
Required Speed =  File Size (bits)  ÷  Desired Time (seconds)
```

All units handled automatically — MB, GB, TB, Kbps, Mbps, Gbps, and more.

---

## Stack

**HTML · CSS · Vanilla JS** — zero frameworks, zero dependencies, zero build step.

---

## Deploy in 60 Seconds

```bash
# GitHub Pages
Settings → Pages → Branch: main → Save
# Live at: https://WARRIORXR.github.io/download-speed-calculator

# Vercel
Import repo → Leave build empty → Deploy
```

---

## Files

```
index.html   → App structure (3 tabs, result panel, comparison table)
style.css    → Dark glassmorphism theme + animations
app.js       → All logic: calculator, history, sharing, gauge, batch
vercel.json  → Static site config for Vercel
```

---

*MIT License — free to use, fork, and ship.*
