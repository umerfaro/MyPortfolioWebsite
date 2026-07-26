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
        num.dataset.live = ghRepos;
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
    '<span class="ok">retro</span>     — CRT mode',
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
      case "retro":
        document.documentElement.classList.toggle("crt");
        return document.documentElement.classList.contains("crt")
          ? '<span class="ok">✓</span> CRT mode on — type retro again to exit'
          : '<span class="ok">✓</span> back to the future';
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
      !!e.target.closest("a, button, input, textarea, label, .filter-btn, .terminal, .palette-item")
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
  const sbLn = document.getElementById("sb-ln");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
    toTop.classList.toggle("show", window.scrollY > 600);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) {
      const p = window.scrollY / max;
      if (progress) progress.style.width = p * 100 + "%";
      if (sbLn) sbLn.textContent = 1 + Math.round(p * 812);
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

// ---------- command palette ----------
(function palette() {
  const root = document.getElementById("palette");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  const openBtn = document.getElementById("palette-open");
  const backdrop = document.getElementById("palette-backdrop");
  if (!root || !input || !list) return;

  const ITEMS = [
    { label: "Go to Home", hint: "section", go: "#home" },
    { label: "Go to About", hint: "section", go: "#about" },
    { label: "Go to Experience", hint: "section", go: "#experience" },
    { label: "Go to Services", hint: "section", go: "#services" },
    { label: "Go to Projects", hint: "section", go: "#projects" },
    { label: "Go to Credentials", hint: "section", go: "#credentials" },
    { label: "Go to Contact", hint: "section", go: "#contact" },
    { label: "Budget IQ — AI Expense Tracker", hint: "play store", url: "https://play.google.com/store/apps/details?id=com.budgetiq.ayroflow" },
    { label: "Dump — AI Todos & Notes", hint: "play store", url: "https://play.google.com/store/apps/details?id=com.ayroflow.dump" },
    { label: "CareCloud Family", hint: "play store", url: "https://play.google.com/store/apps/details?id=com.carecloud.family" },
    { label: "SecureDesk AI", hint: "web", url: "https://securedesk.ayroflow.com/" },
    { label: "AyroChat — WhatsApp Platform", hint: "web", url: "https://whatsapp.ayroflow.com/" },
    { label: "Omni — AI Messenger", hint: "web app", url: "https://ominidubed.web.app/#/login-view" },
    { label: "GitHub Profile", hint: "link", url: "https://github.com/umerfaro" },
    { label: "LinkedIn Profile", hint: "link", url: "https://www.linkedin.com/in/muhammadumerfarooqofficial" },
    { label: "Download CV", hint: "pdf", url: "https://drive.google.com/file/d/16Rwf8ALO29oG6bFmB1NqAa50JJJeI74G/view?usp=sharing" },
    { label: "Email Me", hint: "mail", url: "mailto:Muhammadufarooq.dev@gmail.com" },
  ];

  let filtered = ITEMS;
  let sel = 0;

  function render() {
    if (!filtered.length) {
      list.innerHTML = '<li class="palette-empty">no results — try "projects"</li>';
      return;
    }
    list.innerHTML = filtered
      .map(
        (it, i) =>
          '<li class="palette-item' + (i === sel ? " sel" : "") + '" data-i="' + i + '">' +
          "<span>" + it.label + "</span>" +
          '<span class="hint">' + it.hint + "</span></li>"
      )
      .join("");
  }

  function filter() {
    const q = input.value.trim().toLowerCase();
    filtered = q
      ? ITEMS.filter((it) => it.label.toLowerCase().includes(q))
      : ITEMS;
    sel = 0;
    render();
  }

  function open() {
    root.hidden = false;
    input.value = "";
    filter();
    input.focus();
  }

  function close() {
    root.hidden = true;
    input.blur();
  }

  function run(it) {
    close();
    if (it.go) {
      document.querySelector(it.go).scrollIntoView({ behavior: "smooth" });
    } else if (it.url) {
      window.open(it.url, "_blank", "noopener");
    }
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      root.hidden ? open() : close();
    } else if (e.key === "Escape" && !root.hidden) {
      close();
    }
  });

  input.addEventListener("input", filter);

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      sel = Math.min(sel + 1, filtered.length - 1);
      render();
      const el = list.querySelector(".sel");
      if (el) el.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sel = Math.max(sel - 1, 0);
      render();
      const el = list.querySelector(".sel");
      if (el) el.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && filtered[sel]) {
      run(filtered[sel]);
    }
  });

  list.addEventListener("click", (e) => {
    const li = e.target.closest(".palette-item");
    if (li) run(filtered[+li.dataset.i]);
  });

  if (openBtn) openBtn.addEventListener("click", open);
  if (backdrop) backdrop.addEventListener("click", close);
  render();
})();

