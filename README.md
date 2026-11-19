# 🐍 Python Quest: Endpoint Edition

Learn the Python your domain actually needs — as a game. Built for **security / endpoint / Intune engineers**: you write **real Python in the browser** and run it against a **live simulated Microsoft Intune + Graph API + CrowdStrike** environment. Apply a tag, run the code, and watch it appear on the device in the **Live Intune Portal** — just like the interview console where "correct code → the change is applied."

## Why this fits you
You already think in devices, tags, compliance, and APIs. Every Python concept is taught through those, building up to the tasks interviews actually ask for: a device **tagging engine**, **Graph API** calls (auth, GET/PATCH, pagination, 429 retry), and **security automation**.

## 35 quests across 7 worlds

| World | Python skills | Framed as |
|-------|---------------|-----------|
| 🧱 Foundations | variables, f-strings, booleans, math, string methods | device facts & compliance |
| 🗂️ Collections | lists, dicts, sets, aggregation | your device inventory |
| 🔁 Logic & Flow | if/elif, for, comprehensions, try/except, while | tagging rules & safe scripts |
| 🔧 Functions & Time | functions, defaults, `.get()`, `datetime` | reusable tools & stale-device math |
| 🖥️ Intune Simulator | automate a **live** mock Intune | tag, remediate, report — see it live |
| 🌐 Graph API | OAuth token, GET/PATCH, pagination, 429 retry | real Microsoft Graph patterns |
| 🛡️ Security Boss | CrowdStrike triage, resolve, MD5/IOC, hashlib | SOC automation + capstone engine |

The final boss: write a full **auto-remediation engine** that sweeps the fleet and applies quarantine / stale / BYOD tagging rules — and watch the whole portal light up.

## The live simulation
Three objects are injected into every lesson (fresh each run):
- **`intune`** — `list_devices()`, `add_tag()`, `set_compliance()`, `set_category()`, `offboard()`
- **`graph`** — `authenticate()`, `get()`, `patch()`, `flaky_get()` (simulates 401 / paging / 429)
- **`falcon`** — `list_detections()`, `resolve()`

The portal under the editor re-renders after every run, glowing the rows and tags your code changed.

## Features
- ✅ Real in-browser Python (via [Pyodide](https://pyodide.org) — no install)
- 🖥️ Live Intune/CrowdStrike portal that reacts to your code in real time
- ⭐ XP, levels, world badges 🏅, confetti 🎉
- 🔒 Progressive unlock · 💡 hints + solutions · 💾 auto-saved progress

## Run it anywhere
This is a 100% client-side static site — perfect for **GitHub Pages**. Once deployed you get a public URL that works on any device, including your phone. No backend, no install.

To run locally instead:
```bash
cd python-quest
python3 -m http.server 8000   # then open http://localhost:8000
```
(Pyodide needs http, so don't open the file directly.)

## Project files
```
python-quest/
├── index.html     # page shell, loads Pyodide + scripts
├── styles.css     # game + portal UI theme
├── env.js         # the simulated Intune / Graph / CrowdStrike backend (Python)
├── lessons.js     # all 35 lessons (edit here to add more)
├── app.js         # engine: Python runner, portal, XP, rendering
├── _selftest.js   # dev: extracts env + lessons for testing
└── _selftest.py   # dev: verifies every solution passes & every starter fails
```

## Adding lessons
Append to `LESSONS` in `lessons.js` (copy one as a template). Then verify nothing broke:
```bash
node _selftest.js && python3 _selftest.py
```
This runs every lesson's `solution` through its `check` (must pass) and every `starter` (must fail) — so you never ship a broken quest.

---
Beat the boss, then put "built a device auto-remediation engine and Graph API automation in Python" on your interview answer. 🚀
