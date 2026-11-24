/* ============================================================
   NETWORK SECURITY QUEST — game engine
   ============================================================ */

const STORAGE_KEY = "network-quest-save-v1";

const state = {
  xp: 0,
  completed: [],
  currentLessonId: LESSONS[0].id,
  hintsShown: {},
  selected: {},   // quiz selections: lessonId -> option index
};

/* ---------------- persistence ---------------- */
function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    xp: state.xp, completed: state.completed, currentLessonId: state.currentLessonId, updated: state.updated || 0,
  }));
}
function save() {
  state.updated = Date.now();
  persist();
  scheduleSync();
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.xp = d.xp || 0;
    state.completed = d.completed || [];
    state.currentLessonId = d.currentLessonId || LESSONS[0].id;
    state.updated = d.updated || 0;
  } catch (e) {}
}

/* ---------------- progression ---------------- */
const LEVEL_SIZE = 200;
function levelInfo() {
  const level = Math.floor(state.xp / LEVEL_SIZE) + 1;
  const into = state.xp % LEVEL_SIZE;
  return { level, into, pct: Math.round((into / LEVEL_SIZE) * 100) };
}
function lessonIndex(id) { return LESSONS.findIndex(l => l.id === id); }
function isCompleted(id) { return state.completed.includes(id); }
function isUnlocked(id) {
  const i = lessonIndex(id);
  return i === 0 ? true : isCompleted(LESSONS[i - 1].id);
}
function worldComplete(wid) {
  const ls = LESSONS.filter(l => l.world === wid);
  return ls.length > 0 && ls.every(l => isCompleted(l.id));
}

/* ---------------- drafts ---------------- */
function draftKey(id) { return "nq-draft-" + id; }
function saveDraft(id, v) { localStorage.setItem(draftKey(id), v); }
function loadDraft(id) { return localStorage.getItem(draftKey(id)); }

/* ---------------- checking ---------------- */
function normalize(s) { return String(s).trim().toLowerCase().replace(/\s+/g, ""); }

function checkLesson(lesson) {
  if (lesson.kind === "quiz") {
    const sel = state.selected[lesson.id];
    if (sel === undefined) return { passed: false, feedback: "Pick an answer first." };
    if (sel === lesson.answer) return { passed: true, feedback: "✅ " + (lesson.explanation || "Correct!") };
    return { passed: false, feedback: "Not quite. " + "Try again, or tap a hint." };
  }

  if (lesson.kind === "fill") {
    const wrong = [];
    for (const f of lesson.fields) {
      const el = document.getElementById("field-" + f.id);
      const val = el ? normalize(el.value) : "";
      const ok = f.answers.some(a => normalize(a) === val);
      if (!ok) wrong.push(f.label);
    }
    if (wrong.length === 0) return { passed: true, feedback: "✅ All correct!" };
    return { passed: false, feedback: "Check these: " + wrong.join(", ") };
  }

  if (lesson.kind === "firewall") {
    const text = document.getElementById("editor").value;
    const { results, errors } = NetEngine.evaluate(text, lesson.flows);
    if (errors.length) {
      return { passed: false, feedback: "⚠️ " + errors[0].msg, results, errors };
    }
    const bad = results.filter(r => !r.correct);
    if (bad.length === 0) {
      return { passed: true, feedback: "✅ Every flow matches policy — nicely locked down!", results };
    }
    const b = bad[0];
    return {
      passed: false,
      results,
      feedback: `Flow "${b.flow.desc}" should be ${b.flow.expect.toUpperCase()} but your rules make it ${b.result.toUpperCase()}. (${bad.length} flow${bad.length > 1 ? "s" : ""} off.)`,
    };
  }

  if (lesson.kind === "l7") {
    const text = document.getElementById("editor").value;
    const { results, errors } = NetEngine.evaluateL7(text, lesson.requests, lesson.defaultAction);
    if (errors.length) {
      return { passed: false, feedback: "⚠️ " + errors[0].msg, results, errors };
    }
    const bad = results.filter(r => !r.correct);
    if (bad.length === 0) {
      return { passed: true, feedback: "✅ Every request handled correctly — solid Layer-7 policy!", results };
    }
    const b = bad[0];
    return {
      passed: false,
      results,
      feedback: `Request "${b.req.desc}" should be ${b.req.expect.toUpperCase()} but your rules make it ${b.result.toUpperCase()}. (${bad.length} off.)`,
    };
  }
  return { passed: false, feedback: "Unknown lesson type." };
}

