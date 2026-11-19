/* ============================================================
   NETWORK SECURITY QUEST — simulation engine
   Pure logic (no DOM) so it runs in the browser AND in Node
   for the self-test. Two parts:
     1) IP / subnet math
     2) a firewall rule parser + packet evaluator
   ============================================================ */
(function (root) {

  /* ---------------- IP / subnet math ---------------- */
  function ipToInt(ip) {
    const o = String(ip).trim().split(".");
    if (o.length !== 4) return null;
    let n = 0;
    for (const part of o) {
      const v = Number(part);
      if (!Number.isInteger(v) || v < 0 || v > 255) return null;
      n = (n * 256) + v;
    }
    return n >>> 0;
  }
  function intToIp(n) {
    n = n >>> 0;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }
  function parseCidr(cidr) {
    const m = String(cidr).trim().match(/^(\d+\.\d+\.\d+\.\d+)\s*\/\s*(\d+)$/);
    if (!m) return null;
    const ipInt = ipToInt(m[1]);
    const bits = Number(m[2]);
    if (ipInt === null || bits < 0 || bits > 32) return null;
    const maskInt = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
    const network = (ipInt & maskInt) >>> 0;
    const broadcast = (network | (~maskInt >>> 0)) >>> 0;
    const numAddresses = Math.pow(2, 32 - bits);
    const usableHosts = bits >= 31 ? 0 : numAddresses - 2;
    return {
      bits,
      maskInt,
      mask: intToIp(maskInt),
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      firstHost: bits >= 31 ? intToIp(network) : intToIp((network + 1) >>> 0),
      lastHost: bits >= 31 ? intToIp(broadcast) : intToIp((broadcast - 1) >>> 0),
      numAddresses,
      usableHosts,
    };
  }
  // Is an IP inside a CIDR block?
  function ipInCidr(ip, cidr) {
    const info = parseCidr(cidr);
    const ipInt = ipToInt(ip);
    if (!info || ipInt === null) return false;
    const net = ipToInt(info.network);
    const bc = ipToInt(info.broadcast);
    return ipInt >= net && ipInt <= bc;
  }
  // Smallest prefix length that fits `hosts` usable hosts.
  function prefixForHosts(hosts) {
    for (let bits = 32; bits >= 0; bits--) {
      const usable = bits >= 31 ? 0 : Math.pow(2, 32 - bits) - 2;
      if (usable >= hosts) return bits;
    }
    return 0;
  }

  /* ---------------- firewall engine ---------------- */
  const ACTIONS = ["allow", "deny"];
  const PROTOS = ["tcp", "udp", "icmp", "any"];

  // Rule syntax:  action proto src dst [port]
  //   action: allow | deny
  //   proto : tcp | udp | icmp | any
  //   src/dst: zone name (e.g. internet, dmz, internal, db) or "any"
  //   port  : number or "any" (defaults to any)
  // '#' starts a comment. An optional '->' between src and dst is ignored.
  function parseRules(text) {
    const rules = [];
    const errors = [];
    String(text || "").split("\n").forEach((line, i) => {
      const noComment = line.split("#")[0];
      const raw = noComment.trim();
      if (!raw) return;
      const t = raw.split(/\s+/).filter(p => p !== "->");
      if (t.length < 4) {
        errors.push({ line: i + 1, msg: `Line ${i + 1}: need "action proto src dst [port]" — got "${raw}"` });
        return;
      }
      const action = t[0].toLowerCase();
      const proto = t[1].toLowerCase();
      const src = t[2].toLowerCase();
      const dst = t[3].toLowerCase();
      const port = (t[4] || "any").toLowerCase();
      if (!ACTIONS.includes(action)) { errors.push({ line: i + 1, msg: `Line ${i + 1}: action must be allow or deny` }); return; }
      if (!PROTOS.includes(proto)) { errors.push({ line: i + 1, msg: `Line ${i + 1}: proto must be tcp/udp/icmp/any` }); return; }
      if (port !== "any" && !/^\d+$/.test(port)) { errors.push({ line: i + 1, msg: `Line ${i + 1}: port must be a number or "any"` }); return; }
      rules.push({ action, proto, src, dst, port, raw, line: i + 1 });
    });
    return { rules, errors };
  }

  function matchFlow(rule, flow) {
    const protoOk = rule.proto === "any" || rule.proto === flow.proto;
    const srcOk = rule.src === "any" || rule.src === flow.src;
    const dstOk = rule.dst === "any" || rule.dst === flow.dst;
    const portOk = rule.port === "any" || String(rule.port) === String(flow.port);
    return protoOk && srcOk && dstOk && portOk;
  }

  // Evaluate flows top-down, first match wins, default DENY.
  function evaluate(text, flows) {
    const { rules, errors } = parseRules(text);
    const results = (flows || []).map(f => {
      let matched = null;
      for (const r of rules) { if (matchFlow(r, f)) { matched = r; break; } }
      const result = matched ? matched.action : "deny";
      return {
        flow: f,
        result,
        matchedRule: matched ? matched.raw : "(no match → default deny)",
        correct: f.expect ? result === f.expect : null,
      };
    });
    return { results, errors, rules };
  }

  const api = {
    ipToInt, intToIp, parseCidr, ipInCidr, prefixForHosts,
    parseRules, matchFlow, evaluate,
  };

  root.NetEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

})(typeof window !== "undefined" ? window : globalThis);
