// Increment view count on page load
fetch('https://abacus.jasoncameron.dev/hit/mysite.com/homepage01')
  .then(res => res.json())
  .then(data => {
    document.getElementById('data-views').innerText = data.value;
  });


const BOXES = [
  {
    name: "Daybreak",
    logo : "./Apps_logo/daybreak.png",
    url: "https://saksham744-y.github.io/index.html",
    url2txt:"Download App",
    url2: "https://github.com/saksham744-y/Daybreak/releases/download/v3.0/daybreak3.apk",
    images: ["images/1.png", "images/2.png", "images/3.png"],
    detail:
    "Daybreak is an app as well as a website. Type or paste your tasks in plain words, and Daybreak turns them into a timed daily schedule with reminders. " +
    "Your plan, ticks and notes are saved only on your device. Daybreak has no account and does not send your data anywhere."
  },
  {
    name: "ConverterLab",
    logo : "./Apps_logo/converterlab.png",
    url: " https://saksham744-y.github.io/ConvertLab/",
    url2txt:"Visit GitHub",
    url2: "https://github.com/saksham744-y/ConvertLab",
    images: ["images/4.png", "images/5.png", "images/6.png"],
    detail:
      "ConvertLab is a private, in-browser file converter and small creative toolkit. Video, audio, images, PDFs, documents, GIFs, archives, units, time zones and a paint editor all run on your own device. Files are never uploaded to a server."
  }
];

const FALLBACKS = [
  "linear-gradient(135deg,#ffb03a,#ff3d6e)",
  "linear-gradient(135deg,#ff3d6e,#8a2be2)",
  "linear-gradient(135deg,#8a2be2,#5b0fd1)"
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Render every box ---------- */
const hubs = document.getElementById("hubs");
BOXES.forEach((box, b) => {
  const hub = document.createElement("section");
  hub.className = "hub reveal";
  hub.innerHTML = `
    <div class="acc">
      <button class="acc-bar" type="button" aria-expanded="false" aria-controls="accPanel${b}">
        <img class="acc-logo" src="${esc(box.logo)}" alt="" />
        <span class="acc-name" style="padding-left: 10px;">${esc(box.name)}</span>
        <i class="chev" aria-hidden="true"></i>
      </button>

      <div class="acc-panel" id="accPanel${b}">
        <div class="acc-inner">
          <div class="gallery">
            ${box.images.map((src, i) => `
              <figure class="shot" style="--d:${i * 0.12}s; background:${FALLBACKS[i % 3]}">
                <span class="shot-fallback">IMG ${i + 1}</span>
                <img src="${esc(src)}" alt="${esc(box.name)} image ${i + 1}" loading="lazy" onerror="this.remove()" />
              </figure>`).join("")}
          </div>
          <div class="detail" style="--d:.4s">
            <p>${esc(box.detail)}</p>
            <div class="Buttons">
              <a class="visit" href="${esc(box.url)}" target="_blank" rel="noopener noreferrer">Visit website →</a>
              <a class="visit" href="${esc(box.url2)}" target="_blank" rel="noopener noreferrer">${esc(box.url2txt)} →</a>
          </div>
          </div>
        </div>
      </div>
    </div>`;
  hubs.appendChild(hub);

  /* open / close this box (each box works on its own) */
  const bar = hub.querySelector(".acc-bar");
  bar.addEventListener("click", () => {
    const open = hub.classList.toggle("open");
    bar.setAttribute("aria-expanded", open);
  });
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