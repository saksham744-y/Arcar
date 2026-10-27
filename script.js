/* ============================================================
   ARCAR — edit this one block to change the section:
   name, link, detail text and the 3 images (images/1.png, 2.png, 3.png)
   ============================================================ */
const SECTION = {
  name: "Daybreak",
  url: "https://saksham744-y.github.io",
  url2: "https://github.com/saksham744-y/Daybreak/releases/download/v2.0/daybreak2.apk",
  images: ["images/1.png", "images/2.png", "images/3.png"],
  detail:
    "Daybreak is an app as well as a website. Type or paste your tasks in plain words, and Daybreak turns them into a timed daily schedule with reminders. " +
    "Your plan, ticks and notes are saved only on your device. Daybreak has no account and does not send your data anywhere."
};

const FALLBACKS = [
  "linear-gradient(135deg,#ffb03a,#ff3d6e)",
  "linear-gradient(135deg,#ff3d6e,#8a2be2)",
  "linear-gradient(135deg,#8a2be2,#5b0fd1)"
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Render the section ---------- */
const hub = document.getElementById("hub");
hub.innerHTML = `
  <div class="acc">
    <button class="acc-bar" id="accBar" aria-expanded="false" aria-controls="accPanel">
      <img class="acc-logo" src="./Apps_logo/daybreak.png" alt="" />
      <span class="acc-name">${esc(SECTION.name)}</span>
      <i class="chev" aria-hidden="true"></i>
    </button>

    <div class="acc-panel" id="accPanel">
      <div class="acc-inner">
        <div class="gallery">
          ${SECTION.images.map((src, i) => `
            <figure class="shot" style="--d:${i * 0.12}s; background:${FALLBACKS[i % 3]}">
              <span class="shot-fallback">IMG ${i + 1}</span>
              <img src="${esc(src)}" alt="${esc(SECTION.name)} image ${i + 1}" loading="lazy" onerror="this.remove()" />
            </figure>`).join("")}
        </div>
        <div class="detail" style="--d:.4s">
          <p>${esc(SECTION.detail)}</p>
         <div class="Buttons">
          <a class="visit" href="${esc(SECTION.url)}" target="_blank" rel="noopener noreferrer">Visit website →</a>
          <a class="visit" href="${esc(SECTION.url2)}" target="_blank" rel="noopener noreferrer">Download App →</a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

/* ---------- Open / close ---------- */
const bar = document.getElementById("accBar");
bar.addEventListener("click", () => {
  const open = hub.classList.toggle("open");
  bar.setAttribute("aria-expanded", open);
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- Nav shadow on scroll ---------- */
const nav = document.getElementById("nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });

/* ---------- Cursor glow (desktop only) ---------- */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const glow = document.getElementById("glow");
  addEventListener("mousemove", (e) => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });
}

document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   Page views + anonymous community  (needs:  node server.js)
   - views     → saved in data/views.txt
   - messages  → saved in data/community.txt  (no names / no IDs)
   ============================================================ */
async function api(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

/* ---------- Page view counter ---------- */
const viewEls = document.querySelectorAll("[data-views]");
(async function countView() {
  try {
    let counted = false;
    try { counted = sessionStorage.getItem("arcar-counted") === "1"; } catch {}
    // count once per browser tab session, so refreshing doesn't inflate the number
    const data = await api("/api/views", { method: counted ? "GET" : "POST" });
    if (!counted) { try { sessionStorage.setItem("arcar-counted", "1"); } catch {} }
    viewEls.forEach((el) => (el.textContent = Number(data.views).toLocaleString()));
  } catch {
    viewEls.forEach((el) => (el.textContent = "–"));
  }
})();

/* ---------- Community popup ---------- */
const modal = document.getElementById("commModal");
const list = document.getElementById("commList");
const form = document.getElementById("commForm");
const text = document.getElementById("commText");
const countEl = document.getElementById("commCount");
const statusEl = document.getElementById("commStatus");
const sendBtn = document.getElementById("commSend");
let poll = null, lastFocus = null;

function ago(iso) {
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 45) return "just now";
  if (s < 3600) return Math.round(s / 60) + " min ago";
  if (s < 86400) return Math.round(s / 3600) + " h ago";
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function render(messages) {
  const stick = list.scrollTop + list.clientHeight >= list.scrollHeight - 40;
  list.textContent = "";
  if (!messages.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No messages yet — be the first to say hello 👋";
    list.appendChild(li);
    return;
  }
  messages.forEach((m, i) => {
    const li = document.createElement("li");
    li.style.animationDelay = Math.min(i, 12) * 0.03 + "s";
    const av = document.createElement("span"); av.className = "av"; av.textContent = "A";
    const bubble = document.createElement("div"); bubble.className = "bubble";
    const p = document.createElement("p"); p.textContent = m.text;          // textContent = safe, no HTML injection
    const t = document.createElement("time"); t.dateTime = m.t; t.textContent = "Anonymous · " + ago(m.t);
    bubble.append(p, t); li.append(av, bubble); list.appendChild(li);
  });
  if (stick) list.scrollTop = list.scrollHeight;
}

async function load() {
  try { render((await api("/api/community")).messages); statusEl.textContent = ""; }
  catch { list.textContent = ""; const li = document.createElement("li"); li.className = "empty";
          li.textContent = "Community is offline. Start the site with:  node server.js"; list.appendChild(li); }
}

function openModal() {
  lastFocus = document.activeElement;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  load().then(() => { list.scrollTop = list.scrollHeight; });
  poll = setInterval(load, 15000);                       // pick up new messages while open
  setTimeout(() => text.focus(), 250);
}
function closeModal() {
  modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; clearInterval(poll);
  lastFocus && lastFocus.focus && lastFocus.focus();
}

document.getElementById("commBtn").addEventListener("click", openModal);
modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
text.addEventListener("input", () => { countEl.textContent = text.value.length + " / 280"; });
text.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit(); });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = text.value.trim();
  if (!message) { statusEl.className = "status"; statusEl.textContent = "Write something first."; return; }
  sendBtn.disabled = true; statusEl.className = "status"; statusEl.textContent = "Posting…";
  try {
    await api("/api/community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
    text.value = ""; countEl.textContent = "0 / 280";
    statusEl.className = "status ok"; statusEl.textContent = "Posted ✓";
    await load(); list.scrollTop = list.scrollHeight;
  } catch (err) {
    statusEl.className = "status"; statusEl.textContent = err.message || "Could not post. Is the server running?";
  } finally { sendBtn.disabled = false; }
});

// Update view count using a free counter API
async function updateViewCount() {
    try {
        // Replace 'mysite' with your unique namespace and 'pageviews' with your key
        const response = await fetch('https://abacus.jasoncameron.dev/hit/mysite/pageviews');
        const data = await response.json();
        
        // Target the element in your HTML (ensure you have an element with id="view-count")
        const viewCountElement = document.getElementById('view-count');
        if (viewCountElement) {
            viewCountElement.textContent = data.value;
        }
    } catch (error) {
        console.error('Error updating view count:', error);
    }
}

document.addEventListener('DOMContentLoaded', updateViewCount);


