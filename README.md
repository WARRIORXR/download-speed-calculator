# ⚡ Download Speed Calculator

A **premium, feature-rich** web tool to calculate download times, compare connections, reverse-calculate required speeds, and batch-process multiple files — all in your browser, zero dependencies.

**🌐 Live demo:** https://WARRIORXR.github.io/download-speed-calculator

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⏱ **Download Time Calculator** | Enter file size + speed → get exact download time |
| 🚀 **Reverse Calculator** | Know your deadline → find the minimum speed you need |
| 📦 **Batch File Calculator** | Add multiple files → get combined total download time |
| 📊 **Connection Comparison Table** | See the same file across Dial-up, 3G, 4G, 5G, Cable, Fiber, Gigabit |
| ⚡ **Visual Speed Gauge** | Animated SVG arc + needle showing your speed rating |
| 🕒 **Calculation History** | Last 6 calculations saved to `localStorage`, click to restore |
| 🔗 **Share via URL** | Results are encoded in the URL — just copy and share |
| 📋 **Copy to Clipboard** | One-click copy of the full result summary |
| 💡 **Real-world Context** | "That's like streaming Netflix HD for 2 hours" |
| ⚡ **Quick Presets** | MP3, HD Movie, AAA Game, 4K Blu-ray, 1 TB Backup, and more |
| 🎨 **Premium Dark UI** | Glassmorphism, animated background orbs, smooth micro-animations |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## 🧮 Formulas

### Download Time
```
Time (seconds) = File Size (bits) ÷ Speed (bps)
```

### Required Speed (Reverse Calculator)
```
Speed (bps) = File Size (bits) ÷ Desired Time (seconds)
```

### Batch Total Time
```
Total Time = Σ [File Size (bits) ÷ Speed (bps)] for each file
```

All unit conversions (MB, GB, TB, Kbps, Mbps, Gbps, etc.) are handled automatically.

---

## 📁 File Structure

| File | Description |
|------|-------------|
| `index.html` | Full app structure — 3 tab panels, result panel, comparison table, history |
| `style.css` | Premium dark glassmorphism theme with animations |
| `app.js` | All calculator logic, history, URL sharing, gauge, comparison, batch |
| `README.md` | This file |
| `.nojekyll` | Disables Jekyll processing on GitHub Pages |

---

## 🌐 Supported Units

### File Size
`B`, `KB`, `MB`, `GB`, `TB`, `bit`, `Kbit`, `Mbit`, `Gbit`, `KiB`, `MiB`, `GiB`

### Speed
`bps`, `Kbps`, `Mbps`, `Gbps`, `B/s`, `KB/s`, `MB/s`, `GB/s`

---

## 🚀 How to Host on GitHub Pages

1. Push to your repository at `https://github.com/WARRIORXR/download-speed-calculator`
2. Go to **Settings → Pages**
3. Under **Branch**, select `main` and folder `/root`, then **Save**
4. Wait ~60 seconds → visit `https://WARRIORXR.github.io/download-speed-calculator`

No server, no build step, free forever.

---

## 🌿 Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable release (original minimal version) |
| `feature/enhanced-calculator` | ⭐ Full feature upgrade (current) |

---

## 🔗 URL Sharing

Results are automatically encoded in the URL as query parameters:

```
?s=4&su=GB&p=100&pu=Mbps
```

Share any URL and the recipient sees the same calculation pre-loaded.

---

## 🛠 Tech Stack

- Vanilla **HTML5**, **CSS3**, **JavaScript (ES2020)**
- Google Fonts: **Inter** + **JetBrains Mono**
- Zero frameworks, zero build tools, zero dependencies
- Stores history in `localStorage`

---

## 📄 License

MIT — free to use, modify, and distribute.
