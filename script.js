(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W,
    H,
    particles = [],
    animId;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(90, Math.floor((W * H) / 14000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 2 + 0.4,
        alpha: Math.random() * 0.45 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  init();
})();

(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  const sections = document.querySelectorAll("section[id]");
  const links = navLinks.querySelectorAll(".nav-link");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => {
            l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((s) => io.observe(s));
})();

(function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.style.getPropertyValue("--delay") || "0ms";
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  items.forEach((el) => observer.observe(el));
})();

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

(function initTableFx() {
  document.querySelectorAll(".cmp-row").forEach((row, idx) => {
    const colors = ["#38bdf8", "#a78bfa", "#34d399", "#ec4899", "#06b6d4"];
    const color = colors[idx % colors.length];
    row.querySelectorAll(".cmp-cell").forEach((cell) => {
      cell.addEventListener("mouseenter", () => {
        cell.style.borderColor = `${color}55`;
        cell.style.background = `${color}0d`;
      });
      cell.addEventListener("mouseleave", () => {
        cell.style.borderColor = "";
        cell.style.background = "";
      });
    });
  });
})();

(function initTimelineReveal() {
  const leftItems = document.querySelectorAll(".tl-item.left");
  const rightItems = document.querySelectorAll(".tl-item.right");

  leftItems.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-40px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });
  rightItems.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateX(40px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(
            () => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateX(0)";
            },
            parseInt(entry.target.style.getPropertyValue("--delay") || "0"),
          );
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  [...leftItems, ...rightItems].forEach((el) => io.observe(el));
})();

(function initTilt() {
  if (window.matchMedia("(hover: none)").matches) return;

  document
    .querySelectorAll(".challenge-card, .def-card, .asean-card")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = -dy * 5;
        const rotY = dx * 5;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
        card.style.transition = "transform 0.1s ease";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.4s ease";
      });
    });
})();

(function initProgressBar() {
  const bar = document.createElement("div");
  Object.assign(bar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "2px",
    width: "0%",
    zIndex: "999",
    background: "linear-gradient(90deg, #1a56db, #38bdf8, #a78bfa)",
    transition: "width 0.1s linear",
    pointerEvents: "none",
  });
  document.body.appendChild(bar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  });
})();

(function initTyping() {
  const badge = document.querySelector(".hero-badge");
  if (!badge) return;

  const cursor = document.createElement("span");
  cursor.textContent = "|";
  Object.assign(cursor.style, {
    marginLeft: "3px",
    animation: "none",
    opacity: "1",
    color: "#38bdf8",
  });

  let visible = true;
  setInterval(() => {
    visible = !visible;
    cursor.style.opacity = visible ? "1" : "0";
  }, 600);

  badge.appendChild(cursor);
})();

(function initDateReveal() {
  const sub = document.querySelector("#asean .section-sub");
  if (!sub) return;

  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        sub.style.animation = "fadeInUp 0.8s ease both";
        io.disconnect();
      }
    },
    { threshold: 0.5 },
  );

  io.observe(sub);
})();
