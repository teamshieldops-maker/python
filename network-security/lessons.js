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
  { id: "w8", name: "WAF & AppSec",      emoji: "🧯", blurb: "Layer-7 defense: block SQLi, XSS & path traversal live." },
  { id: "w9", name: "API Security",      emoji: "🔑", blurb: "AuthN/Z, RBAC, JWT & the OWASP API Top 10." },
  { id: "w10", name: "CI/CD & Supply Chain", emoji: "⚙️", blurb: "Secrets, SAST/DAST/SCA, signing & pipeline hardening." },
  { id: "w11", name: "Advanced Networking", emoji: "🛰️", blurb: "mTLS, DDoS, cloud NSG/NACL & DNS tunneling." },
  { id: "w12", name: "Cloud Security",   emoji: "☁️", blurb: "IAM least privilege, S3/bucket exposure, KMS & SSRF." },
  { id: "w13", name: "Container & K8s",  emoji: "🐳", blurb: "NetworkPolicies, pod security, RBAC & admission control." },
  { id: "w14", name: "Detection Eng",   emoji: "🚨", blurb: "SIEM, MITRE ATT&CK, Sigma, UEBA & SOAR." },
  { id: "w15", name: "Secrets Mgmt",    emoji: "🔑", blurb: "Vaults, rotation, dynamic secrets & leak response." },
  { id: "w16", name: "Incident Response", emoji: "🧭", blurb: "NIST lifecycle, forensics, chain of custody & metrics." },
  { id: "w17", name: "IAM & KMS",       emoji: "🔐", blurb: "Roles, SCPs/boundaries, key rotation & key policies." },
  { id: "w18", name: "Threat Modeling", emoji: "🧩", blurb: "STRIDE, trust boundaries, secure defaults & defense in depth." },
  { id: "w19", name: "Web Exploitation", emoji: "🕷️", blurb: "CSRF, IDOR, open redirect, clickjacking & headers." },
  { id: "w20", name: "Compliance",      emoji: "📋", blurb: "SOC 2, ISO 27001, GDPR, PCI DSS & governance." },
];

