/* ============================================================
   Muhammad Umer Farooq — Portfolio interactions
   ============================================================ */

// ---------- boot preloader ----------
(function boot() {
  const pre = document.getElementById("preloader");
  const box = document.getElementById("boot-lines");
  if (!pre || !box) return;

  const skip =
    sessionStorage.getItem("booted") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (skip) {
    pre.classList.add("done");
    setTimeout(() => pre.remove(), 100);
    return;
  }

  const lines = [
    '<span class="b-accent">$</span> <span class="b-cmd">./init umer-portfolio</span>',
    '▸ loading modules ......... <span class="b-accent">done</span>',
    '▸ fetching projects [budget-iq, dump, securedesk] ... <span class="b-accent">done</span>',
    '▸ starting server ......... <span class="b-accent">ready in 0.4s</span>',
    '<span class="b-accent">✓ welcome</span>',
  ];

  let i = 0;
  (function next() {
    const div = document.createElement("div");
    div.innerHTML = lines[i];
    box.appendChild(div);
    if (++i < lines.length) {
      setTimeout(next, 220 + Math.random() * 120);
    } else {
      sessionStorage.setItem("booted", "1");
      setTimeout(() => {
        pre.classList.add("done");
        setTimeout(() => pre.remove(), 600);
      }, 450);
    }
  })();
})();

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

// ---------- live GitHub stats ----------
let ghRepos = null;
(function githubStats() {
  fetch("https://api.github.com/users/umerfaro")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      if (!data || !data.public_repos) return;
      ghRepos = data.public_repos;
      const num = document.getElementById("stat-gh-num");
      const label = document.getElementById("stat-gh-label");
      if (num && label) {
        num.textContent = ghRepos;
        label.textContent = "Public GitHub Repos";
      }
    })
    .catch(() => {});
})();

