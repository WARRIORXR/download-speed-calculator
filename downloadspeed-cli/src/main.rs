//! Download Speed Calculator — Rust terminal port of the web app
//! (`app.js` in the parent folder). Same unit tables (bits vs bytes,
//! decimal 1e3 scale), same presets, plus time/size/convert commands.
//!
//! Run with `cargo run` for the interactive shell, or pass commands directly:
//!   downloadspeed-cli time 80GB 100Mbps
//!   downloadspeed-cli size 50Mbps 30min
//!   downloadspeed-cli convert 500MB GB
//!   downloadspeed-cli presets

use std::io::{self, BufRead, Write};

const CYAN: &str = "\x1b[36m";
const GREEN: &str = "\x1b[32m";
const DIM: &str = "\x1b[2m";
const BOLD: &str = "\x1b[1m";
const RESET: &str = "\x1b[0m";

/// Speed units → bits per second (same table as the JS SPEED_TO_BPS).
const SPEED_TO_BPS: [(&str, f64); 8] = [
    ("bps", 1.0),
    ("Kbps", 1e3),
    ("Mbps", 1e6),
    ("Gbps", 1e9),
    ("Bps", 8.0),
    ("KBps", 8e3),
    ("MBps", 8e6),
    ("GBps", 8e9),
];

/// Data units → bytes (decimal scale, like the web app's presets).
const DATA_TO_BYTES: [(&str, f64); 5] = [
    ("B", 1.0),
    ("KB", 1e3),
    ("MB", 1e6),
    ("GB", 1e9),
    ("TB", 1e12),
];

/// Duration units → seconds.
const DURATION_TO_SECS: [(&str, f64); 5] = [
    ("s", 1.0),
    ("sec", 1.0),
    ("min", 60.0),
    ("m", 60.0),
    ("h", 3600.0),
];

/// Same presets as the JS app: (name, size, sizeUnit, speed, speedUnit, desc)
const PRESETS: [(&str, f64, &str, f64, &str, &str); 8] = [
    ("🎵 MP3 Song", 5.0, "MB", 10.0, "Mbps", "5 MB @ 10 Mbps"),
    ("📺 HD Movie", 4.0, "GB", 50.0, "Mbps", "4 GB @ 50 Mbps"),
    ("🎮 AAA Game", 80.0, "GB", 100.0, "Mbps", "80 GB @ 100 Mbps"),
    ("📁 Office Doc", 50.0, "MB", 20.0, "Mbps", "50 MB @ 20 Mbps"),
    ("🎬 4K Movie", 15.0, "GB", 100.0, "Mbps", "15 GB @ 100 Mbps"),
    ("💿 Software Suite", 2.0, "GB", 25.0, "Mbps", "2 GB @ 25 Mbps"),
    ("📸 RAW Photos (100)", 3.0, "GB", 30.0, "Mbps", "3 GB @ 30 Mbps"),
    ("🎞  Series Season (HD)", 12.0, "GB", 75.0, "Mbps", "12 GB @ 75 Mbps"),
];

fn direct(table: &[(&str, f64)], unit: &str) -> Option<f64> {
    table
        .iter()
        .find(|(name, _)| name.eq_ignore_ascii_case(unit))
        .map(|(_, factor)| *factor)
}

fn lookup(table: &[(&str, f64)], unit: &str) -> Option<f64> {
    if let Some(factor) = direct(table, unit) {
        return Some(factor);
    }
    // aliases — numeric factors are the same for data (bytes) and speed (bits) tables
    match unit.to_lowercase().as_str() {
        "kb/s" => direct(table, "KBps"),
        "mb/s" => direct(table, "MBps"),
        "gb/s" => direct(table, "GBps"),
        "kbit" | "kbits" => direct(table, "Kbps"),
        "mbit" | "mbits" => direct(table, "Mbps"),
        "gbit" | "gbits" => direct(table, "Gbps"),
        "kb" => Some(1e3),
        "mb" => Some(1e6),
        "gb" => Some(1e9),
        "tb" => Some(1e12),
        _ => None,
    }
}

/// "80GB" → (80.0, "GB")
fn parse_value_token(token: &str) -> Option<(f64, String)> {
    let split = token
        .char_indices()
        .find(|(_, c)| !c.is_ascii_digit() && *c != '.')
        .map(|(i, _)| i)?;
    let (digits, unit) = token.split_at(split);
    Some((digits.parse().ok()?, unit.to_string()))
}

fn humanize_time(mut secs: f64) -> String {
    if secs < 1.0 {
        return format!("{secs:.2}s");
    }
    let h = (secs / 3600.0).floor();
    secs -= h * 3600.0;
    let m = (secs / 60.0).floor();
    secs -= m * 60.0;
    let s = secs.round();
    if h >= 1.0 {
        format!("{h}h {m}m {s}s")
    } else if m >= 1.0 {
        format!("{m}m {s}s")
    } else {
        format!("{s}s")
    }
}

fn humanize_size(bytes: f64) -> String {
    for (name, factor) in [("TB", 1e12), ("GB", 1e9), ("MB", 1e6), ("KB", 1e3)] {
        if bytes >= factor {
            return format!("{:.2} {name}", bytes / factor);
        }
    }
    format!("{bytes:.0} B")
}

