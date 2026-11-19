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
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    xp: state.xp, completed: state.completed, currentLessonId: state.currentLessonId,
  }));
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.xp = d.xp || 0;
    state.completed = d.completed || [];
    state.currentLessonId = d.currentLessonId || LESSONS[0].id;
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
  } else if (lesson.kind === "firewall") {
    inputHtml = `<div class="editor-wrap">
        <div class="editor-bar"><span>firewall.rules</span>
          <button id="reset-btn" class="mini-btn" title="Reset">↺ reset</button></div>
        <textarea id="editor" spellcheck="false"></textarea>
      </div>`;
  }

  const primaryLabel = lesson.kind === "firewall" ? "▶ Run traffic" : "✓ Check answer";

  panel.innerHTML = `
    <div class="lesson-crumbs">${world.emoji} ${world.name} · Quest ${idx + 1}/${LESSONS.length}</div>
    <h1 class="lesson-h1">${lesson.title} <span class="lesson-xp">+${lesson.xp} XP</span></h1>
    <div class="story">${lesson.story}</div>
    <div class="concept">${lesson.concept}</div>
    <div class="task"><b>🎯 Mission:</b> ${lesson.task}</div>
    ${inputHtml}
    <div class="btn-row">
      <button id="primary-btn" class="btn check">${primaryLabel}</button>
      <button id="hint-btn" class="btn hint">💡 Hint</button>
      <button id="solution-btn" class="btn ghost">👀 Solution</button>
    </div>
    <div id="hints" class="hints"></div>
    <div id="feedback" class="feedback"></div>
    ${lesson.kind === "firewall" ? `<div class="portal">
        <div class="portal-head">🖥️ Live Traffic Simulator <span class="portal-sub">— runs your rules against each flow</span></div>
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
  if (lesson.kind === "firewall") {
    const ed = document.getElementById("editor");
    ed.value = loadDraft(lesson.id) ?? lesson.starter ?? "";
    autoResize(ed);
    ed.addEventListener("keydown", e => {
      if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.value = ed.value.slice(0, s) + "  " + ed.value.slice(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = s + 2; }
    });
    ed.addEventListener("input", () => { autoResize(ed); saveDraft(lesson.id, ed.value); });
    document.getElementById("reset-btn").onclick = () => { ed.value = lesson.starter ?? ""; saveDraft(lesson.id, ed.value); autoResize(ed); renderTopology(lesson, null); };
    renderTopology(lesson, null);
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
  box.innerHTML = `<div class="sol-head">✅ Answer</div><pre>${escapeHtml(sol)}</pre>` +
    (lesson.kind === "firewall" ? `<button id="use-sol" class="mini-btn">Load into editor</button>` : "");
  el.appendChild(box);
  if (lesson.kind === "firewall") {
    document.getElementById("use-sol").onclick = () => {
      const ed = document.getElementById("editor");
      ed.value = lesson.solution || sol; saveDraft(lesson.id, ed.value); autoResize(ed);
      toast("Loaded — run the traffic to see it pass 📖");
    };
  }
}

function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

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

/* ---------------- boot ---------------- */
function render() { renderSidebar(); renderHUD(); renderLesson(); }
window.addEventListener("DOMContentLoaded", () => {
  load(); render();
  document.getElementById("reset-progress").onclick = resetProgress;
});
