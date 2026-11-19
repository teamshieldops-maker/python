/* ============================================================
   NETWORK SECURITY QUEST — curriculum
   Lesson kinds:
     "quiz"     -> options[] + answer (index)
     "fill"     -> fields[] each validated against answers[]
     "firewall" -> write rules; evaluated live against flows[]
   ============================================================ */

const WORLDS = [
  { id: "w1", name: "Net Foundations",   emoji: "🌐", blurb: "OSI, TCP/UDP, ports & masks — the vocabulary." },
  { id: "w2", name: "Subnetting",        emoji: "🧮", blurb: "CIDR math: networks, broadcasts, host counts." },
  { id: "w3", name: "Firewalls & ACLs",  emoji: "🧱", blurb: "Write rules; watch packets pass or drop live." },
  { id: "w4", name: "Segmentation",      emoji: "🔀", blurb: "Zones, zero trust & least-privilege flows." },
  { id: "w5", name: "Secure Protocols",  emoji: "🔐", blurb: "TLS, VPN/IPSec, DNS security, SSH." },
  { id: "w6", name: "Threat Detection",  emoji: "🛰️", blurb: "Scans, IDS/IPS, exfiltration & response." },
  { id: "w7", name: "Boss: Secure It",   emoji: "🏆", blurb: "Design a full, locked-down enterprise network." },
];

