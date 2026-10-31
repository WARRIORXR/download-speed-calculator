# Download Speed Calculator — Rust Edition

Terminal port of the download-speed web app (`app.js` in the parent folder).
Same unit tables (decimal scale, bits vs bytes distinguished by case), same
presets, zero dependencies (pure std).

## Run

```bash
cargo run                      # interactive shell
cargo run -- time 80GB 100Mbps # or direct commands
cargo run -- size 50Mbps 30min
cargo run -- convert 500MB GB
cargo run -- convert 100Mbps MBps
cargo run -- presets
```

`time` = how long a download takes, `size` = how much you can download in a
given time, `convert` = unit conversion, `presets` = the common-downloads table.
