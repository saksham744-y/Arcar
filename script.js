/* ============================================================
   ARCAR — edit this one block to change the section:
   name, link, detail text and the 3 images (images/1.png, 2.png, 3.png)
   ============================================================ */
const SECTION = {
  name: "Daybreak",
  url: "https://saksham744-y.github.io/",
  url2: "https://github.com/saksham744-y/Daybreak/releases/download/v2.0/daybreak2.apk",
  images: ["images/1.png", "images/2.png", "images/3.png"],
  detail:
    "Your plan, ticks and notes are saved only on your device. Daybreak has no account and does not send your data anywhere." +
    "Daybreak is an app as well as a website. Type or paste your tasks in plain words, and Daybreak turns them into a timed daily schedule with reminders."
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
      <img class="acc-logo" src="./Apps_logo/daybreak.png" alt="logo" />
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