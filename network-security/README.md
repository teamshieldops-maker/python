# 🛡️ Network Security Quest

Learn network security as a game — built for security/network engineers and interview prep. Everything is hands-on: write **real firewall rules** and watch a **live traffic simulator** pass or drop each packet, do **CIDR/subnetting** with instant validation, and work through **zero-trust segmentation, secure protocols, and threat detection** scenarios.

No install, no backend — pure static site, so it runs anywhere (including your phone).

## 28 quests across 7 worlds

| World | You learn |
|-------|-----------|
| 🌐 Net Foundations | OSI layers, TCP vs UDP, well-known ports, subnet masks |
| 🧮 Subnetting | network/broadcast addresses, host counts, right-sizing, range checks |
| 🧱 Firewalls & ACLs | rule syntax, default-deny, rule order, stateful inbound/outbound, egress filtering |
| 🔀 Segmentation | three-tier lockdown, microsegmentation, east-west vs north-south, jump-box SSH |
| 🔐 Secure Protocols | TLS, IPSec vs SSL VPN, DNSSEC vs DoH, VPN/admin ports |
| 🛰️ Threat Detection | port scans, IDS vs IPS, spotting exfiltration, blocking a hostile source |
| 🏆 Boss | design and lock down a full enterprise network |

## The live firewall simulator
In the 🧱 / 🔀 / 🛰️ / 🏆 worlds you write rules in a simple, realistic syntax:
```
action proto src dst [port]
# e.g.
allow tcp internet dmz 443
deny  tcp attacker dmz any
```
Rules evaluate **top-down, first match wins, default-deny**. Hit **Run traffic** and the topology panel shows every flow as **ALLOW (green)** / **DENY (red)** with a ✔/✘ against the required policy — so you *see* your segmentation working (or leaking).

## Features
- 🧱 Live traffic simulator with a real rule engine (subnet math + packet evaluation)
- ❓ concept quizzes, ✏️ subnetting fill-ins, 🧱 firewall challenges
- ⭐ XP, levels, world badges 🏅, confetti 🎉
- 🔒 progressive unlock · 💡 hints + answers · 💾 auto-saved progress

## Run it anywhere
Static files — perfect for GitHub Pages or any static host. Locally:
```bash
cd network-quest
python3 -m http.server 8000   # open http://localhost:8000
```
(Or just open `standalone.html` — the whole app inlined into one file — on any static host.)

## Files
```
network-quest/
├── index.html     # shell
├── styles.css     # theme + topology UI
├── engine.js      # subnet math + firewall rule evaluator (browser + Node)
├── lessons.js     # all 28 lessons
├── app.js         # game engine: XP, rendering, live simulator
├── standalone.html# one-file build
└── _selftest.js   # dev: validates engine math + every lesson solution
```

## Adding lessons
Append to `LESSONS` in `lessons.js` (kinds: `quiz`, `fill`, `firewall`), then:
```bash
node _selftest.js
```
It checks the engine math, confirms every firewall solution satisfies its flows, and warns if a starter already passes.

---
Clear the boss and you can say you've designed and defended a full segmented enterprise network. 🚀