/* ---------------- rendering: sidebar + HUD ---------------- */
function renderSidebar() {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  WORLDS.forEach(world => {
    const ls = LESSONS.filter(l => l.world === world.id);
    const done = ls.filter(l => isCompleted(l.id)).length;
    const wEl = document.createElement("div");
    wEl.className = "world";
    wEl.innerHTML = `<div class="world-head">
      <span class="world-emoji">${world.emoji}</span>
      <span class="world-name">${world.name}</span>
      <span class="world-count ${done === ls.length ? "all" : ""}">${done}/${ls.length}</span>
      ${worldComplete(world.id) ? '<span class="badge-dot" title="World complete!">🏅</span>' : ""}
    </div>`;
    ls.forEach(l => {
      const unlocked = isUnlocked(l.id), completed = isCompleted(l.id);
      const kindIcon = { quiz: "❓", fill: "✏️", firewall: "🧱" }[l.kind] || "▶";
      const item = document.createElement("button");
      item.className = "lesson-item" + (l.id === state.currentLessonId ? " active" : "") + (unlocked ? "" : " locked") + (completed ? " done" : "");
      item.disabled = !unlocked;
      item.innerHTML = `<span class="tick">${completed ? "✅" : unlocked ? kindIcon : "🔒"}</span>
        <span class="lesson-title">${l.title}</span><span class="xp-chip">${l.xp}</span>`;
      item.onclick = () => { state.currentLessonId = l.id; save(); render(); };
      wEl.appendChild(item);
    });
    nav.appendChild(wEl);
  });
}
function renderHUD() {
  const { level, pct, into } = levelInfo();
  document.getElementById("level-num").textContent = level;
  document.getElementById("xp-total").textContent = state.xp;
  document.getElementById("xp-bar-fill").style.width = pct + "%";
  document.getElementById("xp-into").textContent = `${into} / ${LEVEL_SIZE}`;
  document.getElementById("progress-count").textContent = `${state.completed.length} / ${LESSONS.length} quests`;
}

/* ---------------- rendering: lesson ---------------- */
function renderLesson() {
  const lesson = LESSONS.find(l => l.id === state.currentLessonId);
  const panel = document.getElementById("lesson");
  const world = WORLDS.find(w => w.id === lesson.world);
  const idx = lessonIndex(lesson.id);

  let inputHtml = "";
  if (lesson.kind === "quiz") {
    inputHtml = `<div class="options" id="options">` +
      lesson.options.map((o, i) => `<button class="option" data-i="${i}">${escapeHtml(o)}</button>`).join("") +
      `</div>`;
  } else if (lesson.kind === "fill") {
    inputHtml = `<div class="fields">` +
      lesson.fields.map(f => `<label class="field"><span>${escapeHtml(f.label)}</span>
        <input id="field-${f.id}" placeholder="${escapeHtml(f.placeholder || "")}" autocomplete="off" spellcheck="false"></label>`).join("") +
      `</div>`;
  } else if (lesson.kind === "firewall" || lesson.kind === "l7") {
    const fname = lesson.kind === "l7" ? "waf.rules" : "firewall.rules";
    inputHtml = `<div class="editor-wrap">
        <div class="editor-bar"><span>${fname}</span>
          <button id="reset-btn" class="mini-btn" title="Reset">↺ reset</button></div>
        <textarea id="editor" spellcheck="false"></textarea>
      </div>`;
  }

  const primaryLabel = lesson.kind === "firewall" ? "▶ Run traffic"
    : lesson.kind === "l7" ? "▶ Run requests"
    : "✓ Check answer";
  const simHead = lesson.kind === "l7" ? "🧪 Live Request Simulator" : "🖥️ Live Traffic Simulator";
  const simSub = lesson.kind === "l7" ? "— runs your rules against each HTTP request"
    : "— runs your rules against each flow";

  panel.innerHTML = `
    <div class="lesson-crumbs">${world.emoji} ${world.name} · Quest ${idx + 1}/${LESSONS.length}</div>
    <h1 class="lesson-h1">${lesson.title} <span class="lesson-xp">+${lesson.xp} XP</span></h1>
    <div class="story">${lesson.story}</div>
    <div class="concept">${lesson.concept}</div>
    ${richSections(lesson)}
    <div class="task"><b>🎯 Mission:</b> ${lesson.task}</div>
    ${inputHtml}
    <div class="btn-row">
      <button id="primary-btn" class="btn check">${primaryLabel}</button>
      <button id="hint-btn" class="btn hint">💡 Hint</button>
      <button id="solution-btn" class="btn ghost">👀 Solution</button>
    </div>
    <div id="hints" class="hints"></div>
    <div id="feedback" class="feedback"></div>
    ${(lesson.kind === "firewall" || lesson.kind === "l7") ? `<div class="portal">
        <div class="portal-head">${simHead} <span class="portal-sub">${simSub}</span></div>
        <div id="topo" class="topo"></div>
      </div>` : ""}
    <div class="lesson-foot">
      <button id="prev-btn" class="btn ghost" ${idx === 0 ? "disabled" : ""}>← Previous</button>
      <button id="next-btn" class="btn ghost" ${idx === LESSONS.length - 1 ? "disabled" : ""}>Next →</button>
    </div>`;

  // wire inputs
  if (lesson.kind === "quiz") {
    const sel = state.selected[lesson.id];
    document.querySelectorAll(".option").forEach(btn => {
      const i = Number(btn.dataset.i);
      if (i === sel) btn.classList.add("picked");
      btn.onclick = () => {
        state.selected[lesson.id] = i;
        document.querySelectorAll(".option").forEach(b => b.classList.remove("picked"));
        btn.classList.add("picked");
      };
    });
  }
  if (lesson.kind === "firewall" || lesson.kind === "l7") {
    const ed = document.getElementById("editor");
    ed.value = loadDraft(lesson.id) ?? lesson.starter ?? "";
    autoResize(ed);
    ed.addEventListener("keydown", e => {
      if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.value = ed.value.slice(0, s) + "  " + ed.value.slice(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = s + 2; }
    });
    ed.addEventListener("input", () => { autoResize(ed); saveDraft(lesson.id, ed.value); });
    const drawSim = () => { if (lesson.kind === "l7") renderRequests(lesson, null); else renderTopology(lesson, null); };
    document.getElementById("reset-btn").onclick = () => { ed.value = lesson.starter ?? ""; saveDraft(lesson.id, ed.value); autoResize(ed); drawSim(); };
    drawSim();
  }

  document.getElementById("primary-btn").onclick = () => doCheck(lesson);
  document.getElementById("hint-btn").onclick = () => revealHint(lesson);
  document.getElementById("solution-btn").onclick = () => showSolution(lesson);
  document.getElementById("prev-btn").onclick = () => { if (idx > 0) { state.currentLessonId = LESSONS[idx - 1].id; save(); render(); } };
  document.getElementById("next-btn").onclick = () => {
    if (idx < LESSONS.length - 1 && isUnlocked(LESSONS[idx + 1].id)) { state.currentLessonId = LESSONS[idx + 1].id; save(); render(); }
    else if (idx < LESSONS.length - 1) { toast("Finish this quest to unlock the next one! 🔒"); }
  };

  renderHints(lesson);
}