const LESSONS = [
  /* ================= W1: FOUNDATIONS ================= */
  {
    id: "n1", world: "w1", title: "Where IP Lives", xp: 40, kind: "quiz",
    story: `Every control you design sits on the OSI model. Know where things live.`,
    deepDive: `The OSI model breaks networking into 7 layers so you can reason about where a protocol, a problem, or a <i>control</i> belongs.
<pre>L7 Application  — HTTP, DNS, TLS, SMTP      (data an app understands)
L6 Presentation — encoding, encryption format
L5 Session      — sessions/connections state
L4 Transport    — TCP / UDP, PORTS           (segments)
L3 Network      — IP addresses, ROUTING      (packets)
L2 Data Link    — MAC addresses, switches     (frames)
L1 Physical     — cables, radio, bits</pre>
<p>Data is <b>encapsulated</b> top→down as it's sent (each layer wraps the one above with its own header) and <b>de-encapsulated</b> bottom→up as it's received. A security control can only act on the layers it can see: a plain packet filter sees L3/L4 (IPs and ports); a WAF parses L7 (the actual HTTP request).</p>`,
    examples: [
      `<b>Trace a request to https://bank.com:</b> L7 builds the HTTP request and wraps it in TLS → L4 TCP splits it into segments addressed to port 443 → L3 stamps source/destination IPs and routes it → L2 frames it with the next-hop MAC at each hop → L1 is the bits on the wire.`,
      `<b>Where controls live:</b> switch = L2 · router / IP ACL / IPsec = L3 · stateful firewall & port rules = L4 · WAF / reverse proxy / API gateway = L7.`,
    ],
    pitfalls: [
      `Confusing <b>MAC</b> (L2, only meaningful on the local segment) with <b>IP</b> (L3, routable across networks).`,
      `Calling a port a "layer 3 thing" — ports are <b>L4</b> (TCP/UDP).`,
      `Thinking TLS is its own numbered layer; it sits around L6/L7 and rides on top of TCP.`,
    ],
    why: `OSI is the most common networking interview opener. The real skill is <i>mapping</i>: given an attack or a control, say which layer it operates at (e.g., "a SYN flood is L4", "XSS is L7", "ARP spoofing is L2"). That shows you reason about defenses systematically instead of memorizing tools.`,
    keyPoints: [
      "L2 = MAC/switch, L3 = IP/router, L4 = TCP-UDP/ports, L7 = app (HTTP/DNS/TLS).",
      "Encapsulation adds headers going down the stack; the receiver strips them going up.",
      "A control only sees the layers it can inspect — pick the layer that matches the threat.",
    ],
    references: [
      { title: "Cloudflare — What is the OSI model?", url: "https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/" },
      { title: "Wikipedia — OSI model", url: "https://en.wikipedia.org/wiki/OSI_model" },
    ],
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
    deepDive: `<b>TCP</b> and <b>UDP</b> are the two L4 transport protocols; everything above them (HTTP, DNS, etc.) rides on one of them.
<p><b>TCP</b> is connection-oriented: it opens a session with the <b>3-way handshake</b> (SYN → SYN-ACK → ACK), then guarantees <i>reliable, ordered, error-checked</i> delivery with sequence numbers, acknowledgements, and retransmission. Cost: more overhead and round-trips. Used by HTTP(S), SSH, SMTP, databases.</p>
<p><b>UDP</b> is connectionless: no handshake, no ordering, no delivery guarantee — just fire datagrams and go. Cost: the app must handle loss. Benefit: fast and low-overhead. Used by DNS, DHCP, NTP, VoIP, and QUIC/HTTP3.</p>`,
    examples: [
      `<b>TCP handshake:</b> client sends <code>SYN</code> → server replies <code>SYN-ACK</code> → client sends <code>ACK</code>. Only then does data flow. A half-open flood of SYNs with no final ACK is a classic <b>SYN flood</b> DoS.`,
      `<b>DNS uses both:</b> normal lookups go over UDP/53 (small, fast); large responses or zone transfers fall back to TCP/53.`,
    ],
    pitfalls: [
      `Thinking UDP is "insecure" by nature — it isn't; but being connectionless makes <b>source-IP spoofing</b> and <b>amplification</b> (DNS/NTP reflection) easier.`,
      `Forgetting that scanning differs: TCP scans watch for SYN-ACK; UDP scans are slower and ambiguous (no handshake to confirm).`,
      `Assuming a protocol's port implies its transport — always specify tcp vs udp in firewall rules.`,
    ],
    why: `Firewall rules, DDoS categories, and port scans all branch on TCP vs UDP. Interviewers love "walk me through the TCP handshake" and "why is UDP used for DNS?" — crisp answers signal real fundamentals.`,
    keyPoints: [
      "TCP = connection-oriented, reliable, ordered (handshake first). UDP = connectionless, fast, best-effort.",
      "TCP: HTTP(S), SSH, SMTP, DBs. UDP: DNS, DHCP, NTP, VoIP, QUIC.",
      "UDP's statelessness enables spoofing & amplification attacks.",
    ],
    references: [
      { title: "Cloudflare — TCP/IP", url: "https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/" },
      { title: "Cloudflare — UDP", url: "https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/" },
    ],
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
    deepDive: `A <b>port</b> is a 16-bit number (0–65535) at L4 that identifies which service a packet is for. The OS multiplexes many connections using the 5-tuple: <code>(src IP, src port, dst IP, dst port, protocol)</code>.
<p>Port ranges:</p>
<pre>0–1023      Well-known  (HTTP 80, HTTPS 443, SSH 22, DNS 53 …)
1024–49151  Registered  (app-assigned, e.g. MySQL 3306, RDP 3389)
49152–65535 Ephemeral   (temporary client-side source ports)</pre>
<p>When your laptop connects to a web server, the destination port is 443 but your <i>source</i> port is a random ephemeral one — that's how the OS tells concurrent connections apart.</p>`,
    examples: [
      `<b>Common ports to memorize:</b> 20/21 FTP · 22 SSH · 23 Telnet · 25 SMTP · 53 DNS · 80 HTTP · 110 POP3 · 143 IMAP · 389 LDAP · 443 HTTPS · 445 SMB · 3306 MySQL · 3389 RDP · 5432 Postgres.`,
      `<b>Same number, different transport:</b> DNS listens on <code>udp/53</code> and <code>tcp/53</code> — they're distinct rules on a firewall.`,
    ],
    pitfalls: [
      `Assuming an open port proves the service — attackers run SSH on 443 or malware C2 on 53 to blend in. Verify with the actual protocol, not just the number.`,
      `Writing ACLs by port alone; pair with source/destination and protocol for real control.`,
      `Forgetting ephemeral return ports when using a <b>stateless</b> ACL (you must allow them explicitly).`,
    ],
    why: `Every firewall rule, scan result, and traffic log is read through ports. Interviewers rapid-fire "what port is X?" — knowing the top ~15 cold is table stakes.`,
    keyPoints: [
      "Port = 16-bit L4 service identifier; connections are tracked by the 5-tuple.",
      "0–1023 well-known, 1024–49151 registered, 49152+ ephemeral.",
      "An open port ≠ a trusted/known service — confirm the protocol.",
    ],
    references: [
      { title: "IANA — Service Name and Port Number Registry", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" },
      { title: "Wikipedia — List of TCP and UDP port numbers", url: "https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers" },
    ],
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
    deepDive: `An IPv4 address is 32 bits, written as four 8-bit <b>octets</b>. The <b>prefix</b> (the <code>/N</code> in CIDR) says how many leading bits are the <i>network</i> portion; the rest identify <i>hosts</i>. The subnet <b>mask</b> is just those network bits written as 1s.
<pre>/24 = 11111111.11111111.11111111.00000000 = 255.255.255.0
/25 = 11111111.11111111.11111111.10000000 = 255.255.255.128
/26 = ...11000000 = 255.255.255.192
/27 = ...11100000 = 255.255.255.224</pre>
<p>Each extra bit in the mask <b>halves</b> the subnet (and doubles the number of subnets). The last non-zero octet value is <code>256 − block size</code>.</p>`,
    examples: [
      `<b>Prefix → mask quick table:</b> /8 = 255.0.0.0 · /16 = 255.255.0.0 · /24 = 255.255.255.0 · /26 = 255.255.255.192 · /30 = 255.255.255.252.`,
      `<b>Why /24 is everyday:</b> it's exactly 3 octets of network + 1 octet of host = 256 addresses (254 usable) — a tidy "one office LAN" size.`,
    ],
    pitfalls: [
      `Mixing up the <b>mask</b> (which bits are network) with the <b>network address</b> (the first address of the block).`,
      `Off-by-one on the last octet: /25 is .128 not .127, /26 is .192 not .191.`,
      `Assuming bigger prefix = bigger subnet — it's the opposite (/24 is far larger than /30).`,
    ],
    why: `Masks underlie every ACL, route, and segmentation decision. "Convert /26 to a mask" and "how many subnets does borrowing 2 bits create?" are standard interview warm-ups.`,
    keyPoints: [
      "Prefix = count of network bits; mask = those bits as 1s.",
      "Each +1 to the prefix halves the subnet size.",
      "Last octet value = 256 − block size (e.g. /27 → 256−32 = 224).",
    ],
    references: [
      { title: "Wikipedia — CIDR", url: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" },
      { title: "RFC 1918 — Private address space", url: "https://datatracker.ietf.org/doc/html/rfc1918" },
    ],
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
    deepDive: `Every subnet reserves two addresses that can't be assigned to hosts: the <b>network address</b> (all host bits 0) and the <b>broadcast address</b> (all host bits 1). So:
<pre>usable hosts = 2^(32 − prefix) − 2</pre>
<p>The exponent is the number of <i>host</i> bits. Two special cases (RFC 3021 / routing): a <code>/31</code> gives 2 usable addresses (point-to-point links, no broadcast needed) and a <code>/32</code> is a single host (a loopback or one-address route).</p>`,
    examples: [
      `<b>Sizing table:</b> /24 → 254 · /25 → 126 · /26 → 62 · /27 → 30 · /28 → 14 · /29 → 6 · /30 → 2 usable.`,
      `<b>Right-sizing:</b> need 50 hosts? /26 (62) fits with headroom; /27 (30) is too small. Picking the smallest that fits is "least exposure" for address space.`,
    ],
    pitfalls: [
      `Forgetting the <b>−2</b> for network + broadcast (a /27 has 32 addresses but only 30 usable).`,
      `Applying −2 to a <b>/31</b> — point-to-point links use both addresses (RFC 3021).`,
      `Confusing "total addresses" with "usable hosts" in capacity planning.`,
    ],
    why: `Subnet sizing shows up in network design questions and in security (smaller segments = tighter blast radius, cleaner ACLs). "How many hosts in a /27?" is a guaranteed subnetting question.`,
    keyPoints: [
      "usable hosts = 2^(32 − prefix) − 2.",
      "Network and broadcast addresses are always reserved.",
      "/31 = 2 (point-to-point), /32 = single host are the exceptions.",
    ],
    references: [
      { title: "RFC 3021 — Using /31 on point-to-point links", url: "https://datatracker.ietf.org/doc/html/rfc3021" },
      { title: "Wikipedia — Subnetwork", url: "https://en.wikipedia.org/wiki/Subnetwork" },
    ],
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
    deepDive: `The <b>network address</b> is the first address of the block a host belongs to. The fast method (no binary needed):
<ol>
<li>Find the <b>block size</b> = 256 − (the mask octet). For /27 the mask is 255.255.255.<b>224</b>, so block size = 256 − 224 = <b>32</b>.</li>
<li>Find the "interesting octet" (the one the prefix lands in). For /27 that's the 4th octet.</li>
<li>The network is the largest multiple of the block size that is ≤ the host's value in that octet.</li>
</ol>
<p>Formally it's a bitwise <b>AND</b> of the IP and the mask, but the block-size trick is what people use under interview pressure.</p>`,
    examples: [
      `<b>192.168.10.37 /27:</b> block size 32 → multiples are .0, .32, .64, .96. 37 falls in the .32–.63 block → <b>network 192.168.10.32</b>, broadcast .63.`,
      `<b>10.0.0.0 /22:</b> the prefix lands in the 3rd octet; block size there = 256 − 252 = 4 → blocks .0–.3, .4–.7 … → network <b>10.0.0.0</b>, broadcast 10.0.3.255.`,
      `<b>172.16.5.0 /28:</b> block size 16 → .0, .16, .32 … → network <b>172.16.5.0</b>, hosts .1–.14, broadcast .15.`,
    ],
    pitfalls: [
      `Working in the wrong octet — a /22 affects the 3rd octet, not the 4th.`,
      `Rounding up instead of down: the network is the multiple <i>at or below</i> the host value.`,
      `Forgetting that the host IP itself is usually inside the block, not the network address.`,
    ],
    why: `Finding the network address is the atomic skill behind writing ACLs, defining routes, and troubleshooting "why can't these two hosts talk?" It appears in nearly every subnetting interview.`,
    keyPoints: [
      "block size = 256 − mask octet.",
      "Network = largest multiple of the block size ≤ host's value in the interesting octet.",
      "Broadcast = next block boundary − 1; it's the mask AND the IP, done fast.",
    ],
    references: [
      { title: "Wikipedia — CIDR (network/broadcast)", url: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" },
      { title: "Cloudflare — What is a subnet?", url: "https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" },
    ],
    concept: `A <code>/27</code> has a block size of 32 in the last octet (networks at .0, .32, .64, .96 …). The host's network is the block it falls into.
<pre>192.168.10.37 /27  -> .37 falls in .32–.63  -> network .32</pre>`,
    task: `What is the network address of <code>192.168.10.37/27</code>?`,
    fields: [{ id: "net", label: "network address", placeholder: "x.x.x.x", answers: ["192.168.10.32"] }],
    hints: ["/27 block size = 256-224 = 32.", "Which multiple of 32 is just below 37? -> 32"],
    solutionText: "192.168.10.32",
  },
  {
    id: "n7", world: "w2", title: "Find the Broadcast", xp: 90, kind: "fill",
    deepDive: `The <b>broadcast address</b> is the last address of a subnet (all host bits set to 1) — traffic to it reaches every host in the subnet. Fast method:
<ol>
<li>Find the block size = 256 − mask octet. For <code>/22</code> the mask is 255.255.<b>252</b>.0 → block size = 256 − 252 = <b>4</b> in the 3rd octet.</li>
<li>The network starts at a multiple of the block size; the broadcast is <b>one less than the next</b> block boundary.</li>
</ol>
<pre>10.0.0.0 /22 -> 3rd-octet blocks 0-3, 4-7 ... -> network 10.0.0.0, broadcast 10.0.3.255</pre>`,
    examples: [
      `<b>10.0.0.0/22:</b> covers 10.0.0.0 – 10.0.3.255; broadcast = 10.0.3.255.`,
      `<b>192.168.1.0/26:</b> block size 64 → broadcast 192.168.1.63.`,
    ],
    pitfalls: [
      `For prefixes like /22, the "interesting octet" is the 3rd, not the 4th — work in the right octet.`,
      `Broadcast is the last address of <i>this</i> block, i.e. next-boundary − 1, not the next network.`,
      `/31 and /32 have no usable broadcast in the normal sense (point-to-point / single host).`,
    ],
    why: `Broadcast boundaries define where a subnet ends — essential for ACLs, DHCP scopes, and spotting overlaps. It's a guaranteed subnetting interview item.`,
    keyPoints: [
      "Broadcast = all host bits 1 = last address of the block.",
      "block size = 256 − mask octet; broadcast = next boundary − 1.",
      "Work in the octet the prefix lands in.",
    ],
    references: [
      { title: "Cloudflare — What is a subnet?", url: "https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" },
      { title: "Wikipedia — Broadcast address", url: "https://en.wikipedia.org/wiki/Broadcast_address" },
    ],
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
    deepDive: `Usable host range sits <i>between</i> the reserved network and broadcast addresses:
<pre>first host = network + 1
last host  = broadcast − 1</pre>
<p>For <code>172.16.5.0/28</code> (block size 16): network .0, broadcast .15 → usable hosts .1 through .14.</p>`,
    examples: [
      `<b>172.16.5.0/28:</b> first 172.16.5.1, last 172.16.5.14 (14 usable).`,
      `<b>Gateway convention:</b> teams often assign the first (.1) or last usable address to the router.`,
    ],
    pitfalls: [
      `Don't hand out the network or broadcast address to a host — they're reserved.`,
      `/31 is the exception (RFC 3021): both addresses are usable for point-to-point links.`,
      `Off-by-one: first = network+1, last = broadcast−1 (not network/broadcast themselves).`,
    ],
    why: `Assigning gateways, static IPs, and DHCP ranges all require the usable host boundaries. It's a staple of subnetting questions.`,
    keyPoints: [
      "Usable range = network+1 … broadcast−1.",
      "Network and broadcast are reserved (except /31).",
      "Gateways conventionally take the first or last usable IP.",
    ],
    references: [
      { title: "Wikipedia — Subnetwork", url: "https://en.wikipedia.org/wiki/Subnetwork" },
      { title: "RFC 3021 — /31 point-to-point", url: "https://datatracker.ietf.org/doc/html/rfc3021" },
    ],
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
    deepDive: `Pick the <b>smallest</b> subnet that still fits the hosts you need (plus modest growth). Work the host formula backward:
<pre>usable = 2^(32−prefix) − 2
need 50 -> /26 gives 62 (fits), /27 gives 30 (too small)</pre>
<p>Right-sizing is "least privilege" for address space: oversized subnets waste addresses and enlarge a segment's blast radius; undersized ones force painful renumbering.</p>`,
    examples: [
      `<b>50 hosts → /26</b> (62 usable, a little headroom).`,
      `<b>Sizing table:</b> /29→6, /28→14, /27→30, /26→62, /25→126, /24→254.`,
    ],
    pitfalls: [
      `Forgetting the −2 (network+broadcast) when checking if a prefix fits.`,
      `No growth headroom forces re-subnetting later; too much waste bloats segments.`,
      `Smaller prefix number = larger subnet — easy to invert under pressure.`,
    ],
    why: `VLSM / right-sizing is core network design and a frequent "what's the smallest subnet for N hosts?" question. It also ties to segmentation (smaller = tighter blast radius).`,
    keyPoints: [
      "Smallest prefix where 2^(32−prefix)−2 ≥ needed hosts.",
      "Leave modest growth headroom; avoid gross waste.",
      "Right-sizing = least privilege for address space.",
    ],
    references: [
      { title: "Wikipedia — VLSM", url: "https://en.wikipedia.org/wiki/Variable-length_subnet_masking" },
      { title: "Cloudflare — What is a subnet?", url: "https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/" },
    ],
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
    deepDive: `"Does IP X fall in subnet Y?" is constant ACL/troubleshooting work. Find the block the subnet starts at and whether X lands inside it:
<pre>/26 -> block size 64 -> blocks .0-.63, .64-.127, .128-.191, .192-.255
192.168.1.128/26 covers .128 - .191  -> is .130 inside? yes</pre>
<p>Formally it's <code>(IP AND mask) == (network AND mask)</code>; the block-size method is the fast mental version.</p>`,
    examples: [
      `<b>192.168.1.130 in 192.168.1.128/26?</b> block .128–.191 → yes.`,
      `<b>192.168.1.200 in 192.168.1.128/26?</b> .200 is in the .192–.255 block → no.`,
    ],
    pitfalls: [
      `Using the wrong block size (mis-reading the prefix) puts the boundaries in the wrong place.`,
      `Boundary values: .128 and .191 are in the block; .127 and .192 are not.`,
      `Overlapping/typo'd subnets cause silent routing/ACL bugs — double-check boundaries.`,
    ],
    why: `Determining membership underlies writing ACLs, debugging "why can't these talk?", and spotting subnet overlaps — a daily network/security task.`,
    keyPoints: [
      "Membership = IP falls within the subnet's block.",
      "Compute block size, find the block, check boundaries.",
      "Equivalent to (IP AND mask) == network.",
    ],
    references: [
      { title: "Wikipedia — CIDR", url: "https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" },
      { title: "RFC 4632 — CIDR", url: "https://datatracker.ietf.org/doc/html/rfc4632" },
    ],
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
    deepDive: `A firewall rule (ACL entry) matches traffic by <b>action, protocol, source, destination, and port</b>, and either permits or drops it. Rules are evaluated <b>top-down, first match wins</b>, and anything unmatched hits the implicit <b>default deny</b>.
<pre>allow tcp internet dmz 443   # let the world reach the web server on HTTPS
# everything else -> dropped by default deny</pre>
<p>This is a stateless packet-filter view; a stateful firewall additionally tracks connections (next lessons).</p>`,
    examples: [
      `<b>Permit web:</b> one rule allows internet→dmz:443; SSH (22) and internal access stay blocked by default.`,
      `<b>Real syntax parallels:</b> AWS security group inbound rule, iptables <code>-A</code>, Cisco <code>permit tcp ... eq 443</code>.`,
    ],
    pitfalls: [
      `Being too broad (allowing a whole zone or <code>any</code> port) opens far more than intended — be specific.`,
      `Forgetting that the default is deny — you only need to permit what's required.`,
      `Order matters once you have several rules (covered next).`,
    ],
    why: `Writing precise allow rules over an implicit default-deny is the foundation of every firewall/ACL/security-group. Interviewers expect "default deny, permit only what's needed".`,
    keyPoints: [
      "Rules match action/proto/src/dst/port; first match wins.",
      "Default deny — explicitly permit only what's needed.",
      "Be specific: avoid broad zone/any-port allows.",
    ],
    references: [
      { title: "AWS — Security groups", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html" },
      { title: "NIST SP 800-41r1 — Firewalls", url: "https://csrc.nist.gov/pubs/sp/800/41/r1/final" },
    ],
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
    deepDive: `<b>Default deny</b> (allowlist) is the single most important firewall principle: block everything, then permit only the specific flows the business needs. The opposite (default allow + blocklist) is a losing game — you can't enumerate every bad thing.
<pre>allow tcp internet dmz 80
allow tcp internet dmz 443
# NO broad allow -> 22, 3389, everything else is denied</pre>`,
    examples: [
      `<b>Open only web:</b> permit 80 and 443 to the DMZ; SSH/RDP and all else are implicitly dropped.`,
      `<b>Positive security model:</b> same idea as a WAF allowlist or zero-trust "never trust, verify explicitly".`,
    ],
    pitfalls: [
      `Adding a broad "allow any" to "make it work" silently reopens everything — never do this to debug.`,
      `Missing a legitimately-needed flow breaks the app; enumerate required flows carefully.`,
      `Leaving temporary permit rules in place after troubleshooting.`,
    ],
    why: `"Default deny vs default allow" is a fundamental security-design question. Allowlisting is the expected, defensible answer across firewalls, WAFs, and zero trust.`,
    keyPoints: [
      "Default deny + explicit allowlist of required flows.",
      "You can't blocklist every bad thing — allowlist the good.",
      "Never add broad 'allow any' to force things to work.",
    ],
    references: [
      { title: "NIST — Zero Trust Architecture (SP 800-207)", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { title: "OWASP — Positive security model", url: "https://owasp.org/www-community/Positive_security_model" },
    ],
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
    deepDive: `Because evaluation is <b>first match wins</b>, rule order changes behavior. A specific <code>deny</code> placed <i>after</i> a broad <code>allow</code> never fires — the allow already matched.
<pre># WRONG: telnet is allowed because the broad allow matches first
allow tcp internal internet any
deny  tcp internal internet 23

# RIGHT: specific deny first
deny  tcp internal internet 23
allow tcp internal internet any</pre>`,
    examples: [
      `<b>Exceptions before generals:</b> put narrow deny/allow rules above broad ones.`,
      `<b>Real impact:</b> misordered ACLs are a top cause of "the rule exists but traffic still passes/blocks".`,
    ],
    pitfalls: [
      `A shadowed rule (unreachable because an earlier rule always matches) is a silent misconfiguration.`,
      `Appending new rules to the bottom can place them after a catch-all — check position, not just existence.`,
      `Large ACLs drift into shadowing over time; audit with analyzers.`,
    ],
    why: `Rule ordering/shadowing is a classic real-world firewall bug and a favorite interview gotcha. "First match wins, so specific-before-broad" is the key insight.`,
    keyPoints: [
      "First match wins — order is behavior.",
      "Place specific exceptions above broad rules.",
      "Watch for shadowed (unreachable) rules.",
    ],
    references: [
      { title: "Cisco — ACL order of operations", url: "https://www.cisco.com/c/en/us/support/docs/security/ios-firewall/23602-confaccesslists.html" },
      { title: "NIST SP 800-41r1 — Firewall policy", url: "https://csrc.nist.gov/pubs/sp/800/41/r1/final" },
    ],
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
    deepDive: `A <b>stateful</b> firewall tracks connections in a state table. When an internal host <i>initiates</i> an outbound connection, the firewall automatically permits the <b>return</b> traffic for that established session — you do <b>not</b> open an inbound rule for it.
<pre>allow tcp internal internet 443   # outbound web; replies auto-allowed
# the internet still CANNOT initiate inbound to internal (default deny)</pre>
<p>This is why a stateful firewall needs only the initiating-direction rule; unsolicited inbound stays blocked.</p>`,
    examples: [
      `<b>Browsing works, inbound doesn't:</b> internal→internet:443 allowed; internet→internal:anything stays denied.`,
      `<b>Contrast NACLs:</b> stateless filters (AWS NACLs) require you to allow the return/ephemeral ports explicitly.`,
    ],
    pitfalls: [
      `Confusing stateful with stateless — on a stateless ACL you MUST add return-traffic rules (ephemeral ports).`,
      `Opening an inbound rule "so replies work" on a stateful firewall needlessly exposes the host.`,
      `Allowing broad outbound can still enable exfil/C2 — pair with egress filtering (next lesson).`,
    ],
    why: `Stateful vs stateless and "why don't I need an inbound rule for replies?" are standard firewall interview questions. Understanding the state table is the differentiator.`,
    keyPoints: [
      "Stateful firewalls auto-allow established return traffic.",
      "Only permit the initiating direction; inbound stays denied.",
      "Stateless ACLs need explicit return-traffic rules.",
    ],
    references: [
      { title: "Cloudflare — Stateful vs stateless firewall", url: "https://www.cloudflare.com/learning/security/what-is-stateful-inspection/" },
      { title: "AWS — Security groups (stateful) vs NACLs (stateless)", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" },
    ],
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
    deepDive: `Most firewalls lock down inbound but leave <b>outbound</b> wide open — a gift to malware, which needs egress for <b>C2</b> and <b>data exfiltration</b>. Egress filtering allowlists only sanctioned outbound services.
<pre>allow tcp internal internet 443   # HTTPS
allow udp internal internet 53    # DNS
# SMTP(25), IRC(6667), random high ports -> denied</pre>`,
    examples: [
      `<b>Allow only what's needed out:</b> 443 + 53; block 25 (spam/exfil) and odd C2 ports.`,
      `<b>Force proxying:</b> require outbound web through a filtering proxy so you can inspect/allowlist destinations.`,
    ],
    pitfalls: [
      `DNS (53) and HTTPS (443) are themselves exfil channels (DNS tunneling, HTTPS C2) — egress filtering helps but isn't complete; add inspection/monitoring.`,
      `Over-tight egress breaks legitimate updates/telemetry — enumerate needs first.`,
      `Allowing all outbound "for convenience" defeats the control entirely.`,
    ],
    why: `Egress filtering is an underused, high-value control that breaks the attacker kill chain (exfil/C2). Calling it out — and noting DNS/HTTPS can still tunnel — signals mature defense thinking.`,
    keyPoints: [
      "Allowlist outbound; don't leave egress wide open.",
      "Chokes malware C2 and data exfiltration.",
      "DNS/HTTPS can still tunnel — add inspection/monitoring.",
    ],
    references: [
      { title: "SANS — Egress filtering", url: "https://www.sans.org/white-papers/1059/" },
      { title: "MITRE ATT&CK — Exfiltration", url: "https://attack.mitre.org/tactics/TA0010/" },
    ],
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
    deepDive: `The classic secure web architecture is three tiers, each only talking to its neighbour:
<pre>internet --443--> [DMZ: web] --8080--> [internal: app] --3306--> [db]</pre>
<p>The database is never reachable from the internet or directly from web — a breach of the web tier still can't touch the DB without going through app. This is <b>segmentation</b>: contain blast radius by allowing only adjacent, required flows.</p>`,
    examples: [
      `<b>Permit the chain:</b> internet→dmz:443, dmz→internal:8080, internal→db:3306 — and nothing else.`,
      `<b>Blocked by design:</b> internet→db, web→db direct, internet→app all denied by default.`,
    ],
    pitfalls: [
      `Allowing the web tier to reach the DB directly (skipping app) defeats the tiering — a common real-world shortcut.`,
      `Over-broad "internal can reach anything" rules collapse the segmentation.`,
      `Forgetting management/backup paths — design those explicitly rather than leaving a broad hole.`,
    ],
    why: `Three-tier segmentation is a canonical design question ("how would you architect a secure web app network?"). Allowing only adjacent required flows is the textbook answer.`,
    keyPoints: [
      "Each tier talks only to its neighbour on the needed port.",
      "DB unreachable from internet or directly from web.",
      "Segmentation contains blast radius.",
    ],
    references: [
      { title: "NIST — Zero Trust Architecture (SP 800-207)", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { title: "AWS — Multi-tier VPC design", url: "https://docs.aws.amazon.com/whitepapers/latest/web-application-hosting-best-practices/network-segmentation.html" },
    ],
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
    deepDive: `Traditional segmentation guards the perimeter (north-south). <b>Microsegmentation</b> pushes policy down to the <b>individual workload</b> — often identity/host-based rather than purely IP — to control <b>east-west</b> (lateral) traffic inside a segment.
<p>So even if an attacker lands on one workload, they can't freely pivot to its neighbours. It's a core enabler of zero trust in data centers / Kubernetes.</p>`,
    examples: [
      `<b>Per-workload policy:</b> the web pod may talk to the app pod on 8080 and nothing else — enforced at the workload, not just a zone boundary.`,
      `<b>Implementations:</b> Kubernetes NetworkPolicies, service mesh mTLS, host-based firewalls, NSX/Illumio.`,
    ],
    pitfalls: [
      `IP-based rules drift as workloads move/scale — microsegmentation uses identity/labels to stay correct.`,
      `Too granular too fast is unmanageable — start with high-value segments and expand.`,
      `Without visibility (flow maps) you'll block legitimate east-west traffic.`,
    ],
    why: `Microsegmentation and limiting lateral movement are central to zero-trust discussions. Knowing it's identity-based and targets east-west traffic is the depth interviewers want.`,
    keyPoints: [
      "Policy at the workload level, not just the perimeter.",
      "Limits east-west / lateral movement after a breach.",
      "Identity/label-based; enabler of zero trust.",
    ],
    references: [
      { title: "NIST — Zero Trust Architecture (SP 800-207)", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { title: "Kubernetes — Network Policies", url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/" },
    ],
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
    deepDive: `<b>North-south</b> traffic crosses the perimeter (client ↔ data center / internet ↔ app). <b>East-west</b> traffic moves <i>between</i> internal systems (server ↔ server, pod ↔ pod).
<p>Classic defenses (perimeter firewalls) focus north-south; attackers who get inside then move <b>east-west</b> largely unchecked — which is exactly what microsegmentation addresses.</p>`,
    examples: [
      `<b>East-west:</b> app server → database inside the data center.`,
      `<b>North-south:</b> a user on the internet → your web front end.`,
    ],
    pitfalls: [
      `Assuming a strong perimeter is enough — once inside, flat internal networks let attackers roam east-west.`,
      `Monitoring only north-south (the edge) misses lateral movement entirely.`,
      `East-west volume is huge; policy/visibility must scale to it.`,
    ],
    why: `These directions frame nearly every segmentation and zero-trust conversation. Knowing attackers exploit unchecked east-west traffic is the key security point.`,
    keyPoints: [
      "North-south = across the perimeter; east-west = internal/lateral.",
      "Perimeter defenses miss east-west movement.",
      "Microsegmentation + internal monitoring close that gap.",
    ],
    references: [
      { title: "Illumio — East-West vs North-South traffic", url: "https://www.illumio.com/cybersecurity-101/east-west-traffic" },
      { title: "MITRE ATT&CK — Lateral Movement", url: "https://attack.mitre.org/tactics/TA0008/" },
    ],
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
    deepDive: `Administrative access should funnel through a hardened <b>jump box / bastion</b> in a management zone — never directly from the internet or the DMZ. Restrict SSH (22) to the <code>mgmt</code> source only:
<pre>allow tcp mgmt internal 22
# internet->internal:22 and dmz->internal:22 are denied</pre>
<p>The bastion is monitored, MFA-protected, and logged, giving one controlled, auditable choke point for admin access.</p>`,
    examples: [
      `<b>Scope admin:</b> only mgmt→internal:22 is allowed; all other SSH sources are denied.`,
      `<b>Modern variants:</b> SSM Session Manager / Tailscale / Teleport replace open SSH with brokered, audited access.`,
    ],
    pitfalls: [
      `A bastion exposed to the whole internet on 22 just moves the problem — restrict its own inbound and require MFA.`,
      `Leaving direct SSH paths open "temporarily" becomes permanent and bypasses the control.`,
      `No session logging on the jump box means no audit trail of admin actions.`,
    ],
    why: `Bastion/jump-box design is a standard infrastructure-security question. Funneling admin access through one hardened, logged choke point is the expected pattern.`,
    keyPoints: [
      "Admin access only via a hardened, monitored bastion.",
      "Deny direct SSH from internet/DMZ to internal.",
      "MFA + session logging on the jump box; consider brokered access.",
    ],
    references: [
      { title: "AWS — Linux bastion hosts", url: "https://aws.amazon.com/solutions/implementations/linux-bastion/" },
      { title: "AWS — Systems Manager Session Manager", url: "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html" },
    ],
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
    deepDive: `<b>TLS</b> (the S in HTTPS) protects data on the wire with three guarantees: <b>confidentiality</b> (encryption), <b>integrity</b> (tamper detection), and <b>server authentication</b> (the certificate proves you're talking to the real site). The TLS handshake negotiates a cipher and establishes session keys before any data flows.
<p>Plain HTTP (port 80) offers none of these — anyone on the path can read and modify traffic.</p>`,
    examples: [
      `<b>HTTPS vs HTTP:</b> 443 encrypts + authenticates; 80 is cleartext.`,
      `<b>Modern baseline:</b> TLS 1.2/1.3, strong ciphers, HSTS to force HTTPS, valid CA-issued certs.`,
    ],
    pitfalls: [
      `TLS protects data <i>in transit</i> only — you still need encryption at rest and good key/cert management.`,
      `Expired/self-signed/mismatched certs break the authentication guarantee (and train users to click through warnings).`,
      `Old protocols/ciphers (SSLv3, TLS 1.0, RC4) are broken — disable them.`,
    ],
    why: `"What does TLS actually give you?" (confidentiality + integrity + authentication) is a fundamental question. Naming all three, plus "in transit only", shows real understanding.`,
    keyPoints: [
      "TLS = confidentiality + integrity + server authentication.",
      "HTTP/80 is cleartext; use HTTPS/443 + HSTS.",
      "In-transit only; disable old protocols/ciphers.",
    ],
    references: [
      { title: "Cloudflare — What is TLS?", url: "https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/" },
      { title: "OWASP — TLS Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html" },
    ],
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
    deepDive: `<b>IPSec</b> secures traffic at the <b>Network layer (L3)</b>, so it protects <i>all</i> IP traffic in the tunnel transparently — ideal for site-to-site VPNs. <b>SSL/TLS VPNs</b> operate higher up (around the transport/application), often per-application and clientless via a browser.
<pre>IPSec: IKE negotiates keys (UDP 500 / 4500 for NAT-T), then ESP encrypts packets</pre>`,
    examples: [
      `<b>Site-to-site:</b> IPSec tunnels two offices so every IP packet between them is encrypted.`,
      `<b>Remote access:</b> SSL VPN (or IPSec client) for individual users; WireGuard is a modern, simpler L3 VPN.`,
    ],
    pitfalls: [
      `IPSec + NAT needs NAT-Traversal (UDP 4500) — plain ESP can break through NAT.`,
      `Confusing the layers: IPSec = L3 (all traffic), SSL VPN = higher layer (often per-app).`,
      `VPN encrypts the tunnel, not the endpoints — a compromised client still gets in.`,
    ],
    why: `"At what layer does IPSec work, and how does it differ from an SSL VPN?" is a standard VPN question. L3/transparent vs higher-layer/per-app is the distinction.`,
    keyPoints: [
      "IPSec = L3, protects all IP traffic (great for site-to-site).",
      "SSL/TLS VPN = higher layer, often per-app/clientless.",
      "IKE on UDP 500/4500; VPN secures the tunnel, not endpoints.",
    ],
    references: [
      { title: "Cloudflare — What is IPsec?", url: "https://www.cloudflare.com/learning/network-layer/what-is-ipsec/" },
      { title: "Cloudflare — IPsec vs SSL VPN", url: "https://www.cloudflare.com/learning/network-layer/ipsec-vs-ssl-vpn/" },
    ],
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
    deepDive: `DNS has two very different "secure DNS" technologies that solve <i>different</i> problems:
<ul>
<li><b>DNSSEC</b> cryptographically <b>signs</b> DNS records → <b>authenticity/integrity</b> (anti-spoofing/cache-poisoning). It does <b>not</b> encrypt.</li>
<li><b>DoH / DoT</b> (DNS over HTTPS/TLS) <b>encrypts</b> the DNS query → <b>confidentiality/privacy</b> (stops eavesdropping on lookups). It does not prove the answer is authentic.</li>
</ul>`,
    examples: [
      `<b>DNSSEC:</b> a resolver validates signatures so a forged "bank.com → attacker IP" is rejected.`,
      `<b>DoH:</b> your ISP/network can't see which domains you look up.`,
    ],
    pitfalls: [
      `They're complementary, not interchangeable — DNSSEC ≠ privacy; DoH ≠ authenticity.`,
      `DoH can also <i>hinder</i> enterprise security monitoring (hidden lookups) — a real policy trade-off.`,
      `DNSSEC adoption/validation gaps mean spoofing is still possible on unsigned zones.`,
    ],
    why: `"DNSSEC vs DoH" tests whether you separate integrity from confidentiality. Knowing DoH can blind security monitoring is a sharp, practical point.`,
    keyPoints: [
      "DNSSEC = signed records (integrity/authenticity), not encryption.",
      "DoH/DoT = encrypted queries (privacy), not authenticity.",
      "Complementary; DoH can complicate enterprise monitoring.",
    ],
    references: [
      { title: "Cloudflare — DNSSEC", url: "https://www.cloudflare.com/learning/dns/dns-security/" },
      { title: "Cloudflare — DNS over HTTPS (DoH)", url: "https://www.cloudflare.com/learning/dns/dns-over-tls/" },
    ],
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
    deepDive: `The secure-access and admin ports worth memorizing:
<pre>IPSec IKE   UDP 500   (+ UDP 4500 for NAT-Traversal)
SSH         TCP 22    (secure shell / SFTP)
RDP         TCP 3389  (Windows remote desktop)
OpenVPN     UDP 1194  ·  WireGuard  UDP 51820  ·  HTTPS/SSL-VPN 443</pre>`,
    examples: [
      `<b>IKE:</b> UDP 500 negotiates the IPSec tunnel; 4500 carries it through NAT.`,
      `<b>Admin:</b> SSH 22 (Linux/network gear), RDP 3389 (Windows).`,
    ],
    pitfalls: [
      `Never expose RDP (3389) or SSH (22) straight to the internet — brute-force/RDP worms target them; use a bastion/VPN.`,
      `Blocking UDP 4500 silently breaks IPSec behind NAT.`,
      `Default ports are conventions — services can move, so don't rely on port alone for identification.`,
    ],
    why: `Admin/VPN ports come up constantly in firewall rules and "why can't my VPN connect?" troubleshooting. Internet-exposed 3389/22 is a known breach vector worth flagging.`,
    keyPoints: [
      "IKE UDP 500 (+4500 NAT-T), SSH 22, RDP 3389.",
      "Never expose RDP/SSH directly to the internet.",
      "Ports are conventions; confirm the actual service.",
    ],
    references: [
      { title: "IANA — Port registry", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" },
      { title: "CISA — Securing RDP", url: "https://www.cisa.gov/news-events/alerts/2012/03/07/microsoft-releases-remote-desktop-protocol-security-advisory" },
    ],
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
    deepDive: `Reconnaissance leaves a signature in traffic before the real attack. A <b>port scan</b> = one source touching many destination ports (or hosts) in a short window.
<pre>SYN scan: send SYN, watch for SYN-ACK (open) vs RST (closed), never finish the handshake
Vertical scan: many ports on one host · Horizontal: one port across many hosts</pre>`,
    examples: [
      `<b>Vertical scan:</b> one host SYNs ports 1–1024 on a server in seconds.`,
      `<b>Tooling:</b> nmap for the attacker; IDS/IPS + flow analytics to detect the pattern.`,
    ],
    pitfalls: [
      `Slow/"low-and-slow" scans spread over hours evade naive rate thresholds — correlate over longer windows.`,
      `Benign scanners exist (vuln scanners, monitoring) — allowlist known-good sources to cut noise.`,
      `A single blocked SYN isn't a scan; it's the <i>pattern</i> (breadth + rate) that matters.`,
    ],
    why: `Recognizing recon early is classic blue-team work. Knowing scan types (vertical/horizontal, SYN) and that low-and-slow evades thresholds is the depth interviewers want.`,
    keyPoints: [
      "Port scan = one source, many ports/hosts, short window.",
      "SYN scans look for SYN-ACK vs RST without finishing.",
      "Low-and-slow evades naive thresholds — correlate over time.",
    ],
    references: [
      { title: "Nmap — Port scanning techniques", url: "https://nmap.org/book/man-port-scanning-techniques.html" },
      { title: "MITRE ATT&CK — Network Service Discovery", url: "https://attack.mitre.org/techniques/T1046/" },
    ],
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
    deepDive: `Both inspect traffic for threats; the difference is placement and power:
<ul>
<li><b>IDS</b> (Intrusion Detection System) is <b>passive</b> — it sits out-of-band (on a tap/SPAN) and <b>alerts</b>. It can't stop traffic.</li>
<li><b>IPS</b> (Intrusion Prevention System) sits <b>inline</b> and can <b>drop/block</b> malicious traffic in real time.</li>
</ul>
<p>Detection methods for both: <b>signature</b> (known-bad patterns) and <b>anomaly</b> (deviation from baseline).</p>`,
    examples: [
      `<b>IDS:</b> Snort/Suricata on a SPAN port raising alerts to the SOC.`,
      `<b>IPS:</b> the same engine inline, actively dropping an exploit attempt.`,
    ],
    pitfalls: [
      `Inline IPS is a potential bottleneck and single point of failure — size it and plan fail-open/closed deliberately.`,
      `Aggressive IPS blocking on false positives causes outages — tune before enabling prevent mode.`,
      `Encrypted traffic limits inspection unless you decrypt (TLS inspection) — a privacy/performance trade-off.`,
    ],
    why: `IDS vs IPS (passive/alert vs inline/block) is a guaranteed question. The "P is for Prevention / inline" mnemonic plus the fail-open/false-positive trade-offs show depth.`,
    keyPoints: [
      "IDS = passive, detect & alert; IPS = inline, can block.",
      "Both use signature + anomaly detection.",
      "IPS adds latency/availability risk — tune and plan failure mode.",
    ],
    references: [
      { title: "Cloudflare — IDS vs IPS", url: "https://www.cloudflare.com/learning/security/what-is-an-intrusion-detection-system/" },
      { title: "Suricata — IDS/IPS engine", url: "https://suricata.io/" },
    ],
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
    deepDive: `Data exfiltration hides in outbound traffic. Tell-tale signs: a <b>large outbound transfer</b> from an internal host to an <b>unusual destination/port</b>, often <b>off-hours</b>, far above that host's baseline.
<pre>Red flags: big uploads to unknown IPs, odd ports (4444), beaconing to one host,
           DNS/HTTPS tunneling (many long TXT queries / steady POSTs)</pre>`,
    examples: [
      `<b>Classic exfil:</b> internal host → 185.x.x.x:4444, 2.5 GB upload at 3am.`,
      `<b>Covert channels:</b> DNS tunneling or steady HTTPS beacons to a single C2 domain.`,
    ],
    pitfalls: [
      `Legit big uploads exist (backups, cloud sync) — baseline per host and allowlist known destinations.`,
      `Exfil over 443/53 looks "normal" by port — inspect volume, timing, and destination reputation, not just the port.`,
      `Low-and-slow exfil stays under volume thresholds — watch for persistent beaconing too.`,
    ],
    why: `Spotting exfiltration from flow data is core detection work. Knowing to weigh volume + destination + timing (not just port) and that 443/53 are abused is the senior answer.`,
    keyPoints: [
      "Exfil = large/odd outbound to unusual dest, off-hours, above baseline.",
      "443/53 are abused — judge volume/timing/destination, not just port.",
      "Baseline per host; watch for beaconing and low-and-slow.",
    ],
    references: [
      { title: "MITRE ATT&CK — Exfiltration (TA0010)", url: "https://attack.mitre.org/tactics/TA0010/" },
      { title: "MITRE ATT&CK — Exfiltration Over C2 Channel", url: "https://attack.mitre.org/techniques/T1041/" },
    ],
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
    deepDive: `Once you've identified a hostile source, block it <b>above</b> your broad allows (first-match-wins). A deny placed after an <code>allow any</code> never fires:
<pre>deny  tcp attacker dmz any    # specific block first
allow tcp any dmz 443         # then the general service rule</pre>
<p>This combines the order-matters lesson with incident response: contain the bad actor while keeping the service available to everyone else.</p>`,
    examples: [
      `<b>Block + keep serving:</b> deny the attacker zone to the DMZ, still allow internet/partner → dmz:443.`,
      `<b>Real tools:</b> WAF/edge IP deny lists, threat-intel feeds, fail2ban, scrubbing services.`,
    ],
    pitfalls: [
      `Placing the deny after the broad allow = it never triggers (the classic shadowing bug).`,
      `IP blocks are easily evaded (new IPs, botnets) — pair with rate-limiting/behavioral controls.`,
      `Over-broad blocks can take out shared infrastructure (NAT/CDN) that many users sit behind.`,
    ],
    why: `Containing an attacker at the firewall while preserving service, with correct rule order, is a practical IR-meets-networking task interviewers like.`,
    keyPoints: [
      "Put the specific deny ABOVE broad allows (first match wins).",
      "IP blocking alone is evadable — add rate limits/behavior.",
      "Avoid over-broad blocks that hit shared infra.",
    ],
    references: [
      { title: "Cloudflare — IP access rules", url: "https://developers.cloudflare.com/waf/tools/ip-access-rules/" },
      { title: "MITRE ATT&CK — Mitigations", url: "https://attack.mitre.org/mitigations/enterprise/" },
    ],
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
    deepDive: `This capstone combines everything: default-deny, three-tier segmentation, a management choke point, and controlled egress — across internet, DMZ (web), internal (app), db, and mgmt zones. Permit exactly the required flows and let default-deny block the dangerous ones:
<pre>allow internet->dmz:443/80   (users to web)
allow dmz->internal:8080     (web to app)
allow internal->db:3306      (app to db)
allow mgmt->internal:22, mgmt->dmz:22   (bastion admin)
allow internal->internet:443 (outbound updates)
# internet->db, internet->app, dmz->db, internet->mgmt  -> all denied</pre>`,
    examples: [
      `<b>Every flow justified:</b> each allow maps to a real need; nothing broad.`,
      `<b>Blast-radius containment:</b> a breached web server still can't reach the DB directly or the mgmt zone.`,
    ],
    pitfalls: [
      `A single over-broad rule (e.g., <code>allow any dmz any</code>) collapses the whole design — stay specific.`,
      `Forgetting legitimate paths (updates, monitoring, backups) breaks operations — design them in explicitly.`,
      `No logging/review means drift; audit the ruleset over time.`,
    ],
    why: `"Design the firewall policy for a segmented enterprise" is the quintessential network-security interview exercise. Default-deny + least-privilege flows + a bastion is the model answer.`,
    keyPoints: [
      "Default-deny; permit only adjacent, required flows.",
      "Segment tiers; funnel admin through a bastion; filter egress.",
      "Every allow is justified; audit for drift.",
    ],
    references: [
      { title: "NIST — Zero Trust Architecture (SP 800-207)", url: "https://csrc.nist.gov/pubs/sp/800/207/final" },
      { title: "NIST SP 800-41r1 — Firewall policy", url: "https://csrc.nist.gov/pubs/sp/800/41/r1/final" },
    ],
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

  /* ================= W8: WAF & APPSEC (Layer 7) ================= */
  {
    id: "n29", world: "w8", title: "What a WAF Does", xp: 90, kind: "quiz",
    deepDive: `A network firewall sees IPs/ports (L3/L4). A <b>WAF</b> parses the actual <b>HTTP(S)</b> request (L7) — method, path, query, headers, body — and blocks web application attacks: the <b>OWASP Top 10</b> (SQLi, XSS, path traversal, etc.).
<p>It sits in front of the app (reverse proxy / CDN edge / ingress) and complements, not replaces, secure coding and the L3/L4 firewall.</p>`,
    examples: [
      `<b>Catches app attacks:</b> a WAF can block <code>?id=1 OR 1=1</code> that a port-based firewall never sees.`,
      `<b>Deployments:</b> cloud WAF (Cloudflare, AWS WAF), reverse proxy (ModSecurity), or Kubernetes ingress.`,
    ],
    pitfalls: [
      `A WAF is not a substitute for fixing the code — it's defense-in-depth that can be bypassed.`,
      `It needs to see decrypted traffic — TLS terminates at the WAF/edge.`,
      `Poorly tuned rules cause false positives (blocking legit users) or false negatives (missed attacks).`,
    ],
    why: `"What's the difference between a firewall and a WAF?" is a common appsec question. L7/HTTP-aware vs L3/L4, and "defense-in-depth not a code fix," is the answer.`,
    keyPoints: [
      "WAF inspects L7 HTTP to block OWASP-style web attacks.",
      "Sits at reverse proxy/CDN/ingress; needs decrypted traffic.",
      "Complements secure coding — not a replacement.",
    ],
    references: [
      { title: "Cloudflare — What is a WAF?", url: "https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/" },
      { title: "OWASP — Web Application Firewall", url: "https://owasp.org/www-community/Web_Application_Firewall" },
    ],
    story: `🧯 A network firewall sees IPs and ports. A <b>WAF</b> reads the HTTP request itself.`,
    concept: `A <b>Web Application Firewall</b> inspects Layer-7 HTTP (method, path, query, headers, body) and blocks application attacks — the <b>OWASP Top 10</b> like SQL injection, XSS, and path traversal. It complements, not replaces, the L3/L4 firewall.`,
    task: `What best describes a WAF?`,
    options: [
      "An L3/L4 firewall that filters by IP and port",
      "An L7 filter that inspects HTTP to block web attacks (SQLi, XSS, etc.)",
      "A VPN concentrator for remote access",
      "A DNS resolver with caching",
    ],
    answer: 1,
    explanation: "A WAF works at Layer 7, inspecting HTTP content to stop OWASP-style web attacks.",
    hints: ["Think about the HTTP request body and URL.", "It targets OWASP Top 10 attacks."],
    solutionText: "An L7 filter that inspects HTTP to block web attacks",
  },
  {
    id: "n30", world: "w8", title: "Block Path Traversal", xp: 120, kind: "l7", defaultAction: "allow",
    deepDive: `<b>Path (directory) traversal</b> uses <code>../</code> sequences to escape the web root and read files outside it (<code>/etc/passwd</code>, config, keys). In negative-security (blocklist) mode the WAF allows by default and blocks the known-bad signature:
<pre>block when path contains ..</pre>
<p>The real fix is in the app (canonicalize paths, reject <code>..</code>, use safe file APIs); the WAF is a fast compensating control.</p>`,
    examples: [
      `<b>Block traversal:</b> paths containing <code>..</code> (incl. encoded <code>..%2f</code>) are dropped; normal pages pass.`,
      `<b>Target files:</b> attackers aim for <code>../../etc/passwd</code>, app configs, cloud credentials.`,
    ],
    pitfalls: [
      `Encodings bypass naive checks — <code>%2e%2e%2f</code>, <code>..\\</code>, double-encoding — normalize before matching.`,
      `Blocking only <code>../</code> but not its encoded forms leaves gaps.`,
      `WAF rule ≠ fix — also harden the application's file handling.`,
    ],
    why: `Path traversal is a long-standing OWASP issue; writing a WAF rule for it (and knowing encodings evade naive rules) demonstrates practical L7 defense.`,
    keyPoints: [
      "Traversal = ../ to escape the web root and read files.",
      "Block the signature, but normalize encodings first.",
      "Fix the app too (canonicalize, reject .., safe APIs).",
    ],
    references: [
      { title: "OWASP — Path Traversal", url: "https://owasp.org/www-community/attacks/Path_Traversal" },
      { title: "PortSwigger — Directory traversal", url: "https://portswigger.net/web-security/file-path-traversal" },
    ],
    story: `The WAF simulator is live. Write rules; each HTTP request is evaluated and shown allowed/blocked. Here, WAF runs in <b>negative</b> mode — allow by default, block known-bad.`,
    concept: `L7 rule syntax:
<pre>action when field op value</pre>
<ul><li><b>action</b>: allow / block</li>
<li><b>field</b>: method / path / query / body / token / role / header:Name</li>
<li><b>op</b>: contains / matches / eq / present / missing</li></ul>
Path traversal (<code>../</code>) tries to escape the web root to read files like <code>/etc/passwd</code>.`,
    task: `Block any request whose <code>path</code> contains <code>..</code> (directory traversal). Normal pages must still load.`,
    starter: `# negative model: allow by default, block the bad\n`,
    defaultActionNote: "allow",
    requests: [
      { method: "GET", path: "/index.html", desc: "Normal page", expect: "allow" },
      { method: "GET", path: "/../../etc/passwd", desc: "Path traversal", expect: "block" },
      { method: "GET", path: "/files/..%2f..%2fetc", desc: "Encoded traversal", expect: "block" },
      { method: "GET", path: "/products/item-123", desc: "Normal product", expect: "allow" },
    ],
    hints: ["One rule: block when path contains ..", "Default-allow handles the legit pages."],
    solution: `block when path contains ..`,
    solutionText: `block when path contains ..`,
  },
  {
    id: "n31", world: "w8", title: "Stop SQL Injection", xp: 130, kind: "l7", defaultAction: "allow",
    deepDive: `<b>SQL injection</b> smuggles SQL through user input to read/modify the database or bypass auth. A WAF matches classic signatures in the query/body:
<pre>block when query contains union select
block when query contains or 1=1</pre>
<p>The <b>real</b> fix is <b>parameterized queries</b> (prepared statements) in the app — the WAF is a compensating layer, not the cure.</p>`,
    examples: [
      `<b>Auth bypass:</b> <code>' OR 1=1--</code>; <b>data theft:</b> <code>UNION SELECT password FROM users</code>.`,
      `<b>App fix:</b> <code>cursor.execute("... WHERE id = %s", (id,))</code> — never string-concatenate SQL.`,
    ],
    pitfalls: [
      `Signature WAF rules are evadable (comments, encoding, case) — parameterize in code; don't rely on the WAF alone.`,
      `Over-broad SQLi rules false-positive on legit input containing "select"/"or" — tune carefully.`,
      `Blocklisting keywords is a losing game vs a determined attacker.`,
    ],
    why: `Injection is OWASP #3; "how do you prevent SQLi?" must answer <b>parameterized queries</b> first (WAF second). Knowing the WAF is evadable shows you understand defense-in-depth.`,
    keyPoints: [
      "WAF blocks SQLi signatures (union select, or 1=1).",
      "Real fix = parameterized queries / prepared statements.",
      "Signatures are evadable — WAF is a compensating layer.",
    ],
    references: [
      { title: "OWASP — SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" },
      { title: "OWASP — Injection (Top 10)", url: "https://owasp.org/Top10/A03_2021-Injection/" },
    ],
    story: `SQLi hides in query strings — <code>' OR 1=1--</code> or <code>UNION SELECT</code>. Catch the signatures.`,
    concept: `Match attack patterns in the <code>query</code> field. Use <code>contains</code> for simple substrings (case-insensitive).`,
    task: `Block requests whose <code>query</code> contains <code>union select</code> OR <code>or 1=1</code>. Legitimate searches must pass.`,
    starter: `# block classic SQLi signatures in the query\n`,
    requests: [
      { method: "GET", path: "/search", query: "laptop bag", desc: "Normal search", expect: "allow" },
      { method: "GET", path: "/search", query: "' OR 1=1--", desc: "Auth-bypass SQLi", expect: "block" },
      { method: "GET", path: "/items", query: "id=5 UNION SELECT pass FROM users", desc: "UNION injection", expect: "block" },
      { method: "GET", path: "/search", query: "phone case", desc: "Normal search", expect: "allow" },
    ],
    hints: ["Two block rules, one per signature.", "block when query contains union select  /  block when query contains or 1=1"],
    solution: `block when query contains union select\nblock when query contains or 1=1`,
    solutionText: `block when query contains union select\nblock when query contains or 1=1`,
  },
  {
    id: "n32", world: "w8", title: "Neutralize XSS", xp: 130, kind: "l7", defaultAction: "allow",
    deepDive: `<b>XSS</b> (Cross-Site Scripting) injects attacker JavaScript that runs in victims' browsers — stealing sessions, keylogging, defacing. A WAF blocks injection markers in input:
<pre>block when body contains <script
block when body contains onerror</pre>
<p>The real fixes live in the app: <b>context-aware output encoding</b>, a strong <b>Content-Security-Policy</b>, and framework auto-escaping.</p>`,
    examples: [
      `<b>Stored XSS:</b> <code>&lt;script&gt;steal()&lt;/script&gt;</code> saved in a comment; <b>attribute XSS:</b> <code>onerror=alert(1)</code>.`,
      `<b>App defenses:</b> encode on output, set CSP, use framework escaping (React/Angular auto-escape).`,
    ],
    pitfalls: [
      `WAF signatures miss obfuscated/encoded XSS (HTML entities, event handlers, SVG) — encoding + CSP are the durable fix.`,
      `Blocking <code>&lt;script</code> only is trivial to bypass (many vectors) — don't rely on it alone.`,
      `Reflected/DOM XSS may never hit the server body a WAF inspects.`,
    ],
    why: `XSS is a perennial OWASP risk. "How do you stop XSS?" → output encoding + CSP (WAF as backup) is the answer that shows you know where the real fix lives.`,
    keyPoints: [
      "XSS runs attacker JS in the victim's browser.",
      "Real fix: output encoding + CSP + framework escaping.",
      "WAF signatures help but are evadable (DOM/encoded XSS).",
    ],
    references: [
      { title: "OWASP — XSS Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" },
      { title: "MDN — Content Security Policy (CSP)", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" },
    ],
    story: `Cross-site scripting arrives in the request body — <code>&lt;script&gt;</code> tags and <code>onerror=</code> handlers.`,
    concept: `Inspect the <code>body</code> for script injection markers. Real comments shouldn't contain them.`,
    task: `Block requests whose <code>body</code> contains <code>&lt;script</code> OR <code>onerror</code>. Normal comments pass.`,
    starter: `# block script injection in the body\n`,
    requests: [
      { method: "POST", path: "/comment", body: "Great article, thanks!", desc: "Normal comment", expect: "allow" },
      { method: "POST", path: "/comment", body: "<script>steal()</script>", desc: "Stored XSS", expect: "block" },
      { method: "POST", path: "/profile", body: "<img src=x onerror=alert(1)>", desc: "XSS via onerror", expect: "block" },
      { method: "POST", path: "/comment", body: "I give it 5 stars", desc: "Normal comment", expect: "allow" },
    ],
    hints: ["block when body contains <script", "block when body contains onerror"],
    solution: `block when body contains <script\nblock when body contains onerror`,
    solutionText: `block when body contains <script\nblock when body contains onerror`,
  },
  {
    id: "n33", world: "w8", title: "Positive vs Negative", xp: 90, kind: "quiz",
    deepDive: `Two WAF models:
<ul>
<li><b>Negative (blocklist):</b> allow by default, block known-bad signatures. Easy to deploy, low false positives — but <b>bypassable</b> by novel/obfuscated payloads.</li>
<li><b>Positive (allowlist):</b> deny by default, permit only known-good input/shapes. Much stronger, but higher effort and more false positives, so it needs tuning (often via learning mode).</li>
</ul>
<p>Mature deployments blend both and run in "detect/log" before "block".</p>`,
    examples: [
      `<b>Negative:</b> OWASP Core Rule Set signatures catching common attacks.`,
      `<b>Positive:</b> a schema that only accepts <code>id</code> as digits and <code>email</code> as an email — anything else blocked.`,
    ],
    pitfalls: [
      `Pure blocklist lulls you into false confidence — determined attackers evade signatures.`,
      `Pure allowlist, rolled out in block mode without tuning, breaks legitimate traffic.`,
      `Skipping a detect-only/learning phase leads to painful false-positive outages.`,
    ],
    why: `Positive vs negative security model is a classic WAF/design question (same idea as default-deny firewalls and input allowlisting). Knowing the trade-offs and "detect before block" is the mature take.`,
    keyPoints: [
      "Negative = blocklist (easy, bypassable); Positive = allowlist (strong, higher effort).",
      "Blend both; favor allowlisting for critical inputs.",
      "Run detect/learning mode before enabling block.",
    ],
    references: [
      { title: "OWASP — Positive security model", url: "https://owasp.org/www-community/Positive_security_model" },
      { title: "OWASP ModSecurity Core Rule Set", url: "https://coreruleset.org/" },
    ],
    story: `How a WAF decides is a design choice with real trade-offs.`,
    concept: `<b>Negative model</b> (blocklist): allow by default, block known-bad signatures — easy to deploy but can be bypassed by novel/obfuscated payloads. <b>Positive model</b> (allowlist): deny by default, permit only known-good input — far stronger but higher effort and more false positives.`,
    task: `A WAF that blocks only known attack signatures uses which model, and what's its main weakness?`,
    options: [
      "Positive model; weakness is it blocks everything",
      "Negative model; weakness is evasion by novel/obfuscated payloads",
      "Positive model; weakness is it can't see HTTP",
      "Negative model; weakness is it needs client certificates",
    ],
    answer: 1,
    explanation: "Blocklist = negative model; novel or obfuscated payloads can slip past signatures.",
    hints: ["Blocklist = negative.", "What about attacks you haven't seen yet?"],
    solutionText: "Negative model; weak against novel/obfuscated payloads",
  },

  /* ================= W9: API SECURITY ================= */
  {
    id: "n34", world: "w9", title: "BOLA — API #1", xp: 100, kind: "quiz",
    deepDive: `<b>BOLA</b> (Broken Object Level Authorization) is the <b>#1</b> API risk. The API authenticates you but doesn't verify you're allowed <i>this specific object</i>, so changing an ID in the URL leaks someone else's data.
<pre>GET /api/orders/123   (yours)   -> OK
GET /api/orders/124   (not yours) -> should be DENIED, but isn't</pre>
<p>Fix: enforce per-object ownership/authorization on the server for every access.</p>`,
    examples: [
      `<b>IDOR/BOLA:</b> incrementing an order/account/document id returns another user's record.`,
      `<b>Fix:</b> <code>if resource.owner != current_user: 403</code> on every object fetch/update/delete.`,
    ],
    pitfalls: [
      `Using UUIDs instead of sequential IDs is <b>not</b> a fix — it's obscurity; still authorize server-side.`,
      `Checking the list endpoint but not detail/update/delete leaves holes.`,
      `Trusting a client-supplied "tenant_id" without verifying it belongs to the caller.`,
    ],
    why: `BOLA tops the OWASP API Top 10 and causes a huge share of real breaches. "Authenticated but not authorized per object" is the exact definition interviewers want.`,
    keyPoints: [
      "BOLA = missing per-object authorization (authn without authz).",
      "Enforce ownership checks server-side on every object op.",
      "Random IDs ≠ access control.",
    ],
    references: [
      { title: "OWASP API1 — Broken Object Level Authorization", url: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/" },
      { title: "OWASP — Authorization Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" },
    ],
    story: `🔑 The #1 API risk isn't exotic — it's missing authorization checks on objects.`,
    concept: `<b>BOLA</b> (Broken Object Level Authorization) = the API authenticates you but doesn't verify you own the object you requested, so changing an ID (<code>/orders/123</code> → <code>/orders/124</code>) leaks someone else's data.`,
    task: `You're logged in and own order 123. Requesting <code>/api/orders/124</code> returns it with no ownership check. This is:`,
    options: [
      "Broken Object Level Authorization (BOLA)",
      "A SYN flood",
      "DNS poisoning",
      "A TLS downgrade",
    ],
    answer: 0,
    explanation: "Authenticated but not authorized for that object = BOLA, OWASP API Security #1.",
    hints: ["You're authenticated — what's missing?", "It's about per-object ownership."],
    solutionText: "Broken Object Level Authorization (BOLA)",
  },
  {
    id: "n35", world: "w9", title: "Require Authentication", xp: 120, kind: "l7", defaultAction: "block",
    deepDive: `An API gateway in <b>positive</b> mode is deny-by-default — you explicitly allow only authenticated, authorized calls. First gate: no valid token, no entry.
<pre>allow when token present   # everything else -> default block</pre>
<p>"Broken authentication" (OWASP API #2) includes missing auth, weak tokens, and endpoints that forgot to check — the gateway enforces a consistent baseline across every route.</p>`,
    examples: [
      `<b>Require a token:</b> requests without a bearer token are blocked at the edge.`,
      `<b>Centralize:</b> the gateway validates the token once so each microservice doesn't reinvent auth.`,
    ],
    pitfalls: [
      `"Present" isn't "valid" — the gateway/service must also verify the token's signature/exp/aud (see JWT lesson).`,
      `Unauthenticated health/metrics endpoints are fine, but must not leak sensitive data.`,
      `Relying only on the gateway while a service is also directly reachable bypasses auth — lock down east-west too.`,
    ],
    why: `Deny-by-default auth at the gateway is the baseline for API security. "How do you enforce auth consistently across many APIs?" → a gateway that rejects unauthenticated requests.`,
    keyPoints: [
      "Positive model: deny by default, allow authenticated calls.",
      "Validate tokens (not just presence) centrally at the gateway.",
      "Prevent direct service access that bypasses the gateway.",
    ],
    references: [
      { title: "OWASP API2 — Broken Authentication", url: "https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/" },
      { title: "OWASP — API Security Top 10", url: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/" },
    ],
    story: `This is an API gateway in <b>positive</b> mode — <b>deny by default</b>, allow only what you authorize. First: no token, no entry.`,
    concept: `Default action is <b>block</b>. You must explicitly allow legitimate traffic. The <code>token</code> field holds the bearer token (empty/absent = unauthenticated).`,
    task: `Allow requests only when a <code>token</code> is <code>present</code>. Unauthenticated calls must be blocked.`,
    starter: `# deny by default; allow authenticated calls\n`,
    requests: [
      { method: "GET", path: "/api/orders", token: "jwt-abc", desc: "Authenticated", expect: "allow" },
      { method: "GET", path: "/api/orders", token: "", desc: "Empty token", expect: "block" },
      { method: "GET", path: "/api/orders", desc: "No auth header", expect: "block" },
    ],
    hints: ["One rule: allow when token present", "Default-block stops the rest."],
    solution: `allow when token present`,
    solutionText: `allow when token present`,
  },
  {
    id: "n36", world: "w9", title: "Role-Based Access", xp: 160, kind: "l7", defaultAction: "block",
    deepDive: `<b>RBAC</b> grants access by role. Authentication (valid token) is not enough — admin routes need an admin role, users get their own data, and the unauthenticated get nothing. Build it up with ordered rules on a deny-by-default base:
<pre>block when token missing           # 1) reject unauthenticated
allow when role eq admin           # 2) admins
allow when path contains /api/profile  # 3) any authed user's profile</pre>`,
    examples: [
      `<b>RBAC outcomes:</b> admin→admin API allowed; user→admin API blocked; user→profile allowed; unauth→blocked.`,
      `<b>Function-level authz:</b> this is OWASP API #5 — enforce role checks on privileged functions.`,
    ],
    pitfalls: [
      `Order matters: reject unauthenticated first, then grant — a broad allow above the reject lets anons through.`,
      `Roles are coarse; combine with object-level checks (BOLA) for "this admin, this tenant".`,
      `Hidden admin endpoints without server-side role checks (security by obscurity) still get found.`,
    ],
    why: `Broken Function Level Authorization (OWASP API #5) is common. Showing ordered, deny-by-default RBAC that distinguishes authn from authz is the strong answer.`,
    keyPoints: [
      "RBAC = access by role, on top of authentication.",
      "Order rules: reject unauth, then grant by role.",
      "Combine role (function-level) with object-level checks.",
    ],
    references: [
      { title: "OWASP API5 — Broken Function Level Authorization", url: "https://owasp.org/API-Security/editions/2023/en/0xa5-broken-function-level-authorization/" },
      { title: "NIST — RBAC", url: "https://csrc.nist.gov/projects/role-based-access-control" },
    ],
    story: `Authentication isn't authorization. Admin APIs need an admin role; users get their own profile; nobody unauthenticated gets in. Order your rules carefully.`,
    concept: `Still deny-by-default. Build it up: reject unauthenticated first, then grant admins, then allow the user profile path. First match wins.`,
    task: `Allow: admins to <code>/api/admin/*</code> and anyone authenticated to <code>/api/profile</code>. Block non-admins from admin APIs and all unauthenticated calls.`,
    starter: `# deny by default\n# 1) reject if no token\n# 2) admins allowed\n# 3) profile allowed for authenticated users\n`,
    requests: [
      { method: "GET", path: "/api/admin/users", role: "admin", token: "jwt-admin", desc: "Admin → admin API", expect: "allow" },
      { method: "GET", path: "/api/admin/users", role: "user", token: "jwt-user", desc: "User → admin API", expect: "block" },
      { method: "GET", path: "/api/profile", role: "user", token: "jwt-user", desc: "User → own profile", expect: "allow" },
      { method: "GET", path: "/api/profile", role: "", token: "", desc: "Unauthenticated", expect: "block" },
    ],
    hints: [
      "First: block when token missing",
      "Then: allow when role eq admin",
      "Then: allow when path contains /api/profile",
    ],
    solution: `block when token missing\nallow when role eq admin\nallow when path contains /api/profile`,
    solutionText: `block when token missing\nallow when role eq admin\nallow when path contains /api/profile`,
  },
  {
    id: "n37", world: "w9", title: "JWTs: Decode ≠ Verify", xp: 110, kind: "quiz",
    deepDive: `A JWT's payload is just base64 — readable and <b>forgeable</b> by anyone. Trusting a decoded token is a critical bug. You must <b>verify</b>: the <b>signature</b> (with the issuer's key), <b>exp</b> (not expired), <b>aud</b> (for your API), and <b>iss</b> (trusted issuer).
<pre>decode  -> you can read the claims (anyone can)
verify  -> you know the claims are genuine (needs the key)</pre>`,
    examples: [
      `<b>Forgery:</b> an attacker edits <code>"role":"user"</code> to <code>"admin"</code>; only signature verification catches it.`,
      `<b>alg:none attack:</b> a token claiming "no algorithm" must be rejected — pin the expected algorithm.`,
    ],
    pitfalls: [
      `Using a JWT library's "decode" instead of "verify" — a classic, severe broken-auth bug.`,
      `Accepting <code>alg:none</code> or algorithm confusion (RS256↔HS256) lets attackers forge tokens.`,
      `Skipping exp/aud lets stolen or cross-service tokens work.`,
    ],
    why: `JWT decode-vs-verify (and alg:none) is a favorite API-security question and a real-world vuln. The crisp answer: verify signature + exp + aud + iss, pin the algorithm.`,
    keyPoints: [
      "Decoding reads claims; verifying proves they're genuine.",
      "Check signature + exp + aud + iss; pin the algorithm.",
      "Never trust an unverified token.",
    ],
    references: [
      { title: "Auth0 — JWT best practices", url: "https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-best-practices" },
      { title: "RFC 8725 — JWT Best Current Practices", url: "https://datatracker.ietf.org/doc/html/rfc8725" },
    ],
    story: `A very common, very dangerous API mistake.`,
    concept: `A JWT's payload is just base64 — anyone can read AND forge it. You must cryptographically <b>verify the signature</b> with the issuer's key, and check <b>exp</b> (expiry), <b>aud</b> (audience), and <b>iss</b> (issuer). Trusting a decoded-but-unverified token lets attackers mint their own.`,
    task: `Your API base64-decodes a JWT and trusts the <code>role</code> claim to authorize. What's the flaw?`,
    options: [
      "Nothing — decoding a JWT proves it's authentic",
      "Decoding isn't verifying: without checking the signature/exp/aud, a forged token is trusted",
      "JWTs can't carry a role claim",
      "base64 is encrypted, so it's fine",
    ],
    answer: 1,
    explanation: "Must verify signature + exp + aud/iss. Decoding alone lets attackers forge claims.",
    hints: ["Can anyone create a JWT payload?", "What proves the token is genuine?"],
    solutionText: "Decoding isn't verifying — you must validate signature, exp, aud/iss",
  },
  {
    id: "n38", world: "w9", title: "Throttle the Abuse", xp: 90, kind: "quiz",
    deepDive: `<b>Rate limiting / throttling</b> caps how many requests a client (per API key, user, or IP) can make in a window. It blunts brute force, credential stuffing, scraping, and resource-exhaustion abuse — and protects backends from overload.
<pre>429 Too Many Requests + Retry-After   # the server's "slow down"</pre>`,
    examples: [
      `<b>Login protection:</b> 5 attempts/min/account stops password brute force.`,
      `<b>Algorithms:</b> token bucket / leaky bucket / sliding window implement the limit.`,
    ],
    pitfalls: [
      `Rate-limiting by IP alone is weak (NAT shares IPs; botnets rotate them) — key on user/API key where possible.`,
      `No limit on expensive endpoints (search, export) invites resource-exhaustion DoS (OWASP API #4).`,
      `Returning different errors for valid vs invalid users leaks account existence under brute force.`,
    ],
    why: `Unrestricted resource consumption is OWASP API #4. "How do you stop brute force/scraping?" → per-client rate limiting is the direct, expected answer.`,
    keyPoints: [
      "Throttle per client (key/user/IP) to stop brute force/scraping/DoS.",
      "429 + Retry-After signals clients to back off.",
      "IP-only limiting is weak; limit expensive endpoints too.",
    ],
    references: [
      { title: "OWASP API4 — Unrestricted Resource Consumption", url: "https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/" },
      { title: "Cloudflare — What is rate limiting?", url: "https://www.cloudflare.com/learning/bots/what-is-rate-limiting/" },
    ],
    story: `APIs get hammered — credential stuffing, scraping, brute force.`,
    concept: `<b>Rate limiting / throttling</b> (per API key, user, or IP) caps request volume, blunting brute-force, credential stuffing, and scraping, and protecting backends from overload.`,
    task: `Which control best mitigates brute-force login and data scraping against an API?`,
    options: [
      "Returning more detailed error messages",
      "Rate limiting / throttling per client",
      "Increasing the JWT expiry time",
      "Disabling TLS to speed things up",
    ],
    answer: 1,
    explanation: "Per-client rate limiting/throttling directly counters brute force and scraping.",
    hints: ["Think about request volume per client.", "Cap how many calls a client can make."],
    solutionText: "Rate limiting / throttling per client",
  },

  /* ================= W10: CI/CD & SUPPLY CHAIN ================= */
  {
    id: "n39", world: "w10", title: "Secrets in Pipelines", xp: 100, kind: "quiz",
    deepDive: `CI/CD systems hold the keys to prod, so pipeline secrets are prime targets. Deliver them safely: from a <b>secrets manager</b> or the CI's <b>masked secret store</b>, injected at runtime and scoped/short-lived. Best of all: <b>OIDC federation</b> so the pipeline gets short-lived cloud credentials with no stored secret at all.
<p>Never commit secrets to the repo/YAML, and never print them to build logs.</p>`,
    examples: [
      `<b>Good:</b> GitHub Actions OIDC → assume an AWS role for 15 minutes; no long-lived key stored.`,
      `<b>Good:</b> masked CI secret injected as an env var only for the job that needs it.`,
    ],
    pitfalls: [
      `Hardcoding in pipeline YAML (it's in the repo and history forever).`,
      `Echoing secrets to logs — CI masking helps but <code>set -x</code>/debug can still leak them.`,
      `Long-lived cloud keys shared across all jobs = huge blast radius; prefer OIDC/short-lived.`,
    ],
    why: `"How should a pipeline get a prod credential?" is a standard DevSecOps question. Secrets manager / masked store / OIDC (never hardcode or log) is the answer.`,
    keyPoints: [
      "Inject from a secrets manager / masked store at runtime.",
      "Prefer OIDC federation (short-lived, no stored secret).",
      "Never commit to repo/YAML or print to logs.",
    ],
    references: [
      { title: "GitHub — OIDC in Actions", url: "https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect" },
      { title: "OWASP — CI/CD Security Top 10", url: "https://owasp.org/www-project-top-10-ci-cd-security-risks/" },
    ],
    story: `⚙️ A leaked pipeline credential is a breach waiting to happen.`,
    concept: `Pipeline secrets belong in a <b>secrets manager</b> or the CI's masked secret store, injected at runtime and scoped/short-lived (ideally OIDC federation for cloud). Never commit them to the repo, YAML, or build logs.`,
    task: `How should a CI job obtain a production API key?`,
    options: [
      "Hardcoded in the pipeline YAML in the repo",
      "From a secrets manager / masked CI secret, injected at runtime",
      "Printed to the build log for debugging",
      "Emailed to the team and pasted in",
    ],
    answer: 1,
    explanation: "Use a secrets manager / masked CI secrets (or OIDC) — never hardcode or log them.",
    hints: ["Should a secret ever sit in the repo?", "Think masked store / short-lived creds."],
    solutionText: "From a secrets manager / masked CI secret at runtime",
  },
  {
    id: "n40", world: "w10", title: "SAST vs DAST vs SCA", xp: 100, kind: "quiz",
    deepDive: `Three complementary scanners catch different bugs:
<ul>
<li><b>SAST</b> — static analysis of <i>your source</i> for insecure code (early, but false positives).</li>
<li><b>DAST</b> — dynamic testing of the <i>running app</i> from outside (finds real exploitable issues, later in the cycle).</li>
<li><b>SCA</b> — scans <i>third-party dependencies</i> for known CVEs (e.g., Log4Shell).</li>
</ul>
<p>Add <b>IaC</b> scanning and secret scanning for full "shift-left" coverage.</p>`,
    examples: [
      `<b>SCA catches the library bug:</b> a vulnerable <code>log4j</code>/<code>openssl</code> version in your dependency tree.`,
      `<b>SAST</b> flags a SQL concatenation in your code; <b>DAST</b> confirms it's exploitable live.`,
    ],
    pitfalls: [
      `Relying on one tool — they cover different layers (your code vs running app vs dependencies).`,
      `SAST false-positive fatigue leads teams to ignore it — tune and triage.`,
      `DAST needs a deployed/staged target and good coverage of routes.`,
    ],
    why: `"Which tool finds vulnerable dependencies?" (SCA) and "SAST vs DAST?" are staple DevSecOps questions. Knowing each layer and that they're complementary is the answer.`,
    keyPoints: [
      "SAST = your source code; DAST = running app; SCA = dependencies/CVEs.",
      "Add IaC + secret scanning for full coverage.",
      "They're complementary — use all, and triage findings.",
    ],
    references: [
      { title: "OWASP — Source Code Analysis (SAST)", url: "https://owasp.org/www-community/Source_Code_Analysis_Tools" },
      { title: "OWASP — Vulnerability scanning (DAST)", url: "https://owasp.org/www-community/Vulnerability_Scanning_Tools" },
    ],
    story: `Different scanners catch different bugs. Know which is which.`,
    concept: `<b>SAST</b> = static analysis of your source for insecure code. <b>DAST</b> = dynamic testing of the running app from outside. <b>SCA</b> = scanning third-party dependencies for known CVEs.`,
    task: `Which tool finds <b>known-vulnerable third-party dependencies</b> in your project?`,
    options: ["SAST", "DAST", "SCA (Software Composition Analysis)", "A linter"],
    answer: 2,
    explanation: "SCA inventories dependencies and flags ones with known CVEs.",
    hints: ["It's about libraries you didn't write.", "Composition = your dependency tree."],
    solutionText: "SCA (Software Composition Analysis)",
  },
  {
    id: "n41", world: "w10", title: "Harden the Supply Chain", xp: 110, kind: "quiz",
    deepDive: `Software supply-chain attacks (SolarWinds, dependency typosquats, compromised build systems) hit you via what you <i>trust</i>. Defenses:
<ul>
<li><b>Pin</b> exact versions + commit a <b>lockfile with integrity hashes</b>.</li>
<li><b>Verify signatures/provenance</b> of dependencies and base images.</li>
<li>Generate an <b>SBOM</b> and monitor it; restrict who can publish.</li>
</ul>`,
    examples: [
      `<b>Pin + verify:</b> a lockfile hash mismatch blocks a tampered/typosquatted package.`,
      `<b>Provenance:</b> SLSA attestations + Sigstore signatures prove where an artifact came from.`,
    ],
    pitfalls: [
      `Floating <code>latest</code>/<code>*</code> versions make builds non-reproducible and auto-pull compromised updates.`,
      `Trusting a dependency's dependencies (transitive) blindly — SBOM + SCA cover the whole tree.`,
      `Downloading over plain HTTP / unverified mirrors.`,
    ],
    why: `Supply-chain security is front-and-center. "How do you defend against a compromised dependency?" → pin + lockfile hashes + signature/provenance verification + SBOM.`,
    keyPoints: [
      "Pin versions; lockfile with integrity hashes.",
      "Verify signatures/provenance (SLSA, Sigstore); generate SBOM.",
      "Avoid floating versions and unverified sources.",
    ],
    references: [
      { title: "SLSA — Supply-chain levels", url: "https://slsa.dev/" },
      { title: "CISA — Software supply chain security", url: "https://www.cisa.gov/resources-tools/resources/securing-software-supply-chain-series" },
    ],
    story: `SolarWinds and typosquats made supply-chain defense mandatory.`,
    concept: `Defenses: <b>pin</b> exact versions and commit a <b>lockfile with integrity hashes</b>, verify <b>signatures/provenance</b> of dependencies and base images, and limit who can publish. This resists tampered or typosquatted packages.`,
    task: `Which practice best protects against a tampered or typosquatted dependency?`,
    options: [
      "Always install the latest floating version (*) automatically",
      "Pin exact versions with a lockfile + verify integrity hashes/signatures",
      "Disable dependency scanning to speed builds",
      "Download packages over plain HTTP",
    ],
    answer: 1,
    explanation: "Pinning + lockfile hashes + signature/provenance verification stops tampered/typosquatted deps.",
    hints: ["Floating 'latest' is the opposite of safe.", "Pin + verify integrity."],
    solutionText: "Pin exact versions with a lockfile and verify integrity/signatures",
  },
  {
    id: "n42", world: "w10", title: "Pipeline Blast Radius", xp: 110, kind: "quiz",
    deepDive: `The CI/CD system can push to prod, so it's a high-value target. Minimize blast radius:
<ul>
<li><b>Least-privilege, short-lived</b> (OIDC) credentials per job — no standing admin.</li>
<li><b>Protected branches</b> + required reviews; no direct pushes to main.</li>
<li>Don't run <b>untrusted PR code</b> with access to secrets.</li>
<li>Pin/verify third-party <b>Actions/plugins</b> (they run in your pipeline).</li>
</ul>`,
    examples: [
      `<b>Worst case:</b> long-lived cloud admin keys as plaintext env vars in every job — one compromised job owns everything.`,
      `<b>Good:</b> scoped OIDC role per pipeline + protected branches + pinned actions.`,
    ],
    pitfalls: [
      `Running fork PRs with secrets exposed lets attackers exfiltrate them via a malicious workflow.`,
      `Unpinned third-party actions (<code>@main</code>) can change under you (supply-chain in the pipeline).`,
      `Over-privileged CI service accounts that never get reviewed.`,
    ],
    why: `"What's the riskiest CI/CD practice?" and "how do you secure a pipeline?" are common. Least-privilege/OIDC + protected branches + no-untrusted-code-with-secrets is the model answer.`,
    keyPoints: [
      "Least-privilege, short-lived (OIDC) creds per job.",
      "Protected branches + reviews; don't run untrusted PR code with secrets.",
      "Pin/verify third-party actions/plugins.",
    ],
    references: [
      { title: "OWASP — CI/CD Security Top 10", url: "https://owasp.org/www-project-top-10-ci-cd-security-risks/" },
      { title: "GitHub — Security hardening for Actions", url: "https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions" },
    ],
    story: `The CI/CD system itself is a high-value target — it can push to prod.`,
    concept: `Harden pipelines: least-privilege, short-lived (OIDC) credentials; protected branches + required reviews; don't run untrusted PR code with secrets; never expose long-lived admin keys to every job.`,
    task: `Which is the <b>riskiest</b> CI/CD practice?`,
    options: [
      "Using short-lived OIDC cloud credentials",
      "Exposing long-lived cloud admin keys as plaintext env vars in every job",
      "Signing build artifacts",
      "Requiring code review on protected branches",
    ],
    answer: 1,
    explanation: "Long-lived admin keys available to every job = huge blast radius if any job is compromised.",
    hints: ["Which option maximizes damage if one job is hijacked?", "Long-lived + admin + everywhere = bad."],
    solutionText: "Long-lived cloud admin keys as plaintext env vars in every job",
  },
  {
    id: "n43", world: "w10", title: "Sign & Prove It", xp: 110, kind: "quiz",
    deepDive: `Consumers need to trust that an artifact really came from your pipeline, untampered. Two mechanisms:
<ul>
<li><b>Artifact signing</b> (e.g., Sigstore/cosign) — cryptographically sign builds/images so tampering is detectable.</li>
<li><b>Provenance</b> (SLSA attestations) — a signed record of <i>what</i> was built, <i>from which source</i>, <i>by which pipeline</i>.</li>
</ul>
<p>Verifiers (admission controllers, deploy gates) then <b>require</b> a valid signature + provenance before running an image.</p>`,
    examples: [
      `<b>Verify at deploy:</b> a Kubernetes admission policy rejects unsigned images.`,
      `<b>Provenance:</b> prove image X was built from commit Y by pipeline Z — detect a swapped artifact.`,
    ],
    pitfalls: [
      `Signing without <b>verifying</b> at consumption is pointless — enforce the check at deploy.`,
      `Protecting the signing key is critical — a stolen key lets attackers sign malicious artifacts.`,
      `Provenance only helps if the build system itself is trustworthy (hardened CI).`,
    ],
    why: `Artifact signing + SLSA provenance are the cutting edge of supply-chain integrity (post-SolarWinds). Explaining sign + verify + provenance shows current knowledge.`,
    keyPoints: [
      "Sign artifacts (Sigstore) + generate SLSA provenance.",
      "Verify signature/provenance at deploy (admission gate).",
      "Protect signing keys; harden the build system.",
    ],
    references: [
      { title: "Sigstore — Signing & verification", url: "https://www.sigstore.dev/" },
      { title: "SLSA — Provenance", url: "https://slsa.dev/spec/v1.0/provenance" },
    ],
    story: `Consumers need to trust that an artifact really came from your pipeline, untampered.`,
    concept: `<b>Artifact signing</b> (e.g., Sigstore/cosign) plus <b>provenance</b> (SLSA attestations) let consumers cryptographically verify <i>what</i> was built, <i>from which source</i>, and <i>by which pipeline</i> — detecting tampering after the build.`,
    task: `Signing artifacts and generating SLSA provenance primarily gives consumers:`,
    options: [
      "Faster downloads",
      "Verifiable integrity and authenticity of the build (origin + untampered)",
      "Smaller container images",
      "Automatic rollback on failure",
    ],
    answer: 1,
    explanation: "Signing + provenance prove origin and integrity of the artifact.",
    hints: ["It's about trust, not speed.", "Who built it, from what, and was it changed?"],
    solutionText: "Verifiable integrity and authenticity of the build",
  },

  /* ================= W11: ADVANCED NETWORKING ================= */
  {
    id: "n44", world: "w11", title: "Mutual TLS", xp: 100, kind: "quiz",
    deepDive: `Standard TLS authenticates only the <b>server</b> to the client (via its certificate). <b>mTLS</b> adds a <b>client certificate</b> so <i>both</i> ends prove identity — the foundation of zero-trust service-to-service communication and service meshes.
<pre>TLS:  client verifies server cert
mTLS: client verifies server cert AND server verifies client cert</pre>`,
    examples: [
      `<b>Service mesh:</b> Istio/Linkerd issue per-workload certs so every pod-to-pod call is mutually authenticated + encrypted.`,
      `<b>Zero trust:</b> identity is proven by cert, not by network location.`,
    ],
    pitfalls: [
      `Certificate lifecycle (issuance, rotation, revocation) is the hard part — automate it (SPIFFE/mesh CA) or it breaks.`,
      `mTLS authenticates the connection, not the <i>request</i> — still do authz (scopes/roles) per call.`,
      `Expired/misissued client certs cause outages; monitor and auto-renew.`,
    ],
    why: `mTLS underpins zero-trust and service meshes, a hot architecture topic. "What does mTLS add over TLS?" (mutual auth / client cert) with the cert-lifecycle caveat is the strong answer.`,
    keyPoints: [
      "mTLS = both client and server present/verify certificates.",
      "Basis of zero-trust service-to-service (service mesh).",
      "Cert lifecycle automation is the real challenge.",
    ],
    references: [
      { title: "Cloudflare — What is mTLS?", url: "https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/" },
      { title: "SPIFFE — Workload identity", url: "https://spiffe.io/docs/latest/spiffe-about/overview/" },
    ],
    story: `🛰️ Zero-trust service meshes lean heavily on mTLS.`,
    concept: `Standard TLS authenticates the <b>server</b> to the client. <b>mTLS</b> adds a <b>client certificate</b> so both ends authenticate each other — common for service-to-service and zero-trust architectures.`,
    task: `What does mutual TLS add over standard TLS?`,
    options: [
      "Nothing — it's just a faster TLS",
      "The client also presents a certificate, so both sides authenticate",
      "It removes the need for encryption",
      "It only works over UDP",
    ],
    answer: 1,
    explanation: "mTLS = both client and server present/verify certs (two-way authentication).",
    hints: ["Who authenticates in normal TLS?", "'Mutual' = both directions."],
    solutionText: "The client also presents a certificate — two-way authentication",
  },
  {
    id: "n45", world: "w11", title: "Absorb the Flood", xp: 100, kind: "quiz",
    deepDive: `DDoS attacks come in layers, needing different defenses:
<ul>
<li><b>Volumetric</b> (L3/4 floods, UDP/DNS/NTP amplification) — measured in Gbps/Tbps; mitigated <b>upstream</b> by CDN/anycast + scrubbing centers that absorb and filter.</li>
<li><b>Application-layer</b> (L7, e.g. HTTP floods) — fewer packets but expensive requests; mitigated by WAF, rate limiting, bot management, caching.</li>
</ul>
<p>A single on-prem firewall just gets saturated by a big volumetric attack.</p>`,
    examples: [
      `<b>Volumetric:</b> a 300 Gbps UDP flood — absorbed by a provider's anycast/scrubbing network, not your edge box.`,
      `<b>L7:</b> a flood of expensive <code>/search</code> requests — throttled/challenged by a WAF/bot manager.`,
    ],
    pitfalls: [
      `Trying to handle volumetric DDoS at the on-prem firewall — the pipe/box saturates first.`,
      `Amplification abuses spoofable UDP services (DNS/NTP/memcached) — anti-spoofing (BCP 38) helps upstream.`,
      `Ignoring L7 DDoS because bandwidth looks fine — low-bandwidth request floods still exhaust the app.`,
    ],
    why: `DDoS categories and "mitigate volumetric upstream" is a standard availability question. Distinguishing L3/4 volumetric from L7 and matching the defense is the depth.`,
    keyPoints: [
      "Volumetric (L3/4) → upstream CDN/anycast/scrubbing.",
      "Application-layer (L7) → WAF, rate limiting, bot mgmt, caching.",
      "A single firewall can't absorb a large volumetric flood.",
    ],
    references: [
      { title: "Cloudflare — What is a DDoS attack?", url: "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/" },
      { title: "CISA — Understanding DDoS", url: "https://www.cisa.gov/news-events/alerts/2022/01/21/understanding-and-responding-distributed-denial-service-attacks" },
    ],
    story: `A volumetric DDoS can be hundreds of Gbps — no single appliance survives it.`,
    concept: `Volumetric DDoS is mitigated <b>upstream</b>: CDN/anycast to spread load, and cloud <b>scrubbing</b> services that absorb and filter attack traffic before it reaches you. A single on-prem firewall just gets saturated.`,
    task: `Best mitigation for a large <b>volumetric</b> DDoS?`,
    options: [
      "A tighter rule on the on-prem edge firewall",
      "Upstream scrubbing / CDN / anycast to absorb and filter traffic",
      "Switching the web server to a bigger CPU",
      "Blocking ICMP on the host",
    ],
    answer: 1,
    explanation: "Volumetric floods must be absorbed/scrubbed upstream (CDN/anycast/scrubbing centers).",
    hints: ["Can one firewall eat 300 Gbps?", "Push mitigation to the cloud edge."],
    solutionText: "Upstream scrubbing / CDN / anycast",
  },
  {
    id: "n46", world: "w11", title: "Stateful vs Stateless", xp: 110, kind: "quiz",
    deepDive: `Cloud network controls trip people up because two layers behave differently:
<ul>
<li><b>Security Groups</b> are <b>stateful</b> — allow an outbound (or inbound) flow and the <i>return</i> traffic is automatically permitted. They're allow-only, attached to instances/ENIs.</li>
<li><b>Network ACLs</b> are <b>stateless</b> — each direction is evaluated independently, so you must explicitly allow the return traffic (including the <b>ephemeral</b> response ports). They support allow <i>and</i> deny, at the subnet level.</li>
</ul>`,
    examples: [
      `<b>SG:</b> allow inbound 443 → responses flow back automatically.`,
      `<b>NACL:</b> allow inbound 443 AND allow outbound 1024–65535 (ephemeral) or replies are dropped.`,
    ],
    pitfalls: [
      `Forgetting ephemeral return ports on a NACL silently breaks connections that "should" work.`,
      `Expecting NACL deny rules in a Security Group (SGs are allow-only).`,
      `Layering SG + NACL without realizing both must permit the traffic.`,
    ],
    why: `"Security Group vs NACL (stateful vs stateless)" is one of the most common cloud-networking interview questions — and a frequent real-world debugging trap.`,
    keyPoints: [
      "SG = stateful, allow-only, instance-level (returns auto-allowed).",
      "NACL = stateless, allow+deny, subnet-level (allow return/ephemeral explicitly).",
      "Both must permit the traffic when layered.",
    ],
    references: [
      { title: "AWS — Security groups vs NACLs", url: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html" },
      { title: "AWS — Ephemeral ports", url: "https://docs.aws.amazon.com/vpc/latest/userguide/nacl-ephemeral-ports.html" },
    ],
    story: `Cloud network controls trip people up because two layers behave differently.`,
    concept: `AWS <b>Security Groups</b> are <b>stateful</b> — allow outbound and the return is automatic. <b>Network ACLs</b> are <b>stateless</b> — you must explicitly allow BOTH directions (including ephemeral return ports).`,
    task: `AWS Security Groups are stateful. Network ACLs are:`,
    options: [
      "Also stateful — return traffic is automatic",
      "Stateless — you must allow return traffic explicitly (incl. ephemeral ports)",
      "Only for IPv6",
      "Applied at the application layer",
    ],
    answer: 1,
    explanation: "NACLs are stateless; return traffic needs its own explicit rule.",
    hints: ["Which one forgets the connection?", "Think ephemeral return ports."],
    solutionText: "Stateless — allow return traffic explicitly",
  },
  {
    id: "n47", world: "w11", title: "Something in the DNS", xp: 120, kind: "quiz",
    deepDive: `DNS is a near-universal outbound protocol, so attackers abuse it as a <b>covert channel</b>. <b>DNS tunneling</b> encodes data/C2 inside DNS queries — typically long, high-entropy subdomains and heavy <b>TXT</b> traffic to a single attacker-controlled domain.
<pre>Signal: thousands of unique, random-looking subdomains of one domain;
        abnormal query volume; high TXT-record ratio</pre>`,
    examples: [
      `<b>Tunneling:</b> <code>aGVsbG8gd29ybGQ.exfil.evil.com</code>-style subdomains carrying encoded payload.`,
      `<b>Detection:</b> baseline per-domain query volume/entropy; alert on outliers; inspect at the resolver.`,
    ],
    pitfalls: [
      `Blocking DNS outright isn't viable — detect anomalies and force internal resolvers you can monitor.`,
      `Legit services (some CDNs/antivirus) use many subdomains — baseline to avoid false positives.`,
      `DoH can hide these lookups from network monitoring — a reason enterprises control DoH.`,
    ],
    why: `DNS tunneling/exfiltration is a classic covert-channel question. Knowing the signals (entropy, TXT volume, one domain) and that DoH complicates detection shows real depth.`,
    keyPoints: [
      "DNS tunneling = data/C2 hidden in DNS queries.",
      "Signals: long high-entropy subdomains, heavy TXT, one domain.",
      "Detect via resolver monitoring/baselines; DoH can blind you.",
    ],
    references: [
      { title: "MITRE ATT&CK — Exfiltration Over Alternative Protocol / DNS", url: "https://attack.mitre.org/techniques/T1048/" },
      { title: "SANS — Detecting DNS tunneling", url: "https://www.sans.org/white-papers/34152/" },
    ],
    story: `Attackers smuggle data out over a protocol you can't simply block: DNS.`,
    concept: `<b>DNS tunneling</b> encodes data/C2 inside DNS queries — typically long, high-entropy subdomains and heavy <b>TXT</b> traffic to a single attacker-controlled domain. Detection: volume/length anomalies and unusual record-type ratios per domain.`,
    task: `Many long, high-entropy subdomain lookups and heavy TXT queries to one domain most likely indicate:`,
    options: [
      "Normal web browsing",
      "DNS tunneling (exfiltration or C2)",
      "A successful TLS handshake",
      "An NTP sync",
    ],
    answer: 1,
    explanation: "Long random subdomains + heavy TXT to one domain = classic DNS tunneling.",
    hints: ["Why would one domain get thousands of weird subdomains?", "DNS can carry hidden payloads."],
    solutionText: "DNS tunneling (exfiltration or C2)",
  },

  /* ================= W12: CLOUD SECURITY ================= */
  {
    id: "n48", world: "w12", title: "Least Privilege IAM", xp: 100, kind: "quiz",
    deepDive: `<b>Least privilege</b> = grant only the specific actions on the specific resources an identity needs, for only as long as needed. Wildcards (<code>*:*</code>) are the opposite: one leaked credential then owns the account.
<pre>GOOD: allow s3:GetObject on arn:aws:s3:::reports/*
BAD : allow * on *</pre>`,
    examples: [
      `<b>Least privilege:</b> a single action scoped to one bucket ARN.`,
      `<b>Right-size continuously:</b> use last-accessed data / Access Analyzer to prune unused permissions.`,
    ],
    pitfalls: [
      `Granting <code>s3:*</code>/<code>*</code> "to move fast" — it never gets tightened later.`,
      `Static admin keys instead of short-lived role assumption.`,
      `Least privilege is ongoing — permissions creep as roles change.`,
    ],
    why: `Over-permissioned IAM is the most common serious cloud finding. "What does least privilege mean and how do you keep it?" → specific action+resource, pruned continuously.`,
    keyPoints: [
      "Grant minimum action+resource; avoid wildcards.",
      "Prefer short-lived roles over static admin keys.",
      "Continuously prune unused permissions.",
    ],
    references: [
      { title: "AWS — Grant least privilege", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege" },
      { title: "AWS — IAM Access Analyzer", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html" },
    ],
    story: `☁️ Cloud breaches usually trace back to over-permissive IAM. Grant the minimum.`,
    concept: `<b>Least privilege</b> means a policy grants only the specific actions on the specific resources needed. Wildcards like <code>Action:"*"</code> and <code>Resource:"*"</code> are the opposite — one leaked credential then owns everything.`,
    task: `Which IAM policy statement best follows least privilege?`,
    options: [
      'Allow Action "*" on Resource "*"',
      'Allow Action "s3:GetObject" on Resource "arn:aws:s3:::reports/*"',
      'Allow Action "s3:*" on Resource "*"',
      'Allow Action "iam:*" on Resource "*"',
    ],
    answer: 1,
    explanation: "A single specific action scoped to one resource ARN is least privilege; the others use dangerous wildcards.",
    hints: ["Wildcards (*) are the red flag.", "Narrow action + narrow resource = least privilege."],
    solutionText: 'Allow "s3:GetObject" on a specific bucket ARN',
  },
  {
    id: "n49", world: "w12", title: "Write an IAM Policy", xp: 150, kind: "l7", defaultAction: "block",
    deepDive: `Cloud authorization is policy evaluated per request: <b>who</b> (principal) can do <b>what</b> (action) on <b>which</b> (resource), under <b>conditions</b>. Deny-by-default, grant the minimum, and an explicit <b>deny</b> always wins:
<pre>block when resource eq secrets-bucket   # explicit deny beats any allow
allow when action eq s3:GetObject       # least-privilege grant</pre>`,
    examples: [
      `<b>Read-only, scoped:</b> allow <code>s3:GetObject</code> on the reports bucket; deny anything touching secrets; everything else default-denied.`,
      `<b>AWS reality:</b> effective access = (allows) minus (any explicit deny), capped by SCP/permission boundaries.`,
    ],
    pitfalls: [
      `Wildcards (<code>Action:"*"</code>, <code>Resource:"*"</code>) grant far more than intended — scope both.`,
      `Forgetting that an explicit <b>Deny</b> overrides any Allow (use it to carve out protected resources).`,
      `Policies combine (identity + resource + SCP + boundary) — reason about <i>effective</i> permissions, not one document.`,
    ],
    why: `Writing least-privilege IAM (and knowing deny-wins + wildcard danger) is core cloud security and a frequent hands-on question.`,
    keyPoints: [
      "Principal/action/resource/condition; deny-by-default.",
      "Explicit Deny overrides Allow; scope actions AND resources.",
      "Effective access = combined policies capped by SCP/boundaries.",
    ],
    references: [
      { title: "AWS — Policy evaluation logic", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html" },
      { title: "AWS — IAM best practices", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
    ],
    story: `The policy simulator now models cloud API calls (<code>action</code> + <code>resource</code>). Deny-by-default: grant an analyst read-only on the reports bucket, and nothing on secrets.`,
    concept: `Rules can match any attribute — here <code>action</code> and <code>resource</code>:
<pre>allow when action eq s3:GetObject
block when resource eq secrets-bucket</pre>
Remember: deny-by-default, first match wins, so a <b>block</b> above a broad <b>allow</b> wins.`,
    task: `Allow <code>s3:GetObject</code> on <code>reports-bucket</code> only. Block any action on <code>secrets-bucket</code>, and block non-read actions (like DeleteBucket).`,
    starter: `# deny by default; grant read-only on reports, protect secrets\n`,
    requests: [
      { method: "IAM", path: "s3:GetObject → reports-bucket", action: "s3:GetObject", resource: "reports-bucket", desc: "Analyst reads reports", expect: "allow" },
      { method: "IAM", path: "s3:DeleteBucket → reports-bucket", action: "s3:DeleteBucket", resource: "reports-bucket", desc: "Delete the bucket", expect: "block" },
      { method: "IAM", path: "s3:GetObject → secrets-bucket", action: "s3:GetObject", resource: "secrets-bucket", desc: "Read the secrets bucket", expect: "block" },
    ],
    hints: [
      "Protect secrets first: block when resource eq secrets-bucket",
      "Then grant read: allow when action eq s3:GetObject",
      "Default-block drops DeleteBucket automatically.",
    ],
    solution: `block when resource eq secrets-bucket\nallow when action eq s3:GetObject`,
    solutionText: `block when resource eq secrets-bucket\nallow when action eq s3:GetObject`,
  },
  {
    id: "n50", world: "w12", title: "The Public Bucket", xp: 100, kind: "quiz",
    deepDive: `The archetypal cloud leak: object storage opened to the world. A bucket policy with <code>Principal: "*"</code> allowing <code>s3:GetObject</code> on <code>bucket/*</code> means <b>anyone on the internet</b> can read every object.
<p>Exposure can come from the bucket policy, object ACLs, or disabled account-level "Block Public Access" — so you must check all sources.</p>`,
    examples: [
      `<b>World-readable:</b> <code>Principal:"*"</code> + GetObject = public data leak (behind countless breaches).`,
      `<b>Prevent:</b> enable account-level Block Public Access so new buckets are private by default.`,
    ],
    pitfalls: [
      `A private bucket can still hold individual objects with public ACLs — check object-level too.`,
      `"Static site" buckets are legitimately public — allowlist those so remediation doesn't break them.`,
      `Public via a permissive policy is easy to miss if you only review ACLs.`,
    ],
    why: `Public-bucket exposure is the most famous cloud misconfiguration. Knowing the multiple exposure sources and account-level Block Public Access is the expected answer.`,
    keyPoints: [
      "Principal:\"*\" + GetObject = world-readable.",
      "Exposure from policy, ACLs, or account setting — check all.",
      "Enable account-level Block Public Access by default.",
    ],
    references: [
      { title: "AWS — Blocking public access to S3", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html" },
      { title: "OWASP — Cloud security", url: "https://owasp.org/www-project-cloud-security/" },
    ],
    story: `The classic cloud leak: an object store accidentally opened to the world.`,
    concept: `A bucket policy with <code>Principal: "*"</code> allowing <code>s3:GetObject</code> on <code>arn:aws:s3:::bucket/*</code> means <b>anyone on the internet</b> can read every object — the root cause of countless data leaks.`,
    task: `A bucket policy sets <code>Principal: "*"</code> + <code>Allow s3:GetObject</code> on <code>bucket/*</code>. What does it mean?`,
    options: [
      "Only your account can read the objects",
      "Every object is publicly readable by anyone on the internet",
      "The bucket is encrypted at rest",
      "Access requires MFA",
    ],
    answer: 1,
    explanation: "Principal \"*\" = anonymous/anyone; this exposes all objects publicly. Block public access instead.",
    hints: ["What does Principal \"*\" mean?", "Think of the famous open-bucket leaks."],
    solutionText: "Every object is publicly readable by anyone",
  },
  {
    id: "n51", world: "w12", title: "Keys Behind the Encryption", xp: 100, kind: "quiz",
    deepDive: `Server-side encryption with <b>KMS</b> protects data at rest — but it's only as strong as <b>who can use the key</b>. A permissive <b>key policy</b> (broad <code>kms:Decrypt</code>) lets too many principals decrypt, undoing the protection.
<p>In AWS, key usage requires permission in both the key policy and IAM; the key policy is the one people forget to audit.</p>`,
    examples: [
      `<b>Audit the key, not just the bucket:</b> who holds <code>kms:Decrypt</code> on this key?`,
      `<b>Tighten:</b> scope decrypt to the specific roles/services that genuinely need it; rotate keys.`,
    ],
    pitfalls: [
      `"It's KMS-encrypted" means little if the key policy grants decrypt broadly or cross-account.`,
      `Reviewing IAM but not the key policy misses the real exposure.`,
      `Encryption at rest doesn't stop an attacker who already has valid decrypt access.`,
    ],
    why: `"You enabled KMS — what actually determines protection?" → key access (key policy/IAM). This nuance separates checkbox encryption from real data protection.`,
    keyPoints: [
      "Encryption strength = how few principals can use the key.",
      "KMS access = key policy AND IAM — audit both.",
      "Watch broad/cross-account kms:Decrypt; rotate keys.",
    ],
    references: [
      { title: "AWS — KMS key policies", url: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html" },
      { title: "AWS — KMS best practices", url: "https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html" },
    ],
    story: `Encryption at rest is only as strong as who can use the key.`,
    concept: `Server-side encryption with <b>KMS</b> protects data at rest, but a permissive <b>key policy / IAM</b> (who may call <code>kms:Decrypt</code>) can undo it — if everyone can use the key, the encryption adds little against an insider or stolen role.`,
    task: `You enable KMS encryption on a bucket. What most determines whether it actually protects the data?`,
    options: [
      "The color of the AWS console theme",
      "Who is allowed to use the key (key policy / IAM kms:Decrypt)",
      "The bucket's name",
      "The region's time zone",
    ],
    answer: 1,
    explanation: "Access to the key (key policy/IAM) decides real protection; over-broad kms:Decrypt undermines encryption.",
    hints: ["Encryption shifts the problem to key access.", "Who can call kms:Decrypt?"],
    solutionText: "Who is allowed to use the key (key policy / IAM)",
  },
  {
    id: "n52", world: "w12", title: "SSRF to Metadata", xp: 120, kind: "quiz",
    deepDive: `In the cloud, <b>SSRF</b> is especially dangerous because of the <b>instance metadata service</b> at <code>169.254.169.254</code>, which can hand out the instance's IAM role credentials. An attacker who makes your server fetch that URL steals cloud creds (this fueled a major breach).
<p>Defenses, layered: enforce <b>IMDSv2</b> (token-required, blocks simple SSRF), block egress to the metadata IP, and validate/allowlist outbound URLs.</p>`,
    examples: [
      `<b>Attack:</b> SSRF → <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> → role creds.`,
      `<b>Defense:</b> IMDSv2 requires a PUT-obtained token that simple SSRF can't get.`,
    ],
    pitfalls: [
      `IMDSv1 (no token) is trivially exploitable via SSRF — enforce IMDSv2 and disable v1.`,
      `URL allowlists get bypassed by DNS rebinding/redirects — validate the resolved IP and disable redirects.`,
      `Over-permissioned instance roles make a stolen credential far worse — least-privilege the role too.`,
    ],
    why: `Cloud SSRF → metadata credential theft is a landmark cloud vuln (Capital One). IMDSv2 + egress block + URL validation + least-privilege roles is the complete answer.`,
    keyPoints: [
      "SSRF to 169.254.169.254 can steal instance role creds.",
      "Enforce IMDSv2, block metadata egress, validate URLs (resolved IP).",
      "Least-privilege the instance role to limit damage.",
    ],
    references: [
      { title: "AWS — Use IMDSv2", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html" },
      { title: "OWASP — SSRF", url: "https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/" },
    ],
    story: `A server fetching user-supplied URLs is a gift to attackers in the cloud.`,
    concept: `In <b>SSRF</b>, an attacker makes the server request <code>http://169.254.169.254/...</code> (the instance metadata service) to steal role credentials. Mitigations: enforce <b>IMDSv2</b> (token-required), block egress to the metadata IP, and validate/allowlist outbound URLs.`,
    task: `Your app fetches user-provided URLs; an attacker targets <code>169.254.169.254</code>. Best mitigation?`,
    options: [
      "Return a prettier error page",
      "Enforce IMDSv2 and block app egress to the metadata IP + validate URLs",
      "Increase the server's RAM",
      "Switch from HTTPS to HTTP",
    ],
    answer: 1,
    explanation: "IMDSv2 + blocking metadata egress + URL allowlisting defends against SSRF credential theft.",
    hints: ["169.254.169.254 is the metadata endpoint.", "Think IMDSv2 + egress control."],
    solutionText: "Enforce IMDSv2, block metadata egress, validate URLs",
  },
  {
    id: "n53", world: "w12", title: "Who Did What?", xp: 90, kind: "quiz",
    deepDive: `Cloud IR depends on the audit trail. <b>CloudTrail</b> records management (and optionally data) <b>API calls</b> — who did what, when, from where — across the account. (VPC Flow Logs capture network traffic; CloudWatch holds metrics/logs — different jobs.)
<p>Enable it org-wide, send logs to a <b>separate, locked-down</b> account/bucket, and alert on sensitive events (CloudTrail disabled, root login, policy changes).</p>`,
    examples: [
      `<b>Investigate:</b> CloudTrail shows which principal created the public bucket or disabled logging, and from what IP.`,
      `<b>Detect:</b> alert on <code>StopLogging</code>, root usage, mass <code>Delete*</code>, IAM policy changes.`,
    ],
    pitfalls: [
      `Storing logs in the same account an attacker controls lets them tamper/delete — isolate and make immutable.`,
      `Confusing CloudTrail (API audit) with Flow Logs (network) — they answer different questions.`,
      `Not alerting on "logging disabled" — a classic attacker first move.`,
    ],
    why: `"Which service gives an API audit trail?" (CloudTrail) and "how do you protect the logs?" are standard cloud-IR questions. Isolation + alerting on log tampering is the mature take.`,
    keyPoints: [
      "CloudTrail = API-call audit trail (who/what/when/where).",
      "Flow Logs = network, CloudWatch = metrics/logs — different.",
      "Centralize to an isolated, immutable store; alert on tampering.",
    ],
    references: [
      { title: "AWS — What is CloudTrail?", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html" },
      { title: "AWS — CloudTrail security best practices", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/best-practices-security.html" },
    ],
    story: `Incident response in the cloud lives or dies on your audit trail.`,
    concept: `<b>CloudTrail</b> records a log of API calls (who did what, when, from where) across the account — essential for investigations and detections. (VPC Flow Logs capture network traffic, not API calls.)`,
    task: `Which service gives an audit trail of all management API calls in an AWS account?`,
    options: ["VPC Flow Logs", "CloudTrail", "Route 53", "Auto Scaling"],
    answer: 1,
    explanation: "CloudTrail logs API activity (identity, action, time, source) for audit and detection.",
    hints: ["API calls, not packets.", "It 'trails' everything done in the account."],
    solutionText: "CloudTrail",
  },

  /* ================= W13: CONTAINER & K8s SECURITY ================= */
  {
    id: "n54", world: "w13", title: "Containers Aren't VMs", xp: 100, kind: "quiz",
    deepDive: `Containers share the <b>host kernel</b> (isolated by namespaces + cgroups); VMs each run their own kernel on a hypervisor. So container isolation is <b>weaker</b> — a kernel exploit or a privileged/misconfigured container can <b>escape to the host</b>.
<p>For stronger isolation of untrusted workloads, use sandboxed runtimes (gVisor, Kata Containers / microVMs) that add a boundary.</p>`,
    examples: [
      `<b>Shared kernel risk:</b> a kernel 0-day or privileged container can break out to the node.`,
      `<b>Stronger isolation:</b> gVisor (user-space kernel) or Kata (lightweight VM per pod) for untrusted tenants.`,
    ],
    pitfalls: [
      `Assuming container = VM-level isolation — it isn't; design multi-tenancy accordingly.`,
      `Running untrusted/multi-tenant workloads on a shared kernel without sandboxing.`,
      `Privileged containers / host namespaces erase what isolation there is.`,
    ],
    why: `"Why is container isolation weaker than a VM?" (shared kernel) is a near-guaranteed cloud-native question. Mentioning gVisor/Kata for untrusted workloads shows depth.`,
    keyPoints: [
      "Containers share the host kernel (namespaces/cgroups); VMs don't.",
      "Weaker isolation → escapes can reach the host.",
      "Use gVisor/Kata/microVMs for untrusted workloads.",
    ],
    references: [
      { title: "NIST SP 800-190 — Container security", url: "https://csrc.nist.gov/pubs/sp/800/190/final" },
      { title: "gVisor — Sandboxed containers", url: "https://gvisor.dev/docs/" },
    ],
    story: `🐳 The #1 container-security misconception bites teams hard.`,
    concept: `Containers share the host's <b>kernel</b> (isolated by namespaces + cgroups), unlike VMs which each run their own kernel on a hypervisor. So a kernel exploit or a <b>privileged</b>/misconfigured container can escape to the host — weaker isolation than a VM.`,
    task: `Why is container isolation generally weaker than VM isolation?`,
    options: [
      "Containers use more RAM",
      "Containers share the host kernel, so an escape/kernel bug can reach the host",
      "Containers can't run Linux",
      "VMs have no isolation at all",
    ],
    answer: 1,
    explanation: "Containers share the host kernel; VMs each have their own kernel behind a hypervisor.",
    hints: ["What do all containers on a host share?", "Think kernel vs hypervisor."],
    solutionText: "They share the host kernel (namespaces/cgroups), so escapes can reach the host",
  },
  {
    id: "n55", world: "w13", title: "Harden the Image", xp: 100, kind: "quiz",
    deepDive: `Most container risk is baked into the <b>image</b> before it runs. Image hygiene:
<ul>
<li><b>Minimal base</b> (distroless/alpine) — fewer packages = smaller attack surface.</li>
<li><b>Non-root</b> user; drop capabilities.</li>
<li><b>Scan</b> for CVEs in CI (Trivy/Grype).</li>
<li><b>Pin by digest</b> (<code>@sha256:…</code>), not <code>:latest</code>.</li>
<li>No secrets baked into layers.</li>
</ul>`,
    examples: [
      `<b>Worst practice:</b> pull <code>:latest</code> and embed an API key in a layer — unpinned and leaks creds.`,
      `<b>Good:</b> distroless base, non-root, scanned, pinned to a digest.`,
    ],
    pitfalls: [
      `Secrets in image layers persist in every copy/registry — they're effectively public to anyone with the image.`,
      `<code>:latest</code> breaks reproducibility and lets unreviewed code ship.`,
      `Fat base images carry CVEs you don't even use.`,
    ],
    why: `Image hardening is foundational container security. "What makes a secure image?" → minimal, non-root, scanned, pinned, no secrets — is the expected checklist.`,
    keyPoints: [
      "Minimal base + non-root + dropped capabilities.",
      "Scan in CI; pin by digest, not :latest.",
      "Never bake secrets into layers.",
    ],
    references: [
      { title: "NIST SP 800-190 — Container security", url: "https://csrc.nist.gov/pubs/sp/800/190/final" },
      { title: "Docker — Build best practices", url: "https://docs.docker.com/build/building/best-practices/" },
    ],
    story: `Most container risk is baked into the image before it ever runs.`,
    concept: `Image hygiene: use a <b>minimal</b> base, run as <b>non-root</b>, <b>scan</b> for CVEs, pin to an immutable <b>digest</b> (not <code>:latest</code>), and don't bake secrets in layers.`,
    task: `Which is the <b>worst</b> image practice?`,
    options: [
      "Using a minimal/distroless base image",
      "Running the container as a non-root user",
      "Pulling the mutable :latest tag and embedding an API key in a layer",
      "Scanning the image for CVEs in CI",
    ],
    answer: 2,
    explanation: "Mutable :latest + baked-in secrets is the worst: unpinned and leaks credentials.",
    hints: ["Which option is unpinned AND leaks a secret?", ":latest + embedded key = bad."],
    solutionText: "Pulling :latest and embedding a secret in a layer",
  },
  {
    id: "n56", world: "w13", title: "K8s NetworkPolicy", xp: 150, kind: "firewall",
    deepDive: `By default, <b>every pod can talk to every other pod</b> — a flat network ideal for lateral movement. A Kubernetes <b>NetworkPolicy</b> adds default-deny + explicit allows for pod-to-pod (east-west) traffic, selected by labels/namespaces.
<pre>frontend --8080--> backend --5432--> database
# database reachable only from backend; nothing else</pre>
<p>NetworkPolicies need a CNI that enforces them (Calico, Cilium) — applying one with an unsupported CNI silently does nothing.</p>`,
    examples: [
      `<b>Tier the app:</b> allow frontend→backend:8080 and backend→database:5432; deny frontend→database and internet→database.`,
      `<b>Default-deny:</b> a policy selecting all pods with no ingress makes the namespace deny-by-default.`,
    ],
    pitfalls: [
      `No enforcing CNI = NetworkPolicies are accepted but ignored — verify your CNI supports them.`,
      `Policies are namespaced and additive (allow-only); forgetting a default-deny leaves everything open.`,
      `Label/selector mistakes silently widen or break connectivity.`,
    ],
    why: `Pod-to-pod segmentation via NetworkPolicy is core Kubernetes security and the microsegmentation story in K8s. Interviewers probe the default-allow problem and CNI dependency.`,
    keyPoints: [
      "Pods are default-allow; NetworkPolicy adds default-deny + explicit allows.",
      "Selected by labels/namespaces; needs an enforcing CNI (Calico/Cilium).",
      "Segments east-west traffic to limit lateral movement.",
    ],
    references: [
      { title: "Kubernetes — Network Policies", url: "https://kubernetes.io/docs/concepts/services-networking/network-policies/" },
      { title: "Cilium — Network policy", url: "https://docs.cilium.io/en/stable/security/policy/" },
    ],
    story: `By default, every pod in a cluster can talk to every other pod. A <b>NetworkPolicy</b> fixes that with default-deny + explicit allows. The firewall simulator models pod-to-pod flows (zones = tiers).`,
    concept: `Same rule engine: <code>action proto src dst [port]</code>, default-deny. Here zones are app tiers: <code>frontend</code>, <code>backend</code>, <code>database</code>, plus <code>internet</code>.`,
    task: `Allow <code>frontend → backend:8080</code> and <code>backend → database:5432</code>. The database must NOT be reachable from the frontend or the internet.`,
    starter: `# default-deny NetworkPolicy: allow only the needed pod flows\n`,
    flows: [
      { proto: "tcp", src: "frontend", dst: "backend", port: 8080, desc: "Frontend → Backend API", expect: "allow" },
      { proto: "tcp", src: "backend", dst: "database", port: 5432, desc: "Backend → Database", expect: "allow" },
      { proto: "tcp", src: "frontend", dst: "database", port: 5432, desc: "Frontend → Database (skip backend)", expect: "deny" },
      { proto: "tcp", src: "internet", dst: "database", port: 5432, desc: "Internet → Database", expect: "deny" },
    ],
    hints: ["Two allow lines for the two legitimate hops.", "allow tcp frontend backend 8080 / allow tcp backend database 5432"],
    solution: `allow tcp frontend backend 8080\nallow tcp backend database 5432`,
    solutionText: `allow tcp frontend backend 8080\nallow tcp backend database 5432`,
  },
  {
    id: "n57", world: "w13", title: "RBAC & Service Accounts", xp: 110, kind: "quiz",
    deepDive: `Every pod runs as a <b>service account</b>; a compromised pod inherits that SA's Kubernetes API rights. Scope each workload's SA to the <b>narrowest Role</b> (namespaced) possible — never cluster-admin.
<pre>Role (namespaced): get/list configmaps  ->  RoleBinding  ->  the pod's SA</pre>
<p>Also disable auto-mounting the SA token where it isn't needed — otherwise the API credential sits inside every pod.</p>`,
    examples: [
      `<b>Scoped:</b> a web pod gets a Role for <code>get/list configmaps</code> in its namespace — nothing more.`,
      `<b>Dangerous:</b> binding the default SA to cluster-admin means one popped pod owns the cluster.`,
    ],
    pitfalls: [
      `The <b>default</b> service account often has more than needed and its token auto-mounts — disable automount or scope it.`,
      `ClusterRoleBindings grant cluster-wide power; prefer namespaced Roles/RoleBindings.`,
      `Wildcard verbs/resources (<code>*</code>) in a Role defeat least privilege.`,
    ],
    why: `K8s RBAC + service-account least privilege is central to limiting breach impact. "How would you scope a pod's permissions?" → narrow namespaced Role bound to its SA, token automount off.`,
    keyPoints: [
      "Pods inherit their service account's API rights.",
      "Bind a narrow namespaced Role; never cluster-admin.",
      "Disable SA token automount where unneeded.",
    ],
    references: [
      { title: "Kubernetes — RBAC", url: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/" },
      { title: "Kubernetes — Service accounts", url: "https://kubernetes.io/docs/concepts/security/service-accounts/" },
    ],
    story: `A compromised pod inherits its service account's rights. Least privilege matters here too.`,
    concept: `In Kubernetes RBAC, bind each workload's <b>service account</b> to the narrowest Role possible. Granting <b>cluster-admin</b> (or the default SA broad rights) means one popped pod can take over the whole cluster.`,
    task: `A web pod only needs to read config maps in its namespace. What's the right RBAC approach?`,
    options: [
      "Bind its service account to cluster-admin",
      "A Role allowing get/list on configmaps in that namespace, bound to its service account",
      "Give every pod the default service account with broad rights",
      "Disable RBAC entirely",
    ],
    answer: 1,
    explanation: "Scope a namespaced Role to exactly the needed verbs/resources and bind it to that SA.",
    hints: ["Least privilege = narrowest Role.", "cluster-admin for a web pod is a disaster."],
    solutionText: "A narrow namespaced Role bound to the pod's service account",
  },
  {
    id: "n58", world: "w13", title: "Secrets in the Cluster", xp: 110, kind: "quiz",
    deepDive: `Kubernetes <b>Secret</b> values are only <b>base64-encoded</b> in etcd by default — encoding, not encryption. Anyone with etcd or broad API access can read them. Harden by:
<ul>
<li>Enabling <b>encryption at rest</b> for etcd (KMS provider).</li>
<li>Restricting RBAC on Secrets (get/list is sensitive).</li>
<li>Using an <b>external vault</b> (Vault, Secrets Store CSI) so secrets aren't stored in the cluster at all.</li>
</ul>`,
    examples: [
      `<b>Reality check:</b> <code>kubectl get secret -o yaml | base64 -d</code> reveals the value — it was never encrypted.`,
      `<b>Hardened:</b> etcd encryption + tight RBAC, or pull from Vault via CSI at runtime.`,
    ],
    pitfalls: [
      `Assuming K8s Secrets are encrypted — they're base64 unless you enable encryption at rest.`,
      `Broad <code>get secrets</code> RBAC hands out all credentials.`,
      `Secrets in env vars leak via <code>describe</code>/logs — prefer mounted files or a vault.`,
    ],
    why: `"Are Kubernetes Secrets encrypted?" is a classic gotcha — the answer is "base64 by default; enable encryption at rest / use a vault." It signals real K8s security knowledge.`,
    keyPoints: [
      "K8s Secrets = base64 (not encrypted) by default.",
      "Enable etcd encryption at rest; tighten Secret RBAC.",
      "Prefer an external vault / CSI for real secret management.",
    ],
    references: [
      { title: "Kubernetes — Encrypt secret data at rest", url: "https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/" },
      { title: "Kubernetes — Good practices for Secrets", url: "https://kubernetes.io/docs/concepts/security/secrets-good-practices/" },
    ],
    story: `Kubernetes Secrets are base64, not encrypted by default — handle with care.`,
    concept: `K8s Secret values are only <b>base64-encoded</b> in etcd unless you enable <b>encryption at rest</b> (or use an external vault/CSI). Don't bake secrets into images or plain env; restrict RBAC on Secrets and enable etcd encryption.`,
    task: `Which statement about Kubernetes Secrets is correct?`,
    options: [
      "They're strongly encrypted by default in etcd",
      "They're only base64-encoded unless you enable encryption at rest / use a vault",
      "They can't be accessed via RBAC",
      "Putting them in the image is the recommended approach",
    ],
    answer: 1,
    explanation: "K8s Secrets are base64 by default; enable etcd encryption at rest or use an external vault.",
    hints: ["base64 is encoding, not encryption.", "You must turn on encryption at rest."],
    solutionText: "Only base64-encoded unless you enable encryption at rest / a vault",
  },
  {
    id: "n59", world: "w13", title: "Pod Security", xp: 110, kind: "quiz",
    deepDive: `The pod's <code>securityContext</code> is an attack surface. Harden it to shrink escape potential:
<ul>
<li><code>runAsNonRoot: true</code>, specific non-zero UID</li>
<li><code>readOnlyRootFilesystem: true</code></li>
<li>Drop all Linux <b>capabilities</b> (add back only what's needed)</li>
<li>No <code>privileged</code>, no <code>hostPID/hostNetwork/hostPath</code></li>
</ul>
<p>The <b>Pod Security Standards</b> (privileged / baseline / restricted) codify these tiers.</p>`,
    examples: [
      `<b>Worst combo:</b> <code>privileged: true</code> + a <code>hostPath</code> mount of <code>/</code> = direct host takeover.`,
      `<b>Restricted profile:</b> non-root, read-only rootfs, all caps dropped, no host namespaces.`,
    ],
    pitfalls: [
      `Privileged + hostPath / host namespaces effectively give node-level access.`,
      `Adding broad capabilities (<code>CAP_SYS_ADMIN</code> ≈ root) defeats hardening.`,
      `Setting runAsNonRoot but the image defaults to root and no UID is specified → it fails or runs root.`,
    ],
    why: `"Which pod settings are dangerous / how do you harden a pod?" is standard. Naming privileged + hostPath as the worst and citing Pod Security Standards shows real depth.`,
    keyPoints: [
      "Harden securityContext: non-root, read-only rootfs, drop caps.",
      "No privileged / host namespaces / hostPath to sensitive paths.",
      "Use the restricted Pod Security Standard as the target.",
    ],
    references: [
      { title: "Kubernetes — Pod Security Standards", url: "https://kubernetes.io/docs/concepts/security/pod-security-standards/" },
      { title: "Kubernetes — Security context", url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/" },
    ],
    story: `The pod spec itself is an attack surface. Tighten the securityContext.`,
    concept: `Harden pods: <code>runAsNonRoot</code>, <code>readOnlyRootFilesystem</code>, <b>drop all capabilities</b>, no <code>privileged</code>, no <code>hostPath</code>/host namespaces. These shrink the blast radius of a compromised container.`,
    task: `Which pod setting most increases the risk of a host takeover?`,
    options: [
      "runAsNonRoot: true",
      "readOnlyRootFilesystem: true",
      "privileged: true with a hostPath mount of /",
      "Dropping all Linux capabilities",
    ],
    answer: 2,
    explanation: "privileged + hostPath mount of the host root is a direct path to host compromise.",
    hints: ["Which option grants host-level power?", "privileged + hostPath / = escape."],
    solutionText: "privileged: true with a hostPath mount of /",
  },
  {
    id: "n60", world: "w13", title: "Stop It at Admission", xp: 120, kind: "quiz",
    deepDive: `The best place to stop an insecure pod is <b>before it runs</b>. <b>Admission controllers</b> evaluate every create/update request and can <b>reject</b> non-compliant workloads:
<ul>
<li><b>Pod Security Admission</b> (built-in) enforces the baseline/restricted standards per namespace.</li>
<li><b>OPA/Gatekeeper</b> and <b>Kyverno</b> enforce custom policy-as-code (no :latest, no privileged, signed images only…).</li>
</ul>`,
    examples: [
      `<b>Prevent, not detect:</b> a privileged or unsigned pod is rejected at <code>kubectl apply</code>.`,
      `<b>Policy as code:</b> a Kyverno rule requires resource limits and a non-root user on every pod.`,
    ],
    pitfalls: [
      `Audit-only (detect) without enforce (deny) lets bad pods run — pair detection with admission.`,
      `Cluster-wide hard denies without exceptions break legitimate workloads — use per-namespace policy + waivers.`,
      `Admission webhooks that fail open (or are down) can be bypassed — plan failure behavior.`,
    ],
    why: `"How do you prevent insecure pods from being scheduled?" → admission control (PSA / OPA-Gatekeeper / Kyverno). Prevention-over-detection with policy-as-code is the modern answer.`,
    keyPoints: [
      "Admission controllers reject non-compliant pods at deploy time.",
      "Pod Security Admission (built-in) + OPA/Kyverno (custom policy).",
      "Prevent > detect; use namespaced policy + waivers; mind fail-open.",
    ],
    references: [
      { title: "Kubernetes — Admission controllers", url: "https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/" },
      { title: "Kyverno — Policy as code", url: "https://kyverno.io/docs/" },
    ],
    story: `The best place to block an insecure pod is before it ever runs.`,
    concept: `<b>Admission controllers</b> (Pod Security Admission, or policy engines like <b>OPA/Gatekeeper</b> and Kyverno) evaluate every create/update request and <b>reject</b> non-compliant pods at deploy time — preventive, not just detective.`,
    task: `How do you prevent privileged or unscanned pods from ever being scheduled?`,
    options: [
      "Delete them manually after they start",
      "An admission controller / policy engine that rejects non-compliant pods at deploy time",
      "Email developers a reminder",
      "Increase the node count",
    ],
    answer: 1,
    explanation: "Admission control (PSA / OPA-Gatekeeper / Kyverno) blocks bad pods before they run.",
    hints: ["Block at create time, not after.", "Think OPA/Gatekeeper, Pod Security Admission."],
    solutionText: "An admission controller/policy engine that rejects bad pods at deploy time",
  },

  /* ================= W14: DETECTION ENGINEERING / SIEM ================= */
  {
    id: "n61", world: "w14", title: "What a SIEM Does", xp: 90, kind: "quiz",
    deepDive: `A <b>SIEM</b> (Security Information and Event Management) is the SOC's central brain: it <b>ingests</b> logs from everywhere (endpoints, network, cloud, identity, apps), <b>normalizes</b> them to a common schema, <b>correlates</b> across sources, and raises <b>alerts</b> on detection rules — plus storage for hunting and compliance.
<p>Modern "next-gen SIEM" adds analytics/UEBA and tight SOAR integration.</p>`,
    examples: [
      `<b>Cross-source correlation:</b> a firewall deny + an IDS alert + a failed login tied to one incident.`,
      `<b>Tools:</b> Splunk, Microsoft Sentinel, Elastic, CrowdStrike NG-SIEM.`,
    ],
    pitfalls: [
      `"Collect everything" explodes cost and noise — onboard the highest-value sources first.`,
      `Garbage in, garbage out: without normalization/parsing, correlation across sources fails.`,
      `A SIEM detects/alerts; it doesn't block (that's firewalls/EDR/SOAR).`,
    ],
    why: `"What does a SIEM do?" is a baseline SOC question. Ingest → normalize → correlate → alert (+ store for hunt/compliance) is the complete answer.`,
    keyPoints: [
      "SIEM ingests, normalizes, correlates, and alerts across sources.",
      "Central store for hunting and compliance; NG-SIEM adds UEBA/SOAR.",
      "Prioritize high-value log sources; normalize for correlation.",
    ],
    references: [
      { title: "Microsoft — What is a SIEM?", url: "https://www.microsoft.com/en-us/security/business/security-101/what-is-siem" },
      { title: "CrowdStrike — Next-Gen SIEM", url: "https://www.crowdstrike.com/en-us/platform/next-gen-siem/" },
    ],
    story: `🚨 The SOC's central nervous system.`,
    concept: `A <b>SIEM</b> (Security Information and Event Management) <b>aggregates logs</b> from many sources (endpoints, network, cloud, identity), <b>normalizes and correlates</b> them, and raises <b>alerts</b> on detection rules — giving one place to hunt and investigate.`,
    task: `What is a SIEM's core job?`,
    options: [
      "Encrypt all network traffic",
      "Aggregate and correlate logs across sources and alert on detections",
      "Replace the firewall",
      "Store backups of user files",
    ],
    answer: 1,
    explanation: "SIEM centralizes, correlates, and alerts on security-relevant events across the environment.",
    hints: ["Think central log brain for the SOC.", "Aggregate + correlate + alert."],
    solutionText: "Aggregate and correlate logs across sources and alert",
  },
  {
    id: "n62", world: "w14", title: "Detect vs Prevent", xp: 90, kind: "quiz",
    deepDive: `Security controls split into <b>preventive</b> (stop it happening — firewall, IPS, MFA, WAF), <b>detective</b> (notice it — SIEM, IDS, EDR alerts), and <b>responsive/corrective</b> (act — SOAR, IR). A <b>SIEM is primarily detective</b>: it surfaces alerts; it doesn't block traffic itself.
<p>You need all three — prevention fails eventually, so detection + response limit the damage (and dwell time).</p>`,
    examples: [
      `<b>Preventive:</b> firewall/IPS/MFA. <b>Detective:</b> SIEM/IDS/EDR. <b>Responsive:</b> SOAR playbooks, IR team.`,
      `<b>Defense in depth:</b> assume prevention fails; detection + fast response contain the breach.`,
    ],
    pitfalls: [
      `Treating detection as optional because "we have a firewall" — prevention always eventually fails.`,
      `Expecting a SIEM to block — it alerts; enforcement comes from other controls / SOAR.`,
      `Detection without response capacity = alerts nobody acts on.`,
    ],
    why: `Preventive vs detective vs responsive is a foundational framing. Knowing a SIEM is detective (and why you still need it) is the point.`,
    keyPoints: [
      "Preventive (block), detective (notice), responsive (act) — need all.",
      "SIEM is detective; it alerts, it doesn't block.",
      "Prevention fails eventually → detection + response limit damage.",
    ],
    references: [
      { title: "NIST — Security & Privacy Controls (SP 800-53)", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
      { title: "Cloudflare — IDS vs IPS", url: "https://www.cloudflare.com/learning/security/what-is-an-intrusion-detection-system/" },
    ],
    story: `Know what a SIEM does and doesn't do on its own.`,
    concept: `A SIEM is primarily <b>detective</b> — it surfaces alerts for humans/automation to act on. It doesn't block traffic itself (that's firewalls/IPS/EDR). Blocking actions come from integrations, often driven by <b>SOAR</b>.`,
    task: `A SIEM by itself primarily provides:`,
    options: [
      "Inline blocking of malicious packets",
      "Detection and alerting (not blocking on its own)",
      "Disk encryption",
      "Password rotation",
    ],
    answer: 1,
    explanation: "SIEM detects and alerts; enforcement comes from other controls (often orchestrated via SOAR).",
    hints: ["Does a SIEM sit inline on the wire?", "It detects; others enforce."],
    solutionText: "Detection and alerting (not blocking by itself)",
  },
  {
    id: "n63", world: "w14", title: "Map to MITRE ATT&CK", xp: 100, kind: "quiz",
    deepDive: `<b>MITRE ATT&CK</b> is a knowledge base of real-world adversary <b>tactics</b> (the "why" — e.g., Persistence, Lateral Movement) and <b>techniques</b> (the "how" — e.g., T1110 Brute Force). Mapping your detections to ATT&CK reveals <b>coverage gaps</b> and gives everyone a shared vocabulary.
<p>It's the backbone of detection engineering, threat hunting, and purple-team exercises.</p>`,
    examples: [
      `<b>Coverage map:</b> chart which techniques you can detect vs not — the blank cells are your roadmap.`,
      `<b>Shared language:</b> "we saw T1059 (command/scripting) into T1003 (credential dumping)".`,
    ],
    pitfalls: [
      `Chasing 100% technique coverage is unrealistic — prioritize techniques relevant to your threat model/assets.`,
      `Mapping a detection to a tactic once and never revisiting as adversaries evolve.`,
      `Confusing tactics (goal) with techniques (method).`,
    ],
    why: `ATT&CK is the lingua franca of modern detection/hunting. "How do you measure detection coverage?" → map detections to ATT&CK and find the gaps.`,
    keyPoints: [
      "ATT&CK = adversary tactics (why) + techniques (how), real-world.",
      "Map detections to it to find and prioritize coverage gaps.",
      "Shared vocabulary for detection, hunting, purple teaming.",
    ],
    references: [
      { title: "MITRE ATT&CK — Enterprise matrix", url: "https://attack.mitre.org/matrices/enterprise/" },
      { title: "MITRE — ATT&CK Navigator (coverage mapping)", url: "https://mitre-attack.github.io/attack-navigator/" },
    ],
    story: `Great detection programs speak a common language of adversary behavior.`,
    concept: `<b>MITRE ATT&CK</b> is a knowledge base of real-world adversary <b>tactics and techniques</b> (TTPs). Mapping detections to ATT&CK shows coverage gaps and standardizes how teams describe threats.`,
    task: `What is MITRE ATT&CK used for?`,
    options: [
      "A list of allowed TCP ports",
      "A framework of adversary tactics & techniques to map detection coverage",
      "A password strength meter",
      "A cloud billing tool",
    ],
    answer: 1,
    explanation: "ATT&CK catalogs adversary TTPs; teams map detections to it to measure coverage.",
    hints: ["It's about attacker behavior, not ports.", "Tactics & techniques (TTPs)."],
    solutionText: "A framework of adversary tactics & techniques for mapping coverage",
  },
  {
    id: "n64", world: "w14", title: "Tune the Noise", xp: 100, kind: "quiz",
    deepDive: `Detections are judged by their error rates. A <b>false positive</b> (benign flagged as malicious) wastes analyst time; too many cause <b>alert fatigue</b>, so real alerts get ignored. A <b>false negative</b> (missed real attack) is the silent killer. Tuning raises <b>signal-to-noise</b> — better thresholds, allowlists, enrichment — without over-tuning into misses.
<pre>Precision = TP / (TP + FP)   Recall = TP / (TP + FN)</pre>`,
    examples: [
      `<b>Fatigue:</b> a rule firing 500×/day (almost all benign) gets muted — then misses the real one.`,
      `<b>Tune:</b> add context (asset value, user baseline), allowlist known-good, raise the bar precisely.`,
    ],
    pitfalls: [
      `Over-tuning to kill false positives creates false negatives (missed attacks) — balance precision and recall.`,
      `"More alerts = safer" is false — noise hides signal.`,
      `No feedback loop from analysts means noisy rules never improve.`,
    ],
    why: `Alert tuning/triage is half of detection engineering. Knowing FP/FN trade-offs (precision vs recall) and alert fatigue is exactly the SOC maturity interviewers probe.`,
    keyPoints: [
      "False positives cause fatigue; false negatives are missed attacks.",
      "Tune for signal-to-noise; balance precision vs recall.",
      "Use analyst feedback to improve rules continuously.",
    ],
    references: [
      { title: "MITRE — Alert triage / detection engineering", url: "https://center-for-threat-informed-defense.github.io/summiting-the-pyramid/" },
      { title: "Elastic — Tuning detection rules", url: "https://www.elastic.co/guide/en/security/current/rules-ui-management.html" },
    ],
    story: `Alert fatigue gets breaches missed. Tuning is half of detection engineering.`,
    concept: `A <b>false positive</b> is a benign event flagged as malicious. Too many cause <b>alert fatigue</b>, so real alerts get ignored. Tuning (better thresholds, allowlists, enrichment) raises signal-to-noise. Beware over-tuning into <b>false negatives</b> (missed real attacks).`,
    task: `A rule fires 500 times a day, almost all benign. The biggest risk is:`,
    options: [
      "The SIEM runs faster",
      "Alert fatigue — analysts tune it out and miss the real one",
      "Nothing, more alerts is always better",
      "It encrypts the logs",
    ],
    answer: 1,
    explanation: "High false-positive volume causes fatigue; the genuine alert gets lost in the noise.",
    hints: ["What happens to analysts drowning in benign alerts?", "Noise hides the real signal."],
    solutionText: "Alert fatigue — the real alert gets ignored",
  },
  {
    id: "n65", world: "w14", title: "Portable Rules: Sigma", xp: 100, kind: "quiz",
    deepDive: `<b>Sigma</b> is a vendor-neutral, YAML-based format for detection rules. You write the logic once and <b>convert</b> it to each backend's query language (Splunk SPL, Microsoft KQL, Elastic, etc.) — avoiding lock-in and enabling community sharing of detections.
<p>Think of it as "the Snort/YARA of SIEM logs": a common grammar for log-based detections.</p>`,
    examples: [
      `<b>Write once, run anywhere:</b> a Sigma rule for suspicious PowerShell converts to SPL and KQL.`,
      `<b>Share:</b> the SigmaHQ repo publishes community detections you can import and tune.`,
    ],
    pitfalls: [
      `Converted rules still need field mapping to your schema (ECS/OCSF) and local tuning.`,
      `A rule that's portable isn't automatically low-noise — tune per environment.`,
      `Sigma covers log-based detection; network/file detections use Snort/Suricata/YARA.`,
    ],
    why: `Detection-as-code and portability are modern SOC practice. "What's Sigma?" → vendor-neutral detection rules convertible to any SIEM — is the expected answer.`,
    keyPoints: [
      "Sigma = vendor-neutral YAML detection rules.",
      "Convert to SPL/KQL/Elastic; share via SigmaHQ.",
      "Still map fields to your schema and tune locally.",
    ],
    references: [
      { title: "SigmaHQ — Detection rules", url: "https://github.com/SigmaHQ/sigma" },
      { title: "Sigma — Documentation", url: "https://sigmahq.io/docs/guide/getting-started.html" },
    ],
    story: `Write a detection once, run it on any SIEM.`,
    concept: `<b>Sigma</b> is a vendor-agnostic, YAML-based format for detection rules. You author logic once and convert it to each backend's query language (Splunk SPL, KQL, Elastic, etc.) — avoiding lock-in and enabling sharing.`,
    task: `What problem does Sigma solve?`,
    options: [
      "Encrypting log storage",
      "A vendor-neutral detection-rule format convertible to any SIEM's query language",
      "Load balancing collectors",
      "Rotating TLS certificates",
    ],
    answer: 1,
    explanation: "Sigma = generic detection rules you translate into each SIEM's native queries.",
    hints: ["Write once, run on any SIEM.", "Vendor-neutral YAML rules."],
    solutionText: "A vendor-neutral detection-rule format for any SIEM",
  },
  {
    id: "n66", world: "w14", title: "Behavior & Anomalies", xp: 100, kind: "quiz",
    deepDive: `Some attacks have no fixed signature but look <b>abnormal</b>. <b>UEBA</b> (User & Entity Behavior Analytics) baselines normal behavior per user/host and flags deviations:
<ul>
<li><b>Impossible travel</b> — logins from distant locations minutes apart.</li>
<li>Odd-hours access, first-time admin actions, sudden data-access spikes.</li>
</ul>
<p>It catches credential abuse and insider threats that signatures miss — at the cost of more tuning and false positives.</p>`,
    examples: [
      `<b>Impossible travel:</b> NYC login, then Singapore 5 minutes later → anomaly.`,
      `<b>Behavioral:</b> a service account suddenly interactive-logging-in at 3am.`,
    ],
    pitfalls: [
      `Behavioral models need a clean baseline — anomalies during the learning period poison it.`,
      `VPNs/travel/shared accounts generate benign "impossible travel" — enrich to cut false positives.`,
      `Anomaly ≠ malicious; it's a lead that needs investigation.`,
    ],
    why: `Signature vs behavioral detection (and UEBA/impossible travel) is a standard detection question. Knowing anomaly detection catches credential abuse signatures miss is the depth.`,
    keyPoints: [
      "UEBA baselines normal behavior and flags deviations.",
      "Catches credential abuse/insider threats signatures miss.",
      "Anomaly = lead, not verdict; needs a clean baseline + enrichment.",
    ],
    references: [
      { title: "Microsoft — UEBA in Sentinel", url: "https://learn.microsoft.com/en-us/azure/sentinel/identify-threats-with-entity-behavior-analytics" },
      { title: "MITRE ATT&CK — Valid Accounts (T1078)", url: "https://attack.mitre.org/techniques/T1078/" },
    ],
    story: `Some attacks have no signature — but they look abnormal.`,
    concept: `<b>UEBA</b> (User & Entity Behavior Analytics) baselines normal behavior and flags <b>deviations</b> — e.g., <b>impossible travel</b> (logins from two distant countries minutes apart), odd hours, or sudden data access spikes. It catches credential abuse that signatures miss.`,
    task: `A user logs in from New York and 5 minutes later from Singapore. This detection is best described as:`,
    options: [
      "A signature match",
      "A behavioral/anomaly detection (impossible travel, UEBA)",
      "A port scan",
      "A TLS error",
    ],
    answer: 1,
    explanation: "Impossible travel is a behavioral anomaly — UEBA territory, not a static signature.",
    hints: ["No fixed signature — it's about abnormal behavior.", "Impossible travel = UEBA."],
    solutionText: "Behavioral/anomaly detection (impossible travel, UEBA)",
  },
  {
    id: "n67", world: "w14", title: "Automate Response: SOAR", xp: 110, kind: "quiz",
    deepDive: `<b>SOAR</b> (Security Orchestration, Automation and Response) runs <b>playbooks</b> that automatically enrich alerts and take action — isolate a host, disable an account, block an IP, open a ticket. It slashes response time and <b>dwell time</b> (how long an attacker goes undetected/active).
<p>Automate the clear-cut, high-confidence actions; keep humans in the loop for ambiguous or destructive ones.</p>`,
    examples: [
      `<b>Playbook:</b> critical EDR alert → auto-enrich (threat intel, asset owner) → network-isolate host → create ticket.`,
      `<b>Gated action:</b> mass account disable requires analyst approval before executing.`,
    ],
    pitfalls: [
      `Over-automating destructive actions (mass isolation/disable) can cause self-inflicted outages — gate them.`,
      `Playbooks drift as tools change; test and version them.`,
      `Automating on low-confidence alerts amplifies false positives into real impact.`,
    ],
    why: `SOAR and reducing dwell time/MTTR are central to modern SOC operations. "What does SOAR add over a SIEM?" → automated enrichment + response playbooks is the answer.`,
    keyPoints: [
      "SOAR automates enrichment + response via playbooks.",
      "Cuts response time and attacker dwell time.",
      "Automate high-confidence actions; gate destructive ones.",
    ],
    references: [
      { title: "CrowdStrike — What is SOAR?", url: "https://www.crowdstrike.com/en-us/cybersecurity-101/next-gen-siem/security-orchestration-automation-and-response-soar/" },
      { title: "Microsoft — Automation in Sentinel (SOAR)", url: "https://learn.microsoft.com/en-us/azure/sentinel/automation" },
    ],
    story: `Detection is only half the job — response speed decides the damage.`,
    concept: `<b>SOAR</b> (Security Orchestration, Automation and Response) runs <b>playbooks</b> that automatically enrich alerts and take action (isolate a host, disable an account, block an IP), cutting response time and reducing <b>dwell time</b> — how long an attacker stays undetected.`,
    task: `What does SOAR add on top of a SIEM?`,
    options: [
      "It stores more logs",
      "Automated enrichment and response playbooks (isolate host, disable account)",
      "Faster CPUs for the SIEM",
      "A new encryption algorithm",
    ],
    answer: 1,
    explanation: "SOAR orchestrates automated response playbooks, shrinking response and dwell time.",
    hints: ["Automation + response playbooks.", "It acts on the alerts a SIEM raises."],
    solutionText: "Automated enrichment and response playbooks",
  },

  /* ================= W15: SECRETS MANAGEMENT ================= */
  {
    id: "n68", world: "w15", title: "Why a Vault", xp: 90, kind: "quiz",
    deepDive: `Secrets scattered across configs, code, CI variables, and chat are impossible to control or rotate. A <b>secrets manager / vault</b> (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) centralizes them with <b>access control, auditing, encryption at rest, and rotation</b>, delivering them to apps at runtime.
<p>The goal: no long-lived secret sitting in a repo or image — fetch it, scoped and short-lived, when needed.</p>`,
    examples: [
      `<b>Runtime delivery:</b> the app requests the DB password from the vault at startup — nothing stored in the image.`,
      `<b>Auditability:</b> the vault logs who accessed which secret when — impossible with secrets in files.`,
    ],
    pitfalls: [
      `A vault concentrates risk — its own access policies and unseal/root keys must be tightly guarded.`,
      `Fetching a secret then caching it forever reintroduces sprawl — keep leases short.`,
      `Bootstrapping ("secret-zero": how the app authenticates to the vault) needs a secure method (workload identity).`,
    ],
    why: `"Why use a secrets manager over config files?" is a standard question. Centralized, access-controlled, audited, rotatable, runtime-delivered — is the answer.`,
    keyPoints: [
      "Centralize secrets with access control, audit, encryption, rotation.",
      "Deliver at runtime; no long-lived secrets in repos/images.",
      "Guard the vault's own access + solve secret-zero via workload identity.",
    ],
    references: [
      { title: "HashiCorp Vault — What is Vault?", url: "https://developer.hashicorp.com/vault/docs/what-is-vault" },
      { title: "AWS — Secrets Manager", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html" },
    ],
    story: `🔑 Secrets scattered across configs, code, and chat are a breach waiting to happen.`,
    concept: `A <b>secrets manager / vault</b> (HashiCorp Vault, AWS Secrets Manager, etc.) centralizes secrets with <b>access control, auditing, encryption, and rotation</b>, and hands them to apps at runtime — instead of hardcoding them in repos, images, or environment files.`,
    task: `What's the main benefit of a secrets manager over config files?`,
    options: [
      "It makes secrets longer",
      "Centralized, access-controlled, audited, rotatable secret storage delivered at runtime",
      "It encrypts the whole disk",
      "It removes the need for authentication",
    ],
    answer: 1,
    explanation: "Vaults centralize secrets with RBAC, audit, encryption, and rotation — not scattered in code.",
    hints: ["Think central, controlled, audited, rotatable.", "The opposite of secrets-in-repo."],
    solutionText: "Centralized, access-controlled, audited, rotatable storage",
  },
  {
    id: "n69", world: "w15", title: "Rotate to Limit Damage", xp: 100, kind: "quiz",
    deepDive: `<b>Rotation</b> periodically replaces a secret's value, so a leaked credential is only useful until the next rotation — it caps the <b>blast radius over time</b>. Automated, scheduled rotation (ideally zero-downtime with overlapping validity) beats manual rotation that gets skipped.
<p>The strongest form is not rotating static secrets at all but issuing <b>short-lived dynamic</b> ones (next lesson).</p>`,
    examples: [
      `<b>Scheduled rotation:</b> a DB password auto-rotates every 30 days; a leaked copy dies at the next cycle.`,
      `<b>Zero-downtime:</b> issue new credential → deploy → revoke old, so nothing breaks mid-rotation.`,
    ],
    pitfalls: [
      `Rotating without updating every consumer causes outages — coordinate with an overlap window.`,
      `Manual rotation doesn't scale and gets skipped under pressure — automate it.`,
      `Rotation doesn't help if the secret is still over-shared — pair with least privilege.`,
    ],
    why: `"Why rotate secrets?" → limit the useful life of a leaked credential. Mentioning zero-downtime overlap and dynamic secrets shows operational depth.`,
    keyPoints: [
      "Rotation caps a leaked secret's useful lifetime.",
      "Automate on a schedule; zero-downtime via overlap-then-revoke.",
      "Short-lived dynamic secrets are stronger than static+rotation.",
    ],
    references: [
      { title: "AWS — Rotate secrets", url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html" },
      { title: "NIST SP 800-57 — Key management (lifecycle)", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" },
    ],
    story: `Even well-stored secrets should not live forever.`,
    concept: `Regular <b>rotation</b> limits the <b>blast radius</b> of a leaked credential — a stolen secret is only useful until it's rotated. Short-lived / <b>dynamic secrets</b> (generated per-session, auto-expiring) are even stronger than long-lived static ones.`,
    task: `Why rotate secrets on a schedule?`,
    options: [
      "To use more storage",
      "To limit how long a leaked credential stays valid (shrink blast radius)",
      "Rotation is purely cosmetic",
      "To make logins slower",
    ],
    answer: 1,
    explanation: "Rotation caps the useful lifetime of any leaked secret; dynamic short-lived secrets are even better.",
    hints: ["What happens to a stolen key after rotation?", "Blast radius over time."],
    solutionText: "To limit how long a leaked credential stays valid",
  },
  {
    id: "n70", world: "w15", title: "Dynamic Secrets", xp: 100, kind: "quiz",
    deepDive: `<b>Dynamic secrets</b> are generated <b>on demand</b>, scoped to the caller, and <b>auto-expire</b> after a short TTL (e.g., a 15-minute database credential per request). There's no long-lived secret to steal, and access is automatically revoked when the lease ends.
<p>This is the end state of good secret management — closely related to short-lived cloud creds via <b>OIDC/workload identity</b>.</p>`,
    examples: [
      `<b>DB creds on demand:</b> Vault generates a unique 15-minute DB user per app instance.`,
      `<b>Cloud equivalent:</b> OIDC-federated short-lived role credentials instead of static access keys.`,
    ],
    pitfalls: [
      `Dynamic secrets need backend integration (DB/cloud) and lease management — more setup than static.`,
      `Too-short TTLs can cause churn/failures under load; tune leases.`,
      `You still must secure the initial auth to the issuer (secret-zero).`,
    ],
    why: `Dynamic/short-lived secrets are the modern best practice. "What's better than rotating static secrets?" → generate short-lived ones so there's nothing durable to steal.`,
    keyPoints: [
      "Dynamic secrets are on-demand, scoped, auto-expiring.",
      "Nothing long-lived to steal; access auto-revoked at lease end.",
      "Cloud analog: OIDC/workload-identity short-lived creds.",
    ],
    references: [
      { title: "HashiCorp Vault — Dynamic secrets", url: "https://developer.hashicorp.com/vault/docs/secrets/databases" },
      { title: "AWS — IAM roles (temporary credentials)", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html" },
    ],
    story: `The modern pattern: don't hand out standing credentials at all.`,
    concept: `<b>Dynamic secrets</b> are generated on demand, scoped, and <b>auto-expire</b> after a short TTL (e.g., a 15-minute database credential per request). There's no long-lived secret to steal, and access is automatically revoked.`,
    task: `What best describes dynamic secrets?`,
    options: [
      "Permanent credentials shared by all services",
      "On-demand, scoped, short-lived credentials that auto-expire",
      "Secrets printed to logs",
      "Passwords stored in the image",
    ],
    answer: 1,
    explanation: "Dynamic secrets are generated per use with a short TTL and expire automatically.",
    hints: ["Short TTL, generated on demand.", "Nothing long-lived to steal."],
    solutionText: "On-demand, scoped, short-lived credentials that auto-expire",
  },
  {
    id: "n71", world: "w15", title: "A Key Just Leaked", xp: 110, kind: "quiz",
    deepDive: `Treat any exposed secret as <b>compromised</b>. Correct order: <b>revoke/disable</b> it immediately (so the old value stops working), then <b>rotate/replace</b>, then <b>investigate</b> logs for misuse. Deleting the commit alone is useless — it's already in git history, forks, and scraper caches the instant it's public.`,
    examples: [
      `<b>Leaked AWS key in a public repo:</b> disable the key in IAM now, issue a new one, then review CloudTrail for abuse.`,
      `<b>Automate:</b> wire secret-scanner alerts to an auto-revoke workflow for instant response.`,
    ],
    pitfalls: [
      `"I force-pushed to remove it" is not remediation — the secret was scraped; revoke it.`,
      `Rotating without revoking leaves the old value valid in parallel.`,
      `Skipping the log review misses that it may already have been used.`,
    ],
    why: `"A credential just leaked — what now?" is a very common incident question. Revoke → rotate → investigate (assume compromise) is the answer that shows IR instinct.`,
    keyPoints: [
      "Exposed = compromised: revoke immediately.",
      "Order: revoke → rotate → investigate usage.",
      "Deleting the commit doesn't help; automate revoke on detection.",
    ],
    references: [
      { title: "GitHub — Remediating a leaked secret", url: "https://docs.github.com/en/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/remediating-a-leaked-secret" },
      { title: "AWS — What to do if you expose an access key", url: "https://repost.aws/knowledge-center/compromised-credentials-iam-user" },
    ],
    story: `An AWS key appears in a public commit. What's the correct first move?`,
    concept: `Treat any exposed secret as <b>compromised</b>: <b>revoke/disable it immediately</b> (so the old value is dead), then rotate/replace, then review logs for misuse. Deleting the commit alone is useless — it's already in git history, forks, and caches.`,
    task: `A live API key is pushed to a public repo. Best immediate action?`,
    options: [
      "Delete the commit and assume it's fine",
      "Revoke/disable the key now, then rotate and audit for misuse",
      "Rename the repo",
      "Make the repo private and keep the key",
    ],
    answer: 1,
    explanation: "Revoke first (the value is already scraped), then rotate and investigate. Deleting the commit doesn't help.",
    hints: ["It's already scraped the instant it's pushed.", "Revoke beats 'delete the commit'."],
    solutionText: "Revoke the key immediately, then rotate and audit",
  },
  {
    id: "n72", world: "w15", title: "Keep Them Out of Git", xp: 100, kind: "quiz",
    deepDive: `The cheapest leak to prevent is the one never committed. Stop secrets at the source:
<ul>
<li><b>Pre-commit secret scanning</b> (gitleaks, trufflehog) blocks the commit locally.</li>
<li><b>Push protection</b> (GitHub) blocks the push server-side.</li>
<li><code>.gitignore</code> for <code>.env</code>/key files; <code>git-secrets</code> hooks.</li>
</ul>
<p>Once a secret is committed it lives in <b>git history</b> forever (and in forks/clones) unless history is rewritten — and it must be <b>rotated</b> regardless.</p>`,
    examples: [
      `<b>Shift left:</b> a pre-commit hook rejects an <code>AKIA…</code> key before it's ever committed.`,
      `<b>Defense in depth:</b> pre-commit + server-side push protection + CI secret scan.`,
    ],
    pitfalls: [
      `A secret already in history isn't fixed by deleting the latest file — rewrite history AND rotate.`,
      `Pattern scanners miss high-entropy/opaque secrets — combine with entropy detection.`,
      `Example/test keys cause false positives — allowlist them so the gate stays trusted.`,
    ],
    why: `"How do you stop secrets leaking into the repo?" → pre-commit + push protection + .gitignore, and rotate anything that slipped in. Knowing history is forever is the key nuance.`,
    keyPoints: [
      "Block at commit/push with scanners; .gitignore env/key files.",
      "Committed = in history/forks forever → rewrite AND rotate.",
      "Combine regex + entropy; allowlist examples.",
    ],
    references: [
      { title: "GitHub — Push protection", url: "https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations" },
      { title: "gitleaks", url: "https://github.com/gitleaks/gitleaks" },
    ],
    story: `The cheapest leak to prevent is the one that never gets committed.`,
    concept: `Prevent secrets entering source control with <b>pre-commit secret scanning</b> (gitleaks, trufflehog), <code>.gitignore</code> for env files, and server-side push protection. Remember: once committed, a secret lives in <b>git history</b> forever unless history is rewritten — and it should be rotated anyway.`,
    task: `Which best prevents secrets from ever reaching your repo?`,
    options: [
      "Hoping developers remember",
      "Pre-commit secret scanning + push protection + .gitignore for env files",
      "Committing secrets but in lowercase",
      "Storing secrets in the README",
    ],
    answer: 1,
    explanation: "Automated pre-commit/push secret scanning plus ignoring env files stops leaks at the source.",
    hints: ["Automate detection before commit/push.", "gitleaks / trufflehog / push protection."],
    solutionText: "Pre-commit secret scanning + push protection + .gitignore",
  },

  /* ================= W16: INCIDENT RESPONSE & FORENSICS ================= */
  {
    id: "n73", world: "w16", title: "The IR Lifecycle", xp: 100, kind: "quiz",
    deepDive: `The <b>NIST SP 800-61</b> incident response lifecycle has four phases:
<pre>1. Preparation
2. Detection & Analysis
3. Containment, Eradication & Recovery
4. Post-Incident Activity (lessons learned)</pre>
<p><b>Preparation</b> (plans, tooling, access, runbooks, backups) done <i>before</i> an incident is what makes the rest work under pressure. The cycle feeds back: lessons learned improve preparation.</p>`,
    examples: [
      `<b>Preparation pays off:</b> having IR playbooks, logging, and backups ready turns chaos into a process.`,
      `<b>SANS variant:</b> PICERL — Prepare, Identify, Contain, Eradicate, Recover, Lessons Learned.`,
    ],
    pitfalls: [
      `Skipping preparation means improvising mid-breach — the worst time to build process.`,
      `Jumping straight to eradication (wipe/rebuild) before analysis destroys evidence and understanding.`,
      `No post-incident review → the same incident recurs.`,
    ],
    why: `The IR lifecycle is foundational — "walk me through your IR process" expects these phases, with Preparation first and Lessons Learned feeding back.`,
    keyPoints: [
      "NIST phases: Preparation → Detection&Analysis → Containment/Eradication/Recovery → Post-Incident.",
      "Preparation (done before) makes the rest work.",
      "Lessons learned loop back into preparation.",
    ],
    references: [
      { title: "NIST SP 800-61r2 — Computer Security Incident Handling", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final" },
      { title: "SANS — Incident Handler's Handbook (PICERL)", url: "https://www.sans.org/white-papers/33901/" },
    ],
    story: `🧭 Under pressure, a process keeps you from making it worse.`,
    concept: `The <b>NIST incident response lifecycle</b>: <b>Preparation → Detection &amp; Analysis → Containment, Eradication &amp; Recovery → Post-Incident Activity</b> (lessons learned). Preparation (plans, tooling, access) done <i>before</i> an incident is what makes the rest work.`,
    task: `Which is the correct high-level IR order?`,
    options: [
      "Recover → Detect → Prepare → Contain",
      "Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-Incident",
      "Contain → Prepare → Ignore → Recover",
      "Detection → Recovery → Preparation",
    ],
    answer: 1,
    explanation: "NIST: Preparation, Detection & Analysis, Containment/Eradication/Recovery, then Post-Incident.",
    hints: ["Preparation comes first, lessons-learned last.", "Follow the NIST 800-61 phases."],
    solutionText: "Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-Incident",
  },
  {
    id: "n74", world: "w16", title: "Contain Before Eradicate", xp: 100, kind: "quiz",
    deepDive: `<b>Containment</b> (isolate the host, disable the account, block the C2) comes <b>before eradication</b> (remove malware, rebuild). Containing first stops the spread and <b>preserves evidence</b>; eradicating prematurely destroys forensics and can tip off a sophisticated attacker to burn access or detonate.
<p>Capture <b>volatile evidence</b> (memory) during/just after containment, before wiping.</p>`,
    examples: [
      `<b>Right order:</b> network-isolate the compromised server (contain) → image memory/disk → then wipe/rebuild (eradicate) → restore (recover).`,
      `<b>Short vs long containment:</b> quick isolation now, then a planned fuller containment.`,
    ],
    pitfalls: [
      `Wiping first destroys the evidence you need to understand scope and root cause.`,
      `Noisy containment can alert an advanced adversary — coordinate timing for sophisticated intrusions.`,
      `Over-containment of critical prod can be worse than the incident — weigh business impact.`,
    ],
    why: `"Contain or eradicate first, and why?" is a staple IR question. Contain-first (stop spread, preserve evidence) weighed against business impact is the expected answer.`,
    keyPoints: [
      "Contain before eradicate: stop spread, preserve evidence.",
      "Capture volatile memory before wiping.",
      "Weigh business impact; mind tipping off the adversary.",
    ],
    references: [
      { title: "NIST SP 800-61r2 — Containment/Eradication/Recovery", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final" },
      { title: "CISA — Incident response playbooks", url: "https://www.cisa.gov/resources-tools/resources/federal-government-cybersecurity-incident-and-vulnerability-response-playbooks" },
    ],
    story: `Order of operations in a live incident matters enormously.`,
    concept: `<b>Containment</b> (isolate the host, disable the account, block the C2) comes <b>before eradication</b> (remove malware, rebuild). Containing first stops the bleeding and spread while you still preserve evidence; eradicating prematurely can tip off the attacker and destroy forensics.`,
    task: `You find an actively compromised server. What do you do first?`,
    options: [
      "Wipe and rebuild it immediately",
      "Contain it (isolate/segment) to stop spread while preserving evidence",
      "Shut down the whole data center",
      "Nothing until the next maintenance window",
    ],
    answer: 1,
    explanation: "Contain first (isolate) to halt spread and preserve evidence, then eradicate and recover.",
    hints: ["Stop the spread before cleaning up.", "Containment precedes eradication."],
    solutionText: "Contain it first to stop spread and preserve evidence",
  },
  {
    id: "n75", world: "w16", title: "Chain of Custody", xp: 100, kind: "quiz",
    deepDive: `<b>Chain of custody</b> documents who collected/handled each piece of evidence, when, and how — proving it wasn't altered (critical if it reaches court). The technical backbone is a cryptographic <b>hash</b> (SHA-256) taken at collection and re-verified later; always work from a <b>forensic copy</b>, never the original.
<pre>hash(image) at collection == hash(image) now  -> integrity proven</pre>`,
    examples: [
      `<b>Prove integrity:</b> record the disk image's SHA-256 at acquisition; re-hash before analysis to show it's unchanged.`,
      `<b>Documentation:</b> timestamped log of every handoff and action on the evidence.`,
    ],
    pitfalls: [
      `Analyzing the original instead of a verified copy contaminates evidence.`,
      `Gaps in the custody log (unaccounted handoffs) can make evidence inadmissible.`,
      `Using a broken hash (MD5) for legal integrity — prefer SHA-256.`,
    ],
    why: `Evidence handling / chain of custody is core forensics and a common IR question. Hash-at-collection + work-on-copies + documented handoffs is the expected answer.`,
    keyPoints: [
      "Chain of custody proves evidence integrity and handling.",
      "Hash at collection (SHA-256), re-verify; work on copies.",
      "Document every handoff; gaps can void admissibility.",
    ],
    references: [
      { title: "NIST SP 800-86 — Forensics into IR", url: "https://csrc.nist.gov/pubs/sp/800/86/final" },
      { title: "SANS — Digital forensics", url: "https://www.sans.org/cyber-security-courses/advanced-incident-response-threat-hunting/" },
    ],
    story: `Evidence that can't be trusted is useless — especially if it ends up in court.`,
    concept: `<b>Chain of custody</b> documents who collected/handled evidence, when, and how, and proves it wasn't altered — typically by recording cryptographic <b>hashes</b> (e.g., SHA-256) of images at collection and verifying them later. Always work from a <b>copy</b>, never the original.`,
    task: `How do you prove a disk image wasn't tampered with after collection?`,
    options: [
      "Trust the analyst's memory",
      "Record a cryptographic hash at collection and re-verify it later",
      "Rename the file",
      "Store it on the compromised host",
    ],
    answer: 1,
    explanation: "Hashing at collection + later re-verification proves integrity; maintain documented chain of custody.",
    hints: ["Cryptographic hashes prove integrity.", "Work on copies, log every handoff."],
    solutionText: "Hash it at collection and re-verify the hash later",
  },
  {
    id: "n76", world: "w16", title: "Order of Volatility", xp: 110, kind: "quiz",
    deepDive: `Collect the most <b>ephemeral</b> evidence first, before it vanishes. The <b>order of volatility</b> (RFC 3227):
<pre>1. CPU registers/cache  2. RAM (processes, connections, keys)
3. Disk  4. Remote logs/archives  5. Physical config/backups</pre>
<p>Pulling the plug or imaging disk first destroys live memory evidence — running malware, network connections, and encryption keys that may never touch disk.</p>`,
    examples: [
      `<b>Memory first:</b> capture RAM (volatile) before disk — it holds live process/network/key artifacts.`,
      `<b>Fileless malware:</b> may exist only in memory, so a disk-only image misses it entirely.`,
    ],
    pitfalls: [
      `Powering off or reimaging disk first destroys volatile memory evidence forever.`,
      `Running lots of tools on the live host changes its state — minimize footprint, document actions.`,
      `Clock skew across systems scrambles correlation — record and normalize time.`,
    ],
    why: `Order of volatility (RFC 3227) is a classic forensics question. "Capture RAM before disk" and knowing fileless malware lives in memory is the depth.`,
    keyPoints: [
      "Collect most-volatile first: memory before disk before archives.",
      "Fileless threats live in RAM — don't power off first.",
      "Minimize footprint on the live host; document everything.",
    ],
    references: [
      { title: "RFC 3227 — Evidence collection & archiving", url: "https://datatracker.ietf.org/doc/html/rfc3227" },
      { title: "NIST SP 800-86 — Forensic techniques", url: "https://csrc.nist.gov/pubs/sp/800/86/final" },
    ],
    story: `Collect the evidence that disappears fastest, first.`,
    concept: `<b>Order of volatility</b>: capture the most ephemeral data first — CPU registers/cache, then <b>RAM</b> (running processes, network connections, keys), then disk, then logs/archives. Pulling the plug or imaging disk first destroys volatile memory evidence forever.`,
    task: `Which should you capture FIRST in forensics?`,
    options: [
      "Archived backups",
      "Volatile memory (RAM: processes, connections)",
      "The disk image",
      "Printed documentation",
    ],
    answer: 1,
    explanation: "Most volatile first: RAM (and live state) before disk and archives.",
    hints: ["What vanishes when the machine powers off?", "RAM before disk."],
    solutionText: "Volatile memory (RAM) before disk and archives",
  },
  {
    id: "n77", world: "w16", title: "Measure the Response", xp: 100, kind: "quiz",
    deepDive: `IR effectiveness is measured in time:
<ul>
<li><b>Dwell time</b> — how long the attacker was present before detection.</li>
<li><b>MTTD</b> — mean time to detect; <b>MTTR</b> — mean time to respond/remediate.</li>
</ul>
<p>Lower is better — reducing dwell time directly shrinks the damage an intruder can do. These metrics justify investment in detection and automation (SOAR).</p>`,
    examples: [
      `<b>Dwell time:</b> breach on day 1, detected day 30 → 30-day dwell (industry historically measured in weeks/months).`,
      `<b>Drive improvement:</b> faster detection (better rules) + faster response (SOAR) cut dwell/MTTR.`,
    ],
    pitfalls: [
      `Optimizing MTTR by closing tickets fast (not actually resolving) games the metric.`,
      `Ignoring dwell time makes a "contained quickly" story hide months of prior access.`,
      `Metrics without context (severity, asset) mislead.`,
    ],
    why: `Dwell time / MTTD / MTTR are the KPIs leadership asks about. Knowing dwell time = undetected attacker residence, and that reducing it limits damage, is the point.`,
    keyPoints: [
      "Dwell time = attacker's undetected residence time.",
      "MTTD/MTTR measure detect/respond speed; lower is better.",
      "These metrics justify detection + SOAR investment.",
    ],
    references: [
      { title: "Mandiant M-Trends (dwell time reporting)", url: "https://www.mandiant.com/m-trends" },
      { title: "NIST SP 800-61r2 — Incident handling", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final" },
    ],
    story: `You can't improve what you don't measure.`,
    concept: `<b>Dwell time</b> is how long an attacker is present before detection; <b>MTTD/MTTR</b> are mean time to detect/respond. Lower is better — reducing dwell time shrinks the damage an intruder can do. These metrics drive detection-engineering and IR investment.`,
    task: `"Dwell time" refers to:`,
    options: [
      "How long a backup takes",
      "How long an attacker goes undetected in the environment",
      "The TTL of a DNS record",
      "How long a firewall rule lasts",
    ],
    answer: 1,
    explanation: "Dwell time = attacker's undetected residence time; reducing it limits damage.",
    hints: ["Time the attacker stays hidden.", "Lower dwell time = less damage."],
    solutionText: "How long an attacker goes undetected",
  },
  {
    id: "n78", world: "w16", title: "Learn From It", xp: 100, kind: "quiz",
    deepDive: `The incident isn't over when the fire's out. <b>Post-incident activity</b> — a <b>blameless post-mortem</b> — finds the <b>root cause</b> and turns it into concrete improvements (new detections, hardening, process fixes) that feed back into Preparation. <b>Tabletop exercises</b> rehearse the plan before a real incident.
<p>Blameless = focus on systems/process, not individuals, so people share facts openly.</p>`,
    examples: [
      `<b>Root-cause → action:</b> "phishing bypassed MFA" → roll out phishing-resistant FIDO2 + a new detection.`,
      `<b>Tabletop:</b> walk through a ransomware scenario to find gaps before it's real.`,
    ],
    pitfalls: [
      `Blame culture makes people hide facts — keep it blameless to learn the truth.`,
      `A post-mortem with no owned, tracked action items changes nothing.`,
      `Skipping lessons-learned guarantees the same incident recurs.`,
    ],
    why: `Post-incident review / blameless post-mortems are a maturity marker. "What happens after containment?" → root-cause + tracked improvements feeding back into prep.`,
    keyPoints: [
      "Blameless post-mortem → root cause → tracked improvements.",
      "Feeds back into Preparation; tabletops rehearse the plan.",
      "Blameless culture surfaces the real facts.",
    ],
    references: [
      { title: "Google SRE — Postmortem culture", url: "https://sre.google/sre-book/postmortem-culture/" },
      { title: "NIST SP 800-61r2 — Post-incident activity", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final" },
    ],
    story: `The incident isn't over when the fire's out.`,
    concept: `<b>Post-incident activity</b> — a blameless <b>post-mortem / lessons-learned</b> — identifies root cause and concrete improvements (new detections, hardening, process fixes) and feeds them back into Preparation. <b>Tabletop exercises</b> rehearse the plan before a real incident.`,
    task: `What's the main goal of the post-incident (lessons-learned) phase?`,
    options: [
      "Assign blame to an individual",
      "Find root cause and feed concrete improvements back into preparation",
      "Delete all the logs",
      "Immediately forget it happened",
    ],
    answer: 1,
    explanation: "A blameless post-mortem drives root-cause fixes and better preparation/detections.",
    hints: ["Blameless, improvement-focused.", "It loops back into Preparation."],
    solutionText: "Find root cause and improve preparation/detections",
  },

  /* ================= W17: IAM & KMS DEEP-DIVE ================= */
  {
    id: "n79", world: "w17", title: "Roles over Keys", xp: 100, kind: "quiz",
    deepDive: `Long-lived <b>access keys</b> are the most leaked cloud credential (repos, laptops, logs). Prefer <b>IAM roles</b> — temporary, auto-rotating credentials assumed at runtime:
<ul>
<li>Workloads: instance roles / IRSA / workload identity.</li>
<li>Humans: SSO + short-lived sessions, not static users.</li>
<li>Pipelines: OIDC federation (no stored secret).</li>
</ul>
<p>Fewer standing secrets = far less to leak.</p>`,
    examples: [
      `<b>EC2 app:</b> attach an instance role → the SDK gets temporary creds automatically; no stored key.`,
      `<b>CI:</b> GitHub OIDC assumes a role for 15 minutes instead of storing an AWS access key.`,
    ],
    pitfalls: [
      `Creating static IAM user access keys "because it's easy" — they live forever until someone rotates them.`,
      `Over-broad role trust policies let the wrong principals assume powerful roles.`,
      `Not monitoring/rotating the few long-lived keys that genuinely must exist.`,
    ],
    why: `"Most secure way for a workload to call cloud APIs?" → assume a role (temporary creds), not a long-lived key. OIDC for CI is the modern best practice.`,
    keyPoints: [
      "Prefer roles (temporary creds) over long-lived access keys.",
      "Workload identity / IRSA for apps; OIDC for pipelines; SSO for humans.",
      "Fewer standing secrets = smaller attack surface.",
    ],
    references: [
      { title: "AWS — IAM roles", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html" },
      { title: "AWS — Best practices (use roles, not long-lived keys)", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
    ],
    story: `🔐 Long-lived access keys are the most leaked credential in the cloud.`,
    concept: `Prefer <b>IAM roles</b> (temporary, auto-expiring credentials assumed at runtime) over long-lived <b>access keys</b>. For workloads use instance roles / IRSA / workload identity; for humans use SSO + short-lived sessions. Fewer standing secrets = less to leak.`,
    task: `What's the most secure way for an EC2 app to call AWS APIs?`,
    options: [
      "Hardcode a long-lived access key in the app",
      "Attach an IAM role so it gets temporary, auto-rotating credentials",
      "Share one admin key across all servers",
      "Email keys to the app owner",
    ],
    answer: 1,
    explanation: "An instance IAM role supplies temporary, auto-rotated creds — no long-lived key to leak.",
    hints: ["Temporary beats long-lived.", "Roles, not static keys."],
    solutionText: "Attach an IAM role for temporary auto-rotating credentials",
  },
  {
    id: "n80", world: "w17", title: "Guardrails: Boundaries & SCPs", xp: 110, kind: "quiz",
    deepDive: `Even a correct policy needs a ceiling it can't exceed. <b>Permission boundaries</b> (per-principal) and <b>Service Control Policies</b> (org/account-wide) define the <b>maximum</b> permissions possible — a guardrail. Effective access = granted policies <b>intersected</b> with these caps.
<p>So even if someone attaches an over-broad policy, the boundary/SCP still limits the blast radius.</p>`,
    examples: [
      `<b>SCP:</b> deny leaving the allowed regions or disabling CloudTrail, org-wide — no account can override it.`,
      `<b>Boundary:</b> a delegated admin can create roles, but none more powerful than their own boundary allows.`,
    ],
    pitfalls: [
      `Guardrails cap, they don't grant — you still need the actual allow policies.`,
      `Overly strict SCPs break legitimate work; test in audit before enforcing.`,
      `Forgetting SCPs apply even to the root user of member accounts (a feature, sometimes a surprise).`,
    ],
    why: `SCPs / permission boundaries are how large orgs enforce least privilege at scale. "What caps the maximum permissions an identity can have?" → boundaries/SCPs.`,
    keyPoints: [
      "Boundaries/SCPs set the MAX permissions (a ceiling, not a grant).",
      "Effective access = granted ∩ guardrails.",
      "Limit blast radius even when someone over-grants.",
    ],
    references: [
      { title: "AWS — Service control policies (SCPs)", url: "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html" },
      { title: "AWS — Permissions boundaries", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html" },
    ],
    story: `Even a correct policy needs a ceiling it can't exceed.`,
    concept: `<b>Permission boundaries</b> (per-principal) and <b>Service Control Policies</b> (org-wide) set the <b>maximum</b> permissions an identity or account can ever have — a guardrail. A granted policy is still capped by them, limiting blast radius even if someone attaches an over-broad policy.`,
    task: `What do SCPs / permission boundaries provide?`,
    options: [
      "They grant extra permissions automatically",
      "A maximum-permission ceiling that caps what any identity can do",
      "Faster API calls",
      "Encryption of IAM policies",
    ],
    answer: 1,
    explanation: "They define the upper bound of permissions, capping blast radius regardless of attached policies.",
    hints: ["Think ceiling, not grant.", "Caps the maximum, org-wide or per-principal."],
    solutionText: "A maximum-permission ceiling capping any identity",
  },
  {
    id: "n81", world: "w17", title: "Rotate the Keys", xp: 100, kind: "quiz",
    deepDive: `<b>KMS key rotation</b> periodically generates new cryptographic <b>backing material</b> while keeping the same key ID — so old ciphertext still decrypts and rotation is transparent to apps. It limits how much data any single key version protects (crypto hygiene / defense in depth).
<p>Automatic rotation (e.g., yearly in AWS KMS) is a one-setting win for symmetric keys.</p>`,
    examples: [
      `<b>Enable:</b> turn on automatic rotation; old data keeps decrypting, new data uses new material.`,
      `<b>Compliance:</b> CIS/PCI check that CMK rotation is enabled.`,
    ],
    pitfalls: [
      `Rotation ≠ re-encryption — existing ciphertext isn't re-encrypted (fine, but know it).`,
      `Imported key material / some asymmetric keys don't auto-rotate — plan manual rotation.`,
      `Rotation doesn't help if the key policy is over-broad (who can use the key matters more).`,
    ],
    why: `Key rotation is a routine crypto-hygiene/compliance item. Knowing it's transparent (same key ID) and that it doesn't re-encrypt old data is the nuance.`,
    keyPoints: [
      "Rotation adds new backing material; same key ID, old data still decrypts.",
      "Limits per-version exposure (crypto hygiene).",
      "Not re-encryption; imported/asymmetric keys may need manual rotation.",
    ],
    references: [
      { title: "AWS — Rotating KMS keys", url: "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html" },
      { title: "NIST SP 800-57 — Key management", url: "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" },
    ],
    story: `KMS protects data, but keys themselves need lifecycle care.`,
    concept: `Enabling <b>automatic key rotation</b> in KMS periodically generates new cryptographic material while keeping the same key ID (old data still decrypts). It limits how much data is protected by any single key version — defense in depth for your encryption.`,
    task: `Why enable automatic KMS key rotation?`,
    options: [
      "It deletes old encrypted data",
      "It limits how much data any single key version protects, improving crypto hygiene",
      "It makes encryption optional",
      "It disables the key",
    ],
    answer: 1,
    explanation: "Rotation caps data-per-key-version and is transparent (same key ID, old data still decrypts).",
    hints: ["Smaller blast radius per key version.", "Transparent: same key ID."],
    solutionText: "It limits data protected per key version (crypto hygiene)",
  },
  {
    id: "n82", world: "w17", title: "Key Policy vs IAM", xp: 110, kind: "quiz",
    deepDive: `In AWS KMS, using a key requires permission in <b>both</b> the key's <b>key policy</b> and the caller's <b>IAM</b> — but a key policy with <code>Principal: "*"</code> or broad account/cross-account access can make a key usable far too widely. Audit <b>key policies</b>, not just IAM, or "encrypted at rest" means little.`,
    examples: [
      `<b>Over-shared:</b> a key policy granting <code>kms:Decrypt</code> to <code>"*"</code> lets anyone (with any IAM allow) decrypt.`,
      `<b>Tighten:</b> scope the key policy to the specific roles/services that must use the key.`,
    ],
    pitfalls: [
      `Reviewing IAM but ignoring the key policy misses the real exposure.`,
      `Cross-account key grants are easy to forget and widen blast radius.`,
      `Encryption with an open key policy gives a false sense of protection.`,
    ],
    why: `"KMS access is governed by what?" → key policy AND IAM. Auditing who can use the key (not just that encryption is on) is the senior cloud-crypto insight.`,
    keyPoints: [
      "KMS usage needs key policy AND IAM permission.",
      "Over-broad key policies undermine the encryption.",
      "Audit key policies + cross-account grants, not just IAM.",
    ],
    references: [
      { title: "AWS — KMS key policies", url: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policies.html" },
      { title: "AWS — Determining access to a KMS key", url: "https://docs.aws.amazon.com/kms/latest/developerguide/determining-access.html" },
    ],
    story: `KMS access is governed by two layers — misread them and you over-share.`,
    concept: `Using a KMS key requires permission in <b>both</b> the key's <b>key policy</b> and the caller's IAM — but a key policy with <code>Principal: "*"</code> (or broad account access) can make a key usable far too widely. Audit key policies, not just IAM.`,
    task: `A KMS key's key policy grants <code>Principal: "*"</code> with <code>kms:Decrypt</code>. The risk is:`,
    options: [
      "None — IAM still fully protects it",
      "The key can be used far too broadly, undermining the encryption it provides",
      "The key becomes read-only",
      "Encryption speeds up",
    ],
    answer: 1,
    explanation: "An over-broad key policy makes the key widely usable, defeating the point of KMS.",
    hints: ["Who can call kms:Decrypt?", "Principal \"*\" is the red flag."],
    solutionText: "The key becomes usable far too broadly",
  },
  {
    id: "n83", world: "w17", title: "Find Unused Permissions", xp: 110, kind: "quiz",
    deepDive: `Least privilege isn't one-and-done — permissions accumulate as roles change ("privilege creep"). Right-size continuously using evidence:
<ul>
<li><b>Last-accessed</b> data shows which granted permissions were never used.</li>
<li><b>IAM Access Analyzer</b> flags external/public access and can <b>generate least-privilege policies</b> from CloudTrail activity.</li>
</ul>
<p>Prune what's unused on a schedule to keep real-world least privilege.</p>`,
    examples: [
      `<b>Prune:</b> a role granted <code>s3:*</code> but only ever used <code>GetObject</code> → tighten to just that.`,
      `<b>Detect exposure:</b> Access Analyzer finds a role/bucket shared outside the account.`,
    ],
    pitfalls: [
      `Granting broad "just in case" permissions that never get reviewed.`,
      `Pruning without a safety window can break rarely-used but legitimate automation — stage changes.`,
      `Reviewing humans but not roles/service accounts, which often hold the broadest access.`,
    ],
    why: `"How do you keep least privilege over time?" → last-accessed data + Access Analyzer to prune unused permissions continuously. Continuous right-sizing is the mature answer.`,
    keyPoints: [
      "Use last-accessed data + Access Analyzer to find unused/excess access.",
      "Prune continuously (privilege creep is constant).",
      "Include roles/service accounts, not just humans.",
    ],
    references: [
      { title: "AWS — IAM Access Analyzer", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html" },
      { title: "AWS — Refine permissions using last-accessed data", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_access-advisor.html" },
    ],
    story: `Least privilege isn't one-and-done — permissions drift and accumulate.`,
    concept: `Tools like <b>IAM Access Analyzer</b> and last-accessed data reveal <b>unused permissions and roles</b> so you can prune them. Right-sizing continuously (remove what's never used) keeps real-world least privilege as the environment changes.`,
    task: `How do you keep IAM least-privilege over time?`,
    options: [
      "Grant admin to everyone to avoid tickets",
      "Use access analyzers / last-accessed data to prune unused permissions continuously",
      "Never change policies once set",
      "Delete CloudTrail to reduce noise",
    ],
    answer: 1,
    explanation: "Continuously review last-accessed/unused permissions (e.g., Access Analyzer) and prune them.",
    hints: ["Permissions drift — review and prune.", "Access Analyzer / last-accessed."],
    solutionText: "Use access analyzers to prune unused permissions continuously",
  },

  /* ================= W18: THREAT MODELING & SECURE DESIGN ================= */
  {
    id: "n84", world: "w18", title: "STRIDE", xp: 100, kind: "quiz",
    deepDive: `<b>STRIDE</b> enumerates six threat classes, each with a counter-control:
<pre>S poofing              -> Authentication
T ampering             -> Integrity (hashes/signatures)
R epudiation           -> Logging / audit
I nformation disclosure-> Confidentiality (encryption)
D enial of service     -> Availability (rate limits, redundancy)
E levation of privilege-> Authorization (least privilege)</pre>
<p>Applied to each component/flow in a data-flow diagram, STRIDE turns "what could go wrong?" into a structured checklist.</p>`,
    examples: [
      `<b>Map threat→control:</b> Spoofing→MFA/mTLS; Tampering→signing; Info disclosure→TLS/at-rest encryption.`,
      `<b>Per element:</b> walk each process/data store/flow and ask which STRIDE letters apply.`,
    ],
    pitfalls: [
      `Listing threats without assigning owners/mitigations — a model that drives nothing.`,
      `Confusing authentication (Spoofing) with authorization (Elevation).`,
      `One-time modeling; re-threat-model when the design changes.`,
    ],
    why: `STRIDE is the most common threat-modeling framework in design reviews/interviews. Mapping each letter to a control (Spoofing→auth, etc.) is the structured answer.`,
    keyPoints: [
      "STRIDE = 6 threat classes, each mapped to a control.",
      "Apply per component/flow in a data-flow diagram.",
      "Turn findings into owned, tracked mitigations.",
    ],
    references: [
      { title: "Microsoft — STRIDE threat model", url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats" },
      { title: "OWASP — Threat Modeling Process", url: "https://owasp.org/www-community/Threat_Modeling_Process" },
    ],
    story: `🧩 A structured way to ask "what can go wrong?" early in design.`,
    concept: `<b>STRIDE</b> enumerates threat classes: <b>S</b>poofing (auth), <b>T</b>ampering (integrity), <b>R</b>epudiation (logging), <b>I</b>nformation disclosure (confidentiality), <b>D</b>enial of service (availability), <b>E</b>levation of privilege (authorization). Each maps to a control.`,
    task: `In STRIDE, which threat is countered primarily by strong <b>authentication</b>?`,
    options: ["Tampering", "Spoofing", "Denial of service", "Repudiation"],
    answer: 1,
    explanation: "Spoofing (impersonation) is countered by authentication; each STRIDE letter maps to a control.",
    hints: ["Which threat is about faking identity?", "Auth defeats impersonation."],
    solutionText: "Spoofing",
  },
  {
    id: "n85", world: "w18", title: "Trust Boundaries", xp: 100, kind: "quiz",
    deepDive: `In a data-flow diagram, a <b>trust boundary</b> is where data crosses between zones of differing trust (internet→app, app→database, user→kernel, browser→server). Threats <b>concentrate at these crossings</b>, so that's where you place validation, authN/Z, and encryption.
<p>Threat modeling = draw the data flows, mark the boundaries, then enumerate what can go wrong at each crossing (e.g., with STRIDE).</p>`,
    examples: [
      `<b>Boundary controls:</b> at internet→app, validate input + authenticate; at app→db, use least-privilege creds + parameterized queries.`,
      `<b>DFD:</b> external entities, processes, data stores, and the trust boundaries between them.`,
    ],
    pitfalls: [
      `Modeling components but not the <i>flows</i> between them misses where threats actually live.`,
      `Treating internal hops as "trusted" (flat trust) ignores lateral-movement risk.`,
      `Too-coarse diagrams hide boundary crossings.`,
    ],
    why: `Trust boundaries are central to threat modeling / data-flow diagrams. "Where do you focus controls?" → at the boundaries where trust changes.`,
    keyPoints: [
      "Trust boundary = where data crosses trust levels.",
      "Threats concentrate at crossings — put controls there.",
      "Model the flows, not just the components.",
    ],
    references: [
      { title: "OWASP — Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" },
      { title: "Microsoft — Threat Modeling Tool", url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool" },
    ],
    story: `Threats cluster where data crosses from less-trusted to more-trusted zones.`,
    concept: `In a data-flow diagram, a <b>trust boundary</b> is where data moves between zones of differing trust (internet→app, app→database, user→kernel). These crossings are where you concentrate validation, authn/z, and encryption — most vulnerabilities live at boundaries.`,
    task: `Why identify trust boundaries when threat modeling?`,
    options: [
      "They make diagrams prettier",
      "They mark where data crosses trust levels — where controls and threats concentrate",
      "They define CPU limits",
      "They set the color scheme",
    ],
    answer: 1,
    explanation: "Trust boundaries are the crossings where validation/authn/encryption matter most.",
    hints: ["Where does data change trust level?", "Controls concentrate at crossings."],
    solutionText: "They mark where data crosses trust levels (where controls go)",
  },
  {
    id: "n86", world: "w18", title: "Shrink the Attack Surface", xp: 100, kind: "quiz",
    deepDive: `The <b>attack surface</b> is every point an attacker can try: exposed ports/services, endpoints/APIs, inputs, accounts, installed packages, and dependencies. <b>Reduction</b> means removing what you don't need: disable unused services/ports, remove default accounts, minimize endpoints and installed software, close unneeded network paths.
<p>Less exposed = fewer ways in and less to patch.</p>`,
    examples: [
      `<b>Harden a host:</b> close unused ports, remove default creds, uninstall unneeded packages, restrict egress.`,
      `<b>Minimal images:</b> distroless containers carry far fewer exploitable components.`,
    ],
    pitfalls: [
      `Enabling optional features/services "just in case" expands surface you then must defend.`,
      `Forgetting non-obvious surface: admin panels, debug endpoints, old API versions, dependencies.`,
      `Reducing surface once, then letting it creep back with new deployments.`,
    ],
    why: `Attack-surface reduction is a core hardening principle (CIS benchmarks). "How do you reduce attack surface?" → disable/remove the unused, minimize exposure.`,
    keyPoints: [
      "Attack surface = all points an attacker can target.",
      "Reduce by disabling/removing the unused; minimize exposure.",
      "Watch hidden surface: debug/admin endpoints, old APIs, deps.",
    ],
    references: [
      { title: "CIS Benchmarks (hardening)", url: "https://www.cisecurity.org/cis-benchmarks" },
      { title: "OWASP — Attack Surface Analysis Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html" },
    ],
    story: `Every exposed feature is a door an attacker can try.`,
    concept: `<b>Attack surface reduction</b>: disable unused services/ports, remove default accounts, minimize exposed endpoints and installed packages, and close unneeded network paths. Less exposed = fewer ways in.`,
    task: `Which action reduces attack surface?`,
    options: [
      "Enable every optional service by default",
      "Disable unused ports/services and remove default accounts",
      "Open all firewall ports for convenience",
      "Install extra packages just in case",
    ],
    answer: 1,
    explanation: "Turn off what you don't use and remove defaults — fewer entry points for attackers.",
    hints: ["Fewer doors = safer.", "Disable/remove the unused."],
    solutionText: "Disable unused ports/services and remove default accounts",
  },
  {
    id: "n87", world: "w18", title: "Secure Defaults & Fail Closed", xp: 110, kind: "quiz",
    deepDive: `<b>Secure by default</b> means the out-of-the-box state is the safe one: deny by default, encryption on, least privilege, no default passwords. <b>Fail closed</b> means that when a security decision <i>can't</i> be made (a check errors or a dependency is down), the system <b>denies</b> rather than allows.
<pre>authz service times out -> fail closed -> deny the request</pre>`,
    examples: [
      `<b>Fail closed:</b> if the authorization service is unreachable, reject the request (don't default to allow).`,
      `<b>Secure default:</b> new resources are private; features are off until explicitly enabled.`,
    ],
    pitfalls: [
      `Failing <b>open</b> for availability (allow on error) is how auth bypasses happen under load/outage.`,
      `Sometimes safety (fail closed) conflicts with availability — decide deliberately per system, don't default to open.`,
      `Shipping insecure defaults (open ports, default creds) and relying on users to harden.`,
    ],
    why: `"Fail open vs fail closed?" and "secure by default?" are classic design questions. For security decisions, fail closed; ship safe defaults — is the expected stance.`,
    keyPoints: [
      "Secure by default: deny-by-default, encryption on, no default creds.",
      "Fail closed: deny when a security decision can't be made.",
      "Failing open for availability causes auth bypasses.",
    ],
    references: [
      { title: "OWASP — Secure Design Principles", url: "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html" },
      { title: "Saltzer & Schroeder — Fail-safe defaults", url: "https://www.cs.virginia.edu/~evans/cs551/saltzer/" },
    ],
    story: `What happens when something breaks decides whether you're safe or wide open.`,
    concept: `<b>Secure by default</b> means the out-of-the-box configuration is the safe one (deny by default, encryption on, least privilege). <b>Fail closed</b> means on error the system denies access rather than allowing it — e.g., if the authz service is down, reject requests.`,
    task: `An authorization service times out. A "fail closed" design will:`,
    options: [
      "Allow the request through to avoid downtime",
      "Deny the request because authorization couldn't be confirmed",
      "Crash the whole application",
      "Log in the user as admin",
    ],
    answer: 1,
    explanation: "Fail closed = deny when a security decision can't be made; never default to allow.",
    hints: ["On failure, which is safe — allow or deny?", "Closed = deny."],
    solutionText: "Deny the request (couldn't confirm authorization)",
  },
  {
    id: "n88", world: "w18", title: "Defense in Depth", xp: 100, kind: "quiz",
    deepDive: `<b>Defense in depth</b> layers multiple <b>independent</b> controls so that if one fails, others still protect you — no single point of failure. Example stack: network segmentation + WAF + authN/Z + input validation + encryption + monitoring + EDR.
<p>It assumes any single control <i>will</i> eventually fail (zero-day, misconfig, bypass), so redundancy limits the damage.</p>`,
    examples: [
      `<b>Layered web app:</b> WAF + parameterized queries + least-privilege DB user + monitoring — SQLi must beat all four.`,
      `<b>Assume breach:</b> perimeter + segmentation + EDR + logging so one failure isn't fatal.`,
    ],
    pitfalls: [
      `Relying on a single "strong" control (just a firewall / just a WAF) = single point of failure.`,
      `Layers that aren't <i>independent</i> (all fail the same way) don't add real depth.`,
      `More layers add cost/complexity — balance, don't just pile on.`,
    ],
    why: `Defense in depth is a bedrock principle. "Why not rely on one control?" → it will eventually fail; independent layers contain the damage.`,
    keyPoints: [
      "Layer independent controls; assume any one fails.",
      "No single point of failure; redundancy limits damage.",
      "Layers must be genuinely independent to help.",
    ],
    references: [
      { title: "NSA/CISA — Defense in depth", url: "https://www.cisa.gov/news-events/news/defense-depth" },
      { title: "NIST SP 800-53 — Control families", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
    ],
    story: `No single control is perfect — so don't rely on one.`,
    concept: `<b>Defense in depth</b> layers independent controls (network segmentation + WAF + authn/z + input validation + monitoring) so that if one fails, others still protect you. A single perimeter firewall is a single point of failure.`,
    task: `What does defense in depth mean?`,
    options: [
      "Spending the entire budget on one firewall",
      "Layering multiple independent controls so one failure isn't fatal",
      "Only encrypting data",
      "Relying solely on the perimeter",
    ],
    answer: 1,
    explanation: "Multiple independent layers mean a single control's failure doesn't breach you.",
    hints: ["Don't rely on one control.", "Layers that back each other up."],
    solutionText: "Layering multiple independent controls",
  },
  {
    id: "n89", world: "w18", title: "Least Privilege by Design", xp: 110, kind: "quiz",
    deepDive: `<b>Least privilege</b> — every user, service, and process gets only the access it needs, for only as long as it needs it — is the throughline of every world in this quest. It limits blast radius everywhere: IAM policies, network ACLs, K8s RBAC, API scopes, secret access, DB grants.
<p>Pair it with <b>separation of duties</b> (no one person owns a whole sensitive process) and <b>just-in-time</b> elevation.</p>`,
    examples: [
      `<b>Scoped grant:</b> a microservice that reads one table gets read-only on just that table — not DB admin.`,
      `<b>JIT:</b> assume an admin role for one hour with approval, instead of standing admin.`,
    ],
    pitfalls: [
      `"Grant broad to avoid tickets" trades a one-time convenience for permanent risk.`,
      `Least privilege erodes over time (privilege creep) — review and prune continuously.`,
      `Forgetting non-human identities (services/roles), which often hold the broadest access.`,
    ],
    why: `Least privilege is the single most-cited security principle and appears in every framework. Being able to apply it across IAM/network/K8s/API shows cohesive design thinking.`,
    keyPoints: [
      "Minimum access, minimum time — everywhere (IAM/ACL/RBAC/scopes).",
      "Pair with separation of duties and JIT elevation.",
      "Fight privilege creep with continuous review.",
    ],
    references: [
      { title: "NIST — Least privilege (AC-6)", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
      { title: "CISA — Zero trust / least privilege", url: "https://www.cisa.gov/zero-trust-maturity-model" },
    ],
    story: `The design principle that shows up in every other topic you've learned.`,
    concept: `<b>Least privilege</b> — every user, service, and process gets only the access it needs, for only as long as it needs it. It limits blast radius everywhere: IAM, network ACLs, K8s RBAC, API scopes, secrets access. It's the throughline of secure design.`,
    task: `A microservice only needs to read one table. Least privilege says:`,
    options: [
      "Give it full database admin, just in case",
      "Grant read-only access to just that table (and nothing more)",
      "Share the DBA's personal credentials",
      "Grant write access to all tables for flexibility",
    ],
    answer: 1,
    explanation: "Grant exactly the access needed (read that one table) — nothing more.",
    hints: ["Only what it needs, nothing extra.", "Read one table = read one table."],
    solutionText: "Grant read-only to just that table",
  },

  /* ================= W19: WEB EXPLOITATION ================= */
  {
    id: "n90", world: "w19", title: "CSRF", xp: 100, kind: "quiz",
    deepDive: `<b>CSRF</b> abuses a victim's <i>existing session</i>: a malicious page makes the victim's browser send a state-changing request (transfer money, change email) that rides their session cookie. Defenses:
<ul>
<li><b>Anti-CSRF tokens</b> — a secret per-session value the attacker can't know.</li>
<li><b>SameSite cookies</b> (Lax/Strict) — the session cookie isn't sent on cross-site requests.</li>
<li>Check <b>Origin/Referer</b>; keep state changes off GET.</li>
</ul>`,
    examples: [
      `<b>Attack:</b> an image/form on evil.com auto-submits <code>POST /transfer</code> to your bank using your cookie.`,
      `<b>Defense:</b> require a CSRF token + SameSite=Lax cookies.`,
    ],
    pitfalls: [
      `State changes on GET requests are inherently CSRF-prone — use POST/PUT/DELETE.`,
      `A CSRF token stored in a readable cookie and echoed can be defeated by XSS — bind it to the session.`,
      `SameSite alone isn't complete (some flows/old browsers) — layer token + SameSite.`,
    ],
    why: `CSRF is a classic web vuln; "token + SameSite + no-state-on-GET" is the expected fix. Knowing XSS can undermine CSRF defenses shows how vulns chain.`,
    keyPoints: [
      "CSRF rides the victim's session to force state changes.",
      "Defend with anti-CSRF tokens + SameSite cookies.",
      "Keep state changes off GET; check Origin/Referer.",
    ],
    references: [
      { title: "OWASP — CSRF Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" },
      { title: "MDN — SameSite cookies", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite" },
    ],
    story: `🕷️ The web-exploitation world. First: tricking a logged-in user's browser into acting for the attacker.`,
    concept: `<b>CSRF</b> (Cross-Site Request Forgery) abuses a user's existing session: a malicious page makes the victim's browser submit a state-changing request. Defenses: <b>anti-CSRF tokens</b> and <b>SameSite cookies</b> (plus checking Origin/Referer).`,
    task: `Which pair best defends against CSRF?`,
    options: [
      "Longer passwords and CAPTCHAs on login",
      "Anti-CSRF tokens and SameSite cookies",
      "Disabling TLS",
      "Rotating the server's IP",
    ],
    answer: 1,
    explanation: "Per-request anti-CSRF tokens + SameSite cookies stop forged cross-site state changes.",
    hints: ["It abuses the existing session cookie.", "Token the browser can't know + SameSite."],
    solutionText: "Anti-CSRF tokens and SameSite cookies",
  },
  {
    id: "n91", world: "w19", title: "IDOR", xp: 100, kind: "quiz",
    deepDive: `<b>IDOR</b> (Insecure Direct Object Reference), aka BOLA, is a missing <b>authorization</b> check: the app trusts a user-supplied object id without verifying the requester owns/may access it. Changing <code>/orders/123</code> → <code>/orders/124</code> leaks another user's data.
<p>Fix: enforce <b>per-object authorization server-side</b> on every access — don't rely on unguessable IDs.</p>`,
    examples: [
      `<b>Exploit:</b> incrementing an account/document/order id returns someone else's record.`,
      `<b>Fix:</b> <code>if resource.owner != current_user: 403</code> on fetch/update/delete.`,
    ],
    pitfalls: [
      `UUIDs instead of sequential IDs are obscurity, not access control — still authorize.`,
      `Checking list endpoints but not detail/update/delete leaves gaps.`,
      `Trusting a client-supplied tenant/owner id without verifying it belongs to the caller.`,
    ],
    why: `IDOR/BOLA tops the OWASP API Top 10 and is behind many real breaches. "Enforce per-object server-side authorization" is the answer.`,
    keyPoints: [
      "IDOR = missing per-object authorization.",
      "Authorize server-side on every object operation.",
      "Random IDs ≠ access control.",
    ],
    references: [
      { title: "OWASP — IDOR", url: "https://owasp.org/www-community/attacks/Insecure_Direct_Object_Reference" },
      { title: "OWASP API1 — Broken Object Level Authorization", url: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/" },
    ],
    story: `Change the id in the URL, get someone else's data.`,
    concept: `<b>IDOR</b> (Insecure Direct Object Reference) is a missing <b>authorization</b> check: the app trusts a user-supplied object id without verifying ownership. Fix: enforce per-object access control server-side (don't rely on unguessable ids alone).`,
    task: `The fix for IDOR is primarily:`,
    options: [
      "Use longer, random object ids and hope nobody guesses",
      "Enforce server-side authorization that the requester owns/may access the object",
      "Hide the id in a cookie",
      "Return a 500 error for all requests",
    ],
    answer: 1,
    explanation: "IDOR is an authorization gap — verify ownership/permission server-side per object.",
    hints: ["Obscurity isn't access control.", "Check ownership on the server."],
    solutionText: "Enforce server-side per-object authorization",
  },
  {
    id: "n92", world: "w19", title: "Open Redirect", xp: 100, kind: "quiz",
    deepDive: `An <b>open redirect</b> occurs when a redirect destination comes from user input without validation (<code>/login?next=https://evil.com</code>). Attackers use it for convincing phishing (the link starts on your trusted domain) and to abuse OAuth <code>redirect_uri</code>. Fix: only allow <b>relative same-site paths</b> or an <b>allowlist</b> of destinations.`,
    examples: [
      `<b>Phishing:</b> <code>https://trusted.com/go?url=https://evil.com</code> looks safe but lands on evil.com.`,
      `<b>Fix:</b> validate that the redirect target is a relative path (not <code>//</code> or absolute), or on an allowlist.`,
    ],
    pitfalls: [
      `Protocol-relative (<code>//evil.com</code>), backslash, and encoded bypasses defeat naive checks — normalize or allowlist.`,
      `Open redirects weaken OAuth — validate <code>redirect_uri</code> strictly against registered values.`,
      `Treating it as "low severity" ignores its phishing/token-theft impact.`,
    ],
    why: `Open redirect is a common phishing enabler and OAuth pitfall. "Allow only relative same-site paths or an allowlist" is the expected fix.`,
    keyPoints: [
      "User-controlled redirect targets enable phishing/token theft.",
      "Allow only relative same-site paths or an allowlist.",
      "Validate OAuth redirect_uri strictly.",
    ],
    references: [
      { title: "OWASP — Unvalidated Redirects & Forwards Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html" },
      { title: "CWE-601 — Open Redirect", url: "https://cwe.mitre.org/data/definitions/601.html" },
    ],
    story: `A trusted link that quietly bounces users to an attacker's site.`,
    concept: `An <b>open redirect</b> happens when a redirect target comes from user input without validation (<code>/login?next=https://evil.com</code>). Defense: allow only <b>relative, same-site</b> paths or an allowlist of destinations — never redirect to arbitrary absolute URLs.`,
    task: `How do you prevent open redirects?`,
    options: [
      "Redirect to whatever the user supplies",
      "Only allow relative same-site paths or an allowlist of destinations",
      "Use HTTP instead of HTTPS",
      "Add more query parameters",
    ],
    answer: 1,
    explanation: "Validate redirect targets: relative same-site paths or an explicit allowlist only.",
    hints: ["Don't trust a user-supplied destination.", "Relative paths / allowlist."],
    solutionText: "Only allow relative same-site paths or an allowlist",
  },
  {
    id: "n93", world: "w19", title: "Clickjacking", xp: 100, kind: "quiz",
    deepDive: `<b>Clickjacking</b> frames your site invisibly over an attacker page so the victim's clicks land on hidden buttons (e.g., "delete account", "authorize"). Defense: control who may frame your pages with <b>CSP <code>frame-ancestors</code></b> (modern) or the legacy <b>X-Frame-Options: DENY/SAMEORIGIN</b>.`,
    examples: [
      `<b>Attack:</b> a transparent iframe of your settings page over a "Click to win!" button.`,
      `<b>Defense:</b> <code>Content-Security-Policy: frame-ancestors 'none'</code> (or 'self').`,
    ],
    pitfalls: [
      `Relying only on legacy X-Frame-Options — prefer CSP frame-ancestors (more flexible, standard).`,
      `Allowing framing by <code>*</code> defeats the control.`,
      `Sensitive actions should also require re-authentication / confirmation, not just anti-framing.`,
    ],
    why: `Clickjacking defense (frame-ancestors / X-Frame-Options) is standard web hardening and a common headers question.`,
    keyPoints: [
      "Clickjacking tricks clicks via invisible framing.",
      "Defend with CSP frame-ancestors (or X-Frame-Options).",
      "Add confirmation/re-auth for sensitive actions.",
    ],
    references: [
      { title: "OWASP — Clickjacking Defense Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html" },
      { title: "MDN — frame-ancestors", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors" },
    ],
    story: `Your page, invisibly framed over a trap, hijacks the user's clicks.`,
    concept: `<b>Clickjacking</b> frames your site in a transparent overlay so clicks hit hidden buttons. Defense: <code>X-Frame-Options: DENY/SAMEORIGIN</code> or, better, CSP <code>frame-ancestors</code> to control who may embed your pages.`,
    task: `Which header defends against clickjacking?`,
    options: [
      "Content-Length",
      "CSP frame-ancestors (or X-Frame-Options)",
      "Accept-Encoding",
      "Cache-Control",
    ],
    answer: 1,
    explanation: "frame-ancestors / X-Frame-Options control framing, preventing clickjacking overlays.",
    hints: ["It's about who can put you in an iframe.", "frame-ancestors / X-Frame-Options."],
    solutionText: "CSP frame-ancestors (or X-Frame-Options)",
  },
  {
    id: "n94", world: "w19", title: "Security Headers", xp: 100, kind: "quiz",
    deepDive: `A few HTTP response headers harden a web app cheaply:
<ul>
<li><b>Content-Security-Policy (CSP)</b> — restricts which scripts/resources can load → mitigates XSS.</li>
<li><b>Strict-Transport-Security (HSTS)</b> — forces HTTPS, prevents downgrade/SSL-strip.</li>
<li><b>X-Content-Type-Options: nosniff</b>, <b>frame-ancestors</b> (anti-clickjacking), <b>Referrer-Policy</b>.</li>
</ul>`,
    examples: [
      `<b>CSP:</b> <code>default-src 'self'</code> blocks inline/injected scripts from running — a strong XSS backstop.`,
      `<b>HSTS:</b> after the first visit, the browser refuses plain HTTP to your domain.`,
    ],
    pitfalls: [
      `A too-permissive CSP (<code>'unsafe-inline'</code>, <code>*</code>) provides little protection — tighten it.`,
      `HSTS is sticky (max-age) — test before enabling preload, or you can lock yourself out of HTTP.`,
      `Headers harden the browser side; they don't fix server-side bugs.`,
    ],
    why: `Security headers (especially CSP for XSS, HSTS for HTTPS) are standard web-hardening and a common "how would you reduce XSS impact?" answer.`,
    keyPoints: [
      "CSP restricts script/resource origins → mitigates XSS.",
      "HSTS forces HTTPS; nosniff/frame-ancestors/Referrer-Policy add more.",
      "Avoid permissive CSP ('unsafe-inline', *).",
    ],
    references: [
      { title: "MDN — Content Security Policy", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" },
      { title: "OWASP — Secure Headers Project", url: "https://owasp.org/www-project-secure-headers/" },
    ],
    story: `A few response headers harden a web app for free.`,
    concept: `<b>CSP</b> (Content-Security-Policy) restricts which scripts/resources load, mitigating XSS. <b>HSTS</b> (Strict-Transport-Security) forces HTTPS. Together with secure cookies and frame-ancestors, they're baseline web hardening.`,
    task: `Which header most directly mitigates XSS by controlling allowed script sources?`,
    options: [
      "Strict-Transport-Security (HSTS)",
      "Content-Security-Policy (CSP)",
      "X-Powered-By",
      "Server",
    ],
    answer: 1,
    explanation: "CSP restricts script/resource origins, reducing XSS impact; HSTS enforces HTTPS.",
    hints: ["Which one governs where scripts may load from?", "Content-Security-Policy."],
    solutionText: "Content-Security-Policy (CSP)",
  },
  {
    id: "n95", world: "w19", title: "Cookie Flags", xp: 100, kind: "quiz",
    deepDive: `Session cookies are credentials — flag them properly:
<ul>
<li><b>HttpOnly</b> — JavaScript can't read the cookie, so XSS can't steal the session.</li>
<li><b>Secure</b> — sent only over HTTPS.</li>
<li><b>SameSite</b> (Lax/Strict) — not sent on cross-site requests → mitigates CSRF.</li>
</ul>
<p>Missing flags are a common, easily-exploited gap.</p>`,
    examples: [
      `<b>HttpOnly saves you:</b> even with an XSS bug, injected JS can't read <code>document.cookie</code>.`,
      `<b>Set-Cookie:</b> <code>session=...; HttpOnly; Secure; SameSite=Lax</code>.`,
    ],
    pitfalls: [
      `Omitting HttpOnly turns any XSS into instant session theft.`,
      `No Secure flag → the cookie can leak over an accidental HTTP request.`,
      `SameSite=None without Secure is rejected by modern browsers.`,
    ],
    why: `Cookie security flags are a quick-win hardening item and a common question. HttpOnly (anti-XSS-theft) + Secure + SameSite (anti-CSRF) is the trio to name.`,
    keyPoints: [
      "HttpOnly (no JS access), Secure (HTTPS only), SameSite (anti-CSRF).",
      "Missing HttpOnly turns XSS into session theft.",
      "Treat session cookies as credentials.",
    ],
    references: [
      { title: "OWASP — Session Management Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
      { title: "MDN — Set-Cookie", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie" },
    ],
    story: `Session cookies carry the keys to the kingdom — flag them properly.`,
    concept: `Session cookies should be <b>HttpOnly</b> (no JS access → limits XSS theft), <b>Secure</b> (HTTPS only), and <b>SameSite</b> (Lax/Strict → limits CSRF). Missing these is a common, easy-to-exploit gap.`,
    task: `Which cookie flag best prevents JavaScript from stealing a session cookie during an XSS?`,
    options: ["Secure", "HttpOnly", "Domain", "Max-Age"],
    answer: 1,
    explanation: "HttpOnly blocks document.cookie access, so injected JS can't read the session cookie.",
    hints: ["Which flag hides the cookie from JS?", "HttpOnly."],
    solutionText: "HttpOnly",
  },

  /* ================= W20: COMPLIANCE & GOVERNANCE ================= */
  {
    id: "n96", world: "w20", title: "SOC 2", xp: 100, kind: "quiz",
    deepDive: `<b>SOC 2</b> is an independent attestation (by a CPA firm) that a service org's controls meet the AICPA <b>Trust Services Criteria</b>: Security (required), plus optionally Availability, Confidentiality, Processing Integrity, and Privacy.
<ul>
<li><b>Type I</b> — controls designed appropriately at a point in time.</li>
<li><b>Type II</b> — controls operated effectively over a period (months) — the one customers want.</li>
</ul>`,
    examples: [
      `<b>Customer ask:</b> enterprises require a SOC 2 Type II report before buying a SaaS.`,
      `<b>Evidence:</b> access reviews, change management, monitoring, incident response — demonstrated over the period.`,
    ],
    pitfalls: [
      `Confusing Type I (design) with Type II (operating effectiveness over time).`,
      `Thinking SOC 2 certifies the product is secure/bug-free — it attests controls, not code quality.`,
      `Treating it as a one-time push rather than continuous control operation.`,
    ],
    why: `SOC 2 is the attestation SaaS vendors are constantly asked for. Knowing Trust Services Criteria + Type I vs II is the expected GRC literacy.`,
    keyPoints: [
      "SOC 2 attests controls vs the Trust Services Criteria.",
      "Type I = design (point in time); Type II = operating effectiveness (period).",
      "It's about controls, not product bug-freeness.",
    ],
    references: [
      { title: "AICPA — SOC 2 / Trust Services", url: "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services" },
      { title: "AICPA — Trust Services Criteria", url: "https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022" },
    ],
    story: `📋 The report customers ask SaaS vendors for.`,
    concept: `<b>SOC 2</b> is an attestation (by a CPA firm) that a service org's controls meet the AICPA <b>Trust Services Criteria</b> — Security (required), plus optionally Availability, Confidentiality, Processing Integrity, Privacy. <b>Type II</b> tests controls over a period, not just a point in time.`,
    task: `What does a SOC 2 report demonstrate?`,
    options: [
      "A product is bug-free",
      "A service org's controls meet the Trust Services Criteria (independently attested)",
      "The code is open source",
      "The company is profitable",
    ],
    answer: 1,
    explanation: "SOC 2 attests controls against the Trust Services Criteria; Type II covers a period.",
    hints: ["Trust Services Criteria.", "It's about controls, not code quality."],
    solutionText: "Controls meet the Trust Services Criteria (attested)",
  },
  {
    id: "n97", world: "w20", title: "ISO 27001", xp: 100, kind: "quiz",
    deepDive: `<b>ISO/IEC 27001</b> is the international standard for an <b>ISMS</b> (Information Security Management System) — a risk-based framework of policies, processes, and controls with <b>continual improvement</b> (Plan-Do-Check-Act). <b>Annex A</b> lists reference controls; you select those your risk assessment justifies (documented in a Statement of Applicability).
<p>It certifies that you <i>manage</i> security systematically, not that any one product is secure.</p>`,
    examples: [
      `<b>ISMS:</b> risk assessment → select Annex A controls → implement → audit → improve.`,
      `<b>Certification:</b> an accredited body audits and certifies the ISMS (recertified periodically).`,
    ],
    pitfalls: [
      `Thinking ISO 27001 is a product cert — it certifies the management system.`,
      `Copy-pasting all Annex A controls without a risk basis (bloated, unmaintained).`,
      `Treating it as a one-off audit instead of continual improvement.`,
    ],
    why: `ISO 27001 vs SOC 2 is a common GRC comparison (international ISMS standard vs US attestation). Knowing it's a risk-based ISMS with Annex A controls is the point.`,
    keyPoints: [
      "ISO 27001 certifies a risk-based ISMS (PDCA, continual improvement).",
      "Annex A = reference controls, selected via risk (SoA).",
      "Management system, not a product certification.",
    ],
    references: [
      { title: "ISO/IEC 27001", url: "https://www.iso.org/standard/27001" },
      { title: "ISO — Information security management", url: "https://www.iso.org/isoiec-27001-information-security.html" },
    ],
    story: `The international standard for running security as a system.`,
    concept: `<b>ISO/IEC 27001</b> certifies an <b>ISMS</b> (Information Security Management System) — a risk-based framework of policies, controls, and continual improvement (Annex A controls). It's about <i>managing</i> security systematically, not a one-time checklist.`,
    task: `ISO 27001 is centered on:`,
    options: [
      "A specific firewall product",
      "An Information Security Management System (ISMS) — risk-based, continually improved",
      "A programming language standard",
      "A cloud provider's billing model",
    ],
    answer: 1,
    explanation: "ISO 27001 certifies an ISMS: risk management, controls, and continual improvement.",
    hints: ["ISMS.", "A management system, not a product."],
    solutionText: "An ISMS — risk-based, continually improved",
  },
  {
    id: "n98", world: "w20", title: "GDPR", xp: 100, kind: "quiz",
    deepDive: `<b>GDPR</b> protects EU residents' <b>personal data</b> and applies to anyone processing it (extraterritorial). Key obligations: a <b>lawful basis</b> for processing, <b>data-subject rights</b> (access, rectification, erasure/"right to be forgotten", portability), <b>data minimization</b> & storage limitation, privacy by design, and <b>~72-hour breach notification</b> to the supervisory authority. Fines reach up to 4% of global turnover.`,
    examples: [
      `<b>Erasure request:</b> a user asks you to delete their data — you must comply (incl. backups/processors), barring legal holds.`,
      `<b>Breach:</b> notify the regulator within 72 hours of becoming aware (and affected users if high risk).`,
    ],
    pitfalls: [
      `Assuming GDPR only applies to EU companies — it's based on the data subject's residency, not your HQ.`,
      `Personal data is broad (name, email, IP, device/location IDs) — not just obvious identifiers.`,
      `"Deleted" must include backups/replicas and data shared with processors.`,
    ],
    why: `GDPR is the benchmark privacy law with global reach and real fines. Data-subject rights + 72-hour breach notice + extraterritoriality are the must-know points.`,
    keyPoints: [
      "Protects EU residents' personal data; extraterritorial reach.",
      "Data-subject rights (incl. erasure) + 72-hour breach notice.",
      "Data minimization/storage limitation; fines up to 4% turnover.",
    ],
    references: [
      { title: "GDPR — Full text / info", url: "https://gdpr-info.eu/" },
      { title: "EU — Data protection rules", url: "https://commission.europa.eu/law/law-topic/data-protection_en" },
    ],
    story: `Europe's privacy law with global reach and real fines.`,
    concept: `<b>GDPR</b> protects EU residents' <b>personal data</b>: lawful basis for processing, <b>data-subject rights</b> (access, erasure/"right to be forgotten", portability), <b>data minimization</b>, and <b>72-hour breach notification</b> to regulators. Applies to anyone processing EU residents' data.`,
    task: `Which is a core GDPR requirement?`,
    options: [
      "Store all data forever",
      "Honor data-subject rights (access, erasure) and notify breaches within 72 hours",
      "Share personal data freely",
      "Only applies to EU-based companies",
    ],
    answer: 1,
    explanation: "GDPR grants data-subject rights and mandates ~72-hour breach notification; reach is extraterritorial.",
    hints: ["Right to be forgotten, 72-hour breach notice.", "Data-subject rights."],
    solutionText: "Honor data-subject rights and 72-hour breach notification",
  },
  {
    id: "n99", world: "w20", title: "PCI DSS", xp: 100, kind: "quiz",
    deepDive: `<b>PCI DSS</b> governs handling of <b>cardholder data</b> (anyone who stores/processes/transmits it). A central strategy is <b>scope reduction</b>: don't store the PAN, <b>tokenize</b> it, and <b>segment</b> the cardholder-data environment (CDE) so fewer systems fall under the (demanding) requirements.
<p>Never store sensitive authentication data (CVV, full track) after authorization.</p>`,
    examples: [
      `<b>Reduce scope:</b> use a payment processor/tokenization so your systems never see raw card numbers.`,
      `<b>Segment:</b> isolate the CDE so only a small, tightly-controlled zone is in scope.`,
    ],
    pitfalls: [
      `Storing full PAN/CVV "for convenience" massively expands scope and risk (and CVV storage is prohibited).`,
      `A flat network drags everything into PCI scope — segment the CDE.`,
      `Treating PCI as annual paperwork rather than continuous control.`,
    ],
    why: `PCI DSS and scope reduction (tokenize + segment) are standard if you touch payments. "How do you reduce PCI burden?" → minimize stored card data and segment the CDE.`,
    keyPoints: [
      "PCI DSS governs cardholder data handling.",
      "Reduce scope: tokenize/don't store PAN; segment the CDE.",
      "Never store CVV/track data after authorization.",
    ],
    references: [
      { title: "PCI Security Standards Council", url: "https://www.pcisecuritystandards.org/" },
      { title: "PCI — Document library (PCI DSS)", url: "https://www.pcisecuritystandards.org/document_library/" },
    ],
    story: `If you touch card numbers, this one's mandatory.`,
    concept: `<b>PCI DSS</b> governs handling of <b>cardholder data</b>. A key strategy is <b>scope reduction</b> — don't store card numbers, tokenize them, and segment the cardholder-data environment so fewer systems are "in scope" for the (demanding) requirements.`,
    task: `What's the smartest way to reduce PCI DSS burden?`,
    options: [
      "Store full card numbers everywhere for convenience",
      "Reduce scope: tokenize/don't store PAN and segment the cardholder-data environment",
      "Email card numbers to finance",
      "Ignore it if you're small",
    ],
    answer: 1,
    explanation: "Minimize/tokenize stored card data and segment the CDE to shrink PCI scope.",
    hints: ["Less card data stored = less scope.", "Tokenize + segment."],
    solutionText: "Reduce scope: tokenize/don't store PAN and segment the CDE",
  },
  {
    id: "n100", world: "w20", title: "Classify & Retain", xp: 100, kind: "quiz",
    deepDive: `You can't protect data consistently without knowing its sensitivity. <b>Data classification</b> (public / internal / confidential / restricted) drives the controls applied — encryption, access, logging, DLP. <b>Retention policies</b> define how long to keep each class and when to securely delete; keeping data past need adds breach risk and can violate GDPR storage limitation.`,
    examples: [
      `<b>Classify → control:</b> "restricted" data gets encryption + strict access + audit; "public" needs none of that.`,
      `<b>Retain → delete:</b> logs kept 1 year then purged; PII deleted when no longer needed (barring legal holds).`,
    ],
    pitfalls: [
      `No classification → everything treated the same (over-spend on trivial data, under-protect the crown jewels).`,
      `Retention as a max only — some data has a legally-required <i>minimum</i> too.`,
      `"Deleted" must include backups/replicas to actually reduce risk.`,
    ],
    why: `Classification + retention underpin proportionate controls and are explicit GDPR/governance requirements. Knowing classification drives controls (and retention is max AND sometimes min) is the depth.`,
    keyPoints: [
      "Classification drives which controls/retention apply.",
      "Keep per-class retention; delete securely (incl. backups).",
      "Retention is a max — and sometimes a legal minimum.",
    ],
    references: [
      { title: "NIST — Data classification / categorization (FIPS 199)", url: "https://csrc.nist.gov/pubs/fips/199/final" },
      { title: "GDPR — Storage limitation (Art. 5)", url: "https://gdpr-info.eu/art-5-gdpr/" },
    ],
    story: `You can't protect data consistently if you don't label it.`,
    concept: `<b>Data classification</b> (public / internal / confidential / restricted) drives the controls applied (encryption, access, logging). <b>Retention policies</b> define how long to keep each class and when to securely delete — keeping data past need adds risk and can breach GDPR/retention rules.`,
    task: `Why classify data?`,
    options: [
      "To make bigger spreadsheets",
      "So the right controls and retention apply to the right sensitivity level",
      "To slow down the network",
      "Classification has no security value",
    ],
    answer: 1,
    explanation: "Classification lets you apply proportionate controls and retention by sensitivity.",
    hints: ["Label drives the controls.", "Sensitivity → protection + retention."],
    solutionText: "So controls and retention match data sensitivity",
  },
  {
    id: "n101", world: "w20", title: "Separation of Duties", xp: 110, kind: "quiz",
    deepDive: `<b>Separation of duties (SoD)</b> splits a sensitive process so no single person can both perform and approve a critical action — preventing fraud and catching errors. In security/DevOps: the person who writes code shouldn't be the sole approver and deployer to prod; whoever requests privileged access shouldn't also grant it.
<p>Related: <b>dual control / four-eyes</b> for the most sensitive operations (key management, production changes).</p>`,
    examples: [
      `<b>DevOps SoD:</b> developer writes code → a different reviewer approves → protected pipeline deploys.`,
      `<b>Finance analogy:</b> the person who creates a payment can't also approve it.`,
    ],
    pitfalls: [
      `Small teams struggle with strict SoD — compensate with logging, alerting, and break-glass review.`,
      `SoD on paper but shared admin accounts in practice defeats it — use individual, attributable identities.`,
      `Over-rigid SoD can stall work; balance with automation and clear roles.`,
    ],
    why: `Separation of duties is a named control in SOC 2/ISO/PCI and a core governance principle. "Why can't one person own a whole sensitive process?" → fraud/error prevention via SoD.`,
    keyPoints: [
      "SoD: no single person performs AND approves a sensitive action.",
      "Prevents fraud, catches errors; dual control for the most sensitive ops.",
      "Small teams compensate with logging/alerting/review.",
    ],
    references: [
      { title: "NIST — Separation of Duties (AC-5)", url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
      { title: "OWASP — Access Control", url: "https://owasp.org/www-community/Access_Control" },
    ],
    story: `No single person should be able to commit and conceal fraud.`,
    concept: `<b>Separation of duties</b> splits sensitive processes so one person can't both perform and approve a critical action (e.g., the developer who writes code shouldn't solely approve and deploy it to prod). It's a core governance control against fraud and error.`,
    task: `Separation of duties primarily prevents:`,
    options: [
      "Slow deployments",
      "A single individual performing AND approving a sensitive action (fraud/error)",
      "High cloud bills",
      "DNS misconfiguration",
    ],
    answer: 1,
    explanation: "SoD ensures no one person controls a whole sensitive process end-to-end.",
    hints: ["Split perform vs approve.", "One person shouldn't do it all."],
    solutionText: "One person performing and approving a sensitive action",
  },
];
