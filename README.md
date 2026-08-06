# Download Speed Calculator

A minimal, fast tool to calculate how long any file will take to download.

**Live demo:** https://WARRIORXR.github.io/download-speed-calculator

---

## 🚀 How to host this live (GitHub Pages)

1. Go to your repository:  
   **https://github.com/WARRIORXR/download-speed-calculator**

2. Click **Settings** (top tab of the repo)

3. In the left sidebar, click **Pages**

4. Under **Branch**, select `main` and folder `/root`, then click **Save**

5. Wait ~60 seconds, then visit:  
   **https://WARRIORXR.github.io/download-speed-calculator**

That's it — no server, no build step, free forever.

---

## Files

| File | Description |
|------|-------------|
| `index.html` | App structure |
| `style.css` | Minimal dark theme |
| `app.js` | Calculation logic & presets |

---

## Formula

```
Time (seconds) = File Size (bits) ÷ Speed (bps)
```

All unit conversions are handled automatically.