function autoResize(ta) { ta.style.height = "auto"; ta.style.height = Math.max(120, ta.scrollHeight + 4) + "px"; }

/* ---------------- run / check ---------------- */
function doCheck(lesson) {
  const res = checkLesson(lesson);
  const fb = document.getElementById("feedback");
  fb.className = "feedback";
  fb.textContent = res.feedback || "";
  if (lesson.kind === "firewall") renderTopology(lesson, res.results || null);
  if (lesson.kind === "l7") renderRequests(lesson, res.results || null);

  if (res.passed) {
    fb.classList.add("good");
    completeLesson(lesson);
  } else {
    fb.classList.add("bad");
  }
}

function completeLesson(lesson) {
  if (isCompleted(lesson.id)) { toast("Already cleared — nice refresher! ✨"); return; }
  state.completed.push(lesson.id);
  state.xp += lesson.xp;
  save();
  confetti();
  const doneWorld = worldComplete(lesson.world);
  renderSidebar(); renderHUD();
  if (doneWorld) { const w = WORLDS.find(x => x.id === lesson.world); toast(`🏅 World complete: ${w.name}!`); }
  else { toast(`+${lesson.xp} XP — quest cleared! 🎉`); }
  const idx = lessonIndex(lesson.id);
  if (idx < LESSONS.length - 1) { const nb = document.getElementById("next-btn"); if (nb) { nb.classList.add("pulse"); nb.disabled = false; } }
  else { setTimeout(() => toast("🏆 You finished Network Security Quest! Go ace that interview."), 1200); }
}

/* ---------------- topology panel ---------------- */
function renderTopology(lesson, results) {
  const el = document.getElementById("topo");
  if (!el) return;
  // unique zones
  const zones = [];
  lesson.flows.forEach(f => { [f.src, f.dst].forEach(z => { if (!zones.includes(z)) zones.push(z); }); });
  const zoneHtml = `<div class="zones">` + zones.map(z => `<span class="zone zone-${z}">${escapeHtml(z)}</span>`).join("") + `</div>`;

  const rows = lesson.flows.map((f, i) => {
    const r = results ? results[i] : null;
    const actual = r ? r.result : null;
    const mark = r ? (r.correct ? "✔" : "✘") : "";
    const stateCls = r ? (r.correct ? "ok" : "bad") : "pending";
    const actualBadge = actual
      ? `<span class="verdict ${actual}">${actual.toUpperCase()}</span>`
      : `<span class="verdict pending">—</span>`;
    return `<div class="flow-row ${stateCls}">
      <span class="flow-proto">${f.proto.toUpperCase()}</span>
      <span class="flow-path"><b>${escapeHtml(f.src)}</b> → <b>${escapeHtml(f.dst)}</b>:${f.port}</span>
      <span class="flow-desc">${escapeHtml(f.desc)}</span>
      <span class="flow-expect">want <b>${f.expect}</b></span>
      ${actualBadge}
      <span class="flow-mark ${stateCls}">${mark}</span>
    </div>`;
  }).join("");

  el.innerHTML = zoneHtml + `<div class="flows">${rows}</div>`;
}