const LESSONS = [
  /* ================= W1: FOUNDATIONS ================= */
  {
    id: "n1", world: "w1", title: "Where IP Lives", xp: 40, kind: "quiz",
    story: `Every control you design sits on the OSI model. Know where things live.`,
    concept: `The <b>OSI model</b> has 7 layers. Key ones for security:
<ul><li>L2 Data Link — MAC addresses, switches</li>
<li>L3 Network — <b>IP addresses, routers</b></li>
<li>L4 Transport — TCP/UDP, ports</li>
<li>L7 Application — HTTP, DNS, TLS</li></ul>`,
    task: `Which OSI layer do IP addresses and routing operate at?`,
    options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application)"],
    answer: 1,
    explanation: "IP addressing and routing are Layer 3 (Network). Switches/MACs are L2; ports are L4.",
    hints: ["Routers forward based on IP.", "It's the layer between Data Link and Transport."],
    solutionText: "Layer 3 (Network)",
  },
  {
    id: "n2", world: "w1", title: "TCP vs UDP", xp: 40, kind: "quiz",
    story: `Firewall rules and attacks both care which transport protocol is in play.`,
    concept: `<b>TCP</b> is connection-oriented (3-way handshake SYN/SYN-ACK/ACK, reliable, ordered). <b>UDP</b> is connectionless (fast, no handshake) — used by DNS, DHCP, VoIP.`,
    task: `Which statement is correct?`,
    options: [
      "UDP uses a 3-way handshake and guarantees delivery",
      "TCP is connectionless and stateless",
      "TCP is connection-oriented; UDP is connectionless",
      "Both TCP and UDP guarantee ordered delivery",
    ],
    answer: 2,
    explanation: "TCP sets up a connection (handshake, reliable, ordered). UDP is fire-and-forget.",
    hints: ["Which one does the SYN/SYN-ACK/ACK handshake?", "DNS uses the fast, connectionless one."],
    solutionText: "TCP is connection-oriented; UDP is connectionless",
  },
  {
    id: "n3", world: "w1", title: "Know Your Ports", xp: 60, kind: "fill",
    story: `Half of firewall work is knowing the well-known ports cold.`,
    concept: `Common ports: HTTP <b>80</b>, HTTPS <b>443</b>, SSH <b>22</b>, DNS <b>53</b>, RDP <b>3389</b>, SMTP <b>25</b>, MySQL <b>3306</b>.`,
    task: `Fill in the default port numbers.`,
    fields: [
      { id: "https", label: "HTTPS", placeholder: "number", answers: ["443"] },
      { id: "ssh", label: "SSH", placeholder: "number", answers: ["22"] },
      { id: "dns", label: "DNS", placeholder: "number", answers: ["53"] },
    ],
    hints: ["HTTPS is HTTP + TLS (443).", "SSH is 22, DNS is 53."],
    solutionText: "HTTPS=443, SSH=22, DNS=53",
  },
  {
    id: "n4", world: "w1", title: "The /24 Mask", xp: 60, kind: "fill",
    story: `CIDR prefixes map to subnet masks. Start with the everyday one.`,
    concept: `A <code>/24</code> means the first 24 bits are the network. That's 3 full octets of 1s:
<pre>/24  = 11111111.11111111.11111111.00000000 = 255.255.255.0</pre>`,
    task: `Enter the subnet mask for a /24 network (dotted decimal).`,
    fields: [{ id: "mask", label: "/24 mask", placeholder: "255.x.x.x", answers: ["255.255.255.0"] }],
    hints: ["24 bits = 3 octets of 255.", "Last octet is 0."],
    solutionText: "255.255.255.0",
  },
  {
    id: "n5", world: "w1", title: "Hosts in a /27", xp: 70, kind: "fill",
    story: `Subnet sizing decides how many devices fit — and how tight your segments are.`,
    concept: `Usable hosts = 2^(32−prefix) − 2 (subtract network + broadcast).
<pre>/27 -> 2^(32-27) - 2 = 32 - 2 = 30</pre>`,
    task: `How many usable host addresses are in a /27 subnet?`,
    fields: [{ id: "hosts", label: "usable hosts in /27", placeholder: "number", answers: ["30"] }],
    hints: ["2^(32-27) = 32 total addresses.", "Subtract 2 for network + broadcast."],
    solutionText: "30",
  },

  /* ================= W2: SUBNETTING ================= */
  {
    id: "n6", world: "w2", title: "Find the Network", xp: 80, kind: "fill",
    story: `Given any host IP and prefix, you must find its network address — the basis of every ACL.`,
    concept: `A <code>/27</code> has a block size of 32 in the last octet (networks at .0, .32, .64, .96 …). The host's network is the block it falls into.
<pre>192.168.10.37 /27  -> .37 falls in .32–.63  -> network .32</pre>`,
    task: `What is the network address of <code>192.168.10.37/27</code>?`,
    fields: [{ id: "net", label: "network address", placeholder: "x.x.x.x", answers: ["192.168.10.32"] }],
    hints: ["/27 block size = 256-224 = 32.", "Which multiple of 32 is just below 37? -> 32"],
    solutionText: "192.168.10.32",
  },
  {
    id: "n7", world: "w2", title: "Find the Broadcast", xp: 90, kind: "fill",
    story: `The broadcast address ends a subnet — and a /22 spills across octets.`,
    concept: `A <code>/22</code> borrows into the 3rd octet with a block size of 4 (0–3, 4–7 …).
<pre>10.0.0.0 /22 -> network 10.0.0.0, broadcast 10.0.3.255</pre>`,
    task: `What is the broadcast address of <code>10.0.0.0/22</code>?`,
    fields: [{ id: "bc", label: "broadcast address", placeholder: "x.x.x.x", answers: ["10.0.3.255"] }],
    hints: ["/22 block size in 3rd octet = 256-252 = 4 -> covers .0-.3", "Broadcast = last address = 10.0.3.255"],
    solutionText: "10.0.3.255",
  },
  {
    id: "n8", world: "w2", title: "First & Last Host", xp: 90, kind: "fill",
    story: `Assigning gateways and ranges means knowing the usable host boundaries.`,
    concept: `In <code>172.16.5.0/28</code> (block size 16): network .0, broadcast .15, so usable hosts are .1 … .14.`,
    task: `For <code>172.16.5.0/28</code>, give the first and last usable host.`,
    fields: [
      { id: "first", label: "first host", placeholder: "x.x.x.x", answers: ["172.16.5.1"] },
      { id: "last", label: "last host", placeholder: "x.x.x.x", answers: ["172.16.5.14"] },
    ],
    hints: ["/28 = 16 addresses (.0-.15).", "First = network+1, Last = broadcast-1."],
    solutionText: "first 172.16.5.1, last 172.16.5.14",
  },
  {
    id: "n9", world: "w2", title: "Right-Size It", xp: 100, kind: "fill",
    story: `Least privilege applies to subnets too — don't hand out a /16 for 50 hosts.`,
    concept: `Pick the <b>smallest</b> subnet that still fits the hosts:
<pre>/26 -> 62 usable   (fits 50)
/27 -> 30 usable   (too small)</pre>`,
    task: `You need to fit <b>50 hosts</b>. What is the smallest prefix (e.g. /26) that works?`,
    fields: [{ id: "prefix", label: "smallest prefix", placeholder: "/26", answers: ["/26", "26"] }],
    hints: ["/27 gives 30 (too small).", "/26 gives 62 — just enough."],
    solutionText: "/26",
  },
  {
    id: "n10", world: "w2", title: "Is It In Range?", xp: 90, kind: "quiz",
    story: `ACL troubleshooting is constant "does this IP fall in that block?" work.`,
    concept: `A <code>/26</code> has block size 64 (.0–.63, .64–.127, .128–.191, .192–.255).`,
    task: `Is <code>192.168.1.130</code> inside <code>192.168.1.128/26</code>?`,
    options: ["Yes — it's in the .128–.191 block", "No — it's in the .64–.127 block", "No — /26 doesn't cover .130", "Only if the mask is /25"],
    answer: 0,
    explanation: "/26 block size is 64, so .128/26 covers .128–.191. .130 is inside.",
    hints: ["Block size for /26 is 64.", ".128 block runs .128 to .191."],
    solutionText: "Yes — .130 is within .128–.191",
  },

  /* ================= W3: FIREWALLS & ACLS ================= */
  {
    id: "n11", world: "w3", title: "Your First Rule", xp: 90, kind: "firewall",
    story: `🧱 The simulator is live. Write firewall rules below; every run evaluates them against real traffic flows and shows pass/drop in the topology.`,
    concept: `Rule syntax — one per line:
<pre>action proto src dst [port]</pre>
<ul><li><b>action</b>: allow / deny</li>
<li><b>proto</b>: tcp / udp / icmp / any</li>
<li><b>src / dst</b>: a zone (internet, dmz, internal, db…) or any</li>
<li><b>port</b>: a number or any (optional)</li></ul>
Rules are read <b>top-down, first match wins</b>, and anything not matched is <b>denied by default</b>.`,
    task: `Let web users reach the DMZ web server: allow TCP from <code>internet</code> to <code>dmz</code> on port <code>443</code>. Everything else should stay blocked.`,
    starter: `# action proto src dst port\n# your rule here:\n`,
    flows: [
      { proto: "tcp", src: "internet", dst: "dmz", port: 443, desc: "Web user → HTTPS", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "dmz", port: 22, desc: "Internet → SSH on web", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "internal", port: 443, desc: "Internet → internal app", expect: "deny" },
    ],
    hints: ["One line: allow tcp internet dmz 443", "Default deny handles the other two for you."],
    solution: `allow tcp internet dmz 443`,
    solutionText: `allow tcp internet dmz 443`,
  },
  {
    id: "n12", world: "w3", title: "Default Deny", xp: 100, kind: "firewall",
    story: `A hardened firewall allows only what's needed and drops the rest. Open just web.`,
    concept: `List each permitted flow explicitly; the implicit default-deny blocks the rest. Don't add broad allows.`,
    task: `Allow TCP <code>internet → dmz</code> on <code>80</code> and <code>443</code> only. SSH (22) and RDP (3389) must be denied.`,
    starter: `# allow only web to the DMZ\n`,
    flows: [
      { proto: "tcp", src: "internet", dst: "dmz", port: 443, desc: "HTTPS", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "dmz", port: 80, desc: "HTTP", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "dmz", port: 22, desc: "SSH", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "dmz", port: 3389, desc: "RDP", expect: "deny" },
    ],
    hints: ["Two allow lines — one per port.", "Do NOT add 'allow ... any' — that would open 22 and 3389."],
    solution: `allow tcp internet dmz 443\nallow tcp internet dmz 80`,
    solutionText: `allow tcp internet dmz 443\nallow tcp internet dmz 80`,
  },
  {
    id: "n13", world: "w3", title: "Order Matters", xp: 120, kind: "firewall",
    story: `First match wins. A specific deny placed AFTER a broad allow never fires — a classic real-world bug. Fix the order.`,
    concept: `These rules are in the wrong order. Because the broad <code>allow</code> is first, the Telnet <code>deny</code> below it is dead. Reorder so Telnet (23) is blocked while other outbound web still works.`,
    task: `Make it so <code>internal → internet</code> is allowed, EXCEPT TCP port <code>23</code> (Telnet), which must be denied.`,
    starter: `allow tcp internal internet any\ndeny tcp internal internet 23\n`,
    flows: [
      { proto: "tcp", src: "internal", dst: "internet", port: 443, desc: "Outbound HTTPS", expect: "allow" },
      { proto: "tcp", src: "internal", dst: "internet", port: 23, desc: "Outbound Telnet", expect: "deny" },
      { proto: "tcp", src: "internal", dst: "internet", port: 80, desc: "Outbound HTTP", expect: "allow" },
    ],
    hints: ["Put the specific deny ABOVE the broad allow.", "deny tcp internal internet 23\\nallow tcp internal internet any"],
    solution: `deny tcp internal internet 23\nallow tcp internal internet any`,
    solutionText: `deny tcp internal internet 23\nallow tcp internal internet any`,
  },
  {
    id: "n14", world: "w3", title: "Outbound ≠ Inbound", xp: 120, kind: "firewall",
    story: `On a <b>stateful</b> firewall, allowing an outbound connection automatically allows its return traffic — but it does NOT let the internet start a new inbound connection.`,
    concept: `You only need to permit the connection's <i>initiating</i> direction. Return packets for established sessions are allowed automatically. Unsolicited inbound stays blocked by default.`,
    task: `Allow internal users to browse HTTPS (<code>internal → internet:443</code>). Do NOT allow the internet to initiate connections inbound to internal.`,
    starter: `# permit outbound web only\n`,
    flows: [
      { proto: "tcp", src: "internal", dst: "internet", port: 443, desc: "User browsing out", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "internal", port: 443, desc: "Internet initiating inbound", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "internal", port: 3389, desc: "Internet → RDP inbound", expect: "deny" },
    ],
    hints: ["Just one outbound allow is enough.", "allow tcp internal internet 443 — default deny blocks inbound."],
    solution: `allow tcp internal internet 443`,
    solutionText: `allow tcp internal internet 443`,
  },
  {
    id: "n15", world: "w3", title: "Egress Filtering", xp: 130, kind: "firewall",
    story: `Attackers exfiltrate and call home over odd ports. Lock down what internal hosts may send OUT.`,
    concept: `Egress (outbound) filtering limits internal → internet to only sanctioned services, choking malware C2 and data theft.`,
    task: `Allow <code>internal → internet</code> on TCP <code>443</code> and UDP <code>53</code> (DNS) only. Block SMTP (25) and IRC (6667) used for exfil/C2.`,
    starter: `# allow only sanctioned egress\n`,
    flows: [
      { proto: "tcp", src: "internal", dst: "internet", port: 443, desc: "HTTPS", expect: "allow" },
      { proto: "udp", src: "internal", dst: "internet", port: 53, desc: "DNS", expect: "allow" },
      { proto: "tcp", src: "internal", dst: "internet", port: 25, desc: "SMTP (exfil)", expect: "deny" },
      { proto: "tcp", src: "internal", dst: "internet", port: 6667, desc: "IRC C2", expect: "deny" },
    ],
    hints: ["Mind the protocol: DNS is udp.", "allow tcp internal internet 443\\nallow udp internal internet 53"],
    solution: `allow tcp internal internet 443\nallow udp internal internet 53`,
    solutionText: `allow tcp internal internet 443\nallow udp internal internet 53`,
  },

  /* ================= W4: SEGMENTATION ================= */
  {
    id: "n16", world: "w4", title: "Three-Tier Lockdown", xp: 150, kind: "firewall",
    story: `🔀 Classic web→app→db architecture. Each tier talks ONLY to its neighbour. The database must never be reachable from the internet or directly from web.`,
    concept: `Zones: <code>internet</code> → <code>dmz</code> (web) → <code>internal</code> (app) → <code>db</code> (database). Permit only the adjacent, required flows.`,
    task: `Allow: users→web (internet→dmz:443), web→app (dmz→internal:8080), app→db (internal→db:3306). Everything else (esp. internet→db, web→db) denied.`,
    starter: `# wire up the three tiers, nothing more\n`,
    flows: [
      { proto: "tcp", src: "internet", dst: "dmz", port: 443, desc: "User → Web", expect: "allow" },
      { proto: "tcp", src: "dmz", dst: "internal", port: 8080, desc: "Web → App", expect: "allow" },
      { proto: "tcp", src: "internal", dst: "db", port: 3306, desc: "App → DB", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "db", port: 3306, desc: "Internet → DB", expect: "deny" },
      { proto: "tcp", src: "dmz", dst: "db", port: 3306, desc: "Web → DB (skip app)", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "internal", port: 8080, desc: "Internet → App", expect: "deny" },
    ],
    hints: ["Exactly three allow lines, one per tier hop.", "allow tcp internet dmz 443 / allow tcp dmz internal 8080 / allow tcp internal db 3306"],
    solution: `allow tcp internet dmz 443\nallow tcp dmz internal 8080\nallow tcp internal db 3306`,
    solutionText: `allow tcp internet dmz 443\nallow tcp dmz internal 8080\nallow tcp internal db 3306`,
  },
  {
    id: "n17", world: "w4", title: "Microsegmentation", xp: 90, kind: "quiz",
    story: `Zero-trust networking pushes controls down to the workload.`,
    concept: `<b>Microsegmentation</b> enforces per-workload policy (often host/identity based), limiting <b>east-west</b> (lateral) movement inside a segment — not just at the perimeter.`,
    task: `What problem does microsegmentation primarily address?`,
    options: [
      "Encrypting data at rest on disks",
      "Lateral (east-west) movement between workloads inside the network",
      "Speeding up north-south internet throughput",
      "Replacing the need for DNS",
    ],
    answer: 1,
    explanation: "Microsegmentation limits lateral/east-west movement so a breach in one workload can't freely spread.",
    hints: ["Think about an attacker who's already inside.", "It's about traffic BETWEEN internal workloads."],
    solutionText: "Limiting lateral (east-west) movement between workloads",
  },
  {
    id: "n18", world: "w4", title: "East-West vs North-South", xp: 80, kind: "quiz",
    story: `Design conversations constantly use these two directions.`,
    concept: `<b>North-south</b> = traffic in/out of the data center (client ↔ server across the perimeter). <b>East-west</b> = traffic between internal systems (server ↔ server).`,
    task: `Traffic between an app server and a database inside your data center is best described as:`,
    options: ["North-south traffic", "East-west traffic", "Broadcast traffic", "Loopback traffic"],
    answer: 1,
    explanation: "Server-to-server traffic inside the environment is east-west.",
    hints: ["Both endpoints are internal.", "It doesn't cross the perimeter."],
    solutionText: "East-west traffic",
  },
  {
    id: "n19", world: "w4", title: "Jump-Box Only SSH", xp: 130, kind: "firewall",
    story: `Admin access should come from a hardened management zone (jump box) — never straight from the internet or the DMZ.`,
    concept: `Restrict SSH (22) to internal servers so it's permitted ONLY from the <code>mgmt</code> zone.`,
    task: `Allow SSH <code>mgmt → internal:22</code>. Deny SSH to internal from <code>internet</code> and from <code>dmz</code>.`,
    starter: `# only the jump box may SSH in\n`,
    flows: [
      { proto: "tcp", src: "mgmt", dst: "internal", port: 22, desc: "Jump box → SSH", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "internal", port: 22, desc: "Internet → SSH", expect: "deny" },
      { proto: "tcp", src: "dmz", dst: "internal", port: 22, desc: "DMZ → SSH", expect: "deny" },
    ],
    hints: ["One allow scoped to the mgmt zone.", "allow tcp mgmt internal 22"],
    solution: `allow tcp mgmt internal 22`,
    solutionText: `allow tcp mgmt internal 22`,
  },

  /* ================= W5: SECURE PROTOCOLS ================= */
  {
    id: "n20", world: "w5", title: "Encryption In Transit", xp: 80, kind: "quiz",
    story: `Protecting data on the wire is table stakes.`,
    concept: `<b>TLS</b> (used by HTTPS) provides confidentiality, integrity, and server authentication for data in transit. Plain HTTP provides none of these.`,
    task: `Which gives you confidentiality for web traffic in transit?`,
    options: ["HTTP on port 80", "TLS/HTTPS on port 443", "ICMP echo", "An ARP cache"],
    answer: 1,
    explanation: "TLS (HTTPS/443) encrypts data in transit; HTTP/80 is cleartext.",
    hints: ["Which one is encrypted?", "Port 443."],
    solutionText: "TLS/HTTPS on port 443",
  },
  {
    id: "n21", world: "w5", title: "Where IPSec Works", xp: 90, kind: "quiz",
    story: `VPNs secure site-to-site and remote access — but they operate at different layers.`,
    concept: `<b>IPSec</b> secures traffic at the <b>Network layer (L3)</b>, protecting all IP traffic in the tunnel. <b>SSL/TLS VPNs</b> work higher up (around the application/transport).`,
    task: `At which OSI layer does IPSec primarily operate?`,
    options: ["Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 5 (Session)", "Layer 7 (Application)"],
    answer: 1,
    explanation: "IPSec operates at L3, so it can protect any IP traffic transparently.",
    hints: ["The 'IP' in IPSec is a strong clue.", "Same layer as routing."],
    solutionText: "Layer 3 (Network)",
  },
  {
    id: "n22", world: "w5", title: "DNSSEC vs DoH", xp: 100, kind: "quiz",
    story: `DNS is a favourite attack surface. Two defenses solve different problems.`,
    concept: `<b>DNSSEC</b> signs DNS records to guarantee <b>authenticity/integrity</b> (anti-spoofing) — it does NOT encrypt. <b>DoH/DoT</b> encrypts DNS queries for <b>confidentiality/privacy</b>.`,
    task: `What does DNSSEC provide?`,
    options: [
      "Encryption/privacy of DNS queries",
      "Authenticity and integrity of DNS records (anti-spoofing)",
      "Faster DNS resolution via caching",
      "Load balancing across resolvers",
    ],
    answer: 1,
    explanation: "DNSSEC = signed records for integrity/authenticity. Encryption of queries is DoH/DoT.",
    hints: ["DNSSEC is about trust, not secrecy.", "It stops forged/spoofed answers."],
    solutionText: "Authenticity and integrity of DNS records",
  },
  {
    id: "n23", world: "w5", title: "VPN & Admin Ports", xp: 70, kind: "fill",
    story: `More ports to keep in muscle memory — the secure-access ones.`,
    concept: `IPSec IKE uses UDP <b>500</b> (and 4500 for NAT-T). SSH is <b>22</b>. RDP is <b>3389</b>.`,
    task: `Fill in the port numbers.`,
    fields: [
      { id: "ike", label: "IPSec IKE (UDP)", placeholder: "number", answers: ["500"] },
      { id: "ssh", label: "SSH", placeholder: "number", answers: ["22"] },
      { id: "rdp", label: "RDP", placeholder: "number", answers: ["3389"] },
    ],
    hints: ["IKE is 500.", "SSH 22, RDP 3389."],
    solutionText: "IKE=500, SSH=22, RDP=3389",
  },

  /* ================= W6: THREAT DETECTION ================= */
  {
    id: "n24", world: "w6", title: "Spot the Scan", xp: 90, kind: "quiz",
    story: `🛰️ Recon shows up in traffic patterns before the real attack.`,
    concept: `A <b>port scan</b> looks like one source hammering many destination ports (often half-open SYNs) in a short window.`,
    task: `One host sends SYN packets to ports 1–1024 on a server within two seconds. This is most likely:`,
    options: ["Normal web browsing", "A port scan (reconnaissance)", "A DNS lookup", "A TLS handshake"],
    answer: 1,
    explanation: "Many ports from one source rapidly = classic port-scan reconnaissance.",
    hints: ["Legit traffic doesn't touch 1000+ ports at once.", "It's the recon phase."],
    solutionText: "A port scan (reconnaissance)",
  },
  {
    id: "n25", world: "w6", title: "IDS vs IPS", xp: 90, kind: "quiz",
    story: `Both inspect traffic, but one can stop it.`,
    concept: `An <b>IDS</b> is passive — it monitors (often on a span/tap) and <b>alerts</b>. An <b>IPS</b> sits <b>inline</b> and can <b>block/drop</b> malicious traffic in real time.`,
    task: `Which is true?`,
    options: [
      "IDS blocks traffic inline; IPS only alerts",
      "IPS sits inline and can drop traffic; IDS passively alerts",
      "Both are passive and cannot block",
      "IDS and IPS are the same thing",
    ],
    answer: 1,
    explanation: "IPS = inline, can prevent (drop). IDS = passive, detect/alert only.",
    hints: ["The 'P' is for Prevention.", "Which one is inline?"],
    solutionText: "IPS sits inline and can drop; IDS passively alerts",
  },
  {
    id: "n26", world: "w6", title: "Find the Exfil", xp: 110, kind: "quiz",
    story: `Data theft hides in the flow logs. Pick it out.`,
    concept: `Exfiltration often = a large <b>outbound</b> transfer from an internal host to an <b>unusual destination/port</b>, off-hours, far bigger than normal.`,
    task: `Which flow most likely indicates data exfiltration?`,
    options: [
      "internal → internet:443, 12 KB, business hours",
      "internal → internet:53, 400 bytes DNS query",
      "internal → 185.x.x.x:4444, 2.5 GB upload at 3am",
      "internet → dmz:443, inbound web request",
    ],
    answer: 2,
    explanation: "A huge off-hours upload to an odd IP/port (4444) screams exfiltration/C2.",
    hints: ["Look for large OUTBOUND volume.", "Odd port + odd time + big size."],
    solutionText: "internal → 185.x.x.x:4444, 2.5 GB upload at 3am",
  },
  {
    id: "n27", world: "w6", title: "Block the Attacker", xp: 130, kind: "firewall",
    story: `You've identified a hostile source zone. Block it at the top while keeping the web service open to everyone else — order is everything.`,
    concept: `A <b>deny must come before</b> a broad allow, or the allow will let the attacker through first.`,
    task: `Keep <code>internet</code> and <code>partner</code> able to reach <code>dmz:443</code>, but block the <code>attacker</code> zone from the DMZ entirely.`,
    starter: `# block the bad zone first, then allow web\nallow tcp any dmz 443\ndeny tcp attacker dmz any\n`,
    flows: [
      { proto: "tcp", src: "internet", dst: "dmz", port: 443, desc: "Public user → Web", expect: "allow" },
      { proto: "tcp", src: "partner", dst: "dmz", port: 443, desc: "Partner → Web", expect: "allow" },
      { proto: "tcp", src: "attacker", dst: "dmz", port: 443, desc: "Attacker → Web", expect: "deny" },
    ],
    hints: ["Put the deny ABOVE the broad allow.", "deny tcp attacker dmz any\\nallow tcp any dmz 443"],
    solution: `deny tcp attacker dmz any\nallow tcp any dmz 443`,
    solutionText: `deny tcp attacker dmz any\nallow tcp any dmz 443`,
  },

  /* ================= W7: BOSS ================= */
  {
    id: "n28", world: "w7", title: "BOSS: Secure the Enterprise", xp: 300, kind: "firewall",
    story: `🏆 Final boss. You're handed a full enterprise: internet, DMZ (web), internal (app), db, and a mgmt jump box. Write one ruleset that permits every required flow and denies everything dangerous. The topology below must go all-green.`,
    concept: `Required (allow): users→web (internet→dmz:443, :80), web→app (dmz→internal:8080), app→db (internal→db:3306), jump box→app SSH (mgmt→internal:22), jump box→web SSH (mgmt→dmz:22), and outbound updates (internal→internet:443).
Must be denied: internet→db, internet→app, web→db direct, internet→mgmt.`,
    task: `Write the full ruleset so all 11 flows below match their expected verdict.`,
    starter: `# Build the enterprise policy (default-deny does the blocking).\n# allow proto src dst port — one per required flow\n`,
    flows: [
      { proto: "tcp", src: "internet", dst: "dmz", port: 443, desc: "User → Web HTTPS", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "dmz", port: 80, desc: "User → Web HTTP", expect: "allow" },
      { proto: "tcp", src: "dmz", dst: "internal", port: 8080, desc: "Web → App", expect: "allow" },
      { proto: "tcp", src: "internal", dst: "db", port: 3306, desc: "App → DB", expect: "allow" },
      { proto: "tcp", src: "mgmt", dst: "internal", port: 22, desc: "Jump box → App SSH", expect: "allow" },
      { proto: "tcp", src: "mgmt", dst: "dmz", port: 22, desc: "Jump box → Web SSH", expect: "allow" },
      { proto: "tcp", src: "internal", dst: "internet", port: 443, desc: "App → Updates", expect: "allow" },
      { proto: "tcp", src: "internet", dst: "db", port: 3306, desc: "Internet → DB", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "internal", port: 8080, desc: "Internet → App", expect: "deny" },
      { proto: "tcp", src: "dmz", dst: "db", port: 3306, desc: "Web → DB (bypass app)", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "mgmt", port: 22, desc: "Internet → Jump box", expect: "deny" },
    ],
    hints: [
      "Seven allow lines, one per required flow. Default-deny blocks the four dangerous ones.",
      "Don't use broad 'any' dst — be specific so internet→db stays blocked.",
      "allow tcp internet dmz 443 / allow tcp internet dmz 80 / allow tcp dmz internal 8080 / allow tcp internal db 3306 / allow tcp mgmt internal 22 / allow tcp mgmt dmz 22 / allow tcp internal internet 443",
    ],
    solution: `allow tcp internet dmz 443
allow tcp internet dmz 80
allow tcp dmz internal 8080
allow tcp internal db 3306
allow tcp mgmt internal 22
allow tcp mgmt dmz 22
allow tcp internal internet 443`,
    solutionText: `allow tcp internet dmz 443
allow tcp internet dmz 80
allow tcp dmz internal 8080
allow tcp internal db 3306
allow tcp mgmt internal 22
allow tcp mgmt dmz 22
allow tcp internal internet 443`,
  },
];
