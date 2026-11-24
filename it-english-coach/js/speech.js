/* ------------------------------------------------------------------
   Speech: text-to-speech playback, and optional speech recognition
   for the "Say it" drill. Both degrade quietly where unsupported.
   ------------------------------------------------------------------ */

const Speech = (() => {
  const synth = window.speechSynthesis || null;
  let voice = null;

  function pickVoice() {
    if (!synth) return;
    const all = synth.getVoices();
    if (!all.length) return;
    // Prefer a natural-sounding English voice; fall back to any English one.
    const score = v => {
      let s = 0;
      if (/^en[-_]/i.test(v.lang)) s += 10;
      if (/^en[-_](GB|US)/i.test(v.lang)) s += 4;
      if (/natural|neural|premium|enhanced|siri|google/i.test(v.name)) s += 6;
      if (v.localService) s += 1;
      return s;
    };
    voice = all.slice().sort((a, b) => score(b) - score(a))[0] || null;
  }

  if (synth) {
    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
  }

  const canSpeak = () => !!synth;

  /** Speak text. rate 0.1–2. Returns a promise that settles when finished. */
  function speak(text, { rate = 0.95, onStart, onEnd } = {}) {
    return new Promise(resolve => {
      if (!synth) { onEnd?.(); resolve(false); return; }
      synth.cancel();
      const u = new SpeechSynthesisUtterance(stripMarkers(text));
      if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = "en-GB"; }
      u.rate = rate;
      u.pitch = 1;
      u.onstart = () => onStart?.();
      u.onend = () => { onEnd?.(); resolve(true); };
      u.onerror = () => { onEnd?.(); resolve(false); };
      synth.speak(u);
    });
  }

  function stop() { synth?.cancel(); }

  // Em dashes and ellipses read badly in some engines.
  const stripMarkers = t => t.replace(/[\u2014\u2013]/g, ", ").replace(/\u2026/g, ".").replace(/\s+/g, " ").trim();

  /* ------------------------------ recognition ----------------------------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const canListen = () => !!SR;
  let active = null;

  /** Listen once and resolve with the transcript (or "" on failure). */
  function listen({ onInterim, onError } = {}) {
    return new Promise(resolve => {
      if (!SR) { onError?.("unsupported"); resolve(""); return; }
      stopListening();
      const r = new SR();
      r.lang = "en-GB";
      r.interimResults = true;
      r.continuous = false;
      r.maxAlternatives = 1;

      let best = "";
      r.onresult = e => {
        let txt = "";
        for (const res of e.results) txt += res[0].transcript + " ";
        txt = txt.trim();
        if (txt) best = txt;
        onInterim?.(txt);
      };
      r.onerror = e => { onError?.(e.error); };
      r.onend = () => { active = null; resolve(best); };
      active = r;
      try { r.start(); } catch { active = null; onError?.("start-failed"); resolve(""); }
    });
  }

  function stopListening() {
    if (active) { try { active.stop(); } catch {} active = null; }
  }

  /* --------------------------- comparison helper -------------------------- */
  const norm = s => s.toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Contractions and spellings that should count as equal.
  const EQUIV = [
    ["im", "i am"], ["ive", "i have"], ["ill", "i will"], ["id", "i would"],
    ["youre", "you are"], ["weve", "we have"], ["were", "we are"], ["its", "it is"],
    ["dont", "do not"], ["doesnt", "does not"], ["didnt", "did not"], ["cant", "cannot"],
    ["wouldnt", "would not"], ["isnt", "is not"], ["thats", "that is"], ["lets", "let us"],
    ["optimisation", "optimization"], ["organise", "organize"], ["towards", "toward"]
  ];

  function canonical(s) {
    let t = " " + norm(s).replace(/'/g, "") + " ";
    for (const [a, b] of EQUIV) t = t.split(` ${a} `).join(` ${b} `);
    return t.trim();
  }

  /**
   * Compare a spoken attempt with the target sentence.
   * Returns { score 0-100, words: [{w, ok}] } for per-word highlighting.
   */
  function compare(target, heard) {
    const tw = canonical(target).split(" ").filter(Boolean);
    const hw = new Set(canonical(heard).split(" ").filter(Boolean));
    const SKIP = new Set(["a", "an", "the", "to", "of", "and"]);
    let hits = 0, counted = 0;
    const words = canonical(target).split(" ").filter(Boolean).map(w => {
      const ok = hw.has(w);
      if (!SKIP.has(w)) { counted++; if (ok) hits++; }
      return { w, ok };
    });
    const score = counted ? Math.round((hits / counted) * 100) : 0;
    return { score, words, total: tw.length };
  }

  return { canSpeak, speak, stop, canListen, listen, stopListening, compare };
})();
