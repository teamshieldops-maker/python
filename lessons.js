/* ============================================================
   PYTHON QUEST: ENDPOINT EDITION — curriculum
   Full domain path for a security / endpoint / Intune engineer.
   Worlds 5-7 automate the live simulated environment (env.js):
   intune, graph, falcon — your code changes the portal in real time.
   ============================================================ */

const WORLDS = [
  { id: "w1", name: "Foundations",        emoji: "🧱", blurb: "Variables, text, numbers & logic — the atoms of Python." },
  { id: "w2", name: "Collections",        emoji: "🗂️", blurb: "Lists, dicts & sets — your device inventory in code." },
  { id: "w3", name: "Logic & Flow",       emoji: "🔁", blurb: "Decisions, loops, comprehensions & error handling." },
  { id: "w4", name: "Functions & Time",   emoji: "🔧", blurb: "Reusable tools, safe lookups & working with dates." },
  { id: "w5", name: "Intune Simulator",   emoji: "🖥️", blurb: "Automate a live mock Intune — watch tags apply in real time." },
  { id: "w6", name: "Graph API",          emoji: "🌐", blurb: "Auth, GET/PATCH, pagination & 429 retry — real API skills." },
  { id: "w7", name: "Security Boss",      emoji: "🛡️", blurb: "CrowdStrike triage, IOC hashing & auto-remediation." },
  { id: "w8", name: "Advanced Python",    emoji: "🧠", blurb: "Generators, decorators, dataclasses, regex & exceptions." },
  { id: "w9", name: "API Security",       emoji: "🔑", blurb: "JWTs, OAuth, scopes & input validation in Python." },
  { id: "w10", name: "CI/CD & Automation", emoji: "⚙️", blurb: "Tests, retries, secret scanning & dependency checks." },
  { id: "w11", name: "Log Analytics",     emoji: "📊", blurb: "Counter, parsing & detecting attacks in log data." },
  { id: "w12", name: "Cloud Security",    emoji: "☁️", blurb: "boto3-style automation: public buckets, encryption & IAM." },
  { id: "w13", name: "Container & K8s",   emoji: "🐳", blurb: "Audit pods: privileged, root, :latest & env secrets." },
  { id: "w14", name: "Detection Eng",     emoji: "🚨", blurb: "Write SIEM rules: thresholds, correlation & alerts." },
  { id: "w15", name: "Secrets Mgmt",      emoji: "🔑", blurb: "Vault automation: find stale, rotate & revoke leaked." },
  { id: "w16", name: "Incident Response", emoji: "🧭", blurb: "Timeline, IOCs, scoping & a full incident report." },
];