// ---------- hero terminal (demo loop + interactive) ----------
(function terminal() {
  const box = document.getElementById("terminal");
  const cmdEl = document.getElementById("t-cmd");
  const outEl = document.getElementById("t-out");
  const input = document.getElementById("t-input");
  if (!box || !cmdEl || !outEl || !input) return;

  const LINKS = {
    "budget-iq": "https://play.google.com/store/apps/details?id=com.budgetiq.ayroflow",
    dump: "https://play.google.com/store/apps/details?id=com.ayroflow.dump",
    carecloud: "https://play.google.com/store/apps/details?id=com.carecloud.family",
    securedesk: "https://securedesk.ayroflow.com/",
    ayrochat: "https://whatsapp.ayroflow.com/",
  };
  const CV_URL =
    "https://drive.google.com/file/d/16Rwf8ALO29oG6bFmB1NqAa50JJJeI74G/view?usp=sharing";

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
  let demoTimer = null;
  let typingTimer = null;
  let interactive = false;

  function typeCmd(cmd, done) {
    let i = 0;
    (function tick() {
      if (interactive) return;
      cmdEl.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) typingTimer = setTimeout(tick, 55 + Math.random() * 45);
      else done();
    })();
  }

  function demo() {
    if (interactive) return;
    const step = sequence[si];
    cmdEl.textContent = "";
    outEl.innerHTML = "";
    typeCmd(step.cmd, () => {
      demoTimer = setTimeout(() => {
        if (interactive) return;
        outEl.innerHTML = step.out;
        si = (si + 1) % sequence.length;
        demoTimer = setTimeout(demo, 2600);
      }, 450);
    });
  }
  demo();

  function stopDemo() {
    clearTimeout(demoTimer);
    clearTimeout(typingTimer);
  }

  const HELP = [
    '<span class="ok">help</span>      — this list',
    '<span class="ok">whoami</span>    — who am i',
    '<span class="ok">projects</span>  — list live projects',
    '<span class="ok">open</span> &lt;name&gt; — open a project',
    '<span class="ok">github</span>    — my GitHub profile',
    '<span class="ok">cv</span>        — download my CV',
    '<span class="ok">contact</span>   — jump to contact form',
    '<span class="ok">matrix</span>    — ???',
    '<span class="ok">clear</span>     — clear terminal',
  ].join("\n");

  function execute(raw) {
    const parts = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const cmd = parts[0] || "";
    const arg = parts[1] || "";

    switch (cmd) {
      case "":
        return "";
      case "help":
        return HELP;
      case "whoami":
        return '<span class="ok">➜</span> full-stack engineer — flutter · next.js · devops';
      case "projects":
        return (
          "budget-iq  dump  securedesk  ayrochat  carecloud\n" +
          'try: <span class="ok">open budget-iq</span>'
        );
      case "open":
        if (LINKS[arg]) {
          window.open(LINKS[arg], "_blank", "noopener");
          return '<span class="ok">✓</span> opening ' + arg + "…";
        }
        return arg
          ? "not found: " + arg + " — try 'projects'"
          : "usage: open &lt;name&gt; — try 'projects'";
      case "github":
        window.open("https://github.com/umerfaro", "_blank", "noopener");
        return (
          '<span class="ok">✓</span> opening github.com/umerfaro' +
          (ghRepos ? " — " + ghRepos + " public repos" : "")
        );
      case "cv":
        window.open(CV_URL, "_blank", "noopener");
        return '<span class="ok">✓</span> opening CV…';
      case "contact":
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
        return '<span class="ok">✓</span> scrolling to contact…';
      case "sudo":
        return "nice try.";
      case "matrix":
        if (window.__matrix) window.__matrix();
        return '<span class="ok">wake up, neo…</span>';
      case "clear":
        outEl.innerHTML = "";
        return null;
      default:
        return "zsh: command not found: " + cmd + " — try '<span class=\"ok\">help</span>'";
    }
  }

  function enterInteractive() {
    if (!interactive) {
      interactive = true;
      stopDemo();
      box.classList.add("active");
      cmdEl.textContent = "";
      outEl.innerHTML = "type '<span class=\"ok\">help</span>' and hit enter";
    }
    input.focus({ preventScroll: true });
  }

  box.addEventListener("click", enterInteractive);

  input.addEventListener("input", () => {
    cmdEl.textContent = input.value;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const raw = input.value;
    input.value = "";
    cmdEl.textContent = "";
    const result = execute(raw);
    if (result !== null) {
      const line = document.createElement("div");
      line.innerHTML =
        '<span class="ok">$</span> ' +
        raw.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
        (result ? "\n" + result : "");
      outEl.appendChild(line);
      outEl.scrollTop = outEl.scrollHeight;
    }
  });

  // resume demo after the visitor leaves the terminal alone for a while
  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (document.activeElement === input || !interactive) return;
      interactive = false;
      box.classList.remove("active");
      outEl.innerHTML = "";
      demo();
    }, 8000);
  });
})();

// ---------- matrix rain easter egg ----------
(function matrixRain() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.__matrix = function () {};
    return;
  }

  let running = false;

  window.__matrix = function () {
    if (running) return;
    running = true;

    const canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const glyphs =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}=+*";
    const fs = 16;
    const cols = Math.floor(canvas.width / fs);
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -40));

    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const interval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fs + "px monospace";
      for (let i = 0; i < cols; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() > 0.975 ? "#e6ffe6" : "#7ed321";
        ctx.fillText(char, i * fs, drops[i] * fs);
        if (drops[i] * fs > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 50);

    setTimeout(() => {
      canvas.classList.add("fade");
      setTimeout(() => {
        clearInterval(interval);
        canvas.remove();
        running = false;
      }, 1000);
    }, 6000);
  };

  // secret trigger: press "m" twice quickly (outside inputs)
  let lastM = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== "m") return;
    const t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    const now = Date.now();
    if (now - lastM < 400) window.__matrix();
    lastM = now;
  });
})();

// ---------- custom terminal cursor ----------
(function customCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cur = document.getElementById("cursor");
  if (!cur) return;

  let tx = -100, ty = -100, x = -100, y = -100;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cur.classList.add("visible");
  });

  document.addEventListener("mouseleave", () => cur.classList.remove("visible"));

  document.addEventListener("mouseover", (e) => {
    cur.classList.toggle(
      "on-link",
      !!e.target.closest("a, button, input, textarea, label, .filter-btn, .terminal")
    );
  });

  (function follow() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    cur.style.transform =
      "translate(" + (x - cur.offsetWidth / 2) + "px," + (y - cur.offsetHeight / 2) + "px)";
    requestAnimationFrame(follow);
  })();
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