/* ---------------- request simulator (WAF / API) ---------------- */
function renderRequests(lesson, results) {
  const el = document.getElementById("topo");
  if (!el) return;
  const def = lesson.defaultAction || "allow";
  const head = `<div class="l7-default">Default action: <span class="verdict ${def}">${def.toUpperCase()}</span> <span class="portal-sub">(unmatched requests)</span></div>`;
  const rows = lesson.requests.map((req, i) => {
    const r = results ? results[i] : null;
    const actual = r ? r.result : null;
    const mark = r ? (r.correct ? "✔" : "✘") : "";
    const stateCls = r ? (r.correct ? "ok" : "bad") : "pending";
    const actualBadge = actual ? `<span class="verdict ${actual}">${actual.toUpperCase()}</span>` : `<span class="verdict pending">—</span>`;
    // show the most relevant payload field
    const payload = req.query != null ? ("?" + req.query)
      : req.body != null ? ('body: "' + req.body + '"')
      : req.token !== undefined ? ("token: " + (req.token ? "present" : "none") + (req.role ? " · role: " + req.role : ""))
      : "";
    return `<div class="flow-row ${stateCls}">
      <span class="flow-proto">${escapeHtml(req.method)}</span>
      <span class="flow-path"><b>${escapeHtml(req.path)}</b> <small>${escapeHtml(payload)}</small></span>
      <span class="flow-desc">${escapeHtml(req.desc)}</span>
      <span class="flow-expect">want <b>${req.expect}</b></span>
      ${actualBadge}
      <span class="flow-mark ${stateCls}">${mark}</span>
    </div>`;
  }).join("");
  el.innerHTML = head + `<div class="flows">${rows}</div>`;
}

/* ---------------- hints & solution ---------------- */
function revealHint(lesson) {
  const shown = state.hintsShown[lesson.id] || 0;
  if (!lesson.hints || shown >= lesson.hints.length) { toast("That's all the hints — try the solution 👀"); return; }
  state.hintsShown[lesson.id] = shown + 1;
  renderHints(lesson);
}
function renderHints(lesson) {
  const el = document.getElementById("hints"); if (!el) return;
  const shown = state.hintsShown[lesson.id] || 0;
  el.innerHTML = "";
  for (let i = 0; i < shown; i++) {
    const h = document.createElement("div");
    h.className = "hint-line";
    h.innerHTML = `<b>Hint ${i + 1}:</b> <code>${escapeHtml(lesson.hints[i])}</code>`;
    el.appendChild(h);
  }
}
function showSolution(lesson) {
  const el = document.getElementById("hints");
  const box = document.createElement("div");
  box.className = "solution-box";
  const sol = lesson.solutionText || lesson.solution || "";
  const hasEditor = lesson.kind === "firewall" || lesson.kind === "l7";
  box.innerHTML = `<div class="sol-head">✅ Answer</div><pre>${escapeHtml(sol)}</pre>` +
    (hasEditor ? `<button id="use-sol" class="mini-btn">Load into editor</button>` : "");
  el.appendChild(box);
  if (hasEditor) {
    document.getElementById("use-sol").onclick = () => {
      const ed = document.getElementById("editor");
      ed.value = lesson.solution || sol; saveDraft(lesson.id, ed.value); autoResize(ed);
      toast("Loaded — run the traffic to see it pass 📖");
    };
  }
}