// ---------- konami code → CRT retro mode ----------
(function konami() {
  const SEQ = [
    "arrowup", "arrowup", "arrowdown", "arrowdown",
    "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
  ];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    const t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    const key = e.key.toLowerCase();
    pos = key === SEQ[pos] ? pos + 1 : key === SEQ[0] ? 1 : 0;
    if (pos === SEQ.length) {
      pos = 0;
      document.documentElement.classList.toggle("crt");
    }
  });
})();

// ---------- spotlight hover on cards ----------
(function spotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document
    .querySelectorAll(".project-card, .service-card, .tl-card, .cred-card")
    .forEach((card) => {
      card.classList.add("spot");
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
})();

// ---------- magnetic buttons ----------
(function magnetic() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll(".btn, .nav-cta, .kbd-hint").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = "translate(" + dx * 0.12 + "px," + dy * 0.18 + "px)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();

// ---------- VS Code skills window ----------
(function codeWindow() {
  const win = document.getElementById("code-window");
  const gutter = document.getElementById("code-gutter");
  const linesEl = document.getElementById("code-lines");
  if (!win || !gutter || !linesEl) return;

  const K = (s) => '<span class="tok-kw">' + s + "</span>";
  const T = (s) => '<span class="tok-type">' + s + "</span>";
  const S = (s) => '<span class="tok-str">' + s + "</span>";
  const C = (s) => '<span class="tok-cmt">' + s + "</span>";
  const F = (s) => '<span class="tok-fn">' + s + "</span>";

  const LINES = [
    K("class") + " " + T("UmerFarooq") + " " + K("extends") + " " + T("Engineer") + " {",
    "  " + K("final") + " role  = " + S("'Full Stack Engineer'") + ";",
    "  " + K("final") + " stack = [" + S("'Flutter'") + ", " + S("'Next.js'") + ", " + S("'AWS'") + "];",
    "  " + K("final") + " live  = [" + S("'BudgetIQ'") + ", " + S("'Dump'") + ", " + S("'SecureDesk'") + "];",
    "",
    "  " + K("@override"),
    "  " + T("Future") + "&lt;" + T("Product") + "&gt; " + F("build") + "(" + T("Idea") + " idea) " + K("async") + " {",
    "    " + K("return await") + " idea." + F("design") + "()." + F("code") + "()." + F("ship") + "();",
    "  } " + C("// build → test → deploy → repeat"),
    "}",
  ];

  let started = false;

  function stream() {
    if (started) return;
    started = true;
    let i = 0;
    (function next() {
      if (i >= LINES.length) return;
      const g = document.createElement("div");
      g.textContent = i + 1;
      gutter.appendChild(g);
      const l = document.createElement("div");
      l.innerHTML = LINES[i] || "&nbsp;";
      linesEl.appendChild(l);
      i++;
      setTimeout(next, 150);
    })();
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stream();
          io.unobserve(win);
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(win);
})();

// ---------- contribution heatmap ----------
(function heatmap() {
  const grid = document.getElementById("heatmap");
  if (!grid) return;
  const cells = 52 * 7;
  let html = "";
  for (let i = 0; i < cells; i++) {
    const r = Math.random();
    // weighted toward activity, with quiet patches
    const level = r < 0.18 ? 0 : r < 0.42 ? 1 : r < 0.68 ? 2 : r < 0.88 ? 3 : 4;
    html += "<i data-l=\"" + level + "\"></i>";
  }
  grid.innerHTML = html;
  const scroll = grid.parentElement;
  if (scroll) scroll.scrollLeft = scroll.scrollWidth;
})();

// ---------- count-up stats ----------
(function countUp() {
  const stats = document.querySelectorAll(".stat h3");
  if (!stats.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function animate(el) {
    const raw = el.textContent.trim();
    const target = parseInt(raw, 10);
    if (isNaN(target)) return;
    const suffix = raw.replace(/[0-9]/g, "");
    const start = performance.now();
    const dur = 1300;
    (function frame(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else if (el.dataset.live) el.textContent = el.dataset.live;
    })(start);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  stats.forEach((s) => io.observe(s));
})();

// ---------- timeline draw-on-scroll ----------
(function timelineDraw() {
  const tl = document.querySelector(".timeline");
  if (!tl) return;
  const line = document.createElement("div");
  line.className = "timeline-progress";
  tl.appendChild(line);

  function update() {
    const r = tl.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    const progress = Math.min(Math.max((mid - r.top) / r.height, 0), 1);
    line.style.height = progress * 100 + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// ---------- live Islamabad clock ----------
(function clock() {
  const el = document.getElementById("pk-time");
  if (!el) return;
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
  });
  function tick() {
    el.textContent = fmt.format(new Date());
  }
  tick();
  setInterval(tick, 30000);
})();

// ---------- contact form: loading spinner + reset on back ----------
(function contactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", () => {
    if (btn) btn.classList.add("loading");
  });

  // fires on first load, on back/forward (bfcache), and on session restore —
  // clears stale values and un-sticks the spinner after returning from Formspree
  window.addEventListener("pageshow", () => {
    form.reset();
    if (btn) btn.classList.remove("loading");
  });
})();

// ---------- service worker (PWA) ----------
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

// ---------- footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
