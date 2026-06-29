/* ============================================================
   Generative AI & LLMs for Financial Markets — KDD 2026
   Interactions
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- current year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav: scrolled state + progress bar ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 24);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (y / h) * 100 + "%" : "0%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // light stagger for grouped siblings
            const delay = Math.min(i * 60, 180);
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- active section in nav ---------- */
  const navAnchors = Array.from(document.querySelectorAll(".nav__links a"));
  const sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- copy BibTeX ---------- */
  const copyBtn = document.getElementById("copyBibtex");
  const bibtex = document.getElementById("bibtex");
  if (copyBtn && bibtex) {
    copyBtn.addEventListener("click", function () {
      const text = bibtex.innerText;
      const done = function () {
        copyBtn.textContent = "Copied ✓";
        copyBtn.classList.add("is-copied");
        setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-copied");
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- hero canvas: subtle market-data motif ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, t = 0, raf;

    // a few layered "price series" lines
    const series = [
      { amp: 0.06, speed: 0.0012, phase: 0.0, y: 0.42, color: "rgba(240,180,41,0.55)", width: 1.6 },
      { amp: 0.045, speed: 0.0016, phase: 2.1, y: 0.55, color: "rgba(90,162,255,0.40)", width: 1.3 },
      { amp: 0.035, speed: 0.0009, phase: 4.2, y: 0.66, color: "rgba(79,209,197,0.35)", width: 1.2 }
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawLine(s) {
      ctx.beginPath();
      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * w;
        const n =
          Math.sin(i * 0.35 + t * s.speed * 1000 + s.phase) * s.amp +
          Math.sin(i * 0.11 + t * s.speed * 600 + s.phase) * s.amp * 0.6;
        const y = s.y * h + n * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      t += 1;
      series.forEach(drawLine);
      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);

    // pause when hero off-screen (saves battery)
    const hero = document.getElementById("top");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!raf) frame(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }
})();