function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* ---------------- rich lesson sections (professional depth) ---------------- */
function section(title, cls, inner) {
  return inner ? `<div class="sec sec-${cls}"><div class="sec-h">${title}</div><div class="sec-b">${inner}</div></div>` : "";
}
function richSections(l) {
  let h = "";
  if (l.deepDive) h += section("📘 Deep dive", "deepdive", l.deepDive);
  if (l.examples && l.examples.length) h += section("🔧 Worked examples", "examples", l.examples.map(e => `<div class="ex">${e}</div>`).join(""));
  if (l.pitfalls && l.pitfalls.length) h += section("⚠️ Common pitfalls", "pitfalls", "<ul>" + l.pitfalls.map(p => `<li>${p}</li>`).join("") + "</ul>");
  if (l.why) h += section("🎯 Why it matters / interview", "why", l.why);
  if (l.keyPoints && l.keyPoints.length) h += section("🧠 Key takeaways", "key", "<ul>" + l.keyPoints.map(k => `<li>${k}</li>`).join("") + "</ul>");
  if (l.references && l.references.length) h += section("🔗 Go deeper", "refs", "<ul>" + l.references.map(r => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a></li>`).join("") + "</ul>");
  return h;
}

/* ---------------- toast + confetti ---------------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}
function confetti() {
  const c = document.getElementById("confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const cols = ["#7c5cff", "#38e8c6", "#ffcf5c", "#ff5c8a", "#5cc8ff"];
  const P = Array.from({ length: 130 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, r: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], vy: 2 + Math.random() * 4, vx: -2 + Math.random() * 4, rot: Math.random() * 6, vr: -.2 + Math.random() * .4 }));
  let f = 0;
  (function t() {
    ctx.clearRect(0, 0, c.width, c.height);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r); ctx.restore(); });
    if (++f < 140) requestAnimationFrame(t); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}

/* ---------------- reset ---------------- */
function resetProgress() {
  if (!confirm("Reset ALL progress, XP and badges?")) return;
  localStorage.removeItem(STORAGE_KEY);
  LESSONS.forEach(l => localStorage.removeItem(draftKey(l.id)));
  state.xp = 0; state.completed = []; state.hintsShown = {}; state.selected = {};
  state.currentLessonId = LESSONS[0].id;
  render(); toast("Fresh start! 🍀");
}

/* ================= CLOUD SYNC (one-time code, no login) =================
   Progress stored in a free cloud blob keyed by a sync code. One code covers
   BOTH quests (shared origin). Every call is fail-safe — network errors fall
   back to localStorage and never break the app. */
const APP_KEY = "network-quest";
const SB_URL = "https://ymzokfvbfmetzsygmxsh.supabase.co/rest/v1/progress";
const SB_KEY = "sb_publishable_FlOsN7qt1YpKbnvDeaxGJg_Tx73AYr3";
const SB_HEADERS = { "apikey": SB_KEY, "Authorization": "Bearer " + SB_KEY, "Content-Type": "application/json" };
const SYNC_ID_KEY = "quest-sync-id";
let syncTimer = null;

function fetchT(url, opts, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 15000);
  return fetch(url, Object.assign({ signal: ctrl.signal }, opts || {})).finally(() => clearTimeout(t));
}
function setSyncMsg(text, isError) {
  const el = document.getElementById("sync-msg");
  if (el) { el.textContent = text || ""; el.style.color = isError ? "var(--bad)" : "var(--good)"; }
}
function getSyncId() { return localStorage.getItem(SYNC_ID_KEY) || ""; }
function setSyncId(id) { if (id) localStorage.setItem(SYNC_ID_KEY, id); }
function clearSyncId() { localStorage.removeItem(SYNC_ID_KEY); }
function mySection() { return { xp: state.xp, completed: state.completed, current: state.currentLessonId, updated: state.updated || Date.now() }; }

function mergeSection(sec) {
  if (!sec) return false;
  const before = state.completed.length;
  const union = Array.from(new Set([...(state.completed || []), ...((sec.completed) || [])]));
  const changed = union.length !== before || (Number(sec.xp) || 0) > state.xp;
  state.completed = union;
  state.xp = Math.max(state.xp, Number(sec.xp) || 0);
  return changed;
}

function newSyncCode() {
  try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
}
async function sbGet(code) {
  const r = await fetchT(SB_URL + "?code=eq." + encodeURIComponent(code) + "&select=data", { headers: SB_HEADERS });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const rows = await r.json();
  if (!rows || !rows[0]) return null;          // no such code exists
  return rows[0].data || {};
}
async function sbPut(code, data) {
  const r = await fetchT(SB_URL, { method: "POST", headers: Object.assign({ "Prefer": "resolution=merge-duplicates" }, SB_HEADERS), body: JSON.stringify({ code: code, data: data, updated: new Date().toISOString() }) });
  if (!r.ok) throw new Error("HTTP " + r.status);
}
// Short, easy-to-type 4-digit code (1000–9999). We check Supabase that it's
// free before handing it out so two people can never collide on the same code.
function rand4() { return String(Math.floor(1000 + Math.random() * 9000)); }
async function freeSyncCode() {
  for (let i = 0; i < 25; i++) {
    const c = rand4();
    const existing = await sbGet(c);               // throws on network error -> caller handles
    if (!existing || Object.keys(existing).length === 0) return c;
  }
  return newSyncCode();                             // fallback: unique UUID if all 4-digit tries were taken
}

async function pullSync() {
  const id = getSyncId(); if (!id) return;
  try {
    const data = await sbGet(id) || {};
    if (mergeSection(data[APP_KEY])) { persist(); render(); toast("☁ Synced from your other device"); }
    updateSyncUI();
  } catch (e) { /* offline — ignore */ }
}
function scheduleSync() { if (!getSyncId()) return; clearTimeout(syncTimer); syncTimer = setTimeout(pushSync, 1200); }
async function pushSync() {
  const id = getSyncId(); if (!id) return;
  try {
    let data = {};
    try { data = await sbGet(id) || {}; } catch (e) {}
    mergeSection(data[APP_KEY]);      // fold any remote progress into local FIRST so a push can never shrink it
    data[APP_KEY] = mySection();      // then store the union
    await sbPut(id, data);
    updateSyncUI("ok");
  } catch (e) { updateSyncUI("err"); }
}
async function enableSync() {
  setSyncMsg("Enabling cloud sync…");
  try {
    const code = await freeSyncCode();
    const data = {}; data[APP_KEY] = mySection();
    await sbPut(code, data);
    setSyncId(code); updateSyncUI();
    setSyncMsg("✅ Cloud sync enabled — copy your code below and enter it on your other devices.");
    toast("☁ Cloud sync enabled");
  } catch (e) {
    setSyncMsg("Couldn't enable sync: " + ((e && e.message) || "network error") + ". Try again, or use Manual backup below.", true);
  }
}
async function connectSync() {
  const input = document.getElementById("sync-code-input");
  const id = (input ? input.value : "").trim();
  if (!id) { setSyncMsg("Paste a sync code first.", true); return; }
  setSyncMsg("Connecting…");
  try {
    const data = await sbGet(id);
    if (!data) { setSyncMsg("No data found for code \"" + id + "\". Check the digits, and make sure sync is enabled on the device that has your progress.", true); return; }
    const sec = data[APP_KEY];
    setSyncId(id);
    mergeSection(sec);
    if (sec && sec.current) state.currentLessonId = sec.current;   // jump to where you left off
    persist(); await pushSync();
    render(); updateSyncUI();
    if (!sec || !(sec.completed && sec.completed.length)) {
      setSyncMsg("Connected to \"" + id + "\", but it has no saved progress for this quest yet. Enable sync on the device that has your progress, then use the code it shows.", true);
    } else {
      setSyncMsg("✅ Connected — restored " + state.completed.length + " completed lesson(s), " + state.xp + " XP.");
      toast("☁ Connected & synced");
    }
  } catch (e) { setSyncMsg("Couldn't connect: " + ((e && e.message) || "network error") + ".", true); }
}
function disconnectSync() { clearSyncId(); updateSyncUI(); setSyncMsg("Cloud sync turned off (progress stays on this device)."); }

function updateSyncUI(flag) {
  const on = !!getSyncId();
  const status = document.getElementById("sync-status");
  const codeWrap = document.getElementById("sync-code-wrap");
  const codeOut = document.getElementById("sync-code-out");
  const enableBtn = document.getElementById("sync-enable");
  const disconnectBtn = document.getElementById("sync-disconnect");
  if (!status) return;
  if (on) {
    status.innerHTML = "Cloud sync: <b style='color:var(--good)'>ON</b>" + (flag === "err" ? " <span style='color:var(--warn)'>(will retry — offline)</span>" : "");
    if (codeOut) codeOut.value = getSyncId();
    if (codeWrap) codeWrap.style.display = "";
    if (enableBtn) enableBtn.style.display = "none";
    if (disconnectBtn) disconnectBtn.style.display = "";
  } else {
    status.innerHTML = "Cloud sync: <b style='color:var(--muted)'>OFF</b>";
    if (codeWrap) codeWrap.style.display = "none";
    if (enableBtn) enableBtn.style.display = "";
    if (disconnectBtn) disconnectBtn.style.display = "none";
  }
}

/* ---------------- manual backup (fallback) ---------------- */
function exportCode() {
  const data = { v: 1, app: APP_KEY, xp: state.xp, completed: state.completed, current: state.currentLessonId };
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}
function openBackup() {
  const ta = document.getElementById("backup-code");
  if (ta) ta.value = exportCode();
  const msg = document.getElementById("backup-msg"); if (msg) msg.textContent = "";
  updateSyncUI();
  document.getElementById("backup-modal").classList.add("show");
}
function closeBackup() { document.getElementById("backup-modal").classList.remove("show"); }
function restoreFromCode() {
  const ta = document.getElementById("backup-code");
  const msg = document.getElementById("backup-msg");
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob((ta.value || "").trim()))));
    if (!data || !Array.isArray(data.completed)) throw new Error("invalid");
    state.xp = Number(data.xp) || 0;
    state.completed = data.completed;
    state.currentLessonId = data.current || LESSONS[0].id;
    save();
    closeBackup();
    render();
    toast("✅ Progress restored!");
  } catch (e) {
    if (msg) msg.textContent = "That code didn't look right — paste the full backup code and try Restore again.";
  }
}
function downloadBackup() {
  const blob = new Blob([exportCode()], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "network-quest-progress.txt";
  document.body.appendChild(a); a.click(); a.remove();
  toast("Downloaded your backup 📄");
}
function copyText(val) {
  const done = () => toast("Copied! 📋");
  if (navigator.clipboard) navigator.clipboard.writeText(val).then(done).catch(done);
  else done();
}
function copyBackup() { copyText(document.getElementById("backup-code").value); }
function copySyncCode() { copyText(getSyncId()); }

/* ---------------- durable storage (automatic) ---------------- */
// Ask the browser to make this origin's storage persistent so it isn't
// auto-evicted (storage pressure, Safari ITP, etc.). No user action needed.
async function requestPersistence() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      const already = await navigator.storage.persisted();
      if (!already) await navigator.storage.persist();
    }
  } catch (e) { /* not supported — localStorage still used */ }
}

/* ---------------- practice lab (free sandbox, not graded) ---------------- */
const LAB_FW = {
  goal: `Let the public reach the web tier, let the web tier reach the database, and block everything else (<b>default deny</b>). Syntax: <code>action proto src dst port</code> — e.g. <code>allow tcp internet dmz 443</code>.`,
  starter: `# action proto src dst port   (first match wins; anything unmatched is denied)\n`,
  flows: [
    { proto: "tcp", src: "internet", dst: "dmz",      port: 443,  desc: "Public user loads the website",       expect: "allow" },
    { proto: "tcp", src: "dmz",      dst: "db",        port: 5432, desc: "Web app queries the database",         expect: "allow" },
    { proto: "tcp", src: "internet", dst: "db",        port: 5432, desc: "Attacker hits the DB directly",        expect: "deny"  },
    { proto: "tcp", src: "internet", dst: "internal",  port: 22,   desc: "SSH straight from the internet",       expect: "deny"  },
    { proto: "tcp", src: "dmz",      dst: "internal",  port: 445,  desc: "Compromised web box pivots to SMB",    expect: "deny"  },
  ],
  solution: `allow tcp internet dmz 443\nallow tcp dmz db 5432\ndeny any any any any`,
};
const LAB_API = {
  goal: `Protect an API: <b>block</b> any path containing <code>/admin</code> unless the caller's role is <code>admin</code>, <b>block</b> requests with no token, and <b>allow</b> everything else. Syntax: <code>allow|block when &lt;field&gt; &lt;op&gt; &lt;value&gt;</code>. Fields: path, role, token, method. Ops: eq, contains, present, missing.`,
  starter: `# first match wins\n`,
  defaultAction: "allow",
  requests: [
    { method: "GET", path: "/api/admin/users", role: "user",  token: "t", desc: "Normal user reaches admin route", expect: "block" },
    { method: "GET", path: "/api/admin/users", role: "admin", token: "t", desc: "Admin reaches admin route",       expect: "allow" },
    { method: "GET", path: "/api/orders",      role: "user",  token: "",  desc: "Request arrives with no token",   expect: "block" },
    { method: "GET", path: "/api/orders",      role: "user",  token: "t", desc: "Authenticated normal request",    expect: "allow" },
  ],
  solution: `block when token missing\nallow when role eq admin\nblock when path contains /admin\nallow`,
};

function openLab() {
  document.getElementById("lab-fw-goal").innerHTML = LAB_FW.goal;
  document.getElementById("lab-api-goal").innerHTML = LAB_API.goal;
  const fw = document.getElementById("lab-fw-ed"); if (!fw.value) fw.value = LAB_FW.starter;
  const api = document.getElementById("lab-api-ed"); if (!api.value) api.value = LAB_API.starter;
  if (!document.getElementById("lab-sub-q").textContent) labNewSubChallenge();
  document.getElementById("lab-modal").classList.add("show");
}
function closeLab() { document.getElementById("lab-modal").classList.remove("show"); }
function labTab(tab) {
  document.querySelectorAll(".lab-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".lab-pane").forEach(p => { p.hidden = (p.id !== "lab-" + tab); });
}
function labVerdictRow(proto, path, desc, expect, actual, correct) {
  const cls = correct ? "ok" : "bad";
  return `<div class="lab-row ${cls}">
    <span class="lab-proto">${escapeHtml(proto)}</span>
    <span class="lab-path">${escapeHtml(path)}<div class="lab-desc">${escapeHtml(desc)}</div></span>
    <span class="flow-expect">want <b>${expect}</b></span>
    <span class="verdict ${actual}">${actual.toUpperCase()}</span>
    <span class="lab-mark ${cls}">${correct ? "✔" : "✘"}</span>
  </div>`;
}
function labSummary(results) {
  const n = results.length, ok = results.filter(r => r.correct).length;
  const pass = ok === n;
  const first = results.find(r => !r.correct);
  const hint = pass ? "All flows behave as intended. 🎉"
    : `Not yet — e.g. "${escapeHtml(first.desc)}" should be <b>${first.expect.toUpperCase()}</b> but your rules made it <b>${first.actual.toUpperCase()}</b>.`;
  return `<div class="lab-summary ${pass ? "ok" : "bad"}">${ok}/${n} correct — ${hint}</div>`;
}
function labRunFirewall() {
  const text = document.getElementById("lab-fw-ed").value;
  const out = document.getElementById("lab-fw-out");
  const { results, errors } = NetEngine.evaluate(text, LAB_FW.flows);
  const rows = results.map(r => labVerdictRow(r.flow.proto.toUpperCase(),
    `${r.flow.src} → ${r.flow.dst}:${r.flow.port}`, r.flow.desc, r.flow.expect, r.result, r.result === r.flow.expect));
  const mapped = results.map(r => ({ correct: r.result === r.flow.expect, desc: r.flow.desc, expect: r.flow.expect, actual: r.result }));
  const errHtml = errors.length ? `<div class="lab-err">${errors.map(e => escapeHtml(e.msg)).join("<br>")}</div>` : "";
  out.innerHTML = errHtml + labSummary(mapped) + rows.join("");
}
function labRunApi() {
  const text = document.getElementById("lab-api-ed").value;
  const out = document.getElementById("lab-api-out");
  const { results, errors } = NetEngine.evaluateL7(text, LAB_API.requests, LAB_API.defaultAction);
  const rows = results.map(r => {
    const payload = `${r.req.method} ${r.req.path} · role:${r.req.role} · token:${r.req.token ? "present" : "none"}`;
    return labVerdictRow("HTTP", payload, r.req.desc, r.req.expect, r.result, r.result === r.req.expect);
  });
  const mapped = results.map(r => ({ correct: r.result === r.req.expect, desc: r.req.desc, expect: r.req.expect, actual: r.result }));
  const errHtml = errors.length ? `<div class="lab-err">${errors.map(e => escapeHtml(e.msg)).join("<br>")}</div>` : "";
  out.innerHTML = errHtml + labSummary(mapped) + rows.join("");
}
function labAnalyzeCidr() {
  const v = document.getElementById("lab-sub-in").value.trim();
  const out = document.getElementById("lab-sub-out");
  const info = NetEngine.parseCidr(v);
  if (!info) { out.innerHTML = `<div class="lab-err">Not a valid CIDR. Try something like 10.0.8.0/22.</div>`; return; }
  const f = (k, val) => `<div><span>${k}</span><b>${val}</b></div>`;
  out.innerHTML = `<div class="lab-facts">
    ${f("Network", info.network)}${f("Broadcast", info.broadcast)}
    ${f("Mask", info.mask + " (/" + info.bits + ")")}${f("Usable hosts", info.usableHosts.toLocaleString())}
    ${f("First host", info.firstHost)}${f("Last host", info.lastHost)}
  </div>`;
}
let labSubChallenge = null;
function labNewSubChallenge() {
  const bits = 8 + Math.floor(Math.random() * 23); // /8../30
  const octet = () => Math.floor(Math.random() * 256);
  const base = `10.${octet()}.${octet()}.0`;
  const cidr = base + "/" + bits;
  const info = NetEngine.parseCidr("10.0.0.0/" + bits);
  const types = [
    { q: `How many <b>usable hosts</b> are in a <code>/${bits}</code>?`, a: String(info.usableHosts) },
    { q: `What is the <b>subnet mask</b> (dotted decimal) for a <code>/${bits}</code>?`, a: info.mask },
  ];
  labSubChallenge = types[Math.floor(Math.random() * types.length)];
  document.getElementById("lab-sub-q").innerHTML = labSubChallenge.q;
  document.getElementById("lab-sub-ans").value = "";
  document.getElementById("lab-sub-fb").innerHTML = "";
}
function labCheckSub() {
  if (!labSubChallenge) return;
  const given = document.getElementById("lab-sub-ans").value.trim().replace(/,/g, "");
  const fb = document.getElementById("lab-sub-fb");
  const ok = given === labSubChallenge.a;
  fb.innerHTML = `<div class="lab-summary ${ok ? "ok" : "bad"}">${ok ? "✔ Correct!" : "✘ Not quite — the answer is <b>" + escapeHtml(labSubChallenge.a) + "</b>."}</div>`;
}

/* ---------------- boot ---------------- */
function render() { renderSidebar(); renderHUD(); renderLesson(); }
window.addEventListener("DOMContentLoaded", () => {
  load(); render();
  requestPersistence();
  pullSync();
  window.addEventListener("beforeunload", () => { persist(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { persist(); } else { pullSync(); } });
  document.getElementById("reset-progress").onclick = resetProgress;
  const wire = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
  wire("backup-btn", openBackup);
  wire("close-modal", closeBackup);
  wire("copy-code", copyBackup);
  wire("download-code", downloadBackup);
  wire("restore-code", restoreFromCode);
  wire("sync-enable", enableSync);
  wire("sync-connect", connectSync);
  wire("sync-disconnect", disconnectSync);
  wire("sync-copy", copySyncCode);
  // practice lab
  wire("lab-btn", openLab);
  wire("lab-close", closeLab);
  document.querySelectorAll(".lab-tab").forEach(b => b.onclick = () => labTab(b.dataset.tab));
  wire("lab-fw-run", labRunFirewall);
  wire("lab-fw-reset", () => { document.getElementById("lab-fw-ed").value = LAB_FW.starter; document.getElementById("lab-fw-out").innerHTML = ""; });
  wire("lab-fw-sol", () => { document.getElementById("lab-fw-ed").value = LAB_FW.solution; labRunFirewall(); });
  wire("lab-api-run", labRunApi);
  wire("lab-api-reset", () => { document.getElementById("lab-api-ed").value = LAB_API.starter; document.getElementById("lab-api-out").innerHTML = ""; });
  wire("lab-api-sol", () => { document.getElementById("lab-api-ed").value = LAB_API.solution; labRunApi(); });
  wire("lab-sub-run", labAnalyzeCidr);
  wire("lab-sub-check", labCheckSub);
  wire("lab-sub-new", labNewSubChallenge);
});