fn cmd_time(args: &[String]) {
    // time <size><unit> <speed><unit>
    let size = args
        .first()
        .and_then(|t| parse_value_token(t))
        .and_then(|(v, u)| lookup(&DATA_TO_BYTES, &u).map(|f| v * f));
    let speed = args
        .get(1)
        .and_then(|t| parse_value_token(t))
        .and_then(|(v, u)| lookup(&SPEED_TO_BPS, &u).map(|f| v * f));
    match (size, speed) {
        (Some(bytes), Some(bps)) if bps > 0.0 => {
            let secs = bytes * 8.0 / bps;
            println!(
                "⏱  {BOLD}{}{RESET} to download {} at {}",
                humanize_time(secs),
                humanize_size(bytes),
                args.get(1).map(String::as_str).unwrap_or("?"),
            );
        }
        _ => println!("{DIM}Usage: time <size><unit> <speed><unit>   e.g. time 80GB 100Mbps{RESET}"),
    }
}

fn cmd_size(args: &[String]) {
    // size <speed><unit> <duration><unit>
    let speed = args
        .first()
        .and_then(|t| parse_value_token(t))
        .and_then(|(v, u)| lookup(&SPEED_TO_BPS, &u).map(|f| v * f));
    let dur = args
        .get(1)
        .and_then(|t| parse_value_token(t))
        .and_then(|(v, u)| lookup(&DURATION_TO_SECS, &u).map(|f| v * f));
    match (speed, dur) {
        (Some(bps), Some(secs)) if bps > 0.0 => {
            let bytes = bps * secs / 8.0;
            println!(
                "📦 {BOLD}{}{RESET} downloadable in {} at {}",
                humanize_size(bytes),
                args.get(1).map(String::as_str).unwrap_or("?"),
                args.first().map(String::as_str).unwrap_or("?"),
            );
        }
        _ => println!("{DIM}Usage: size <speed><unit> <duration><unit>   e.g. size 50Mbps 30min{RESET}"),
    }
}

fn looks_like_speed(u: &str) -> bool {
    let l = u.to_lowercase();
    l.ends_with("bps") || l.ends_with("b/s") || l.ends_with("bit") || l.ends_with("bits")
}

fn cmd_convert(args: &[String]) {
    // convert <value><unit> <target unit>
    let (value, unit) = args
        .first()
        .and_then(|t| parse_value_token(t))
        .unwrap_or((0.0, String::new()));
    let target = args.get(1).map(String::as_str).unwrap_or("");
    let table: &[(&str, f64)] = if looks_like_speed(&unit) || looks_like_speed(target) {
        &SPEED_TO_BPS
    } else {
        &DATA_TO_BYTES
    };
    match (lookup(table, &unit), lookup(table, target)) {
        (Some(f), Some(t)) if f > 0.0 => {
            println!("≈ {BOLD}{:.4} {target}{RESET}", value * f / t);
        }
        _ => println!(
            "{DIM}Usage: convert <value><unit> <target-unit>\nData: B KB MB GB TB · Speed: bps Kbps Mbps Gbps Bps KBps MBps GBps{RESET}"
        ),
    }
}

fn cmd_presets() {
    println!("{BOLD}Common downloads{RESET} {DIM}(size @ speed → time){RESET}");
    for (name, size, su, speed, pu, _desc) in PRESETS {
        let bytes = size * lookup(&DATA_TO_BYTES, su).unwrap_or(1.0);
        let bps = speed * lookup(&SPEED_TO_BPS, pu).unwrap_or(1.0);
        println!(
            "  {:<24} {} @ {} {}  →  {GREEN}{}{RESET}",
            name,
            format!("{size} {su}").trim(),
            speed,
            pu,
            humanize_time(bytes * 8.0 / bps),
        );
    }
}

fn print_help() {
    println!(
        "{BOLD}Download Speed Calculator — Rust Edition{RESET}

  time <size><unit> <speed><unit>      e.g. time 80GB 100Mbps
  size <speed><unit> <duration><unit>  e.g. size 50Mbps 30min
  convert <value><unit> <target>       e.g. convert 500MB GB
  presets                              common downloads table
  help · quit"
    );
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if !args.is_empty() {
        let cmd = args[0].as_str();
        let rest = &args[1..];
        match cmd {
            "time" => cmd_time(rest),
            "size" => cmd_size(rest),
            "convert" => cmd_convert(rest),
            "presets" => cmd_presets(),
            _ => print_help(),
        }
        return;
    }

    println!("{BOLD}⚡ Download Speed Calculator — Rust Edition{RESET} {DIM}(type help){RESET}");
    let stdin = io::stdin();
    loop {
        print!("{CYAN}speed>{RESET} ");
        let _ = io::stdout().flush();
        let mut line = String::new();
        if stdin.lock().read_line(&mut line).unwrap_or(0) == 0 {
            break;
        }
        let mut parts = line.split_whitespace().map(|s| s.to_string());
        let cmd = parts.next().unwrap_or_default();
        let rest: Vec<String> = parts.collect();
        match cmd.as_str() {
            "" => continue,
            "quit" | "exit" | "q" => break,
            "time" => cmd_time(&rest),
            "size" => cmd_size(&rest),
            "convert" => cmd_convert(&rest),
            "presets" => cmd_presets(),
            "help" | "?" => print_help(),
            other => println!("{DIM}Unknown command '{other}' — type help{RESET}"),
        }
    }
    println!("Bye! 👋");
}
