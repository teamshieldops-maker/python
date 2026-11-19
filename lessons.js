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
];
