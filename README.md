# ⚡ Download Speed Calculator

> **Instantly calculate download times. Compare connections. Share results.**  
> No installs. No sign-up. Just open and use.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?style=for-the-badge&logo=github)](https://warriorxr.github.io/download-speed-calculator/)
[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?style=for-the-badge&logo=vercel)](https://speedcalculator-omega.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-main-181717?style=for-the-badge&logo=github)](https://github.com/WARRIORXR/download-speed-calculator)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

| Platform | URL |
|----------|-----|
| 🌐 GitHub Pages | https://warriorxr.github.io/download-speed-calculator/ |
| ▲ Vercel | https://speedcalculator-omega.vercel.app/ |

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

## Files

```
index.html   → App structure (3 tabs, result panel, comparison table)
style.css    → Dark glassmorphism theme + animations
app.js       → All logic: calculator, history, sharing, gauge, batch
```

---

*MIT License — free to use, fork, and ship.*
