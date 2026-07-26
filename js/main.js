/* ============================================================
   Muhammad Umer Farooq — Portfolio interactions
   ============================================================ */

// ---------- particle constellation background ----------
(function particles() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dots;
  const mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((w * h) / 22000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  resize();

  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(126, 211, 33, 0.4)";
      ctx.fill();
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(126, 211, 33, ${0.1 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const a = dots[i];
        const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dist < 170) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(126, 211, 33, ${0.13 * (1 - dist / 170)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// ---------- hero terminal ----------
(function terminal() {
  const cmdEl = document.getElementById("t-cmd");
  const outEl = document.getElementById("t-out");
  if (!cmdEl || !outEl) return;

  const sequence = [
    {
      cmd: "whoami",
      out: '<span class="ok">➜</span> full-stack engineer — flutter · next.js · devops',
    },
    {
      cmd: "flutter build apk --release",
      out: '<span class="ok">✓</span> Built app-release.apk — live on Play Store',
    },
    {
      cmd: "git push origin main",
      out: '<span class="ok">✓</span> CI/CD pipeline green — deployed via GitHub Actions',
    },
    {
      cmd: "ls ~/projects",
      out: "budget-iq  dump  securedesk  ayrochat  carecloud",
    },
  ];

  let si = 0;

  function typeCmd(cmd, done) {
    let i = 0;
    (function tick() {
      cmdEl.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) setTimeout(tick, 55 + Math.random() * 45);
      else done();
    })();
  }

  function run() {
    const step = sequence[si];
    cmdEl.textContent = "";
    outEl.innerHTML = "";
    typeCmd(step.cmd, () => {
      setTimeout(() => {
        outEl.innerHTML = step.out;
        si = (si + 1) % sequence.length;
        setTimeout(run, 2600);
      }, 450);
    });
  }
  run();
})();

// ---------- navbar ----------
(function nav() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const toTop = document.getElementById("to-top");

  const progress = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
    toTop.classList.toggle("show", window.scrollY > 600);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) {
      progress.style.width = (window.scrollY / max) * 100 + "%";
    }
  });

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    })
  );

  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  // active link highlighting
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) =>
            l.classList.toggle(
              "active",
              l.getAttribute("href") === `#${entry.target.id}`
            )
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
})();

// ---------- scroll reveal ----------
(function reveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ---------- skill bars ----------
(function skills() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".fill").forEach((f) => {
            f.style.width = f.dataset.level + "%";
          });
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const wrap = document.getElementById("skills-wrap");
  if (wrap) io.observe(wrap);
})();

// ---------- 3D tilt on cards ----------
(function tilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // hero portrait tilt follows the cursor anywhere on the hero
  const portrait = document.getElementById("portrait");
  const hero = document.getElementById("home");
  if (portrait && hero) {
    hero.addEventListener("mousemove", (e) => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      portrait.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      portrait.style.transform = "";
    });
  }
})();

// ---------- project filters ----------
(function filters() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach((c) => {
        const show = f === "all" || c.dataset.category.includes(f);
        c.classList.toggle("hidden-card", !show);
      });
    });
  });
})();

// ---------- footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