const LESSONS = [
  /* ================= WORLD 1: FOUNDATIONS ================= */
  {
    id: "l1", world: "w1", title: "First Contact", xp: 40,
    story: `Welcome, architect. 👋 A <b>variable</b> is a labelled box that holds a value. Let's store a device name.`,
    concept: `Create a variable with <code>=</code> (means "put right side into left side"). Show it with <code>print()</code>. Text in quotes is a <b>string</b>.
<pre>hostname = "SERVER-01"
print(hostname)</pre>`,
    task: `Create <code>device_name</code> set to exactly <code>"LAPTOP-01"</code> and print it.`,
    starter: `# Create your variable below\n`,
    check: `
if 'device_name' not in globals():
    _feedback = "I can't find a variable named device_name yet."
elif device_name == "LAPTOP-01":
    _passed = True; _feedback = "Nailed it — your first variable. 🎉"
else:
    _feedback = f"device_name is '{device_name}', but it must be exactly 'LAPTOP-01'."
`,
    hints: ['Use =', 'Text needs quotes: "LAPTOP-01"', 'device_name = "LAPTOP-01"'],
    solution: `device_name = "LAPTOP-01"\nprint(device_name)`,
  },
  {
    id: "l2", world: "w1", title: "Building a Tag", xp: 40,
    story: `Tagging systems join small facts into one label. Build <code>Windows-11</code> from two facts.`,
    concept: `An <b>f-string</b> drops variables into text — put <code>f</code> before the quote and wrap variables in <code>{ }</code>:
<pre>os_name = "Windows"
ver = "11"
tag = f"{os_name}-{ver}"   # "Windows-11"</pre>`,
    task: `Using the given variables, make <code>tag</code> equal <code>"Windows-11"</code> with an f-string.`,
    starter: `os_name = "Windows"\nos_version = "11"\n\n# Build the tag\n`,
    check: `
if 'tag' not in globals():
    _feedback = "Create a variable named tag."
elif tag == "Windows-11":
    _passed = True; _feedback = "Perfect tag! f-strings will be everywhere from here. ✨"
else:
    _feedback = f"Your tag is '{tag}', we want 'Windows-11'."
`,
    hints: ['f"..."', 'f"{os_name}-{os_version}"', 'tag = f"{os_name}-{os_version}"'],
    solution: `os_name = "Windows"\nos_version = "11"\n\ntag = f"{os_name}-{os_version}"\nprint(tag)`,
  },
  {
    id: "l3", world: "w1", title: "Compliant or Not?", xp: 50,
    story: `Compliance is yes/no. In Python that's a <b>boolean</b>: <code>True</code> / <code>False</code>. 80+ passes.`,
    concept: `Comparisons produce booleans. <code>=</code> assigns, <code>==</code> compares:
<pre>10 == 10   # True
7 >= 80    # False</pre>`,
    task: `A <code>score</code> of 75 is given. Make <code>is_compliant</code> True only if score is 80 or higher.`,
    starter: `score = 75\n\n# Is it compliant?\n`,
    check: `
if 'is_compliant' not in globals():
    _feedback = "Create is_compliant."
elif is_compliant is False:
    _passed = True; _feedback = "Correct — 75 < 80 so False. A decision in code! ✅"
elif is_compliant is True:
    _feedback = "75 is NOT >= 80, so this should be False."
else:
    _feedback = "is_compliant should be True/False. Use score >= 80."
`,
    hints: ['Use >=', 'score >= 80 is itself True/False', 'is_compliant = score >= 80'],
    solution: `score = 75\n\nis_compliant = score >= 80\nprint(is_compliant)`,
  },
  {
    id: "l4", world: "w1", title: "Compliance Math", xp: 50,
    story: `Reports need numbers. Compute a compliance percentage from counts.`,
    concept: `Python does math with <code>+ - * /</code>. <code>round()</code> rounds:
<pre>rate = 4 / 6        # 0.666...
pct = round(rate * 100)   # 67</pre>`,
    task: `<code>compliant</code>=4 of <code>total</code>=6. Compute <code>percent</code> = rounded whole-number percentage (should be 67).`,
    starter: `compliant = 4\ntotal = 6\n\n# percent = ?\n`,
    check: `
if 'percent' not in globals():
    _feedback = "Create percent."
elif percent == 67:
    _passed = True; _feedback = "67% compliant. You just built a KPI. 📊"
else:
    _feedback = f"Expected 67, got {percent}. Try round(compliant/total*100)."
`,
    hints: ['Divide then multiply by 100', 'Wrap in round()', 'percent = round(compliant / total * 100)'],
    solution: `compliant = 4\ntotal = 6\n\npercent = round(compliant / total * 100)\nprint(percent)`,
  },
  {
    id: "l5", world: "w1", title: "Clean the Hostname", xp: 50,
    story: `Real data is messy — extra spaces, wrong case. String methods clean it up.`,
    concept: `Strings have built-in tools:
<pre>s = "  pc-1 "
s.strip()    # "pc-1"  (trim spaces)
s.upper()    # "  PC-1 "
"a,b".split(",")  # ["a","b"]</pre>
You can chain them: <code>s.strip().upper()</code>.`,
    task: `Clean <code>raw</code> into <code>hostname</code> — trimmed and UPPERCASE (result: <code>"LAPTOP-01"</code>).`,
    starter: `raw = "  Laptop-01 "\n\n# hostname = ?\n`,
    check: `
if 'hostname' not in globals():
    _feedback = "Create hostname."
elif hostname == "LAPTOP-01":
    _passed = True; _feedback = "Spotless. Chaining string methods is a daily move. 🧼"
else:
    _feedback = f"Expected 'LAPTOP-01', got '{hostname}'. Try raw.strip().upper()."
`,
    hints: ['Trim with .strip()', 'Uppercase with .upper()', 'hostname = raw.strip().upper()'],
    solution: `raw = "  Laptop-01 "\n\nhostname = raw.strip().upper()\nprint(hostname)`,
  },

  /* ================= WORLD 2: COLLECTIONS ================= */
  {
    id: "l6", world: "w2", title: "The Inventory List", xp: 50,
    story: `Fleets have thousands of devices. A <b>list</b> holds many values in order.`,
    concept: `<pre>devices = ["PC-1", "PC-2"]
devices.append("PC-3")  # add
len(devices)            # 3
devices[0]              # "PC-1" (starts at 0)
devices[-1]             # last</pre>`,
    task: `Append <code>"TABLET-03"</code> to the inventory, then store the new count in <code>total</code>.`,
    starter: `devices = ["LAPTOP-01", "LAPTOP-02", "PHONE-07"]\n\n# add + count\n`,
    check: `
if 'total' not in globals():
    _feedback = "Store the count in total."
elif len(devices) == 4 and devices[-1] == "TABLET-03" and total == 4:
    _passed = True; _feedback = "Inventory now holds 4. Lists grow with .append(). 📝"
else:
    _feedback = f"Expected 4 ending in 'TABLET-03'. Got devices={devices}, total={globals().get('total')}."
`,
    hints: ['devices.append("TABLET-03")', 'total = len(devices)', 'Do both lines'],
    solution: `devices = ["LAPTOP-01", "LAPTOP-02", "PHONE-07"]\n\ndevices.append("TABLET-03")\ntotal = len(devices)\nprint(devices, total)`,
  },
  {
    id: "l7", world: "w2", title: "A Device Has Properties", xp: 60,
    story: `A real device has an OS, compliance, an owner. A <b>dictionary</b> stores labelled properties — exactly how Graph hands you a device.`,
    concept: `<pre>device = {"name": "PC-1", "os": "Windows", "compliant": True}
device["os"]            # "Windows"
device["os"] = "Win11"  # change</pre>`,
    task: `Build <code>device</code> with <code>name</code>="LAPTOP-01", <code>os</code>="Windows", <code>compliant</code>=True. Read the OS into <code>device_os</code>.`,
    starter: `# Build the dict, then read its os\n`,
    check: `
if 'device' not in globals() or not isinstance(device, dict):
    _feedback = "Create a dict named device."
elif device.get("name")=="LAPTOP-01" and device.get("os")=="Windows" and device.get("compliant") is True and globals().get("device_os")=="Windows":
    _passed = True; _feedback = "One box, all the facts — the backbone of everything ahead. 🗂️"
else:
    _feedback = "Make device = {'name':'LAPTOP-01','os':'Windows','compliant':True} and device_os = device['os']."
`,
    hints: ['Keys & string values need quotes; True does not.', 'device = {"name":"LAPTOP-01","os":"Windows","compliant":True}', 'device_os = device["os"]'],
    solution: `device = {"name": "LAPTOP-01", "os": "Windows", "compliant": True}\ndevice_os = device["os"]\nprint(device_os)`,
  },
  {
    id: "l8", world: "w2", title: "The Tag Map", xp: 60,
    story: `Core shape of a tagging system: a dict mapping each device to a <b>list</b> of tags.`,
    concept: `<pre>device_tags = {"PC-1": ["windows", "corporate"]}
device_tags["PC-1"].append("compliant")</pre>`,
    task: `Create <code>device_tags</code> mapping <code>"LAPTOP-01"</code> to <code>["windows","corporate"]</code>, then append <code>"compliant"</code> to it.`,
    starter: `# Build + add a tag\n`,
    check: `
if 'device_tags' not in globals() or not isinstance(device_tags, dict):
    _feedback = "Create device_tags."
else:
    _t = device_tags.get("LAPTOP-01", [])
    if {"windows","corporate","compliant"}.issubset(set(_t)):
        _passed = True; _feedback = "device -> list of tags. That's a tagging system. 🏷️"
    else:
        _feedback = f"LAPTOP-01 should have windows, corporate AND compliant. Got {_t}."
`,
    hints: ['device_tags = {"LAPTOP-01": ["windows","corporate"]}', 'device_tags["LAPTOP-01"].append("compliant")', 'Both lines'],
    solution: `device_tags = {"LAPTOP-01": ["windows", "corporate"]}\ndevice_tags["LAPTOP-01"].append("compliant")\nprint(device_tags)`,
  },
  {
    id: "l9", world: "w2", title: "Kill the Duplicates", xp: 60,
    story: `Tag lists get messy with repeats. A <b>set</b> keeps only unique values.`,
    concept: `<pre>set(["a", "a", "b"])   # {"a", "b"}
sorted(set(...))        # back to a sorted list</pre>`,
    task: `From <code>raw_tags</code> (has duplicates), build <code>unique</code> — a sorted list of the distinct tags.`,
    starter: `raw_tags = ["windows", "corporate", "windows", "compliant", "corporate"]\n\n# unique = ?\n`,
    check: `
_exp = ["compliant", "corporate", "windows"]
if 'unique' not in globals():
    _feedback = "Create unique."
elif unique == _exp:
    _passed = True; _feedback = "Deduped and sorted. Sets are a cleanup superpower. 🧹"
else:
    _feedback = f"Expected {_exp}, got {unique}. Try sorted(set(raw_tags))."
`,
    hints: ['Remove dupes with set()', 'Sort with sorted()', 'unique = sorted(set(raw_tags))'],
    solution: `raw_tags = ["windows", "corporate", "windows", "compliant", "corporate"]\n\nunique = sorted(set(raw_tags))\nprint(unique)`,
  },
  {
    id: "l10", world: "w2", title: "Count the Compliant", xp: 70,
    story: `Aggregating is a core reporting skill. Count how many devices are compliant.`,
    concept: `<code>sum()</code> over booleans counts the True ones (True==1):
<pre>sum(1 for d in devices if d["compliant"])</pre>
or add inside a loop.`,
    task: `From <code>devices</code>, store the number of compliant devices in <code>compliant_count</code> (should be 2).`,
    starter: `devices = [\n    {"name": "A", "compliant": True},\n    {"name": "B", "compliant": False},\n    {"name": "C", "compliant": True},\n]\n\n# compliant_count = ?\n`,
    check: `
if 'compliant_count' not in globals():
    _feedback = "Create compliant_count."
elif compliant_count == 2:
    _passed = True; _feedback = "Aggregation unlocked — the basis of every dashboard. 📈"
else:
    _feedback = f"Expected 2, got {compliant_count}."
`,
    hints: ['Count where d["compliant"] is True', 'sum(1 for d in devices if d["compliant"])', 'compliant_count = sum(1 for d in devices if d["compliant"])'],
    solution: `devices = [\n    {"name": "A", "compliant": True},\n    {"name": "B", "compliant": False},\n    {"name": "C", "compliant": True},\n]\n\ncompliant_count = sum(1 for d in devices if d["compliant"])\nprint(compliant_count)`,
  },

  /* ================= WORLD 3: LOGIC & FLOW ================= */
  {
    id: "l11", world: "w3", title: "Tagging Rule", xp: 60,
    story: `Tags come from rules: "if macOS, tag apple." Meet <code>if / elif / else</code>.`,
    concept: `<pre>if os_name == "Windows":
    platform = "microsoft"
elif os_name in ("macOS", "iOS"):
    platform = "apple"
else:
    platform = "other"</pre>
4-space indent marks what's "inside". <code>in (...)</code> checks membership.`,
    task: `<code>os_name</code> is "macOS". Set <code>platform_tag</code>: Windows→"microsoft", macOS/iOS→"apple", else "other".`,
    starter: `os_name = "macOS"\n\n# decide platform_tag\n`,
    check: `
if 'platform_tag' not in globals():
    _feedback = "Set platform_tag."
elif platform_tag == "apple":
    _passed = True; _feedback = "Decision logic online — macOS -> apple. 🍎"
else:
    _feedback = f"os_name is 'macOS' so platform_tag should be 'apple'. Got '{platform_tag}'."
`,
    hints: ['Colon after each condition, then indent', 'elif os_name in ("macOS","iOS"):', 'See the concept block for the full shape'],
    solution: `os_name = "macOS"\n\nif os_name == "Windows":\n    platform_tag = "microsoft"\nelif os_name in ("macOS", "iOS"):\n    platform_tag = "apple"\nelse:\n    platform_tag = "other"\nprint(platform_tag)`,
  },
  {
    id: "l12", world: "w3", title: "Sweep the Fleet", xp: 70,
    story: `A <code>for</code> loop runs your rule over every device — 3 or 30,000, same code.`,
    concept: `<pre>windows = []
for d in devices:
    if d["os"] == "Windows":
        windows.append(d["name"])</pre>`,
    task: `Loop <code>devices</code> and build <code>windows_devices</code> — the names of Windows devices only.`,
    starter: `devices = [\n    {"name": "LAPTOP-01", "os": "Windows"},\n    {"name": "MAC-02",    "os": "macOS"},\n    {"name": "SERVER-09", "os": "Windows"},\n]\n\n# collect Windows names\n`,
    check: `
_exp = ["LAPTOP-01", "SERVER-09"]
if 'windows_devices' not in globals():
    _feedback = "Build windows_devices."
elif sorted(windows_devices) == sorted(_exp):
    _passed = True; _feedback = "You swept the fleet. Scales to thousands unchanged. 🔁"
else:
    _feedback = f"Expected {_exp}, got {windows_devices}."
`,
    hints: ['Start windows_devices = []', 'if d["os"]=="Windows": windows_devices.append(d["name"])', 'See concept block'],
    solution: `devices = [\n    {"name": "LAPTOP-01", "os": "Windows"},\n    {"name": "MAC-02",    "os": "macOS"},\n    {"name": "SERVER-09", "os": "Windows"},\n]\n\nwindows_devices = []\nfor d in devices:\n    if d["os"] == "Windows":\n        windows_devices.append(d["name"])\nprint(windows_devices)`,
  },
  {
    id: "l13", world: "w3", title: "One-Line Filter", xp: 70,
    story: `The <b>list comprehension</b> does loop+filter+collect in one line. Interviewers love it.`,
    concept: `<pre>names = [d["name"] for d in devices if not d["compliant"]]</pre>
Read: give me d["name"], for each d in devices, where not compliant.`,
    task: `Build <code>non_compliant</code> — names of all devices where <code>compliant</code> is False — in one line.`,
    starter: `devices = [\n    {"name": "LAPTOP-01", "compliant": True},\n    {"name": "PHONE-07",  "compliant": False},\n    {"name": "SERVER-09", "compliant": False},\n]\n\n# one-line filter\n`,
    check: `
_exp = ["PHONE-07", "SERVER-09"]
if 'non_compliant' not in globals():
    _feedback = "Build non_compliant."
elif sorted(non_compliant) == sorted(_exp):
    _passed = True; _feedback = "Clean one-liner — very Pythonic. 😎"
else:
    _feedback = f"Expected {_exp}, got {non_compliant}."
`,
    hints: ['[ VALUE for d in devices if CONDITION ]', 'if not d["compliant"]', 'non_compliant = [d["name"] for d in devices if not d["compliant"]]'],
    solution: `devices = [\n    {"name": "LAPTOP-01", "compliant": True},\n    {"name": "PHONE-07",  "compliant": False},\n    {"name": "SERVER-09", "compliant": False},\n]\n\nnon_compliant = [d["name"] for d in devices if not d["compliant"]]\nprint(non_compliant)`,
  },
  {
    id: "l14", world: "w3", title: "Don't Crash on Bad Data", xp: 80,
    story: `APIs return junk sometimes. <code>try/except</code> lets your script survive instead of dying.`,
    concept: `<pre>try:
    value = int(raw)
except ValueError:
    value = 0   # fallback</pre>
If the risky line fails, the except block runs instead of crashing.`,
    task: `<code>raw</code> is <code>"N/A"</code> (not a number). Safely convert to int; on failure set <code>battery</code> to <code>-1</code>.`,
    starter: `raw = "N/A"\n\n# battery = int(raw) but safe\n`,
    check: `
if 'battery' not in globals():
    _feedback = "Create battery."
elif battery == -1:
    _passed = True; _feedback = "Crash-proof. This is what makes scripts production-safe. 🛡️"
else:
    _feedback = f"'N/A' can't become an int, so battery should be -1. Got {battery}."
`,
    hints: ['Wrap int(raw) in try:', 'except ValueError: battery = -1', 'try:\\n    battery = int(raw)\\nexcept ValueError:\\n    battery = -1'],
    solution: `raw = "N/A"\n\ntry:\n    battery = int(raw)\nexcept ValueError:\n    battery = -1\nprint(battery)`,
  },
  {
    id: "l15", world: "w3", title: "Drain the Queue", xp: 80,
    story: `A <code>while</code> loop repeats until a condition changes — perfect for processing a work queue.`,
    concept: `<pre>while queue:          # runs while the list is non-empty
    item = queue.pop()  # remove the last item
    processed += 1</pre>`,
    task: `Drain <code>queue</code> with a while loop, counting items into <code>processed</code> (should be 4) until the queue is empty.`,
    starter: `queue = ["DEV-1", "DEV-2", "DEV-3", "DEV-4"]\nprocessed = 0\n\n# drain the queue\n`,
    check: `
if 'processed' not in globals():
    _feedback = "Create processed."
elif processed == 4 and len(queue) == 0:
    _passed = True; _feedback = "Queue drained. while-loops power job runners everywhere. ⚙️"
else:
    _feedback = f"Expected processed==4 and empty queue. Got processed={globals().get('processed')}, queue={queue}."
`,
    hints: ['while queue:', 'queue.pop(); processed += 1', 'while queue:\\n    queue.pop()\\n    processed += 1'],
    solution: `queue = ["DEV-1", "DEV-2", "DEV-3", "DEV-4"]\nprocessed = 0\n\nwhile queue:\n    queue.pop()\n    processed += 1\nprint(processed, queue)`,
  },

  /* ================= WORLD 4: FUNCTIONS & TIME ================= */
  {
    id: "l16", world: "w4", title: "Your First Tool", xp: 70,
    story: `Stop copy-pasting logic. A <b>function</b> packages it once for reuse.`,
    concept: `<pre>def make_tag(os_name):
    return os_name.lower()

make_tag("Windows")   # "windows"</pre>`,
    task: `Write <code>make_tag(os_name)</code> returning the OS name lowercased.`,
    starter: `# define make_tag\n`,
    check: `
if 'make_tag' not in globals() or not callable(make_tag):
    _feedback = "Define def make_tag(os_name):"
elif make_tag("Windows")=="windows" and make_tag("macOS")=="macos":
    _passed = True; _feedback = "Reusable tool built. Write once, call forever. 🔧"
else:
    _feedback = "make_tag should return os_name.lower()."
`,
    hints: ['def make_tag(os_name):', 'return os_name.lower()', 'def make_tag(os_name):\\n    return os_name.lower()'],
    solution: `def make_tag(os_name):\n    return os_name.lower()\n\nprint(make_tag("Windows"))`,
  },
  {
    id: "l17", world: "w4", title: "The Tag Factory", xp: 90,
    story: `A function that returns a whole <b>list</b> of tags for a device.`,
    concept: `<pre>def get_tags(device):
    tags = [device["os"].lower()]
    tags.append("compliant" if device["compliant"] else "non-compliant")
    return tags</pre>
<code>A if cond else B</code> is a one-line choice.`,
    task: `Write <code>get_tags(device)</code> returning [OS lowercased, then "compliant" or "non-compliant"].`,
    starter: `# define get_tags(device)\n`,
    check: `
if 'get_tags' not in globals() or not callable(get_tags):
    _feedback = "Define def get_tags(device):"
else:
    _a = get_tags({"os":"Windows","compliant":True})
    _b = get_tags({"os":"macOS","compliant":False})
    if sorted(_a)==sorted(["windows","compliant"]) and sorted(_b)==sorted(["macos","non-compliant"]):
        _passed = True; _feedback = "The core of a tag engine, in a function. 🏭"
    else:
        _feedback = f"Compliant Windows should give ['windows','compliant']; got {_a}."
`,
    hints: ['Start tags = [device["os"].lower()]', 'tags.append("compliant" if device["compliant"] else "non-compliant")', 'return tags'],
    solution: `def get_tags(device):\n    tags = [device["os"].lower()]\n    tags.append("compliant" if device["compliant"] else "non-compliant")\n    return tags\n\nprint(get_tags({"os":"Windows","compliant":True}))`,
  },
  {
    id: "l18", world: "w4", title: "Safe Lookups", xp: 80,
    story: `A missing key crashes a script. <code>.get()</code> gives a fallback instead.`,
    concept: `<pre>device.get("owner")               # None if missing
device.get("owner", "unassigned") # fallback</pre>`,
    task: `Write <code>get_owner(device)</code> returning the owner, or <code>"unassigned"</code> if missing.`,
    starter: `# define get_owner(device)\n`,
    check: `
if 'get_owner' not in globals() or not callable(get_owner):
    _feedback = "Define def get_owner(device):"
elif get_owner({"owner":"alice"})=="alice" and get_owner({"name":"PC-1"})=="unassigned":
    _passed = True; _feedback = "Crash-proof lookups — real data won't break you. 🛡️"
else:
    _feedback = 'Use device.get("owner", "unassigned").'
`,
    hints: ['.get(key, fallback)', 'return device.get("owner","unassigned")', 'def get_owner(device):\\n    return device.get("owner","unassigned")'],
    solution: `def get_owner(device):\n    return device.get("owner", "unassigned")\n\nprint(get_owner({"name":"PC-1"}))`,
  },
  {
    id: "l19", world: "w4", title: "Default Arguments", xp: 90,
    story: `Functions can take optional inputs with defaults — flexible, reusable tools.`,
    concept: `<pre>def label(device, prefix="auto"):
    return f"{prefix}:{device['os'].lower()}"

label(d)              # "auto:windows"
label(d, "manual")    # "manual:windows"</pre>`,
    task: `Write <code>tag_device(device, prefix="auto")</code> returning <code>f"{prefix}:{os lowercased}"</code>.`,
    starter: `# define tag_device(device, prefix="auto")\n`,
    check: `
if 'tag_device' not in globals() or not callable(tag_device):
    _feedback = "Define def tag_device(device, prefix='auto'):"
else:
    _a = tag_device({"os":"Windows"})
    _b = tag_device({"os":"iOS"}, "manual")
    if _a=="auto:windows" and _b=="manual:ios":
        _passed = True; _feedback = "Optional args = flexible tools. 🎛️"
    else:
        _feedback = f"Expected 'auto:windows' and 'manual:ios'; got '{_a}' and '{_b}'."
`,
    hints: [
      'Default goes in the signature: prefix="auto"',
      "Return an f-string: f\"{prefix}:{device['os'].lower()}\"",
      `def tag_device(device, prefix="auto"):\n    return f"{prefix}:{device['os'].lower()}"`,
    ],
    solution: `def tag_device(device, prefix="auto"):\n    return f"{prefix}:{device['os'].lower()}"\n\nprint(tag_device({"os":"Windows"}))\nprint(tag_device({"os":"iOS"}, "manual"))`,
  },
  {
    id: "l20", world: "w4", title: "Days Since Last Seen", xp: 100,
    story: `Finding stale devices needs date math. Python's <code>datetime</code> handles it.`,
    concept: `<pre>from datetime import date
last = date(2026, 9, 15)
today = date(2026, 11, 13)
gap = (today - last).days    # 59</pre>
Subtracting dates gives a timedelta; <code>.days</code> is the number of days.`,
    task: `Compute <code>days_since</code> = days between <code>last_seen</code> and <code>today</code> (should be 59).`,
    starter: `from datetime import date\nlast_seen = date(2026, 9, 15)\ntoday = date(2026, 11, 13)\n\n# days_since = ?\n`,
    check: `
if 'days_since' not in globals():
    _feedback = "Create days_since."
elif days_since == 59:
    _passed = True; _feedback = "Date math down. Stale-device hunting is now possible. 📅"
else:
    _feedback = f"Expected 59, got {days_since}. Try (today - last_seen).days."
`,
    hints: ['Subtract the dates', 'Take .days', 'days_since = (today - last_seen).days'],
    solution: `from datetime import date\nlast_seen = date(2026, 9, 15)\ntoday = date(2026, 11, 13)\n\ndays_since = (today - last_seen).days\nprint(days_since)`,
  },

  /* ================= WORLD 5: INTUNE SIMULATOR ================= */
  {
    id: "l21", world: "w5", title: "Meet the Portal", xp: 90,
    story: `🖥️ Now it gets real. A live object <code>intune</code> holds your fleet — and the panel below shows it. Let's read it.`,
    concept: `The simulator gives you <code>intune</code>:
<pre>intune.list_devices()      # list of device dicts
intune.get_device("DEV-001")
intune.add_tag("DEV-001", "corporate")
intune.set_compliance("DEV-001", True)</pre>
Run the code and watch the <b>Live Intune Portal</b> below react.`,
    task: `Store the number of devices in the fleet in <code>count</code> (use <code>intune.list_devices()</code>).`,
    starter: `# how many devices are enrolled?\ndevices = intune.list_devices()\n\n# count = ?\nprint(devices)\n`,
    check: `
if 'count' not in globals():
    _feedback = "Create count from intune.list_devices()."
elif count == 6:
    _passed = True; _feedback = "6 devices enrolled. You're reading a live system now. 🖥️"
else:
    _feedback = f"Expected 6, got {count}. Use count = len(intune.list_devices())."
`,
    hints: ['Call intune.list_devices()', 'Wrap it in len()', 'count = len(intune.list_devices())'],
    solution: `devices = intune.list_devices()\ncount = len(devices)\nprint(count)`,
  },
  {
    id: "l22", world: "w5", title: "Apply a Tag (for real)", xp: 110,
    story: `This is the interview moment: write code, run it, and watch the tag <b>appear on the device</b> in the portal below. ✨`,
    concept: `<pre>intune.add_tag("DEV-001", "corporate")</pre>
After you run it, look at LAPTOP-01 (DEV-001) in the portal — the <code>corporate</code> chip lights up.`,
    task: `Apply the tag <code>"corporate"</code> to device <code>"DEV-001"</code>.`,
    starter: `# tag DEV-001 as corporate\n`,
    check: `
_d = intune.get_device("DEV-001")
if _d and "corporate" in _d["tags"]:
    _passed = True; _feedback = "💥 Tag applied in Intune! See the glowing chip on LAPTOP-01 below."
else:
    _feedback = "DEV-001 needs the 'corporate' tag. Use intune.add_tag('DEV-001', 'corporate')."
`,
    hints: ['Use intune.add_tag', 'Two arguments: device id, then tag', 'intune.add_tag("DEV-001", "corporate")'],
    solution: `intune.add_tag("DEV-001", "corporate")\nprint(intune.get_device("DEV-001"))`,
  },
  {
    id: "l23", world: "w5", title: "Bulk Tag by Rule", xp: 120,
    story: `Nobody tags 10,000 devices by hand. Loop the fleet and tag by a rule.`,
    concept: `Combine a loop + condition + the API:
<pre>for d in intune.list_devices():
    if not d["compliant"]:
        intune.add_tag(d["id"], "review")</pre>`,
    task: `Tag every <b>non-compliant</b> device with <code>"review"</code>. (Watch several chips appear below.)`,
    starter: `# tag all non-compliant devices "review"\nfor d in intune.list_devices():\n    pass\n`,
    check: `
_bad = [d for d in intune.list_devices() if not d["compliant"]]
_ok = all("review" in d["tags"] for d in _bad)
_clean = all("review" not in d["tags"] for d in intune.list_devices() if d["compliant"])
if _ok and _clean and len(_bad) >= 1:
    _passed = True; _feedback = f"Bulk-tagged {len(_bad)} non-compliant devices. This IS the automation job. 🚀"
elif not _ok:
    _feedback = "Some non-compliant devices are missing the 'review' tag."
else:
    _feedback = "Only non-compliant devices should get 'review' — a compliant one got tagged."
`,
    hints: ['Loop for d in intune.list_devices()', 'if not d["compliant"]:', 'intune.add_tag(d["id"], "review")'],
    solution: `for d in intune.list_devices():\n    if not d["compliant"]:\n        intune.add_tag(d["id"], "review")\nprint("done")`,
  },
  {
    id: "l24", world: "w5", title: "Remediate Compliance", xp: 110,
    story: `IPHONE-22 (DEV-003) got fixed. Flip it to compliant and watch its badge turn green below.`,
    concept: `<pre>intune.set_compliance("DEV-003", True)</pre>`,
    task: `Set device <code>"DEV-003"</code> to compliant (True).`,
    starter: `# mark DEV-003 compliant\n`,
    check: `
_d = intune.get_device("DEV-003")
if _d and _d["compliant"] is True:
    _passed = True; _feedback = "Green badge! Remediation applied to IPHONE-22. ✅"
else:
    _feedback = "DEV-003 should be compliant. Use intune.set_compliance('DEV-003', True)."
`,
    hints: ['Use intune.set_compliance', 'Second arg is True', 'intune.set_compliance("DEV-003", True)'],
    solution: `intune.set_compliance("DEV-003", True)\nprint(intune.get_device("DEV-003"))`,
  },
  {
    id: "l25", world: "w5", title: "Hunt Stale Devices", xp: 140,
    story: `Stale devices (not seen in 30+ days) are a security risk. Find and tag them — real date math on live data.`,
    concept: `Each device has <code>lastSeen</code> like <code>"2026-09-15"</code>. Parse it and compare to <code>NOW</code> (already defined as today):
<pre>from datetime import datetime
seen = datetime.strptime(d["lastSeen"], "%Y-%m-%d").date()
if (NOW - seen).days > 30:
    intune.add_tag(d["id"], "stale")</pre>`,
    task: `Tag every device not seen in more than 30 days with <code>"stale"</code>. (Two devices qualify.)`,
    starter: `from datetime import datetime\n\n# tag stale devices (lastSeen > 30 days ago)\nfor d in intune.list_devices():\n    pass\n`,
    check: `
from datetime import datetime as _dtm
_stale_ids = set()
for _d in intune.list_devices():
    _seen = _dtm.strptime(_d["lastSeen"], "%Y-%m-%d").date()
    if (NOW - _seen).days > 30:
        _stale_ids.add(_d["id"])
_tagged = {d["id"] for d in intune.list_devices() if "stale" in d["tags"]}
if _tagged == _stale_ids and len(_stale_ids) == 2:
    _passed = True; _feedback = "Stale fleet flagged with date math on live data. Senior-level move. 🕵️"
else:
    _feedback = f"'stale' should be on exactly {sorted(_stale_ids)}. You tagged {sorted(_tagged)}."
`,
    hints: ['Parse with datetime.strptime(d["lastSeen"], "%Y-%m-%d").date()', 'Compare (NOW - seen).days > 30', 'Then intune.add_tag(d["id"], "stale")'],
    solution: `from datetime import datetime\n\nfor d in intune.list_devices():\n    seen = datetime.strptime(d["lastSeen"], "%Y-%m-%d").date()\n    if (NOW - seen).days > 30:\n        intune.add_tag(d["id"], "stale")\nprint("done")`,
  },
  {
    id: "l26", world: "w5", title: "Export a CSV Report", xp: 120,
    story: `Management wants a report. Build CSV rows from the live fleet.`,
    concept: `Build a list of lines, header first:
<pre>report = ["deviceName,compliant"]
for d in intune.list_devices():
    report.append(f"{d['name']},{d['compliant']}")</pre>
Later you'd write this to a file — same shape.`,
    task: `Build <code>report</code>: a list starting with header <code>"deviceName,compliant"</code>, then one <code>"name,compliant"</code> row per device (7 items total).`,
    starter: `# build a CSV report of the fleet\nreport = ["deviceName,compliant"]\n\n`,
    check: `
if 'report' not in globals() or not isinstance(report, list):
    _feedback = "Create a list named report."
elif report[0] == "deviceName,compliant" and len(report) == 7 and "LAPTOP-01,True" in report:
    _passed = True; _feedback = "Report generated. One step from emailing it to the CISO. 📄"
else:
    _feedback = f"Need header + 6 rows (7 total) like 'LAPTOP-01,True'. Got {len(report)} items."
`,
    hints: [
      'Loop the fleet and append one row per device',
      "Row format: f\"{d['name']},{d['compliant']}\"",
      "report.append(f\"{d['name']},{d['compliant']}\")",
    ],
    solution: `report = ["deviceName,compliant"]\nfor d in intune.list_devices():\n    report.append(f"{d['name']},{d['compliant']}")\nprint("\\n".join(report))`,
  },

  /* ================= WORLD 6: GRAPH API ================= */
  {
    id: "l27", world: "w6", title: "Get a Token", xp: 110,
    story: `🌐 Real Graph calls need auth first (OAuth2 client credentials). No token = 401.`,
    concept: `<pre>token = graph.authenticate(client_id, client_secret, tenant_id)</pre>
In real life you'd POST to the token endpoint; here <code>graph.authenticate</code> simulates it and stores the token on the client.`,
    task: `Authenticate <code>graph</code> with any non-empty <code>client_id</code>, <code>client_secret</code>, <code>tenant_id</code>. Store the result in <code>token</code>.`,
    starter: `client_id = "app-1234"\nclient_secret = "s3cr3t"\ntenant_id = "contoso.onmicrosoft.com"\n\n# token = ?\n`,
    check: `
if 'token' not in globals():
    _feedback = "Store the token."
elif token and graph.token:
    _passed = True; _feedback = "Authenticated. Now the API will talk to you. 🔑"
else:
    _feedback = "Call graph.authenticate(client_id, client_secret, tenant_id) and store it in token."
`,
    hints: ['Use graph.authenticate', 'Pass all three values', 'token = graph.authenticate(client_id, client_secret, tenant_id)'],
    solution: `client_id = "app-1234"\nclient_secret = "s3cr3t"\ntenant_id = "contoso.onmicrosoft.com"\n\ntoken = graph.authenticate(client_id, client_secret, tenant_id)\nprint(token)`,
  },
  {
    id: "l28", world: "w6", title: "Your First GET", xp: 120,
    story: `Call the managedDevices endpoint and read the JSON — the real Intune-via-Graph pattern.`,
    concept: `<pre>resp = graph.get(url)
resp.status_code      # 200
data = resp.json()    # dict with a "value" list</pre>`,
    task: `GET the managed devices, then read the first device's <code>deviceName</code> into <code>first_name</code> (expect <code>"LAPTOP-01"</code>).`,
    starter: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\n# resp = ... ; data = ... ; first_name = ...\n`,
    check: `
if globals().get("first_name") == "LAPTOP-01":
    _passed = True; _feedback = "You pulled live API data and parsed it. This is THE interview task. 🌐"
else:
    _feedback = 'Do resp = graph.get(url); data = resp.json(); first_name = data["value"][0]["deviceName"].'
`,
    hints: ['resp = graph.get(url)', 'data = resp.json()', 'first_name = data["value"][0]["deviceName"]'],
    solution: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\nresp = graph.get(url)\ndata = resp.json()\nfirst_name = data["value"][0]["deviceName"]\nprint(resp.status_code, first_name)`,
  },
  {
    id: "l29", world: "w6", title: "Follow the Pages", xp: 160,
    story: `Graph returns results in pages. Miss the <code>@odata.nextLink</code> and you only see the first few devices — a classic interview trap.`,
    concept: `Keep requesting the next link until it's gone:
<pre>all_names = []
url = START_URL
while url:
    data = graph.get(url).json()
    for d in data["value"]:
        all_names.append(d["deviceName"])
    url = data.get("@odata.nextLink")</pre>`,
    task: `Collect <b>all</b> device names across every page into <code>all_names</code> (should be 6 — the simulator pages 3 at a time).`,
    starter: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\nall_names = []\n# loop through all pages\n`,
    check: `
if 'all_names' not in globals():
    _feedback = "Build all_names."
elif sorted(all_names) == ["IPHONE-22","KIOSK-03","LAPTOP-01","MACBOOK-07","PIXEL-09","SERVER-01"]:
    _passed = True; _feedback = "All 6 across pages. Pagination is a skill most people get wrong — not you. 🏅"
else:
    _feedback = f"Expected 6 names across pages, got {len(all_names)}: {all_names}. Follow data.get('@odata.nextLink')."
`,
    hints: ['Use while url:', 'Append each d["deviceName"]', 'url = data.get("@odata.nextLink")  # None ends the loop'],
    solution: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\nall_names = []\nwhile url:\n    data = graph.get(url).json()\n    for d in data["value"]:\n        all_names.append(d["deviceName"])\n    url = data.get("@odata.nextLink")\nprint(all_names)`,
  },
  {
    id: "l30", world: "w6", title: "PATCH an Update", xp: 140,
    story: `Reading is half the job. Write a change back with PATCH and confirm the 204.`,
    concept: `<pre>resp = graph.patch(url, json={"complianceState": "compliant"})
resp.status_code   # 204 = success, no content</pre>`,
    task: `PATCH <code>DEV-005</code> to <code>complianceState</code> "compliant". Store the response in <code>resp</code> (expect status 204; SERVER-01 turns green below).`,
    starter: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices/DEV-005"\n\n# resp = graph.patch(...)\n`,
    check: `
_d = intune.get_device("DEV-005")
if globals().get("resp") is not None and getattr(resp, "status_code", None) == 204 and _d and _d["compliant"] is True:
    _passed = True; _feedback = "204 — write succeeded. SERVER-01 is compliant now. ✍️"
else:
    _feedback = 'Use resp = graph.patch(url, json={"complianceState": "compliant"}).'
`,
    hints: ['Use graph.patch(url, json={...})', 'Body: {"complianceState": "compliant"}', 'resp = graph.patch(url, json={"complianceState": "compliant"})'],
    solution: `graph.authenticate("app-1234", "secret", "contoso")\nurl = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices/DEV-005"\n\nresp = graph.patch(url, json={"complianceState": "compliant"})\nprint(resp.status_code)`,
  },
  {
    id: "l31", world: "w6", title: "Survive Rate Limits", xp: 170,
    story: `Graph throttles you with HTTP 429. Production code retries instead of failing. <code>graph.flaky_get</code> returns 429 twice, then 200.`,
    concept: `Retry in a loop until success (or you run out of tries):
<pre>for attempt in range(5):
    resp = graph.flaky_get(url)
    if resp.status_code == 200:
        break
    # real code would sleep(resp.headers["Retry-After"]) here</pre>`,
    task: `Keep calling <code>graph.flaky_get(url)</code> until you get status 200. Store the final status in <code>status</code>.`,
    starter: `url = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\nstatus = None\n\n# retry until 200\n`,
    check: `
if globals().get("status") == 200 and graph._flaky >= 3:
    _passed = True; _feedback = "You rode out the throttling and got your 200. Rock-solid automation. 🧱"
elif graph._flaky == 0:
    _feedback = "Call graph.flaky_get(url) in a loop."
else:
    _feedback = f"Keep looping until status_code == 200 (it takes a few tries). status={globals().get('status')}."
`,
    hints: ['Loop with for attempt in range(5):', 'resp = graph.flaky_get(url)', 'if resp.status_code == 200: status = 200; break'],
    solution: `url = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\nstatus = None\n\nfor attempt in range(5):\n    resp = graph.flaky_get(url)\n    if resp.status_code == 200:\n        status = 200\n        break\nprint(status)`,
  },

  /* ================= WORLD 7: SECURITY BOSS ================= */
  {
    id: "l32", world: "w7", title: "Triage Detections", xp: 130,
    story: `🛡️ Switch to CrowdStrike. <code>falcon.list_detections()</code> gives live detections. Surface the serious ones.`,
    concept: `<pre>for det in falcon.list_detections():
    det["severity"]   # "critical" / "high" / ...
    det["hostname"]</pre>`,
    task: `Build <code>critical_hosts</code> — hostnames of detections with severity <code>"critical"</code> or <code>"high"</code>.`,
    starter: `# hostnames with severity critical or high\n`,
    check: `
if 'critical_hosts' not in globals():
    _feedback = "Build critical_hosts."
elif sorted(critical_hosts) == ["LAPTOP-01", "SERVER-01"]:
    _passed = True; _feedback = "Triaged to the 2 that matter. That's SOC signal-vs-noise. 🚨"
else:
    _feedback = f"Expected ['LAPTOP-01','SERVER-01'], got {critical_hosts}."
`,
    hints: ['Loop falcon.list_detections()', 'if det["severity"] in ("critical","high")', 'critical_hosts = [d["hostname"] for d in falcon.list_detections() if d["severity"] in ("critical","high")]'],
    solution: `critical_hosts = [d["hostname"] for d in falcon.list_detections() if d["severity"] in ("critical", "high")]\nprint(critical_hosts)`,
  },
  {
    id: "l33", world: "w7", title: "Respond & Resolve", xp: 130,
    story: `Automate the response: resolve every critical detection. Watch their status flip below.`,
    concept: `<pre>for det in falcon.list_detections():
    if det["severity"] == "critical":
        falcon.resolve(det["id"])</pre>`,
    task: `Resolve all <code>"critical"</code> detections (det-3 should become status "resolved").`,
    starter: `# resolve all critical detections\n`,
    check: `
_crit = [d for d in falcon.list_detections() if d["severity"] == "critical"]
if _crit and all(d["status"] == "resolved" for d in _crit):
    _passed = True; _feedback = "Critical detections auto-resolved. You just wrote a mini-SOAR playbook. ⚡"
else:
    _feedback = "Every critical detection should have status 'resolved'. Use falcon.resolve(det['id'])."
`,
    hints: ['Loop detections', 'if d["severity"]=="critical":', 'falcon.resolve(d["id"])'],
    solution: `for d in falcon.list_detections():\n    if d["severity"] == "critical":\n        falcon.resolve(d["id"])\nprint(falcon.list_detections())`,
  },
  {
    id: "l34", world: "w7", title: "Hash the IOCs", xp: 160,
    story: `Threat intel works on hashes. Compute MD5s and match against known-bad indicators.`,
    concept: `<code>hashlib</code> hashes text:
<pre>import hashlib
h = hashlib.md5("abc123".encode()).hexdigest()
h in KNOWN_BAD_HASHES   # True</pre>
<code>KNOWN_BAD_HASHES</code> is provided by the environment.`,
    task: `From <code>samples</code>, build <code>bad_found</code> — the sample strings whose MD5 is in <code>KNOWN_BAD_HASHES</code> (expect <code>["abc123","password"]</code>).`,
    starter: `import hashlib\nsamples = ["abc123", "hello", "password"]\n\n# bad_found = strings whose md5 is known-bad\n`,
    check: `
if 'bad_found' not in globals():
    _feedback = "Build bad_found."
elif sorted(bad_found) == ["abc123", "password"]:
    _passed = True; _feedback = "IOC enrichment done. You matched evidence to intel. 🔬"
else:
    _feedback = f"Expected ['abc123','password'], got {bad_found}. Hash each with hashlib.md5(s.encode()).hexdigest()."
`,
    hints: ['Hash: hashlib.md5(s.encode()).hexdigest()', 'Check membership in KNOWN_BAD_HASHES', 'bad_found = [s for s in samples if hashlib.md5(s.encode()).hexdigest() in KNOWN_BAD_HASHES]'],
    solution: `import hashlib\nsamples = ["abc123", "hello", "password"]\n\nbad_found = [s for s in samples if hashlib.md5(s.encode()).hexdigest() in KNOWN_BAD_HASHES]\nprint(bad_found)`,
  },
  {
    id: "l35", world: "w7", title: "BOSS: Auto-Remediation Engine", xp: 300,
    story: `🏆 Final boss. Write one pass over the fleet that applies your whole security policy — the capstone automation an interviewer dreams of.`,
    concept: `Apply ALL these rules to every device in <code>intune</code>:
<ul>
<li>Not compliant → add tag <code>"quarantine"</code></li>
<li>Not seen in 30+ days (stale) → add tag <code>"stale"</code></li>
<li>Not managed (BYOD) → add tag <code>"byod"</code></li>
</ul>
Use <code>intune.add_tag</code>, <code>datetime.strptime</code>, and the provided <code>NOW</code>. Watch the portal below light up.`,
    task: `Loop the fleet and apply the three rules above to every device.`,
    starter: `from datetime import datetime\n\nfor d in intune.list_devices():\n    did = d["id"]\n    # rule 1: not compliant -> "quarantine"\n    # rule 2: stale (>30 days) -> "stale"\n    # rule 3: not managed -> "byod"\n    pass\n`,
    check: `
from datetime import datetime as _dtm
_exp = {
    "DEV-001": set(),
    "DEV-002": set(),
    "DEV-003": {"quarantine"},
    "DEV-004": {"stale", "byod"},
    "DEV-005": {"quarantine", "stale"},
    "DEV-006": {"quarantine"},
}
_ok = True; _bad = None; _got = None
for _d in intune.list_devices():
    if set(_d["tags"]) != _exp.get(_d["id"], set()):
        _ok = False; _bad = _d["id"]; _got = _d["tags"]; break
if _ok:
    _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a full auto-remediation engine across a live fleet. You are interview-ready."
else:
    _feedback = f"{_bad} tags are off: got {sorted(_got)}, expected {sorted(_exp[_bad])}. Check your three rules."
`,
    hints: [
      'Rule 1: if not d["compliant"]: intune.add_tag(did, "quarantine")',
      'Rule 2: seen = datetime.strptime(d["lastSeen"], "%Y-%m-%d").date(); if (NOW - seen).days > 30: intune.add_tag(did, "stale")',
      'Rule 3: if not d["managed"]: intune.add_tag(did, "byod")',
      `from datetime import datetime
for d in intune.list_devices():
    did = d["id"]
    if not d["compliant"]:
        intune.add_tag(did, "quarantine")
    seen = datetime.strptime(d["lastSeen"], "%Y-%m-%d").date()
    if (NOW - seen).days > 30:
        intune.add_tag(did, "stale")
    if not d["managed"]:
        intune.add_tag(did, "byod")`,
    ],
    solution: `from datetime import datetime\n\nfor d in intune.list_devices():\n    did = d["id"]\n    if not d["compliant"]:\n        intune.add_tag(did, "quarantine")\n    seen = datetime.strptime(d["lastSeen"], "%Y-%m-%d").date()\n    if (NOW - seen).days > 30:\n        intune.add_tag(did, "stale")\n    if not d["managed"]:\n        intune.add_tag(did, "byod")\nprint("remediation complete")`,
  },

  /* ================= WORLD 8: ADVANCED PYTHON ================= */
  {
    id: "l36", world: "w8", title: "Generators Stream Data", xp: 120,
    story: `🧠 Processing 100k devices? Don't build a giant list — <b>yield</b> them one at a time with a generator. Memory-friendly and fast.`,
    concept: `A function with <code>yield</code> is a generator — it produces values lazily:
<pre>def names():
    for d in intune.list_devices():
        yield d["name"]

list(names())   # pull them all</pre>`,
    task: `Write a generator <code>compliant_names()</code> that yields the <code>name</code> of each <b>compliant</b> device. Then collect them into <code>names</code>.`,
    starter: `# define the generator, then: names = list(compliant_names())\n`,
    check: `
if 'compliant_names' not in globals() or not callable(compliant_names):
    _feedback = "Define a generator function compliant_names() that uses yield."
else:
    _exp = [d["name"] for d in intune.list_devices() if d["compliant"]]
    _got = list(compliant_names())
    if _got == _exp and globals().get("names") == _exp:
        _passed = True; _feedback = "Lazy streaming with yield — scales to millions of rows. 🌊"
    else:
        _feedback = f"Expected {_exp}, got {_got}."
`,
    hints: ["Use yield inside a for-loop over intune.list_devices().", "Only yield when d['compliant'] is True.", "names = list(compliant_names())"],
    solution: `def compliant_names():\n    for d in intune.list_devices():\n        if d["compliant"]:\n            yield d["name"]\n\nnames = list(compliant_names())\nprint(names)`,
  },
  {
    id: "l37", world: "w8", title: "Decorators Wrap Logic", xp: 140,
    story: `Want to add logging, retries, or auditing to many functions without touching each one? That's a <b>decorator</b>.`,
    concept: `A decorator is a function that wraps another function:
<pre>import functools
def count_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)
    wrapper.calls = 0
    return wrapper</pre>`,
    task: `Write a decorator <code>count_calls</code> that tracks how many times a function ran via a <code>.calls</code> attribute. Decorate <code>ping()</code> and call it 3 times.`,
    starter: `import functools\n\n# define count_calls, decorate ping, call it 3 times\n`,
    check: `
if 'ping' not in globals() or not callable(ping):
    _feedback = "Define and decorate a function ping()."
elif getattr(ping, "calls", None) == 3:
    _passed = True; _feedback = "Reusable cross-cutting behavior — decorators are everywhere in real code. 🎁"
else:
    _feedback = f"ping.calls should be 3 after calling ping() three times. Got {getattr(ping, 'calls', None)}."
`,
    hints: ["wrapper.calls starts at 0 and += 1 each call.", "Apply with @count_calls above def ping():", "Call ping() three times at the end."],
    solution: `import functools\n\ndef count_calls(fn):\n    @functools.wraps(fn)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return fn(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef ping():\n    return "pong"\n\nping()\nping()\nping()\nprint(ping.calls)`,
  },
  {
    id: "l38", world: "w8", title: "Dataclasses", xp: 110,
    story: `Dictionaries are loose. A <b>dataclass</b> gives you a typed, self-documenting object with almost no boilerplate.`,
    concept: `<pre>from dataclasses import dataclass

@dataclass
class Device:
    name: str
    os: str
    compliant: bool

d = Device("LAPTOP-01", "Windows", True)
d.name   # "LAPTOP-01"</pre>`,
    task: `Define a <code>Device</code> dataclass with fields <code>name</code>, <code>os</code>, <code>compliant</code>. Create <code>d = Device("LAPTOP-01", "Windows", True)</code>.`,
    starter: `from dataclasses import dataclass\n\n# define Device, then create d\n`,
    check: `
if 'd' not in globals():
    _feedback = "Create an instance named d."
elif getattr(d, "name", None) == "LAPTOP-01" and getattr(d, "os", None) == "Windows" and getattr(d, "compliant", None) is True:
    _passed = True; _feedback = "Typed, clean objects with zero boilerplate. 🧱"
else:
    _feedback = "d should be Device('LAPTOP-01','Windows',True) with .name/.os/.compliant."
`,
    hints: ["Decorate the class with @dataclass.", "Fields use type hints: name: str", 'd = Device("LAPTOP-01", "Windows", True)'],
    solution: `from dataclasses import dataclass\n\n@dataclass\nclass Device:\n    name: str\n    os: str\n    compliant: bool\n\nd = Device("LAPTOP-01", "Windows", True)\nprint(d)`,
  },
  {
    id: "l39", world: "w8", title: "Regex on Logs", xp: 130,
    story: `Log parsing is bread-and-butter security work. Pull every IP out of a log line with <code>re</code>.`,
    concept: `<pre>import re
re.findall(r"\\d+\\.\\d+\\.\\d+\\.\\d+", text)  # all IPv4-looking strings</pre>
<code>\\d+</code> = digits, <code>\\.</code> = literal dot. <code>findall</code> returns every match.`,
    task: `From <code>log</code>, extract all IPv4 addresses into <code>ips</code> (expect <code>['10.0.0.5', '192.168.1.20']</code>).`,
    starter: `import re\nlog = "2026-11-13 login from 10.0.0.5 failed; retry from 192.168.1.20"\n\n# ips = ?\n`,
    check: `
if 'ips' not in globals():
    _feedback = "Create ips."
elif ips == ["10.0.0.5", "192.168.1.20"]:
    _passed = True; _feedback = "Regex log-parsing unlocked — half of blue-team scripting. 🔎"
else:
    _feedback = f"Expected ['10.0.0.5','192.168.1.20'], got {ips}."
`,
    hints: ["Use re.findall with a digit-dot pattern.", 'Pattern: r"\\d+\\.\\d+\\.\\d+\\.\\d+"', 'ips = re.findall(r"\\d+\\.\\d+\\.\\d+\\.\\d+", log)'],
    solution: `import re\nlog = "2026-11-13 login from 10.0.0.5 failed; retry from 192.168.1.20"\n\nips = re.findall(r"\\d+\\.\\d+\\.\\d+\\.\\d+", log)\nprint(ips)`,
  },
  {
    id: "l40", world: "w8", title: "Custom Exceptions", xp: 120,
    story: `Good automation fails loudly and specifically. Define your own exception type and handle it.`,
    concept: `<pre>class ComplianceError(Exception):
    pass

def enforce(device):
    if not device["compliant"]:
        raise ComplianceError("device not compliant")
    return True</pre>
Catch it with <code>try/except ComplianceError</code>.`,
    task: `Define <code>ComplianceError</code> and <code>enforce(device)</code> (raises it when not compliant, else returns True). Then catch it for a non-compliant device and set <code>caught = True</code>.`,
    starter: `# define ComplianceError + enforce, then catch it\n`,
    check: `
if 'ComplianceError' not in globals() or not isinstance(ComplianceError, type) or not issubclass(ComplianceError, Exception):
    _feedback = "Define a ComplianceError exception class."
elif 'enforce' not in globals() or not callable(enforce):
    _feedback = "Define enforce(device)."
else:
    try:
        _ok = enforce({"compliant": True})
    except Exception:
        _ok = None
    if _ok is True and globals().get("caught") is True:
        _passed = True; _feedback = "Precise, catchable failures — production-grade error handling. 🧯"
    else:
        _feedback = "enforce(compliant) should return True, and catching a non-compliant device should set caught=True."
`,
    hints: ["class ComplianceError(Exception): pass", "raise ComplianceError(...) when not compliant", "Wrap enforce({'compliant': False}) in try/except ComplianceError and set caught = True"],
    solution: `class ComplianceError(Exception):\n    pass\n\ndef enforce(device):\n    if not device["compliant"]:\n        raise ComplianceError("device not compliant")\n    return True\n\ncaught = False\ntry:\n    enforce({"compliant": False})\nexcept ComplianceError:\n    caught = True\nprint(caught)`,
  },

  /* ================= WORLD 9: API SECURITY ================= */
  {
    id: "l41", world: "w9", title: "Decode a JWT", xp: 130,
    story: `🔑 APIs hand you a JWT. Its middle segment is just base64 JSON — let's read the claims.`,
    concept: `A JWT is <code>header.payload.signature</code>. Decode the payload (segment 1) — remember base64 needs padding:
<pre>import base64, json
part = token.split(".")[1]
part += "=" * (-len(part) % 4)   # fix padding
claims = json.loads(base64.urlsafe_b64decode(part))</pre>`,
    task: `Decode the JWT's payload into <code>claims</code> and read the <code>role</code> into <code>role</code> (expect <code>"admin"</code>).`,
    starter: `import base64, json\ntoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MSIsInJvbGUiOiJhZG1pbiIsImF1ZCI6ImludHVuZS1hcGkiLCJleHAiOjk5OTk5OTk5OTl9.c2lnbmF0dXJl"\n\n# decode payload -> claims, then role\n`,
    check: `
if globals().get("role") == "admin" and isinstance(globals().get("claims"), dict):
    _passed = True; _feedback = "Decoded the claims! Next lesson: why decoding ALONE is dangerous. 🔓"
else:
    _feedback = 'Split on ".", take index 1, pad to a multiple of 4, base64.urlsafe_b64decode, json.loads, then claims["role"].'
`,
    hints: ["token.split('.')[1] is the payload.", 'Pad: part += "=" * (-len(part) % 4)', 'claims = json.loads(base64.urlsafe_b64decode(part)); role = claims["role"]'],
    solution: `import base64, json\ntoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MSIsInJvbGUiOiJhZG1pbiIsImF1ZCI6ImludHVuZS1hcGkiLCJleHAiOjk5OTk5OTk5OTl9.c2lnbmF0dXJl"\n\npart = token.split(".")[1]\npart += "=" * (-len(part) % 4)\nclaims = json.loads(base64.urlsafe_b64decode(part))\nrole = claims["role"]\nprint(role)`,
  },
  {
    id: "l42", world: "w9", title: "Verify, Don't Trust", xp: 130,
    story: `Decoding a JWT proves nothing — anyone can forge the payload. You must validate claims (and, really, the signature). Start with expiry + audience.`,
    concept: `Never trust an unverified token. At minimum check it hasn't expired and is meant for your API:
<pre>valid = claims["exp"] > now_ts and claims["aud"] == "intune-api"</pre>`,
    task: `Given <code>claims</code> (expired!) and <code>now_ts</code>, set <code>valid</code> = token not expired AND audience is <code>"intune-api"</code>. (It should come out <code>False</code>.)`,
    starter: `claims = {"aud": "intune-api", "exp": 1000}\nnow_ts = 2000\n\n# valid = ?\n`,
    check: `
if 'valid' not in globals():
    _feedback = "Create valid."
elif valid is False:
    _passed = True; _feedback = "Rejected an expired token — exactly right. Decode != verify. 🛡️"
elif valid is True:
    _feedback = "exp (1000) is before now_ts (2000), so the token is EXPIRED — valid should be False."
else:
    _feedback = "valid should be a boolean from two checks: exp > now_ts AND aud == 'intune-api'."
`,
    hints: ["Expired means claims['exp'] <= now_ts.", "Combine with 'and'.", 'valid = claims["exp"] > now_ts and claims["aud"] == "intune-api"'],
    solution: `claims = {"aud": "intune-api", "exp": 1000}\nnow_ts = 2000\n\nvalid = claims["exp"] > now_ts and claims["aud"] == "intune-api"\nprint(valid)`,
  },
  {
    id: "l43", world: "w9", title: "Bearer Token Header", xp: 110,
    story: `To call a protected API you attach your token as a Bearer header. Get a token, build the header.`,
    concept: `<pre>token = graph.authenticate(client_id, secret, tenant)
headers = {"Authorization": f"Bearer {token}"}</pre>`,
    task: `Authenticate <code>graph</code>, then build <code>headers</code> with an <code>Authorization: Bearer &lt;token&gt;</code> entry.`,
    starter: `# authenticate, then build the headers dict\n`,
    check: `
_h = globals().get("headers")
if not isinstance(_h, dict) or "Authorization" not in _h:
    _feedback = "Create a headers dict with an 'Authorization' key."
elif _h["Authorization"].startswith("Bearer ") and graph.token and _h["Authorization"].endswith(graph.token):
    _passed = True; _feedback = "Properly authenticated API call header. 🔐"
else:
    _feedback = 'headers = {"Authorization": f"Bearer {token}"} after graph.authenticate(...).'
`,
    hints: ["token = graph.authenticate('app','secret','tenant')", 'Use an f-string: f"Bearer {token}"', 'headers = {"Authorization": f"Bearer {token}"}'],
    solution: `token = graph.authenticate("app-1234", "secret", "contoso")\nheaders = {"Authorization": f"Bearer {token}"}\nprint(headers)`,
  },
  {
    id: "l44", world: "w9", title: "Check the Scope", xp: 120,
    story: `A valid token still shouldn't do everything. Enforce least privilege by checking granted scopes.`,
    concept: `<pre>def require_scope(granted, needed):
    return needed in granted</pre>
OAuth scopes (like <code>DeviceManagementManagedDevices.Read.All</code>) limit what a token may do.`,
    task: `Write <code>require_scope(granted, needed)</code> returning True only if <code>needed</code> is in <code>granted</code>. Then set <code>allowed = require_scope(granted, "DeviceManagementManagedDevices.Read.All")</code>.`,
    starter: `granted = ["DeviceManagementManagedDevices.Read.All", "User.Read"]\n\n# define require_scope, then set allowed\n`,
    check: `
if 'require_scope' not in globals() or not callable(require_scope):
    _feedback = "Define require_scope(granted, needed)."
elif require_scope(["a", "b"], "b") is True and require_scope(["a"], "z") is False and globals().get("allowed") is True:
    _passed = True; _feedback = "Least-privilege authorization in two lines. 🎯"
else:
    _feedback = "require_scope should return (needed in granted), and allowed should be True."
`,
    hints: ["return needed in granted", "Call it with the Read.All scope.", 'allowed = require_scope(granted, "DeviceManagementManagedDevices.Read.All")'],
    solution: `granted = ["DeviceManagementManagedDevices.Read.All", "User.Read"]\n\ndef require_scope(granted, needed):\n    return needed in granted\n\nallowed = require_scope(granted, "DeviceManagementManagedDevices.Read.All")\nprint(allowed)`,
  },
  {
    id: "l45", world: "w9", title: "Validate the Input", xp: 140,
    story: `Never trust client input. Reject unexpected fields (mass-assignment) and wrong types before acting on a payload.`,
    concept: `Allowlist the fields you accept:
<pre>ALLOWED = {"name", "os"}
def validate(payload):
    if set(payload) - ALLOWED:   # any extra keys?
        return False
    return isinstance(payload.get("name"), str)</pre>
An attacker adding <code>"isAdmin": true</code> must be rejected.`,
    task: `Write <code>validate(payload)</code> that returns True only if keys are a subset of <code>{"name","os"}</code> AND <code>name</code> is a string. Extra keys or bad types → False.`,
    starter: `ALLOWED = {"name", "os"}\n\n# define validate(payload)\n`,
    check: `
if 'validate' not in globals() or not callable(validate):
    _feedback = "Define validate(payload)."
else:
    _a = validate({"name": "X", "os": "Windows"})
    _b = validate({"name": "X", "os": "Windows", "isAdmin": True})
    _c = validate({"name": 123})
    if _a is True and _b is False and _c is False:
        _passed = True; _feedback = "Mass-assignment blocked, types enforced. This stops real breaches. 🧰"
    else:
        _feedback = f"Expected True/False/False, got {_a}/{_b}/{_c}. Reject extra keys and non-string names."
`,
    hints: ["Extra keys: set(payload) - ALLOWED should be empty.", "Type check: isinstance(payload.get('name'), str)", "Return False if extra keys OR name isn't a str."],
    solution: `ALLOWED = {"name", "os"}\n\ndef validate(payload):\n    if set(payload) - ALLOWED:\n        return False\n    return isinstance(payload.get("name"), str)\n\nprint(validate({"name": "X", "os": "Windows"}))`,
  },

  /* ================= WORLD 10: CI/CD & AUTOMATION ================= */
  {
    id: "l46", world: "w10", title: "Write a Test", xp: 110,
    story: `⚙️ Automation you don't test is automation you can't trust. Assertions are the simplest tests.`,
    concept: `<pre>assert is_strong("x" * 12) is True
assert is_strong("short") is False</pre>
An <code>assert</code> that's False raises <code>AssertionError</code> and fails the build.`,
    task: `Write <code>is_strong(pw)</code> (True if 12+ chars). Write <code>test_is_strong()</code> that asserts both a strong and weak case, call it, and set <code>tested = True</code>.`,
    starter: `# define is_strong, then test_is_strong(), then call it\n`,
    check: `
if 'is_strong' not in globals() or not callable(is_strong):
    _feedback = "Define is_strong(pw)."
elif is_strong("x" * 12) is True and is_strong("short") is False and globals().get("tested") is True:
    _passed = True; _feedback = "Green tests = shippable code. This mindset passes interviews. ✅"
else:
    _feedback = "is_strong should be True for 12+ chars, False otherwise; run test_is_strong() and set tested=True."
`,
    hints: ["return len(pw) >= 12", "Inside the test use assert ... is True / is False.", "Call test_is_strong() then set tested = True"],
    solution: `def is_strong(pw):\n    return len(pw) >= 12\n\ndef test_is_strong():\n    assert is_strong("x" * 12) is True\n    assert is_strong("short") is False\n\ntest_is_strong()\ntested = True\nprint("tests passed")`,
  },
  {
    id: "l47", world: "w10", title: "Retry with Backoff", xp: 140,
    story: `Pipelines hit flaky APIs. Robust automation retries instead of failing. The simulator's <code>graph.flaky_get</code> fails twice, then succeeds.`,
    concept: `<pre>def fetch_with_retry(url, max_tries=5):
    for _ in range(max_tries):
        resp = graph.flaky_get(url)
        if resp.status_code == 200:
            return resp
    return resp</pre>`,
    task: `Write <code>fetch_with_retry(url)</code> that retries until status 200, call it, and store the final status code in <code>status</code>.`,
    starter: `url = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\n# define fetch_with_retry, call it, set status\n`,
    check: `
if 'fetch_with_retry' not in globals() or not callable(fetch_with_retry):
    _feedback = "Define fetch_with_retry(url)."
elif globals().get("status") == 200:
    _passed = True; _feedback = "Resilient automation that rides out failures. 🧱"
else:
    _feedback = f"Loop graph.flaky_get until status_code == 200; set status. Got {globals().get('status')}."
`,
    hints: ["Loop with for _ in range(5):", "Return the response when status_code == 200.", "status = fetch_with_retry(url).status_code"],
    solution: `url = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"\n\ndef fetch_with_retry(url, max_tries=5):\n    for _ in range(max_tries):\n        resp = graph.flaky_get(url)\n        if resp.status_code == 200:\n            return resp\n    return resp\n\nstatus = fetch_with_retry(url).status_code\nprint(status)`,
  },
  {
    id: "l48", world: "w10", title: "Scan for Secrets", xp: 140,
    story: `A hardcoded AWS key or API token in a repo is a breach. Build a mini secret-scanner with regex.`,
    concept: `Match known secret shapes:
<pre>import re
re.search(r"AKIA[0-9A-Z]{16}|sk_live_\\w+", line)</pre>
AWS access keys start <code>AKIA…</code>; many API keys look like <code>sk_live_…</code>.`,
    task: `From the <code>config</code> text, build <code>leaks</code> — the lines that contain a secret (expect 2: the AWS key and the API key).`,
    starter: `import re\nconfig = "db_host=localhost\\naws_key=AKIAIOSFODNN7EXAMPLE\\napi_key=sk_live_abc123\\nlog_level=info"\n\n# leaks = ?\n`,
    check: `
if 'leaks' not in globals():
    _feedback = "Create leaks."
elif len(leaks) == 2 and any("AKIA" in x for x in leaks) and any("sk_live" in x for x in leaks):
    _passed = True; _feedback = "You just built a secret scanner — pre-commit hooks use exactly this. 🔦"
else:
    _feedback = f"Expected 2 secret lines (AWS key + api_key), got {leaks}."
`,
    hints: ["Split with config.splitlines().", "Keep lines where re.search(pattern, line) matches.", 'leaks = [l for l in config.splitlines() if re.search(r"AKIA[0-9A-Z]{16}|sk_live_\\w+", l)]'],
    solution: `import re\nconfig = "db_host=localhost\\naws_key=AKIAIOSFODNN7EXAMPLE\\napi_key=sk_live_abc123\\nlog_level=info"\n\nleaks = [l for l in config.splitlines() if re.search(r"AKIA[0-9A-Z]{16}|sk_live_\\w+", l)]\nprint(leaks)`,
  },
  {
    id: "l49", world: "w10", title: "Dependency Scan (SCA)", xp: 140,
    story: `Most breaches ride in via a vulnerable library. Compare installed packages against a known-vulnerable list — that's SCA.`,
    concept: `<pre>vulnerable = [pkg for pkg, ver in installed.items()
              if f"{pkg}=={ver}" in KNOWN_VULN]</pre>`,
    task: `Given <code>installed</code> and <code>KNOWN_VULN</code>, build <code>vulnerable</code> — the package names whose exact version is known-vulnerable (expect <code>['pyyaml', 'requests']</code>, sorted).`,
    starter: `installed = {"requests": "2.19.0", "flask": "2.3.0", "pyyaml": "5.1"}\nKNOWN_VULN = {"requests==2.19.0", "pyyaml==5.1", "log4j==2.14.0"}\n\n# vulnerable = ? (sorted)\n`,
    check: `
if 'vulnerable' not in globals():
    _feedback = "Create vulnerable."
elif sorted(vulnerable) == ["pyyaml", "requests"]:
    _passed = True; _feedback = "SCA in one line — this catches the Log4Shells before they ship. 🧪"
else:
    _feedback = f"Expected ['pyyaml','requests'], got {sorted(vulnerable) if isinstance(vulnerable, list) else vulnerable}."
`,
    hints: ["Build 'pkg==ver' and test membership in KNOWN_VULN.", 'f"{pkg}=={ver}" in KNOWN_VULN', 'vulnerable = sorted(pkg for pkg, ver in installed.items() if f"{pkg}=={ver}" in KNOWN_VULN)'],
    solution: `installed = {"requests": "2.19.0", "flask": "2.3.0", "pyyaml": "5.1"}\nKNOWN_VULN = {"requests==2.19.0", "pyyaml==5.1", "log4j==2.14.0"}\n\nvulnerable = sorted(pkg for pkg, ver in installed.items() if f"{pkg}=={ver}" in KNOWN_VULN)\nprint(vulnerable)`,
  },
  {
    id: "l50", world: "w10", title: "BOSS: Pipeline Security Gate", xp: 300,
    story: `🏆 Final boss. Build the CI/CD gate that fails a build if it finds vulnerable dependencies OR leaked secrets — the capstone of secure automation.`,
    concept: `Combine SCA + secret scanning into one gate that returns a report and a pass/fail:
<pre>def pipeline_gate(installed, config, known_vuln):
    vulnerable = sorted(...)      # SCA
    secrets = [... secret lines ...]
    return {"vulnerable": vulnerable,
            "secrets": len(secrets),
            "passed": not vulnerable and not secrets}</pre>`,
    task: `Write <code>pipeline_gate(installed, config, known_vuln)</code> returning a dict with <code>vulnerable</code> (sorted names), <code>secrets</code> (count), and <code>passed</code> (True only if both are empty). Call it into <code>report</code>.`,
    starter: `import re\ninstalled = {"requests": "2.19.0", "flask": "2.3.0", "pyyaml": "5.1"}\nconfig = "db_host=localhost\\naws_key=AKIAIOSFODNN7EXAMPLE\\napi_key=sk_live_abc123"\nKNOWN_VULN = {"requests==2.19.0", "pyyaml==5.1"}\n\n# define pipeline_gate(installed, config, known_vuln), then report = ...\n`,
    check: `
if 'pipeline_gate' not in globals() or not callable(pipeline_gate):
    _feedback = "Define pipeline_gate(installed, config, known_vuln)."
else:
    _r = globals().get("report")
    if not isinstance(_r, dict):
        _feedback = "Call pipeline_gate(...) into report."
    elif sorted(_r.get("vulnerable", [])) == ["pyyaml", "requests"] and _r.get("secrets", 0) >= 2 and _r.get("passed") is False:
        _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a full CI/CD security gate — SCA + secret scanning + a pass/fail verdict. You're interview-ready."
    else:
        _feedback = f"Gate should find vulnerable ['pyyaml','requests'], 2+ secrets, and passed=False. Got {_r}."
`,
    hints: [
      "Reuse your SCA: vulnerable = sorted(pkg for pkg,ver in installed.items() if f'{pkg}=={ver}' in known_vuln)",
      'Secrets: [l for l in config.splitlines() if re.search(r"AKIA[0-9A-Z]{16}|sk_live_\\w+", l)]',
      "passed = not vulnerable and not secrets",
    ],
    solution: `import re\ninstalled = {"requests": "2.19.0", "flask": "2.3.0", "pyyaml": "5.1"}\nconfig = "db_host=localhost\\naws_key=AKIAIOSFODNN7EXAMPLE\\napi_key=sk_live_abc123"\nKNOWN_VULN = {"requests==2.19.0", "pyyaml==5.1"}\n\ndef pipeline_gate(installed, config, known_vuln):\n    vulnerable = sorted(pkg for pkg, ver in installed.items() if f"{pkg}=={ver}" in known_vuln)\n    secrets = [l for l in config.splitlines() if re.search(r"AKIA[0-9A-Z]{16}|sk_live_\\w+", l)]\n    return {"vulnerable": vulnerable, "secrets": len(secrets), "passed": not vulnerable and not secrets}\n\nreport = pipeline_gate(installed, config, KNOWN_VULN)\nprint(report)`,
  },

  /* ================= WORLD 11: LOG ANALYTICS ================= */
  {
    id: "l51", world: "w11", title: "Count with Counter", xp: 120,
    story: `📊 Security = finding the needle in millions of log lines. <code>collections.Counter</code> tallies things instantly.`,
    concept: `<pre>from collections import Counter
counts = Counter(["ok", "fail", "ok"])
counts["ok"]     # 2
counts["fail"]   # 1</pre>`,
    task: `From <code>statuses</code>, build a <code>Counter</code> and store how many are <code>"failed"</code> in <code>failed_count</code> (expect 3).`,
    starter: `from collections import Counter\nstatuses = ["ok", "failed", "ok", "failed", "failed"]\n\n# failed_count = ?\n`,
    check: `
if 'failed_count' not in globals():
    _feedback = "Create failed_count."
elif failed_count == 3:
    _passed = True; _feedback = "Counter tallies in one pass — the workhorse of log analysis. 📊"
else:
    _feedback = f"Expected 3, got {failed_count}. Try Counter(statuses)['failed']."
`,
    hints: ["Wrap the list: Counter(statuses)", "Index it: counts['failed']", "failed_count = Counter(statuses)['failed']"],
    solution: `from collections import Counter\nstatuses = ["ok", "failed", "ok", "failed", "failed"]\n\nfailed_count = Counter(statuses)["failed"]\nprint(failed_count)`,
  },
  {
    id: "l52", world: "w11", title: "Top Talker", xp: 130,
    story: `Which source IP is hammering you hardest? <code>most_common</code> ranks them for you.`,
    concept: `<pre>Counter(ips).most_common(1)   # [('10.0.0.9', 4)]
Counter(ips).most_common(1)[0][0]   # '10.0.0.9'</pre>`,
    task: `From <code>ips</code>, find the single most frequent source into <code>top_ip</code> (expect <code>"10.0.0.9"</code>).`,
    starter: `from collections import Counter\nips = ["10.0.0.9", "10.0.0.2", "10.0.0.9", "10.0.0.9", "192.168.1.5", "10.0.0.2"]\n\n# top_ip = ?\n`,
    check: `
if 'top_ip' not in globals():
    _feedback = "Create top_ip."
elif top_ip == "10.0.0.9":
    _passed = True; _feedback = "Top talker identified — first move in triaging noisy logs. 📡"
else:
    _feedback = f"Expected '10.0.0.9', got {top_ip}. Use Counter(ips).most_common(1)[0][0]."
`,
    hints: ["Counter(ips).most_common(1) gives a list of (value, count).", "Grab [0][0] for the value.", "top_ip = Counter(ips).most_common(1)[0][0]"],
    solution: `from collections import Counter\nips = ["10.0.0.9", "10.0.0.2", "10.0.0.9", "10.0.0.9", "192.168.1.5", "10.0.0.2"]\n\ntop_ip = Counter(ips).most_common(1)[0][0]\nprint(top_ip)`,
  },
  {
    id: "l53", world: "w11", title: "Parse & Tally", xp: 140,
    story: `Real logs are text. Split each line, then count what matters — failed logins per user.`,
    concept: `<pre>for line in log_lines:
    user, status = line.split()
    if status == "FAIL":
        fails[user] += 1</pre>`,
    task: `Each line in <code>log_lines</code> is <code>"user STATUS"</code>. Count FAILs per user and build <code>repeat_offenders</code> — users with 3+ fails (expect <code>["alice"]</code>).`,
    starter: `from collections import Counter\nlog_lines = ["alice FAIL", "bob OK", "alice FAIL", "alice FAIL", "bob OK"]\n\n# repeat_offenders = users with >= 3 FAILs\n`,
    check: `
if 'repeat_offenders' not in globals():
    _feedback = "Create repeat_offenders."
elif sorted(repeat_offenders) == ["alice"]:
    _passed = True; _feedback = "Parsed and aggregated — now you can detect patterns, not just read lines. 🧮"
else:
    _feedback = f"Expected ['alice'], got {repeat_offenders}. Count FAILs per user, keep those >= 3."
`,
    hints: ["Split each line: user, status = line.split()", "Tally fails in a Counter when status == 'FAIL'.", "repeat_offenders = [u for u, n in fails.items() if n >= 3]"],
    solution: `from collections import Counter\nlog_lines = ["alice FAIL", "bob OK", "alice FAIL", "alice FAIL", "bob OK"]\n\nfails = Counter()\nfor line in log_lines:\n    user, status = line.split()\n    if status == "FAIL":\n        fails[user] += 1\nrepeat_offenders = [u for u, n in fails.items() if n >= 3]\nprint(repeat_offenders)`,
  },
  {
    id: "l54", world: "w11", title: "Top-N Report", xp: 130,
    story: `A good report shows the top offenders, ranked. Build one.`,
    concept: `<code>most_common(n)</code> returns the top n as <code>(value, count)</code> tuples, already sorted:
<pre>Counter(events).most_common(2)
# [('login', 5), ('logout', 3)]</pre>`,
    task: `From <code>events</code>, build <code>report</code> = the top 2 most common events as a list of (event, count) tuples.`,
    starter: `from collections import Counter\nevents = ["login", "login", "logout", "login", "error", "logout"]\n\n# report = top 2\n`,
    check: `
if 'report' not in globals():
    _feedback = "Create report."
elif list(report) == [("login", 3), ("logout", 2)]:
    _passed = True; _feedback = "A ranked report in one call — ready to hand to the SOC lead. 📋"
else:
    _feedback = f"Expected [('login',3),('logout',2)], got {report}. Use Counter(events).most_common(2)."
`,
    hints: ["Counter(events).most_common(2)", "It's already sorted by count, descending.", "report = Counter(events).most_common(2)"],
    solution: `from collections import Counter\nevents = ["login", "login", "logout", "login", "error", "logout"]\n\nreport = Counter(events).most_common(2)\nprint(report)`,
  },
  {
    id: "l55", world: "w11", title: "BOSS: Brute-Force Detector", xp: 300,
    story: `🏆 Final boss of analytics. Scan an auth log and flag any source IP with 5+ failed logins — a real brute-force detection you could run against production logs tomorrow.`,
    concept: `Each line is <code>"IP user RESULT"</code>. Parse, count FAILs per IP, flag the noisy ones:
<pre>ip, user, result = line.split()
if result == "FAIL":
    fails[ip] += 1
flagged = sorted(ip for ip, n in fails.items() if n >= 5)</pre>`,
    task: `From <code>log_lines</code>, build <code>flagged</code> — sorted list of IPs with 5 or more FAILs (expect <code>["10.0.0.9"]</code>).`,
    starter: `from collections import Counter\nlog_lines = [\n    "10.0.0.9 alice FAIL", "10.0.0.9 alice FAIL", "10.0.0.9 bob FAIL",\n    "10.0.0.9 bob FAIL", "10.0.0.9 carol FAIL",\n    "10.0.0.2 dave OK", "10.0.0.2 dave FAIL", "192.168.1.5 eve OK",\n]\n\n# flagged = IPs with >= 5 FAILs\n`,
    check: `
if 'flagged' not in globals():
    _feedback = "Create flagged."
elif sorted(flagged) == ["10.0.0.9"]:
    _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a brute-force detector from raw logs — parsing, aggregation, thresholds. You're interview-ready."
else:
    _feedback = f"Expected ['10.0.0.9'], got {flagged}. Count FAILs per IP (first token) and keep those >= 5."
`,
    hints: [
      "Split three tokens: ip, user, result = line.split()",
      "Tally only when result == 'FAIL', keyed by ip.",
      "flagged = sorted(ip for ip, n in fails.items() if n >= 5)",
    ],
    solution: `from collections import Counter\nlog_lines = [\n    "10.0.0.9 alice FAIL", "10.0.0.9 alice FAIL", "10.0.0.9 bob FAIL",\n    "10.0.0.9 bob FAIL", "10.0.0.9 carol FAIL",\n    "10.0.0.2 dave OK", "10.0.0.2 dave FAIL", "192.168.1.5 eve OK",\n]\n\nfails = Counter()\nfor line in log_lines:\n    ip, user, result = line.split()\n    if result == "FAIL":\n        fails[ip] += 1\nflagged = sorted(ip for ip, n in fails.items() if n >= 5)\nprint(flagged)`,
  },

  /* ================= WORLD 12: CLOUD SECURITY (Python) ================= */
  {
    id: "l56", world: "w12", title: "Scan for Public Buckets", xp: 120,
    story: `☁️ A live mock AWS account is available as <code>aws</code> (boto3-style). The #1 cloud leak is a public object store — go find them.`,
    concept: `The <code>aws</code> client lists resources:
<pre>for b in aws.list_buckets():
    b["name"], b["public"], b["encrypted"]</pre>
Also: <code>aws.block_public_access(name)</code>, <code>aws.enable_encryption(name)</code>, <code>aws.list_policies()</code>.`,
    task: `Build <code>public_buckets</code> — the names of every bucket where <code>public</code> is True (expect <code>['customer-backups', 'public-assets']</code>).`,
    starter: `# find all public buckets\n`,
    check: `
if 'public_buckets' not in globals():
    _feedback = "Create public_buckets."
elif sorted(public_buckets) == ["customer-backups", "public-assets"]:
    _passed = True; _feedback = "Found the exposed buckets — step one of cloud posture management. ☁️"
else:
    _feedback = f"Expected ['customer-backups','public-assets'], got {public_buckets}."
`,
    hints: ["Loop aws.list_buckets().", "Keep b['name'] where b['public'] is True.", "public_buckets = [b['name'] for b in aws.list_buckets() if b['public']]"],
    solution: `public_buckets = [b["name"] for b in aws.list_buckets() if b["public"]]\nprint(public_buckets)`,
  },
  {
    id: "l57", world: "w12", title: "Lock Them Down", xp: 130,
    story: `Don't just report — remediate. Block public access on every exposed bucket.`,
    concept: `<pre>for b in aws.list_buckets():
    if b["public"]:
        aws.block_public_access(b["name"])</pre>`,
    task: `Block public access on every currently-public bucket. Afterwards no bucket should be public.`,
    starter: `# remediate: block public access on all public buckets\n`,
    check: `
_still_public = [b["name"] for b in aws.list_buckets() if b["public"]]
if not _still_public:
    _passed = True; _feedback = "All buckets locked down. Auto-remediation is the dream of every cloud team. 🔒"
else:
    _feedback = f"These are still public: {_still_public}. Loop and call aws.block_public_access(name)."
`,
    hints: ["Loop the buckets.", "if b['public']: aws.block_public_access(b['name'])"],
    solution: `for b in aws.list_buckets():\n    if b["public"]:\n        aws.block_public_access(b["name"])\nprint("locked down")`,
  },
  {
    id: "l58", world: "w12", title: "Encryption Audit", xp: 120,
    story: `Data at rest must be encrypted. Find the buckets that aren't.`,
    concept: `Same list, different flag: <code>b["encrypted"]</code>.`,
    task: `Build <code>unencrypted</code> — names of buckets where <code>encrypted</code> is False (expect <code>['customer-backups', 'terraform-state']</code>).`,
    starter: `# find unencrypted buckets\n`,
    check: `
if 'unencrypted' not in globals():
    _feedback = "Create unencrypted."
elif sorted(unencrypted) == ["customer-backups", "terraform-state"]:
    _passed = True; _feedback = "Encryption gaps found — this is a standard compliance finding. 🔐"
else:
    _feedback = f"Expected ['customer-backups','terraform-state'], got {unencrypted}."
`,
    hints: ["if not b['encrypted']", "unencrypted = [b['name'] for b in aws.list_buckets() if not b['encrypted']]"],
    solution: `unencrypted = [b["name"] for b in aws.list_buckets() if not b["encrypted"]]\nprint(unencrypted)`,
  },
  {
    id: "l59", world: "w12", title: "Enforce Encryption", xp: 120,
    story: `Turn on encryption everywhere it's missing.`,
    concept: `<pre>aws.enable_encryption(name)</pre>`,
    task: `Enable encryption on every unencrypted bucket. Afterwards all buckets must be encrypted.`,
    starter: `# enable encryption where missing\n`,
    check: `
_still = [b["name"] for b in aws.list_buckets() if not b["encrypted"]]
if not _still:
    _passed = True; _feedback = "Every bucket encrypted at rest. Clean audit. ✅"
else:
    _feedback = f"Still unencrypted: {_still}. Loop and call aws.enable_encryption(name)."
`,
    hints: ["Loop the buckets.", "if not b['encrypted']: aws.enable_encryption(b['name'])"],
    solution: `for b in aws.list_buckets():\n    if not b["encrypted"]:\n        aws.enable_encryption(b["name"])\nprint("encrypted")`,
  },
  {
    id: "l60", world: "w12", title: "Hunt Over-Permissive IAM", xp: 140,
    story: `Wildcard IAM policies are a breach multiplier. Flag any policy granting <code>*</code> actions.`,
    concept: `Each policy has an <code>actions</code> list. A wildcard like <code>"*"</code> or <code>"s3:*"</code> is over-permissive:
<pre>any("*" in a for a in policy["actions"])</pre>`,
    task: `Build <code>risky_policies</code> — names of policies where any action contains <code>*</code> (expect <code>['AdminLegacy', 'BackupSvc']</code>).`,
    starter: `# flag policies with wildcard actions\n`,
    check: `
if 'risky_policies' not in globals():
    _feedback = "Create risky_policies."
elif sorted(risky_policies) == ["AdminLegacy", "BackupSvc"]:
    _passed = True; _feedback = "Wildcard IAM caught — least-privilege enforcement in code. 🎯"
else:
    _feedback = f"Expected ['AdminLegacy','BackupSvc'], got {risky_policies}."
`,
    hints: ["Loop aws.list_policies().", "Check any('*' in a for a in p['actions']).", "risky_policies = [p['name'] for p in aws.list_policies() if any('*' in a for a in p['actions'])]"],
    solution: `risky_policies = [p["name"] for p in aws.list_policies() if any("*" in a for a in p["actions"])]\nprint(risky_policies)`,
  },
  {
    id: "l61", world: "w12", title: "BOSS: Cloud Posture Scanner", xp: 300,
    story: `🏆 Final boss. Write one function that audits the whole cloud account — finds public buckets, unencrypted data, and wildcard IAM — then auto-remediates the buckets. This is a real CSPM tool in miniature.`,
    concept: `Collect findings, then remediate:
<pre>def secure_cloud(aws):
    public = sorted(b["name"] for b in aws.list_buckets() if b["public"])
    unenc  = sorted(b["name"] for b in aws.list_buckets() if not b["encrypted"])
    risky  = sorted(p["name"] for p in aws.list_policies()
                    if any("*" in a for a in p["actions"]))
    for b in aws.list_buckets():
        aws.block_public_access(b["name"])
        aws.enable_encryption(b["name"])
    return {"public": public, "unencrypted": unenc, "risky_policies": risky}</pre>`,
    task: `Write <code>secure_cloud(aws)</code> that returns findings (<code>public</code>, <code>unencrypted</code>, <code>risky_policies</code> — each sorted) AND remediates all buckets (block public + encrypt). Call it into <code>findings</code>.`,
    starter: `# define secure_cloud(aws); then: findings = secure_cloud(aws)\n`,
    check: `
if 'secure_cloud' not in globals() or not callable(secure_cloud):
    _feedback = "Define secure_cloud(aws)."
else:
    _f = globals().get("findings")
    _public_left = [b["name"] for b in aws.list_buckets() if b["public"]]
    _unenc_left = [b["name"] for b in aws.list_buckets() if not b["encrypted"]]
    if (isinstance(_f, dict)
            and sorted(_f.get("public", [])) == ["customer-backups", "public-assets"]
            and sorted(_f.get("unencrypted", [])) == ["customer-backups", "terraform-state"]
            and sorted(_f.get("risky_policies", [])) == ["AdminLegacy", "BackupSvc"]
            and not _public_left and not _unenc_left):
        _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a cloud posture scanner that finds AND fixes misconfigurations. That's CSPM — you're interview-ready."
    else:
        _feedback = f"Findings must list the offenders AND remediation must leave no public/unencrypted buckets. Got findings={_f}, still public={_public_left}, still unencrypted={_unenc_left}."
`,
    hints: [
      "Collect the three finding lists FIRST (before remediating).",
      "public: b['public']; unencrypted: not b['encrypted']; risky: any('*' in a for a in p['actions']).",
      "Then loop buckets calling aws.block_public_access and aws.enable_encryption; return the findings dict.",
    ],
    solution: `def secure_cloud(aws):\n    public = sorted(b["name"] for b in aws.list_buckets() if b["public"])\n    unenc = sorted(b["name"] for b in aws.list_buckets() if not b["encrypted"])\n    risky = sorted(p["name"] for p in aws.list_policies() if any("*" in a for a in p["actions"]))\n    for b in aws.list_buckets():\n        aws.block_public_access(b["name"])\n        aws.enable_encryption(b["name"])\n    return {"public": public, "unencrypted": unenc, "risky_policies": risky}\n\nfindings = secure_cloud(aws)\nprint(findings)`,
  },

  /* ================= WORLD 13: CONTAINER & K8s SECURITY (Python) ================= */
  {
    id: "l62", world: "w13", title: "Find Privileged Pods", xp: 130,
    story: `🐳 A live mock cluster is available as <code>k8s</code>. A privileged container can escape to the host — hunt them down.`,
    concept: `<pre>for p in k8s.list_pods():
    p["name"], p["namespace"], p["privileged"]
    p["runAsRoot"], p["image"], p["limits"], p["envSecrets"]</pre>`,
    task: `Build <code>privileged</code> — names of pods where <code>privileged</code> is True (expect <code>['debug-shell']</code>).`,
    starter: `# find privileged pods\n`,
    check: `
if 'privileged' not in globals():
    _feedback = "Create privileged."
elif sorted(privileged) == ["debug-shell"]:
    _passed = True; _feedback = "Privileged pod found — a top container-escape risk. 🐳"
else:
    _feedback = f"Expected ['debug-shell'], got {privileged}."
`,
    hints: ["Loop k8s.list_pods().", "Keep p['name'] where p['privileged'].", "privileged = [p['name'] for p in k8s.list_pods() if p['privileged']]"],
    solution: `privileged = [p["name"] for p in k8s.list_pods() if p["privileged"]]\nprint(privileged)`,
  },
  {
    id: "l63", world: "w13", title: "Root & No Limits", xp: 140,
    story: `Pods should run as non-root with resource limits. Flag the ones that break both rules.`,
    concept: `Combine two conditions with <code>and</code>/<code>or</code>. Here: running as root OR missing resource limits is a finding.`,
    task: `Build <code>unsafe</code> — names of pods that <code>runAsRoot</code> OR have no <code>limits</code> (expect <code>['api-5d', 'debug-shell']</code>).`,
    starter: `# flag pods that run as root OR have no resource limits\n`,
    check: `
if 'unsafe' not in globals():
    _feedback = "Create unsafe."
elif sorted(unsafe) == ["api-5d", "debug-shell"]:
    _passed = True; _feedback = "Root + unbounded pods flagged — classic Pod Security findings. 🔒"
else:
    _feedback = f"Expected ['api-5d','debug-shell'], got {unsafe}."
`,
    hints: ["Condition: p['runAsRoot'] or not p['limits']", "unsafe = [p['name'] for p in k8s.list_pods() if p['runAsRoot'] or not p['limits']]"],
    solution: `unsafe = [p["name"] for p in k8s.list_pods() if p["runAsRoot"] or not p["limits"]]\nprint(unsafe)`,
  },
  {
    id: "l64", world: "w13", title: "The :latest Trap", xp: 130,
    story: `Mutable <code>:latest</code> image tags break reproducibility and let unreviewed code into prod. Find them.`,
    concept: `A string ends with a suffix via <code>.endswith(...)</code>:
<pre>"api:latest".endswith(":latest")   # True</pre>`,
    task: `Build <code>latest_images</code> — names of pods whose <code>image</code> ends with <code>:latest</code> (expect <code>['api-5d', 'debug-shell']</code>).`,
    starter: `# find pods using the :latest tag\n`,
    check: `
if 'latest_images' not in globals():
    _feedback = "Create latest_images."
elif sorted(latest_images) == ["api-5d", "debug-shell"]:
    _passed = True; _feedback = "Unpinned images caught — pin digests/tags for supply-chain safety. 📌"
else:
    _feedback = f"Expected ['api-5d','debug-shell'], got {latest_images}."
`,
    hints: ["Use p['image'].endswith(':latest').", "latest_images = [p['name'] for p in k8s.list_pods() if p['image'].endswith(':latest')]"],
    solution: `latest_images = [p["name"] for p in k8s.list_pods() if p["image"].endswith(":latest")]\nprint(latest_images)`,
  },
  {
    id: "l65", world: "w13", title: "Secrets in Env", xp: 130,
    story: `Secrets in plain environment variables leak into logs, crash dumps, and <code>kubectl describe</code>. Find pods doing it.`,
    concept: `A non-empty list is truthy:
<pre>if p["envSecrets"]:   # has secrets in env</pre>`,
    task: `Build <code>leaky_pods</code> — names of pods with any entries in <code>envSecrets</code> (expect <code>['api-5d']</code>).`,
    starter: `# find pods exposing secrets via env vars\n`,
    check: `
if 'leaky_pods' not in globals():
    _feedback = "Create leaky_pods."
elif sorted(leaky_pods) == ["api-5d"]:
    _passed = True; _feedback = "Env-var secret exposure found — move these to mounted Secrets/a vault. 🔑"
else:
    _feedback = f"Expected ['api-5d'], got {leaky_pods}."
`,
    hints: ["A non-empty list is truthy: if p['envSecrets']", "leaky_pods = [p['name'] for p in k8s.list_pods() if p['envSecrets']]"],
    solution: `leaky_pods = [p["name"] for p in k8s.list_pods() if p["envSecrets"]]\nprint(leaky_pods)`,
  },
  {
    id: "l66", world: "w13", title: "BOSS: Pod Security Audit", xp: 300,
    story: `🏆 Final boss. Write one admission-style auditor that scans every pod and reports all four classes of finding. This is what a Pod Security / OPA policy engine does.`,
    concept: `Return a dict with four sorted lists:
<pre>def audit_pods(k8s):
    pods = k8s.list_pods()
    return {
        "privileged":   sorted(p["name"] for p in pods if p["privileged"]),
        "run_as_root":  sorted(p["name"] for p in pods if p["runAsRoot"]),
        "latest_image": sorted(p["name"] for p in pods if p["image"].endswith(":latest")),
        "secrets_in_env": sorted(p["name"] for p in pods if p["envSecrets"]),
    }</pre>`,
    task: `Write <code>audit_pods(k8s)</code> returning those four sorted lists, and call it into <code>report</code>.`,
    starter: `# define audit_pods(k8s); then report = audit_pods(k8s)\n`,
    check: `
if 'audit_pods' not in globals() or not callable(audit_pods):
    _feedback = "Define audit_pods(k8s)."
else:
    _r = globals().get("report")
    if (isinstance(_r, dict)
            and sorted(_r.get("privileged", [])) == ["debug-shell"]
            and sorted(_r.get("run_as_root", [])) == ["api-5d", "debug-shell"]
            and sorted(_r.get("latest_image", [])) == ["api-5d", "debug-shell"]
            and sorted(_r.get("secrets_in_env", [])) == ["api-5d"]):
        _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a Kubernetes pod-security auditor — the core of an admission policy engine. You're interview-ready."
    else:
        _feedback = f"Report must have the four finding lists. Got {_r}."
`,
    hints: [
      "Grab pods = k8s.list_pods() once.",
      "Four comprehensions: privileged, runAsRoot, image endswith ':latest', envSecrets truthy.",
      "Return them in a dict with keys privileged / run_as_root / latest_image / secrets_in_env.",
    ],
    solution: `def audit_pods(k8s):\n    pods = k8s.list_pods()\n    return {\n        "privileged": sorted(p["name"] for p in pods if p["privileged"]),\n        "run_as_root": sorted(p["name"] for p in pods if p["runAsRoot"]),\n        "latest_image": sorted(p["name"] for p in pods if p["image"].endswith(":latest")),\n        "secrets_in_env": sorted(p["name"] for p in pods if p["envSecrets"]),\n    }\n\nreport = audit_pods(k8s)\nprint(report)`,
  },

  /* ================= WORLD 14: DETECTION ENGINEERING (SIEM) ================= */
  {
    id: "l67", world: "w14", title: "Filter the Stream", xp: 120,
    story: `🚨 Raw events are available as <code>siem</code>. Detection starts with filtering the firehose down to what matters.`,
    concept: `Each event is a dict:
<pre>for e in siem.list_events():
    e["type"]    # "login" / "process"
    e["user"], e["host"], e["result"], e["name"]</pre>`,
    task: `Build <code>failed_logins</code> — the events where <code>type</code> is <code>"login"</code> and <code>result</code> is <code>"fail"</code>. Store the count in <code>fail_count</code> (expect 6).`,
    starter: `# collect failed login events, then count them\n`,
    check: `
if 'fail_count' not in globals():
    _feedback = "Create fail_count."
elif fail_count == 6 and isinstance(globals().get("failed_logins"), list):
    _passed = True; _feedback = "Filtered the stream — step one of every detection. 🚨"
else:
    _feedback = f"Expected 6 failed logins, got {globals().get('fail_count')}."
`,
    hints: ["Filter on e['type']=='login' and e['result']=='fail'.", "failed_logins = [e for e in siem.list_events() if e['type']=='login' and e['result']=='fail']", "fail_count = len(failed_logins)"],
    solution: `failed_logins = [e for e in siem.list_events() if e["type"] == "login" and e["result"] == "fail"]\nfail_count = len(failed_logins)\nprint(fail_count)`,
  },
  {
    id: "l68", world: "w14", title: "Threshold Alert", xp: 140,
    story: `A single failed login is noise. Many from one user is a brute-force attempt. Alert on the threshold.`,
    concept: `Tally per user, then keep those over the line:
<pre>from collections import Counter
fails = Counter(e["user"] for e in events
                if e["type"]=="login" and e["result"]=="fail")</pre>`,
    task: `Build <code>brute_force</code> — users with 5 or more failed logins (expect <code>['alice']</code>).`,
    starter: `from collections import Counter\n\n# users with >= 5 failed logins\n`,
    check: `
if 'brute_force' not in globals():
    _feedback = "Create brute_force."
elif sorted(brute_force) == ["alice"]:
    _passed = True; _feedback = "Threshold rule firing — the bread-and-butter SIEM detection. 📈"
else:
    _feedback = f"Expected ['alice'], got {brute_force}."
`,
    hints: ["Counter over failed-login users.", "Keep users with count >= 5.", "brute_force = [u for u, n in fails.items() if n >= 5]"],
    solution: `from collections import Counter\nfails = Counter(e["user"] for e in siem.list_events() if e["type"] == "login" and e["result"] == "fail")\nbrute_force = [u for u, n in fails.items() if n >= 5]\nprint(brute_force)`,
  },
  {
    id: "l69", world: "w14", title: "Correlate the Kill Chain", xp: 160,
    story: `The real signal isn't fails OR a success — it's many fails <b>followed by</b> a success (a brute-force that worked). Correlate the two.`,
    concept: `Combine a count rule with a set membership:
<pre>success_users = {e["user"] for e in events
                 if e["type"]=="login" and e["result"]=="success"}
compromised = [u for u in success_users if fails[u] >= 5]</pre>`,
    task: `Build <code>compromised</code> — users who both had 5+ failed logins AND a successful login (expect <code>['alice']</code>).`,
    starter: `from collections import Counter\n\n# users with >=5 fails AND a later success\n`,
    check: `
if 'compromised' not in globals():
    _feedback = "Create compromised."
elif sorted(compromised) == ["alice"]:
    _passed = True; _feedback = "Correlation across events — this is what separates SIEM from grep. 🔗"
else:
    _feedback = f"Expected ['alice'], got {compromised}. (carol logged in but had no fails.)"
`,
    hints: ["Count fails per user with Counter.", "Collect the set of users with a success.", "compromised = [u for u in success_users if fails[u] >= 5]"],
    solution: `from collections import Counter\nevents = siem.list_events()\nfails = Counter(e["user"] for e in events if e["type"] == "login" and e["result"] == "fail")\nsuccess_users = {e["user"] for e in events if e["type"] == "login" and e["result"] == "success"}\ncompromised = [u for u in success_users if fails[u] >= 5]\nprint(compromised)`,
  },
  {
    id: "l70", world: "w14", title: "Signature Detection", xp: 130,
    story: `Some things are bad on sight. Match process events against a known-bad list.`,
    concept: `<code>KNOWN_BAD_PROCESSES</code> is provided by the environment (<code>mimikatz.exe</code>, <code>nc.exe</code>, <code>psexec.exe</code>).`,
    task: `Build <code>malware_hosts</code> — hosts running a process in <code>KNOWN_BAD_PROCESSES</code> (expect <code>['PC2']</code>).`,
    starter: `# find hosts running known-bad processes\n`,
    check: `
if 'malware_hosts' not in globals():
    _feedback = "Create malware_hosts."
elif sorted(malware_hosts) == ["PC2"]:
    _passed = True; _feedback = "Signature hit on mimikatz — classic credential-theft detection. 🎯"
else:
    _feedback = f"Expected ['PC2'], got {malware_hosts}."
`,
    hints: ["Filter process events whose name is in KNOWN_BAD_PROCESSES.", "malware_hosts = [e['host'] for e in siem.list_events() if e['type']=='process' and e['name'] in KNOWN_BAD_PROCESSES]"],
    solution: `malware_hosts = [e["host"] for e in siem.list_events() if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES]\nprint(malware_hosts)`,
  },
  {
    id: "l71", world: "w14", title: "Write a Detection Rule", xp: 140,
    story: `Package detection logic as a reusable rule that emits structured alerts with a severity.`,
    concept: `A rule is a function returning alert dicts:
<pre>def detect_malware(events):
    return [{"host": e["host"], "severity": "critical"}
            for e in events
            if e["type"]=="process" and e["name"] in KNOWN_BAD_PROCESSES]</pre>`,
    task: `Write <code>detect_malware(events)</code> returning a list of <code>{"host", "severity": "critical"}</code> alerts for known-bad processes. Call it into <code>alerts</code>.`,
    starter: `# define detect_malware(events); then alerts = detect_malware(siem.list_events())\n`,
    check: `
if 'detect_malware' not in globals() or not callable(detect_malware):
    _feedback = "Define detect_malware(events)."
else:
    _a = globals().get("alerts")
    if _a == [{"host": "PC2", "severity": "critical"}]:
        _passed = True; _feedback = "A reusable detection rule emitting structured alerts. 🧩"
    else:
        _feedback = f"Expected [{{'host':'PC2','severity':'critical'}}], got {_a}."
`,
    hints: ["Return a list of dicts with host + severity.", 'severity is "critical"', 'alerts = detect_malware(siem.list_events())'],
    solution: `def detect_malware(events):\n    return [{"host": e["host"], "severity": "critical"} for e in events if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES]\n\nalerts = detect_malware(siem.list_events())\nprint(alerts)`,
  },
  {
    id: "l72", world: "w14", title: "BOSS: Detection Pipeline", xp: 300,
    story: `🏆 Final boss. Run multiple detection rules over the event stream and emit a single <b>prioritized</b> alert list — exactly what a SIEM correlation engine does.`,
    concept: `Combine two rules and sort critical-first:
<pre>def run_detections(events):
    alerts = []
    # malware (critical)
    for e in events:
        if e["type"]=="process" and e["name"] in KNOWN_BAD_PROCESSES:
            alerts.append({"rule":"malware","severity":"critical","subject":e["host"]})
    # brute-force success (high)
    fails = Counter(...); success = {...}
    for u in sorted(success):
        if fails[u] >= 5:
            alerts.append({"rule":"brute_force_success","severity":"high","subject":u})
    rank = {"critical":0,"high":1,"medium":2,"low":3}
    return sorted(alerts, key=lambda a: rank[a["severity"]])</pre>`,
    task: `Write <code>run_detections(events)</code> emitting malware (critical) + brute-force-success (high) alerts, sorted critical-first. Call it into <code>alerts</code>.`,
    starter: `from collections import Counter\n\n# define run_detections(events); then alerts = run_detections(siem.list_events())\n`,
    check: `
if 'run_detections' not in globals() or not callable(run_detections):
    _feedback = "Define run_detections(events)."
else:
    _a = globals().get("alerts")
    _ok = (isinstance(_a, list) and len(_a) == 2
           and _a[0].get("severity") == "critical" and _a[0].get("rule") == "malware" and _a[0].get("subject") == "PC2"
           and _a[1].get("severity") == "high" and _a[1].get("rule") == "brute_force_success" and _a[1].get("subject") == "alice")
    if _ok:
        _passed = True; _feedback = "🏆 BOSS DEFEATED. You built a multi-rule detection pipeline with prioritized alerts — real detection engineering. You're interview-ready."
    else:
        _feedback = f"Expected a critical malware (PC2) alert first, then a high brute_force_success (alice). Got {_a}."
`,
    hints: [
      "Rule 1: malware -> {'rule':'malware','severity':'critical','subject':host}.",
      "Rule 2: users with >=5 fails AND a success -> {'rule':'brute_force_success','severity':'high','subject':user}.",
      "Sort with a severity rank dict so critical comes before high.",
    ],
    solution: `from collections import Counter\n\ndef run_detections(events):\n    alerts = []\n    for e in events:\n        if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES:\n            alerts.append({"rule": "malware", "severity": "critical", "subject": e["host"]})\n    fails = Counter(e["user"] for e in events if e["type"] == "login" and e["result"] == "fail")\n    success = {e["user"] for e in events if e["type"] == "login" and e["result"] == "success"}\n    for u in sorted(success):\n        if fails[u] >= 5:\n            alerts.append({"rule": "brute_force_success", "severity": "high", "subject": u})\n    rank = {"critical": 0, "high": 1, "medium": 2, "low": 3}\n    return sorted(alerts, key=lambda a: rank[a["severity"]])\n\nalerts = run_detections(siem.list_events())\nprint(alerts)`,
  },

  /* ================= WORLD 15: SECRETS MANAGEMENT ================= */
  {
    id: "l73", world: "w15", title: "Find Stale Secrets", xp: 120,
    story: `🔑 A secrets vault is available as <code>vault</code>. Credentials that haven't rotated in ages are a standing risk — find them.`,
    concept: `<pre>for s in vault.list_secrets():
    s["name"], s["age_days"], s["rotated"], s["revoked"]</pre>
Also: <code>vault.rotate(name)</code> (resets age to 0) and <code>vault.revoke(name)</code>.`,
    task: `Build <code>stale</code> — names of secrets older than 90 days (expect <code>['db-password', 'legacy-token']</code>).`,
    starter: `# find secrets older than 90 days\n`,
    check: `
if 'stale' not in globals():
    _feedback = "Create stale."
elif sorted(stale) == ["db-password", "legacy-token"]:
    _passed = True; _feedback = "Stale credentials surfaced — rotation candidates found. 🔑"
else:
    _feedback = f"Expected ['db-password','legacy-token'], got {stale}."
`,
    hints: ["Filter s['age_days'] > 90.", "stale = [s['name'] for s in vault.list_secrets() if s['age_days'] > 90]"],
    solution: `stale = [s["name"] for s in vault.list_secrets() if s["age_days"] > 90]\nprint(stale)`,
  },
  {
    id: "l74", world: "w15", title: "Rotate Everything Old", xp: 130,
    story: `Don't just report — rotate. Automated rotation shrinks the window a leaked key is useful.`,
    concept: `<pre>for s in vault.list_secrets():
    if s["age_days"] > 90:
        vault.rotate(s["name"])</pre>`,
    task: `Rotate every secret older than 90 days. Afterwards none should be older than 90 days.`,
    starter: `# rotate all stale secrets\n`,
    check: `
_still = [s["name"] for s in vault.list_secrets() if s["age_days"] > 90]
if not _still:
    _passed = True; _feedback = "All aged secrets rotated — blast radius minimized. 🔄"
else:
    _feedback = f"Still stale: {_still}. Loop and call vault.rotate(name) where age_days > 90."
`,
    hints: ["Loop the secrets.", "if s['age_days'] > 90: vault.rotate(s['name'])"],
    solution: `for s in vault.list_secrets():\n    if s["age_days"] > 90:\n        vault.rotate(s["name"])\nprint("rotated")`,
  },
  {
    id: "l75", world: "w15", title: "Leak Response", xp: 130,
    story: `A secret just leaked in a public repo. Rotation isn't enough — you must <b>revoke</b> it immediately so the old value is dead.`,
    concept: `<pre>vault.revoke("legacy-token")   # old value no longer valid</pre>
Assume any exposed credential is compromised: revoke, then rotate, then audit usage.`,
    task: `The secret <code>"legacy-token"</code> leaked. Revoke it (so its <code>revoked</code> flag becomes True).`,
    starter: `# revoke the leaked secret\n`,
    check: `
_s = vault._find("legacy-token") if hasattr(vault, "_find") else None
if _s is None:
    for _x in vault.list_secrets():
        if _x["name"] == "legacy-token":
            _s = _x
if _s and _s.get("revoked") is True:
    _passed = True; _feedback = "Leaked credential revoked — correct first move in leak response. 🚫"
else:
    _feedback = "legacy-token should be revoked. Use vault.revoke('legacy-token')."
`,
    hints: ["Use vault.revoke with the secret name.", "vault.revoke('legacy-token')"],
    solution: `vault.revoke("legacy-token")\nprint(vault.list_secrets())`,
  },
  {
    id: "l76", world: "w15", title: "BOSS: Secrets Hygiene", xp: 260,
    story: `🏆 Write the secrets-hygiene job: find stale secrets, rotate them all, and revoke a known-leaked one — then report what you did.`,
    concept: `<pre>def secrets_hygiene(vault, leaked):
    stale = sorted(s["name"] for s in vault.list_secrets() if s["age_days"] > 90)
    for name in stale:
        vault.rotate(name)
    vault.revoke(leaked)
    return {"rotated": stale, "revoked": leaked}</pre>`,
    task: `Write <code>secrets_hygiene(vault, leaked)</code> that rotates all 90+ day secrets and revokes <code>leaked</code>, returning <code>{"rotated": [sorted names], "revoked": leaked}</code>. Call it with <code>leaked="legacy-token"</code> into <code>report</code>.`,
    starter: `# define secrets_hygiene(vault, leaked); then report = secrets_hygiene(vault, "legacy-token")\n`,
    check: `
if 'secrets_hygiene' not in globals() or not callable(secrets_hygiene):
    _feedback = "Define secrets_hygiene(vault, leaked)."
else:
    _r = globals().get("report")
    _leaked = None
    for _x in vault.list_secrets():
        if _x["name"] == "legacy-token":
            _leaked = _x
    _no_stale = not [s for s in vault.list_secrets() if s["age_days"] > 90]
    if (isinstance(_r, dict)
            and sorted(_r.get("rotated", [])) == ["db-password", "legacy-token"]
            and _r.get("revoked") == "legacy-token"
            and _no_stale and _leaked and _leaked["revoked"] is True):
        _passed = True; _feedback = "🏆 BOSS DEFEATED. Automated secrets hygiene — rotate, revoke, report. You're interview-ready."
    else:
        _feedback = f"Rotate all 90+ day secrets, revoke the leaked one, and report both. Got {_r}."
`,
    hints: [
      "Collect stale names FIRST (age_days > 90), sorted.",
      "Rotate each, then vault.revoke(leaked).",
      'Return {"rotated": stale, "revoked": leaked}.',
    ],
    solution: `def secrets_hygiene(vault, leaked):\n    stale = sorted(s["name"] for s in vault.list_secrets() if s["age_days"] > 90)\n    for name in stale:\n        vault.rotate(name)\n    vault.revoke(leaked)\n    return {"rotated": stale, "revoked": leaked}\n\nreport = secrets_hygiene(vault, "legacy-token")\nprint(report)`,
  },

  /* ================= WORLD 16: INCIDENT RESPONSE & FORENSICS ================= */
  {
    id: "l77", world: "w16", title: "Build the Timeline", xp: 120,
    story: `🧭 First move in any investigation: order the events. A timeline turns chaos into a story.`,
    concept: `Sort by a key with <code>sorted(..., key=...)</code>:
<pre>ordered = sorted(events, key=lambda e: e["ts"])</pre>`,
    task: `From <code>siem</code> events, build <code>timeline</code> — event ids ordered by <code>ts</code> (expect <code>[1,2,3,4,5,6,7,8,9,10]</code>).`,
    starter: `# order event ids by timestamp\n`,
    check: `
if 'timeline' not in globals():
    _feedback = "Create timeline."
elif list(timeline) == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]:
    _passed = True; _feedback = "Timeline reconstructed — the backbone of every investigation. 🧭"
else:
    _feedback = f"Expected ids 1..10 ordered by ts, got {timeline}."
`,
    hints: ["Sort events by e['ts'].", "timeline = [e['id'] for e in sorted(siem.list_events(), key=lambda e: e['ts'])]"],
    solution: `timeline = [e["id"] for e in sorted(siem.list_events(), key=lambda e: e["ts"])]\nprint(timeline)`,
  },
  {
    id: "l78", world: "w16", title: "Scope the Blast Radius", xp: 130,
    story: `When a host is implicated, pull everything that happened on it to understand the scope.`,
    concept: `Filter events by host and collect the distinct users involved.`,
    task: `For compromised host <code>"PC1"</code>, build <code>pc1_users</code> — the distinct users seen in events on PC1 (expect <code>['alice']</code>).`,
    starter: `# who acted on host PC1?\n`,
    check: `
if 'pc1_users' not in globals():
    _feedback = "Create pc1_users."
elif sorted(pc1_users) == ["alice"]:
    _passed = True; _feedback = "Scoped the host to its actors — containment starts here. 🎯"
else:
    _feedback = f"Expected ['alice'], got {pc1_users}."
`,
    hints: ["Filter events where e['host']=='PC1'.", "Use a set of users to dedupe.", "pc1_users = sorted({e['user'] for e in siem.list_events() if e['host']=='PC1'})"],
    solution: `pc1_users = sorted({e["user"] for e in siem.list_events() if e["host"] == "PC1"})\nprint(pc1_users)`,
  },
  {
    id: "l79", world: "w16", title: "Extract IOCs", xp: 130,
    story: `Pull indicators of compromise from the evidence so you can hunt for them everywhere else.`,
    concept: `Indicators here are the malicious process names seen in events (matched against <code>KNOWN_BAD_PROCESSES</code>).`,
    task: `Build <code>iocs</code> — sorted distinct known-bad process names observed (expect <code>['mimikatz.exe']</code>).`,
    starter: `# extract known-bad process IOCs\n`,
    check: `
if 'iocs' not in globals():
    _feedback = "Create iocs."
elif sorted(iocs) == ["mimikatz.exe"]:
    _passed = True; _feedback = "IOCs extracted — now you can sweep the whole fleet for them. 🧬"
else:
    _feedback = f"Expected ['mimikatz.exe'], got {iocs}."
`,
    hints: ["Process events whose name is in KNOWN_BAD_PROCESSES.", "iocs = sorted({e['name'] for e in siem.list_events() if e['type']=='process' and e['name'] in KNOWN_BAD_PROCESSES})"],
    solution: `iocs = sorted({e["name"] for e in siem.list_events() if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES})\nprint(iocs)`,
  },
  {
    id: "l80", world: "w16", title: "Decide Containment", xp: 140,
    story: `Containment = which hosts to isolate right now. Pull in both malware hosts AND hosts of compromised accounts.`,
    concept: `Union two sets:
<pre>isolate = malware_hosts | compromised_login_hosts</pre>`,
    task: `Build <code>isolate</code> — sorted hosts that either ran known-bad malware OR hosted a brute-forced-then-successful login (expect <code>['PC1', 'PC2']</code>).`,
    starter: `from collections import Counter\n\n# hosts to isolate: malware hosts + compromised-login hosts\n`,
    check: `
if 'isolate' not in globals():
    _feedback = "Create isolate."
elif sorted(isolate) == ["PC1", "PC2"]:
    _passed = True; _feedback = "Containment scope set — PC2 (malware) and PC1 (compromised login). 🧱"
else:
    _feedback = f"Expected ['PC1','PC2'], got {isolate}. (PC2 ran mimikatz; alice was brute-forced then logged in on PC1.)"
`,
    hints: [
      "Malware hosts: process events in KNOWN_BAD_PROCESSES.",
      "Compromised: users with >=5 fails AND a success; take their success host.",
      "Union the two host sets and sort.",
    ],
    solution: `from collections import Counter\nevents = siem.list_events()\nmalware_hosts = {e["host"] for e in events if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES}\nfails = Counter(e["user"] for e in events if e["type"] == "login" and e["result"] == "fail")\ncompromised_hosts = {e["host"] for e in events if e["type"] == "login" and e["result"] == "success" and fails[e["user"]] >= 5}\nisolate = sorted(malware_hosts | compromised_hosts)\nprint(isolate)`,
  },
  {
    id: "l81", world: "w16", title: "BOSS: Incident Report", xp: 300,
    story: `🏆 Final boss of the whole curriculum. Produce a complete incident report: timeline length, IOCs, compromised users, and containment list — the artifact you hand to leadership.`,
    concept: `Assemble everything you've built:
<pre>def incident_report(events):
    ... timeline, iocs, compromised users, hosts to isolate ...
    return {"events": N, "iocs": [...], "compromised_users": [...], "isolate": [...]}</pre>`,
    task: `Write <code>incident_report(events)</code> returning <code>events</code> (count), <code>iocs</code> (sorted), <code>compromised_users</code> (sorted), and <code>isolate</code> (sorted hosts). Call it into <code>report</code>.`,
    starter: `from collections import Counter\n\n# define incident_report(events); then report = incident_report(siem.list_events())\n`,
    check: `
if 'incident_report' not in globals() or not callable(incident_report):
    _feedback = "Define incident_report(events)."
else:
    _r = globals().get("report")
    _ok = (isinstance(_r, dict)
           and _r.get("events") == 10
           and sorted(_r.get("iocs", [])) == ["mimikatz.exe"]
           and sorted(_r.get("compromised_users", [])) == ["alice"]
           and sorted(_r.get("isolate", [])) == ["PC1", "PC2"])
    if _ok:
        _passed = True; _feedback = "🏆 FINAL BOSS DEFEATED. A full incident report from raw events — timeline, IOCs, scope, containment. You've completed the curriculum. Go ace that interview. 🎓"
    else:
        _feedback = f"Report needs events=10, iocs=['mimikatz.exe'], compromised_users=['alice'], isolate=['PC1','PC2']. Got {_r}."
`,
    hints: [
      "Reuse your earlier pieces: IOCs, compromised users (>=5 fails + success), isolate hosts.",
      "events = len(the event list).",
      'Return a dict with keys events / iocs / compromised_users / isolate (lists sorted).',
    ],
    solution: `from collections import Counter\n\ndef incident_report(events):\n    fails = Counter(e["user"] for e in events if e["type"] == "login" and e["result"] == "fail")\n    compromised = sorted({e["user"] for e in events if e["type"] == "login" and e["result"] == "success" and fails[e["user"]] >= 5})\n    iocs = sorted({e["name"] for e in events if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES})\n    malware_hosts = {e["host"] for e in events if e["type"] == "process" and e["name"] in KNOWN_BAD_PROCESSES}\n    comp_hosts = {e["host"] for e in events if e["type"] == "login" and e["result"] == "success" and fails[e["user"]] >= 5}\n    return {"events": len(events), "iocs": iocs, "compromised_users": compromised, "isolate": sorted(malware_hosts | comp_hosts)}\n\nreport = incident_report(siem.list_events())\nprint(report)`,
  },
];
